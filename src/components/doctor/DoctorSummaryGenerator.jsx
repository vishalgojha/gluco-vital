import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { subDays, format, eachDayOfInterval, isWithinInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function DoctorSummaryGenerator({ patientEmail, patientName, onSummaryGenerated }) {
  const [generating, setGenerating] = useState(false);
  const [timeWindow, setTimeWindow] = useState("last_7_days");

  const generateSummary = async () => {
    setGenerating(true);
    try {
      const days = timeWindow === "last_7_days" ? 7 : timeWindow === "last_14_days" ? 14 : 30;
      const startDate = subDays(new Date(), days);
      const endDate = new Date();

      // Fetch logs and memories
      const [allLogs, memories] = await Promise.all([
        base44.entities.HealthLog.list('-created_date', 500),
        base44.entities.ConversationMemory.filter({ user_email: patientEmail }).catch(() => [])
      ]);

      // Filter logs for this patient and time window
      const patientLogs = allLogs.filter(log => 
        (log.user_email === patientEmail || log.created_by === patientEmail) &&
        log.status !== 'deleted' && log.status !== 'corrected' &&
        new Date(log.created_date) >= startDate
      );

      // Analyze decision states from log notes
      const decisionStates = { observe: 0, stabilize: 0, escalate: 0 };
      const sugarLogs = patientLogs.filter(l => l.log_type === 'sugar' && l.numeric_value);
      
      patientLogs.forEach(log => {
        const notes = (log.notes || '').toLowerCase();
        if (notes.includes('escalate') || notes.includes('urgent') || notes.includes('emergency')) {
          decisionStates.escalate++;
        } else if (notes.includes('fatigue') || notes.includes('tired') || notes.includes('overwhelmed') || notes.includes('stabilize')) {
          decisionStates.stabilize++;
        } else {
          decisionStates.observe++;
        }
      });

      // Detect fatigue from memories and logs
      const fatigueMemories = memories.filter(m => 
        m.memory_type === 'engagement_state' && 
        (m.value?.includes('fatigue') || m.value?.includes('disengaged'))
      );
      
      const fatigueIndicators = patientLogs.filter(log => {
        const notes = (log.notes || '').toLowerCase();
        return notes.includes("don't care") || 
               notes.includes("tired") || 
               notes.includes("exhausted") ||
               notes.includes("give up") ||
               notes.includes("what's the point");
      });

      const fatigueStatus = fatigueIndicators.length >= 3 ? 'severe' : 
                           fatigueIndicators.length >= 1 ? 'detected' : 
                           fatigueMemories.length > 0 ? 'mild' : 'none';

      // Logging behavior
      const allDays = eachDayOfInterval({ start: startDate, end: endDate });
      const daysWithLogs = new Set(patientLogs.map(l => format(new Date(l.created_date), 'yyyy-MM-dd')));
      const missedDays = allDays
        .filter(d => !daysWithLogs.has(format(d, 'yyyy-MM-dd')))
        .map(d => format(d, 'EEE'));

      const logConsistency = missedDays.length === 0 ? 'strong' :
                            missedDays.length <= 2 ? 'moderate' :
                            missedDays.length <= 4 ? 'declining' : 'poor';

      // Glucose volatility
      let volatility = 'low';
      if (sugarLogs.length >= 2) {
        const values = sugarLogs.map(l => l.numeric_value);
        const range = Math.max(...values) - Math.min(...values);
        volatility = range > 150 ? 'critical' : range > 100 ? 'high' : range > 50 ? 'moderate' : 'low';
      }

      // Risk flags
      const riskFlags = [];
      if (logConsistency === 'declining' || logConsistency === 'poor') riskFlags.push('adherence_risk');
      if (fatigueStatus === 'detected' || fatigueStatus === 'severe') riskFlags.push('burnout_risk');
      if (sugarLogs.some(l => l.numeric_value < 70)) riskFlags.push('hypo_risk');
      if (sugarLogs.some(l => l.numeric_value > 300)) riskFlags.push('hyper_risk');
      if (missedDays.length > 3) riskFlags.push('data_gap_risk');

      // Patient voice - find most expressive quote
      let patientVoice = null;
      const expressiveLogs = patientLogs.filter(l => l.notes && l.notes.length > 20);
      if (expressiveLogs.length > 0) {
        // Prioritize emotional/fatigue-related quotes
        const emotionalLog = expressiveLogs.find(l => 
          l.notes.toLowerCase().includes("don't care") ||
          l.notes.toLowerCase().includes("tired") ||
          l.notes.toLowerCase().includes("hard")
        ) || expressiveLogs[0];
        
        patientVoice = {
          verbatim_excerpt: emotionalLog.notes.slice(0, 150),
          timestamp: emotionalLog.created_date
        };
      }

      // System recommendation
      let action = 'ignore';
      let urgency = 'low';
      
      if (decisionStates.escalate > 0 || riskFlags.includes('hypo_risk')) {
        action = 'contact';
        urgency = 'high';
      } else if (fatigueStatus === 'severe' || riskFlags.length >= 2) {
        action = 'review';
        urgency = 'medium';
      } else if (fatigueStatus === 'detected' || logConsistency === 'declining') {
        action = 'monitor';
        urgency = 'low';
      }

      // Create summary
      const summary = await base44.entities.DoctorSummary.create({
        patient_email: patientEmail,
        patient_name: patientName,
        time_window: timeWindow,
        decision_state_distribution: decisionStates,
        diabetes_fatigue: {
          status: fatigueStatus,
          trend: fatigueIndicators.length > 1 ? 'rising' : 'stable',
          evidence_count: fatigueIndicators.length
        },
        logging_behavior: {
          consistency: logConsistency,
          readings_logged: sugarLogs.length,
          expected_readings: days,
          missed_days: missedDays.slice(0, 5)
        },
        glucose_context: {
          volatility,
          avg_reading: sugarLogs.length > 0 ? Math.round(sugarLogs.reduce((a, b) => a + b.numeric_value, 0) / sugarLogs.length) : null,
          range_low: sugarLogs.length > 0 ? Math.min(...sugarLogs.map(l => l.numeric_value)) : null,
          range_high: sugarLogs.length > 0 ? Math.max(...sugarLogs.map(l => l.numeric_value)) : null
        },
        risk_flags: riskFlags,
        patient_voice: patientVoice,
        system_recommendation: { action, urgency },
        generated_at: new Date().toISOString()
      });

      toast.success("Summary generated");
      onSummaryGenerated?.(summary);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate summary");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={timeWindow} onValueChange={setTimeWindow}>
        <SelectTrigger className="w-36 h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last_7_days">Last 7 days</SelectItem>
          <SelectItem value="last_14_days">Last 14 days</SelectItem>
          <SelectItem value="last_30_days">Last 30 days</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={generateSummary} disabled={generating} size="sm">
        {generating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        <span className="ml-1.5">Generate</span>
      </Button>
    </div>
  );
}
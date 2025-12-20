import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { format, subDays, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Loader2, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ReportGenerator({ userEmail, onReportGenerated }) {
  const [reportType, setReportType] = useState("weekly");
  const [dateRange, setDateRange] = useState({ from: subDays(new Date(), 7), to: new Date() });
  const [generating, setGenerating] = useState(false);

  const quickRanges = {
    weekly: { from: startOfWeek(new Date()), to: endOfWeek(new Date()) },
    monthly: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    quarterly: { from: startOfQuarter(new Date()), to: endOfQuarter(new Date()) }
  };

  const handleTypeChange = (type) => {
    setReportType(type);
    setDateRange(quickRanges[type]);
  };

  const generateReport = async () => {
    setGenerating(true);
    try {
      // Fetch logs for the period (check both user_email and created_by for agent-created logs)
      const allLogs = await base44.entities.HealthLog.list('-created_date', 500);
      const userLogs = allLogs.filter(log => 
        log.user_email === userEmail || log.created_by === userEmail
      );
      const filteredLogs = userLogs.filter(log => {
        const logDate = new Date(log.created_date);
        return logDate >= dateRange.from && logDate <= dateRange.to;
      });

      const profile = await base44.entities.PatientProfile.filter({ user_email: userEmail });
      const patientProfile = profile?.[0];

      // Calculate stats
      const sugarLogs = filteredLogs.filter(l => l.log_type === "sugar" && l.numeric_value);
      const bpLogs = filteredLogs.filter(l => l.log_type === "blood_pressure");
      const medLogs = filteredLogs.filter(l => l.log_type === "medication");

      const sugarStats = sugarLogs.length > 0 ? {
        average: Math.round(sugarLogs.reduce((a, b) => a + b.numeric_value, 0) / sugarLogs.length),
        highest: Math.max(...sugarLogs.map(l => l.numeric_value)),
        lowest: Math.min(...sugarLogs.map(l => l.numeric_value)),
        readings_count: sugarLogs.length,
        in_target_percent: Math.round((sugarLogs.filter(l => l.numeric_value <= (patientProfile?.target_sugar_post_meal || 140)).length / sugarLogs.length) * 100)
      } : null;

      // Generate AI summary
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a caring health analyst. Generate a health report summary for a diabetes patient.

Patient: ${patientProfile?.name || 'Patient'}
Period: ${format(dateRange.from, "MMM d")} to ${format(dateRange.to, "MMM d, yyyy")}
Report Type: ${reportType}

Health Data:
- Sugar readings: ${sugarLogs.length} (Avg: ${sugarStats?.average || 'N/A'} mg/dL, Range: ${sugarStats?.lowest || 'N/A'}-${sugarStats?.highest || 'N/A'})
- BP readings: ${bpLogs.length}
- Medication logs: ${medLogs.length}
- Total logs: ${filteredLogs.length}

Patient Targets:
- Fasting Sugar: ${patientProfile?.target_sugar_fasting || 100} mg/dL
- Post-meal Sugar: ${patientProfile?.target_sugar_post_meal || 140} mg/dL

Medications: ${patientProfile?.medications?.map(m => m.name).join(', ') || 'Not specified'}

Generate a warm, encouraging report with:
1. A brief summary (2-3 sentences)
2. 2-3 identified risks or concerns (if any)
3. 3-4 actionable recommendations
4. 2-3 achievements or positive observations
5. 3-5 specific questions the patient should ask their doctor at the next visit based on their health data and patterns

Be caring and supportive in tone. Questions for doctor should be practical and relevant to diabetes management.`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            risks: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            achievements: { type: "array", items: { type: "string" } },
            questions_for_doctor: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Create report
      const report = await base44.entities.HealthReport.create({
        user_email: userEmail,
        report_type: reportType,
        start_date: format(dateRange.from, "yyyy-MM-dd"),
        end_date: format(dateRange.to, "yyyy-MM-dd"),
        summary: aiResponse.summary,
        sugar_stats: sugarStats,
        medication_adherence: medLogs.length > 0 ? Math.min(100, Math.round((medLogs.length / (reportType === 'weekly' ? 14 : reportType === 'monthly' ? 60 : 180)) * 100)) : 0,
        risks_identified: aiResponse.risks || [],
        recommendations: aiResponse.recommendations || [],
        achievements: aiResponse.achievements || [],
        questions_for_doctor: aiResponse.questions_for_doctor || []
      });

      toast.success("Report generated successfully!");
      onReportGenerated?.(report);
    } catch (error) {
      toast.error("Failed to generate report");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-100">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-blue-100 rounded-xl">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Generate Health Report</h3>
          <p className="text-xs text-slate-500">AI-powered analysis of your health data</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Report Type</label>
          <Select value={reportType} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly Report</SelectItem>
              <SelectItem value="monthly">Monthly Report</SelectItem>
              <SelectItem value="quarterly">Quarterly Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {dateRange.from && dateRange.to ? (
                  `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`
                ) : "Select dates"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button 
          onClick={generateReport} 
          disabled={generating || !dateRange.from || !dateRange.to}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
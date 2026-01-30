import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Stethoscope, Sparkles, TrendingUp, TrendingDown, Target, Calendar, Loader2, RefreshCw } from "lucide-react";
import { format, subDays, differenceInDays } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Utensils, Activity as ActivityIcon, Shield, Pill } from "lucide-react";

function calculateStdDev(values) {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function RiskBadge({ label, level }) {
  const colors = {
    none: "bg-green-100 text-green-700 border-green-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
    mild: "bg-blue-100 text-blue-700 border-blue-200",
    moderate: "bg-amber-100 text-amber-700 border-amber-200",
    significant: "bg-orange-100 text-orange-700 border-orange-200",
    high: "bg-red-100 text-red-700 border-red-200"
  };
  
  return (
    <div className={`text-center px-3 py-2 rounded-lg border ${colors[level] || colors.none}`}>
      <p className="text-xs font-semibold">{label}</p>
      <p className="text-[10px] uppercase mt-0.5">{level}</p>
    </div>
  );
}

export default function NurseCoach({ logs = [], profile, achievements }) {
  const [coaching, setCoaching] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeAndCoach = async () => {
    setLoading(true);
    try {
      // Prepare comprehensive data for analysis
      const sugarLogs = logs.filter(l => l.log_type === "sugar" && l.numeric_value);
      const bpLogs = logs.filter(l => l.log_type === "blood_pressure");
      const mealLogs = logs.filter(l => l.log_type === "meal");
      const medicationLogs = logs.filter(l => l.log_type === "medication");
      const exerciseLogs = logs.filter(l => l.log_type === "exercise");
      const symptomLogs = logs.filter(l => l.log_type === "symptom");
      const stepsLogs = logs.filter(l => l.log_type === "steps");
      const heartRateLogs = logs.filter(l => l.log_type === "heart_rate");
      const sleepLogs = logs.filter(l => l.log_type === "sleep");

      // Calculate patterns
      const fastingReadings = sugarLogs.filter(l => l.time_of_day === "morning_fasting");
      const ppReadings = sugarLogs.filter(l => ["after_breakfast", "after_lunch", "after_dinner"].includes(l.time_of_day));
      
      const avgFasting = fastingReadings.length > 0 
        ? Math.round(fastingReadings.reduce((a, b) => a + b.numeric_value, 0) / fastingReadings.length) 
        : null;
      const avgPP = ppReadings.length > 0 
        ? Math.round(ppReadings.reduce((a, b) => a + b.numeric_value, 0) / ppReadings.length) 
        : null;

      // RISK DETECTION: DKA and Hypoglycemia patterns
      const highSugarReadings = sugarLogs.filter(l => l.numeric_value > 250);
      const veryHighSugarReadings = sugarLogs.filter(l => l.numeric_value > 300);
      const lowSugarReadings = sugarLogs.filter(l => l.numeric_value < 70);
      const veryLowSugarReadings = sugarLogs.filter(l => l.numeric_value < 50);
      
      // Recent dangerous patterns (last 7 days)
      const recentHighs = highSugarReadings.filter(l => differenceInDays(new Date(), new Date(l.created_date)) <= 7);
      const recentLows = lowSugarReadings.filter(l => differenceInDays(new Date(), new Date(l.created_date)) <= 7);
      
      // Variability (high variability = poor control)
      const last14Readings = sugarLogs.slice(0, 14).map(l => l.numeric_value);
      const stdDev = last14Readings.length > 2 ? calculateStdDev(last14Readings) : 0;
      const highVariability = stdDev > 50;

      // Symptom analysis
      const recentSymptoms = symptomLogs.filter(l => differenceInDays(new Date(), new Date(l.created_date)) <= 7);
      const worryingSymptoms = recentSymptoms.filter(l => 
        /dizzy|nausea|vomit|confusion|chest|pain|breath/i.test(l.value || l.notes || '')
      );

      // Weekly comparison
      const last7Days = sugarLogs.filter(l => differenceInDays(new Date(), new Date(l.created_date)) <= 7);
      const prev7Days = sugarLogs.filter(l => {
        const diff = differenceInDays(new Date(), new Date(l.created_date));
        return diff > 7 && diff <= 14;
      });

      const avgLast7 = last7Days.length > 0 
        ? Math.round(last7Days.reduce((a, b) => a + b.numeric_value, 0) / last7Days.length) 
        : null;
      const avgPrev7 = prev7Days.length > 0 
        ? Math.round(prev7Days.reduce((a, b) => a + b.numeric_value, 0) / prev7Days.length) 
        : null;

      // Time-of-day patterns for meal recommendations
      const morningAvg = sugarLogs.filter(l => l.time_of_day?.includes("breakfast")).reduce((sum, l, _, arr) => sum + l.numeric_value / arr.length, 0);
      const lunchAvg = sugarLogs.filter(l => l.time_of_day?.includes("lunch")).reduce((sum, l, _, arr) => sum + l.numeric_value / arr.length, 0);
      const dinnerAvg = sugarLogs.filter(l => l.time_of_day?.includes("dinner")).reduce((sum, l, _, arr) => sum + l.numeric_value / arr.length, 0);
      
      const afterDinnerAvg = sugarLogs.filter(l => l.time_of_day === "after_dinner").length > 0
        ? Math.round(sugarLogs.filter(l => l.time_of_day === "after_dinner").reduce((a, b) => a + b.numeric_value, 0) / sugarLogs.filter(l => l.time_of_day === "after_dinner").length)
        : null;

      // Engagement metrics
      const loggingStreak = achievements?.current_streak || 0;
      const totalLogs = achievements?.logs_count || logs.length;
      const recentEngagement = logs.filter(l => differenceInDays(new Date(), new Date(l.created_date)) <= 7).length;
      const engagementLevel = recentEngagement >= 14 ? "high" : recentEngagement >= 7 ? "medium" : "low";

      // Wearable insights
      const recentSteps = stepsLogs.filter(l => differenceInDays(new Date(), new Date(l.created_date)) <= 7);
      const avgDailySteps = recentSteps.length > 0 
        ? Math.round(recentSteps.reduce((sum, l) => sum + (l.numeric_value || 0), 0) / 7)
        : 0;
      const recentSleep = sleepLogs.filter(l => differenceInDays(new Date(), new Date(l.created_date)) <= 7);
      const avgSleep = recentSleep.length > 0
        ? (recentSleep.reduce((sum, l) => sum + (l.numeric_value || 0), 0) / recentSleep.length).toFixed(1)
        : 0;
      const avgHR = heartRateLogs.length > 0
        ? Math.round(heartRateLogs.slice(0, 20).reduce((sum, l) => sum + (l.numeric_value || 0), 0) / Math.min(heartRateLogs.length, 20))
        : 0;

      // Medication adherence
      const expectedMeds = profile?.medications?.length || 0;
      const actualMeds = medicationLogs.filter(l => differenceInDays(new Date(), new Date(l.created_date)) <= 7).length;
      const medAdherence = expectedMeds > 0 ? Math.round((actualMeds / (expectedMeds * 7)) * 100) : 100;

      const prompt = `You are GlucoVital Coach, a warm, caring, and highly intelligent diabetes health coach with advanced clinical knowledge. Analyze this patient's data deeply and provide proactive, personalized coaching with early risk detection.

**PATIENT PROFILE:**
- Name: ${profile?.name || "Patient"}
- Age: ${profile?.age || "Not specified"}
- On Insulin: ${profile?.is_on_insulin ? "Yes" : "No"}
- Conditions: ${profile?.conditions?.join(", ") || "Diabetes"}
- Target Fasting: ${profile?.target_sugar_fasting || 100} mg/dL
- Target PP: ${profile?.target_sugar_post_meal || 140} mg/dL
- Current Streak: ${loggingStreak} days
- Language: ${profile?.language_preference || "english"}
- Cultural Context: ${profile?.cultural_context || "general"}
- Preferred Honorific: ${profile?.preferred_honorific || ""}

**HEALTH DATA (Last 30 days):**
- Total Sugar Readings: ${sugarLogs.length}
- Fasting: ${fastingReadings.length} readings (Avg: ${avgFasting || "N/A"} mg/dL)
- Post-Prandial: ${ppReadings.length} readings (Avg: ${avgPP || "N/A"} mg/dL)
- BP Readings: ${bpLogs.length}
- Meal Logs: ${mealLogs.length}
- Medication Logs: ${medicationLogs.length}
- Exercise Logs: ${exerciseLogs.length}
- Symptom Logs: ${symptomLogs.length}
- Wearable Data: ${stepsLogs.length} steps, ${heartRateLogs.length} HR, ${sleepLogs.length} sleep entries

**⚠️ CRITICAL RISK INDICATORS:**
- High readings (>250): ${highSugarReadings.length} total, ${recentHighs.length} in last 7 days
- Very high (>300): ${veryHighSugarReadings.length} total
- Low readings (<70): ${lowSugarReadings.length} total, ${recentLows.length} in last 7 days
- Very low (<50): ${veryLowSugarReadings.length} total
- Blood sugar variability (StdDev): ${stdDev.toFixed(1)} ${highVariability ? "⚠️ HIGH" : ""}
- Worrying symptoms: ${worryingSymptoms.length} in last 7 days
- Medication adherence: ${medAdherence}%

**PATTERN ANALYSIS:**
- Morning (breakfast): ${morningAvg ? morningAvg.toFixed(0) : "N/A"} mg/dL avg
- Afternoon (lunch): ${lunchAvg ? lunchAvg.toFixed(0) : "N/A"} mg/dL avg
- Evening (dinner): ${dinnerAvg ? dinnerAvg.toFixed(0) : "N/A"} mg/dL avg
- After dinner spike: ${afterDinnerAvg || "N/A"} mg/dL

**WEEKLY TREND:**
- Last 7 days: ${avgLast7 || "N/A"} mg/dL avg
- Previous 7 days: ${avgPrev7 || "N/A"} mg/dL avg
- Direction: ${avgLast7 && avgPrev7 ? (avgLast7 < avgPrev7 ? "Improving ↓" : avgLast7 > avgPrev7 ? "Worsening ↑" : "Stable →") : "Insufficient data"}

**ENGAGEMENT LEVEL:** ${engagementLevel.toUpperCase()}
- Recent logs (7d): ${recentEngagement}
- Logging streak: ${loggingStreak} days
- Total lifetime logs: ${totalLogs}

**WEARABLE/ACTIVITY DATA (Last 7 days):**
- Daily Steps Average: ${avgDailySteps > 0 ? `${avgDailySteps.toLocaleString()} (Goal: 10,000)` : "N/A"}
- Average Sleep: ${avgSleep > 0 ? `${avgSleep} hours/night (Goal: 7-8h)` : "N/A"}
- Resting Heart Rate: ${avgHR > 0 ? `${avgHR} bpm` : "N/A"}
- Activity Level: ${avgDailySteps >= 10000 ? "High ✓" : avgDailySteps >= 5000 ? "Moderate" : avgDailySteps > 0 ? "Low - needs improvement" : "No data"}

**COACHING INSTRUCTIONS:**
1. **Risk Assessment First**: If ANY critical risks detected (DKA signs, frequent hypoglycemia, high variability, dangerous symptoms), flag them URGENTLY
2. **Personalization**: Adapt tone based on engagement level:
   - High engagement: Detailed, analytical, celebrate progress
   - Medium engagement: Encouraging, supportive, motivate consistency
   - Low engagement: Simple, warm, re-engage gently
3. **Cultural Sensitivity**: Use appropriate language/examples for ${profile?.cultural_context || "general"} context
4. **Lifestyle Recommendations**: Provide SPECIFIC diet and exercise advice based on:
   - Time-of-day patterns (which meal causes spikes?)
   - Cultural food preferences
   - Current exercise/activity level from wearable data
   - Sleep quality and its impact on blood sugar control
5. **Medication Insights**: If adherence <80%, probe why (forgetfulness? side effects? access?)

**RECENT READINGS (last 10):**
${sugarLogs.slice(0, 10).map(l => `- ${format(new Date(l.created_date), "MMM d HH:mm")}: ${l.numeric_value} mg/dL (${l.time_of_day || "unspecified"})${l.notes ? ` - "${l.notes}"` : ''}`).join("\n")}

${worryingSymptoms.length > 0 ? `\n**RECENT SYMPTOMS:**\n${worryingSymptoms.map(s => `- ${s.value}: ${s.notes || ''}`).join("\n")}` : ''}

Provide comprehensive coaching response in this JSON format:
{
  "greeting": "Warm personalized greeting using name, honorific, cultural context",
  "overall_status": "excellent" | "good" | "moderate" | "needs_attention" | "critical",
  "status_message": "Brief overall assessment",
  "urgent_alerts": [
    "Any critical health risks requiring immediate doctor consultation"
  ],
  "risk_assessment": {
    "dka_risk": "none" | "low" | "moderate" | "high",
    "hypoglycemia_risk": "none" | "low" | "moderate" | "high",
    "variability_concern": "none" | "mild" | "significant",
    "notes": "Brief explanation of detected risks"
  },
  "key_insights": [
    {"type": "positive" | "warning" | "critical" | "tip", "message": "Insight with specific data"}
  ],
  "diet_recommendations": [
    "Specific food/meal advice based on time-of-day patterns and cultural context",
    "What to eat more/less of with reasoning"
  ],
  "exercise_recommendations": [
    "Specific exercise advice based on current level and sugar patterns",
    "Best timing for exercise based on their data"
  ],
  "medication_coaching": "Advice on medication timing/adherence if needed, or null",
  "weekly_focus": "One specific, measurable goal for this week",
  "action_plan": [
    "Specific actionable step with reasoning",
    "Another specific step",
    "Third specific step"
  ],
  "motivation": "Personalized encouragement based on engagement level and progress",
  "engagement_boost": "Specific message to improve logging consistency if engagement is low, or null",
  "next_check_reminder": "What specific metrics to track next"
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            greeting: { type: "string" },
            overall_status: { type: "string", enum: ["excellent", "good", "moderate", "needs_attention", "critical"] },
            status_message: { type: "string" },
            urgent_alerts: { type: "array", items: { type: "string" } },
            risk_assessment: {
              type: "object",
              properties: {
                dka_risk: { type: "string", enum: ["none", "low", "moderate", "high"] },
                hypoglycemia_risk: { type: "string", enum: ["none", "low", "moderate", "high"] },
                variability_concern: { type: "string", enum: ["none", "mild", "significant"] },
                notes: { type: "string" }
              }
            },
            key_insights: { 
              type: "array", 
              items: { 
                type: "object", 
                properties: { 
                  type: { type: "string" }, 
                  message: { type: "string" } 
                } 
              } 
            },
            diet_recommendations: { type: "array", items: { type: "string" } },
            exercise_recommendations: { type: "array", items: { type: "string" } },
            medication_coaching: { type: "string" },
            weekly_focus: { type: "string" },
            action_plan: { type: "array", items: { type: "string" } },
            motivation: { type: "string" },
            engagement_boost: { type: "string" },
            next_check_reminder: { type: "string" }
          }
        }
      });

      setCoaching(result);
    } catch (error) {
      console.error("Coaching error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    excellent: "from-emerald-500 to-green-500",
    good: "from-green-500 to-emerald-500",
    moderate: "from-amber-500 to-orange-500",
    needs_attention: "from-orange-500 to-red-500",
    critical: "from-red-600 to-rose-600"
  };

  const insightIcons = {
    positive: "✅",
    warning: "⚠️",
    critical: "🚨",
    tip: "💡"
  };

  if (!coaching) {
    return (
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-violet-100 rounded-xl">
            <Stethoscope className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Nurse Coach</h3>
            <p className="text-sm text-slate-500">Personalized health coaching</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Get AI-powered health analysis with personalized tips, weekly goals, and action plans.
        </p>
        <Button 
          onClick={analyzeAndCoach} 
          disabled={loading || logs.length < 3}
          className="w-full bg-violet-600 hover:bg-violet-700"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" /> Get My Health Coaching</>
          )}
        </Button>
        {logs.length < 3 && (
          <p className="text-xs text-slate-400 mt-2 text-center">Log at least 3 readings to get coaching</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header with status */}
      <div className={`bg-gradient-to-r ${statusColors[coaching.overall_status]} p-5 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Health Coaching</h3>
              <p className="text-sm text-white/80">{coaching.status_message}</p>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={analyzeAndCoach}
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Greeting */}
        <p className="text-slate-700 leading-relaxed">{coaching.greeting}</p>

        {/* Urgent Alerts */}
        {coaching.urgent_alerts && coaching.urgent_alerts.length > 0 && (
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border-2 border-red-200">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600 animate-pulse" />
              Urgent Health Alerts
            </h3>
            <div className="space-y-2">
              {coaching.urgent_alerts.map((alert, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white/60 rounded-lg p-3">
                  <span className="text-red-600 font-bold">🚨</span>
                  <p className="text-sm text-red-900 font-medium">{alert}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Assessment */}
        {coaching.risk_assessment && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
            <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" />
              Risk Assessment
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <RiskBadge label="DKA Risk" level={coaching.risk_assessment.dka_risk} />
              <RiskBadge label="Hypo Risk" level={coaching.risk_assessment.hypoglycemia_risk} />
              <RiskBadge label="Variability" level={coaching.risk_assessment.variability_concern} />
            </div>
            {coaching.risk_assessment.notes && (
              <p className="text-sm text-amber-800 bg-white/50 rounded-lg p-3">{coaching.risk_assessment.notes}</p>
            )}
          </div>
        )}

        {/* Key Insights */}
        <div className="space-y-2">
          <h4 className="font-medium text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-500" /> Key Insights
          </h4>
          <div className="space-y-2">
            {coaching.key_insights?.map((insight, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg text-sm ${
                  insight.type === "positive" ? "bg-green-50 text-green-700" :
                  insight.type === "warning" ? "bg-amber-50 text-amber-700" :
                  "bg-blue-50 text-blue-700"
                }`}
              >
                {insightIcons[insight.type]} {insight.message}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Focus */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-100">
          <h4 className="font-medium text-indigo-800 flex items-center gap-2 mb-2">
            <Target className="w-4 h-4" /> This Week's Focus
          </h4>
          <p className="text-sm text-indigo-700">{coaching.weekly_focus}</p>
        </div>

        {/* Diet Recommendations */}
        {coaching.diet_recommendations && coaching.diet_recommendations.length > 0 && (
          <div>
            <h4 className="font-medium text-slate-800 flex items-center gap-2 mb-3">
              <Utensils className="w-4 h-4 text-green-600" /> Personalized Diet Advice
            </h4>
            <div className="space-y-2">
              {coaching.diet_recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-green-50 rounded-lg p-3 border border-green-100">
                  <span className="text-green-600">🥗</span>
                  <p className="text-sm text-green-800">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercise Recommendations */}
        {coaching.exercise_recommendations && coaching.exercise_recommendations.length > 0 && (
          <div>
            <h4 className="font-medium text-slate-800 flex items-center gap-2 mb-3">
              <ActivityIcon className="w-4 h-4 text-blue-600" /> Exercise Guidance
            </h4>
            <div className="space-y-2">
              {coaching.exercise_recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <span className="text-blue-600">🏃</span>
                  <p className="text-sm text-blue-800">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medication Coaching */}
        {coaching.medication_coaching && (
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
            <h4 className="font-medium text-purple-800 flex items-center gap-2 mb-2">
              <Pill className="w-4 h-4" /> Medication Insights
            </h4>
            <p className="text-sm text-purple-700">{coaching.medication_coaching}</p>
          </div>
        )}

        {/* Action Plan */}
        <div>
          <h4 className="font-medium text-slate-800 flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-violet-500" /> Your Action Plan
          </h4>
          <div className="space-y-2">
            {coaching.action_plan?.map((action, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-sm text-slate-700">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Boost */}
        {coaching.engagement_boost && (
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
            <p className="text-sm text-pink-800">💪 <strong>Stay Engaged:</strong> {coaching.engagement_boost}</p>
          </div>
        )}

        {/* Motivation */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
          <p className="text-sm text-amber-800">💝 {coaching.motivation}</p>
        </div>

        {/* Next Check */}
        <div className="text-center text-sm text-slate-500 pt-2 border-t border-slate-100">
          📌 {coaching.next_check_reminder}
        </div>
      </div>
    </div>
  );
}
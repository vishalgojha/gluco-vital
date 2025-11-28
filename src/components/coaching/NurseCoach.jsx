import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Stethoscope, Sparkles, TrendingUp, TrendingDown, Target, Calendar, Loader2, RefreshCw } from "lucide-react";
import { format, subDays, differenceInDays } from "date-fns";
import ReactMarkdown from "react-markdown";

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

      // Calculate patterns
      const fastingReadings = sugarLogs.filter(l => l.time_of_day === "morning_fasting");
      const ppReadings = sugarLogs.filter(l => ["after_breakfast", "after_lunch", "after_dinner"].includes(l.time_of_day));
      
      const avgFasting = fastingReadings.length > 0 
        ? Math.round(fastingReadings.reduce((a, b) => a + b.numeric_value, 0) / fastingReadings.length) 
        : null;
      const avgPP = ppReadings.length > 0 
        ? Math.round(ppReadings.reduce((a, b) => a + b.numeric_value, 0) / ppReadings.length) 
        : null;

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

      // Time-of-day patterns
      const afterDinnerAvg = sugarLogs.filter(l => l.time_of_day === "after_dinner").length > 0
        ? Math.round(sugarLogs.filter(l => l.time_of_day === "after_dinner").reduce((a, b) => a + b.numeric_value, 0) / sugarLogs.filter(l => l.time_of_day === "after_dinner").length)
        : null;

      const prompt = `You are Nurse Priya, a warm and caring diabetes health coach. Analyze this patient's health data and provide personalized coaching.

**PATIENT PROFILE:**
- Name: ${profile?.name || "Patient"}
- Age: ${profile?.age || "Not specified"}
- On Insulin: ${profile?.is_on_insulin ? "Yes" : "No"}
- Conditions: ${profile?.conditions?.join(", ") || "Diabetes"}
- Target Fasting: ${profile?.target_sugar_fasting || 100} mg/dL
- Target PP: ${profile?.target_sugar_post_meal || 140} mg/dL
- Current Streak: ${achievements?.current_streak || 0} days
- Language Preference: ${profile?.language_preference || "english"}

**HEALTH DATA (Last 30 days):**
- Total Sugar Readings: ${sugarLogs.length}
- Fasting Readings: ${fastingReadings.length} (Avg: ${avgFasting || "N/A"} mg/dL)
- PP Readings: ${ppReadings.length} (Avg: ${avgPP || "N/A"} mg/dL)
- After Dinner Avg: ${afterDinnerAvg || "N/A"} mg/dL
- BP Readings: ${bpLogs.length}
- Meal Logs: ${mealLogs.length}
- Medication Logs: ${medicationLogs.length}

**WEEKLY TREND:**
- Last 7 days avg: ${avgLast7 || "N/A"} mg/dL
- Previous 7 days avg: ${avgPrev7 || "N/A"} mg/dL
- Trend: ${avgLast7 && avgPrev7 ? (avgLast7 < avgPrev7 ? "Improving ✓" : avgLast7 > avgPrev7 ? "Needs attention" : "Stable") : "Need more data"}

**RECENT READINGS (last 10):**
${sugarLogs.slice(0, 10).map(l => `- ${format(new Date(l.created_date), "MMM d")}: ${l.numeric_value} mg/dL (${l.time_of_day || "unspecified"})`).join("\n")}

Provide coaching response in this JSON format:
{
  "greeting": "Warm personalized greeting using their name and cultural context",
  "overall_status": "good" | "moderate" | "needs_attention",
  "status_message": "Brief status summary",
  "key_insights": [
    {"type": "positive" | "warning" | "tip", "message": "Insight message"}
  ],
  "weekly_focus": "One specific goal for this week",
  "action_plan": [
    "Specific actionable step 1",
    "Specific actionable step 2", 
    "Specific actionable step 3"
  ],
  "motivation": "Encouraging message with cultural touch",
  "next_check_reminder": "What to focus on next"
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            greeting: { type: "string" },
            overall_status: { type: "string", enum: ["good", "moderate", "needs_attention"] },
            status_message: { type: "string" },
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
            weekly_focus: { type: "string" },
            action_plan: { type: "array", items: { type: "string" } },
            motivation: { type: "string" },
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
    good: "from-green-500 to-emerald-500",
    moderate: "from-amber-500 to-orange-500",
    needs_attention: "from-red-500 to-rose-500"
  };

  const insightIcons = {
    positive: "✅",
    warning: "⚠️",
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
          Get AI-powered health analysis with personalized tips, weekly goals, and action plans from Nurse Priya.
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
              <h3 className="font-semibold">Nurse Priya's Coaching</h3>
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
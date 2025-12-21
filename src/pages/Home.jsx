import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, subDays, isToday } from "date-fns";
import { Droplet, Heart, Utensils, Activity, TrendingUp, Calendar, Sparkles, AlertCircle, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import StatCard from "@/components/dashboard/StatCard";
import LogCard from "@/components/dashboard/LogCard";
import SugarChart from "@/components/dashboard/SugarChart";
import InsightCard from "@/components/dashboard/InsightCard";
import WhatsAppConnect from "@/components/WhatsAppConnect";
import PointsDisplay from "@/components/gamification/PointsDisplay";
import WeeklyChallenge from "@/components/gamification/WeeklyChallenge";
import RecommendedSchedule from "@/components/dashboard/RecommendedSchedule";
import NurseCoach from "@/components/coaching/NurseCoach";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import QuickLogModal from "@/components/onboarding/QuickLogModal";
import QuickMedicationModal from "@/components/onboarding/QuickMedicationModal";
import { generateDemoData, DEMO_USER_EMAIL } from "@/components/demo/DemoDataGenerator";
import DemoBanner from "@/components/demo/DemoBanner";
import DemoAIChat from "@/components/demo/DemoAIChat";
import { useReminderScheduler } from "@/components/notifications/ReminderScheduler";

export default function Home() {
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [demoData, setDemoData] = useState(null);
  const [showDemoChat, setShowDemoChat] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check for demo mode - MUST check URL param first
    const urlParams = new URLSearchParams(window.location.search);
    const demoMode = urlParams.get('demo') === 'true';
    
    if (demoMode) {
      // Demo mode takes priority over real auth
      setIsDemo(true);
      const data = generateDemoData();
      setDemoData(data);
      setUser(data.user);
    } else {
      setIsDemo(false);
      base44.auth.me().then((userData) => {
        setUser(userData);
        // Show onboarding for new users who haven't completed it
        if (!userData?.onboarding_completed) {
          setShowOnboarding(true);
        }
      }).catch(() => {});
    }
  }, [window.location.search]);

  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['health-logs', user?.email, isDemo],
    queryFn: async () => {
      if (isDemo && demoData) {
        return demoData.logs;
      }
      // Fetch logs where user_email matches OR created_by matches
      const results = await base44.entities.HealthLog.list('-created_date', 200);
      // Filter for this user's logs (by user_email or created_by), exclude corrected/deleted
      return results.filter(log => 
        (log.user_email === user?.email || log.created_by === user?.email) &&
        log.status !== 'corrected' && log.status !== 'deleted'
      );
    },
    enabled: !!user?.email || isDemo
  });

  const { data: profile } = useQuery({
    queryKey: ['patient-profile', isDemo],
    queryFn: async () => {
      if (isDemo && demoData) {
        return demoData.profile;
      }
      const results = await base44.entities.PatientProfile.filter({ user_email: user?.email });
      return results?.[0];
    },
    enabled: !!user?.email || isDemo
  });

  const { data: achievements } = useQuery({
    queryKey: ['user-achievements', user?.email, isDemo],
    queryFn: async () => {
      if (isDemo && demoData) {
        return demoData.achievements;
      }
      const results = await base44.entities.UserAchievements.filter({ user_email: user?.email });
      return results?.[0] || null;
    },
    enabled: !!user?.email || isDemo
  });

  const todayLogs = logs.filter(log => isToday(new Date(log.created_date)));
  const sugarLogs = logs.filter(log => log.log_type === "sugar" && log.numeric_value);
  const lastSugar = sugarLogs[0]?.numeric_value;
  const avgSugar = sugarLogs.length > 0 
    ? Math.round(sugarLogs.slice(0, 7).reduce((a, b) => a + b.numeric_value, 0) / Math.min(sugarLogs.length, 7))
    : null;

  const bpLogs = logs.filter(log => log.log_type === "blood_pressure");
  const lastBP = bpLogs[0]?.value;

  const generateInsights = () => {
    const insights = [];
    
    if (sugarLogs.length >= 5) {
      const afterDinnerLogs = sugarLogs.filter(l => l.time_of_day === "after_dinner");
      const otherLogs = sugarLogs.filter(l => l.time_of_day !== "after_dinner");
      
      if (afterDinnerLogs.length > 0 && otherLogs.length > 0) {
        const avgAfterDinner = afterDinnerLogs.reduce((a, b) => a + b.numeric_value, 0) / afterDinnerLogs.length;
        const avgOther = otherLogs.reduce((a, b) => a + b.numeric_value, 0) / otherLogs.length;
        
        if (avgAfterDinner > avgOther * 1.15) {
          insights.push({
            type: "warning",
            title: "Dinner time sugar spikes detected!",
            description: "Your sugar is consistently highest after dinner compared to other times.",
            action: "Reduce carbs by 20% at dinner. Try more veggies instead."
          });
        }
      }

      const recentAvg = sugarLogs.slice(0, 5).reduce((a, b) => a + b.numeric_value, 0) / 5;
      const olderAvg = sugarLogs.slice(5, 10).reduce((a, b) => a + b.numeric_value, 0) / Math.min(sugarLogs.length - 5, 5);
      
      if (sugarLogs.length >= 10 && recentAvg < olderAvg * 0.95) {
        insights.push({
          type: "improvement",
          title: "Great progress! 📈",
          description: "Your sugar levels are improving compared to last week. Keep doing what you're doing!",
          action: null
        });
      }
    }

    if (todayLogs.length === 0) {
      insights.push({
        type: "info",
        title: "No logs today yet",
        description: "Start logging to track your health patterns. Just send a message on WhatsApp!",
        action: "Send 'Sugar 120' on WhatsApp to start"
      });
    }

    if (todayLogs.length >= 3) {
      insights.push({
        type: "success",
        title: "Excellent tracking today!",
        description: `You've logged ${todayLogs.length} entries today. Consistent tracking = better insights.`,
        action: null
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const handleOnboardingAction = (action) => {
    if (action === "connect_whatsapp") {
      window.open(base44.agents.getWhatsAppConnectURL('health_buddy'), '_blank');
    } else if (action === "add_medication") {
      setShowMedicationModal(true);
    } else if (action === "first_log") {
      setShowQuickLog(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    queryClient.invalidateQueries({ queryKey: ['health-logs'] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Demo Mode Banner */}
      {isDemo && <DemoBanner />}

      {/* Demo AI Chat */}
      {isDemo && (
        <DemoAIChat 
          isOpen={showDemoChat} 
          onClose={() => setShowDemoChat(false)} 
        />
      )}

      {/* Onboarding Flow */}
      {showOnboarding && !isDemo && (
        <OnboardingFlow 
          user={user} 
          onComplete={handleOnboardingComplete}
          onStepAction={handleOnboardingAction}
        />
      )}

      {/* Quick Log Modal */}
      <QuickLogModal 
        isOpen={showQuickLog} 
        onClose={() => {
          setShowQuickLog(false);
          queryClient.invalidateQueries({ queryKey: ['health-logs'] });
        }} 
        user={user} 
      />

      {/* Quick Medication Modal */}
      <QuickMedicationModal 
        isOpen={showMedicationModal} 
        onClose={() => setShowMedicationModal(false)} 
        user={user} 
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            {user ? `Hello, ${user.full_name?.split(' ')[0] || 'there'}` : 'Gluco Vital'} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            {format(new Date(), "EEEE, MMMM d")} • Your health companion
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                icon={Droplet}
                label="Last Sugar"
                value={lastSugar ? `${lastSugar}` : "--"}
                subValue="mg/dL"
                color="blue"
              />
              <StatCard 
                icon={Heart}
                label="Last BP"
                value={lastBP || "--"}
                color="red"
              />
              <StatCard 
                icon={TrendingUp}
                label="7-Day Avg Sugar"
                value={avgSugar || "--"}
                subValue="mg/dL"
                color="purple"
              />
              <StatCard 
                icon={Calendar}
                label="Today's Logs"
                value={todayLogs.length}
                color="green"
              />
            </div>

            {/* Sugar Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Sugar Trend</h2>
                  <p className="text-sm text-slate-500">Last 14 readings</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <SugarChart 
                logs={logs}
                targetFasting={profile?.target_sugar_fasting || 100}
                targetPostMeal={profile?.target_sugar_post_meal || 140}
              />
            </div>

            {/* AI Insights */}
            {insights.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                  <h2 className="text-lg font-semibold text-slate-800">AI Insights</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {insights.map((insight, idx) => (
                    <InsightCard key={idx} {...insight} />
                  ))}
                </div>
              </div>
            )}

            {/* Nurse Coach - Detailed Health Coaching */}
            <NurseCoach logs={logs} profile={profile} achievements={achievements} />

            {/* Recent Logs */}
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
              {logsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              ) : logs.length > 0 ? (
                <div className="space-y-3">
                  {logs.slice(0, 10).map(log => (
                                            <LogCard key={log.id} log={log} timezone={profile?.timezone || "Asia/Kolkata"} />
                                          ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                  <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No health logs yet</p>
                  <p className="text-sm text-slate-400 mt-1">Connect WhatsApp and start logging!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Points & Streak Mini Display */}
            <PointsDisplay 
              points={achievements?.total_points || 0}
              streak={achievements?.current_streak || 0}
            />

            {/* Recommended Schedule for Insulin Users */}
            <RecommendedSchedule 
              isOnInsulin={profile?.is_on_insulin || false}
              todayLogs={todayLogs}
            />

            {/* Weekly Challenge */}
            <WeeklyChallenge 
              progress={achievements?.weekly_challenge_progress || 0}
            />

            {!isDemo && <WhatsAppConnect isConnected={profile?.whatsapp_connected} />}
            
            {isDemo && (
              <div className="space-y-4">
                {/* Demo CTA */}
                <DemoBanner compact />
                
                {/* Try AI Health Buddy */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 border border-violet-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-violet-800">Health Buddy AI</h3>
                      <p className="text-xs text-violet-600">Try a sample conversation</p>
                    </div>
                  </div>
                  <p className="text-sm text-violet-700 mb-4">
                    See how the AI responds to your health logs with gentle insights and context-aware follow-ups.
                  </p>
                  <Button
                    onClick={() => setShowDemoChat(true)}
                    className="w-full bg-violet-600 hover:bg-violet-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Try Demo Chat
                  </Button>
                </div>

                {/* Demo Features Guide */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-800 mb-3">🎯 Explore Demo Features</h3>
                  <div className="space-y-2 text-sm">
                    <a href={createPageUrl("Reports") + "?demo=true"} className="block p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      📊 <span className="text-slate-700">Reports</span> — Weekly summaries & insights
                    </a>
                    <a href={createPageUrl("Progress") + "?demo=true"} className="block p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      📈 <span className="text-slate-700">Progress</span> — Trends over time
                    </a>
                    <a href={createPageUrl("CareHub") + "?demo=true"} className="block p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      💊 <span className="text-slate-700">Care Hub</span> — Medications & reminders
                    </a>
                    <a href={createPageUrl("CaregiverDashboard") + "?demo=true"} className="block p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      👥 <span className="text-slate-700">Caregiver View</span> — What family sees
                    </a>
                    <a href={createPageUrl("Achievements") + "?demo=true"} className="block p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      🏆 <span className="text-slate-700">Achievements</span> — Streaks & badges
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4">Quick Tips 💡</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-700">Log consistently</p>
                  <p className="text-slate-500 text-xs mt-1">Same times daily = better patterns</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-700">Note what you eat</p>
                  <p className="text-slate-500 text-xs mt-1">Helps identify food triggers</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-700">Share with doctor</p>
                  <p className="text-slate-500 text-xs mt-1">Show your trends at checkups</p>
                </div>
              </div>
            </div>

            {/* How to Log */}
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-5 border border-violet-100">
              <h3 className="font-semibold text-slate-800 mb-3">How to Log via WhatsApp</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p>📍 <strong>"Sugar 120"</strong> - log sugar level</p>
                <p>📍 <strong>"BP 130/80"</strong> - blood pressure</p>
                <p>📍 <strong>"Ate rice dal"</strong> - meals</p>
                <p>📍 <strong>"Took medicine"</strong> - medication</p>
                <p>📍 <strong>"Feeling dizzy"</strong> - symptoms</p>
              </div>
            </div>

            {/* Global Reach */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-3">🌍 Supports 14 Languages</h3>
              <p className="text-xs text-slate-500 mb-3">Countries with highest diabetics:</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                  <span>🇨🇳 China</span>
                  <span className="font-bold text-red-700">141M</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                  <span>🇮🇳 India</span>
                  <span className="font-bold text-orange-700">77M</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span>🇺🇸 USA</span>
                  <span className="font-bold text-blue-700">32M</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span>🇵🇰 Pakistan</span>
                  <span className="font-bold text-green-700">33M</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                  <span>🇧🇷 Brazil</span>
                  <span className="font-bold text-purple-700">17M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
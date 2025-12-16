import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, startOfDay, differenceInDays } from "date-fns";
import { TrendingUp, TrendingDown, Activity, Calendar, Download, Target, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SugarTrendChart, SugarDistributionChart, TimeOfDayChart, BPTrendChart } from "@/components/reports/ReportCharts";
import MedicationAdherenceChart from "@/components/progress/MedicationAdherenceChart";
import ProgressStats from "@/components/progress/ProgressStats";
import ComparisonCards from "@/components/progress/ComparisonCards";

export default function Progress() {
  const [user, setUser] = useState(null);
  const [timeRange, setTimeRange] = useState("30"); // days

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['health-logs-progress', user?.email],
    queryFn: () => base44.entities.HealthLog.filter({ user_email: user?.email }, '-created_date', 200),
    enabled: !!user?.email
  });

  const { data: profile } = useQuery({
    queryKey: ['patient-profile', user?.email],
    queryFn: async () => {
      const results = await base44.entities.PatientProfile.filter({ user_email: user?.email });
      return results?.[0];
    },
    enabled: !!user?.email
  });

  const { data: achievements } = useQuery({
    queryKey: ['user-achievements', user?.email],
    queryFn: async () => {
      const results = await base44.entities.UserAchievements.filter({ user_email: user?.email });
      return results?.[0];
    },
    enabled: !!user?.email
  });

  // Filter logs by time range
  const cutoffDate = subDays(new Date(), parseInt(timeRange));
  const filteredLogs = logs.filter(log => new Date(log.created_date) >= cutoffDate);

  // Calculate comparison with previous period
  const prevCutoffDate = subDays(cutoffDate, parseInt(timeRange));
  const prevPeriodLogs = logs.filter(log => {
    const date = new Date(log.created_date);
    return date >= prevCutoffDate && date < cutoffDate;
  });

  const handleExport = () => {
    const sugarLogs = filteredLogs.filter(l => l.log_type === "sugar" && l.numeric_value);
    const bpLogs = filteredLogs.filter(l => l.log_type === "blood_pressure");
    
    let csv = "Date,Type,Value,Time of Day,Notes\n";
    
    filteredLogs.forEach(log => {
      csv += `${format(new Date(log.created_date), "yyyy-MM-dd HH:mm")},${log.log_type},${log.value || log.numeric_value},"${log.time_of_day || ''}","${log.notes || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-progress-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              Progress Tracking
            </h1>
            <p className="text-slate-500 mt-1">Comprehensive view of your health trends</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="60">Last 60 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Progress Stats */}
        <ProgressStats 
          currentLogs={filteredLogs}
          previousLogs={prevPeriodLogs}
          profile={profile}
          achievements={achievements}
        />

        {/* Comparison Cards */}
        <ComparisonCards 
          currentLogs={filteredLogs}
          previousLogs={prevPeriodLogs}
          timeRange={parseInt(timeRange)}
        />

        {/* Charts Section */}
        <Tabs defaultValue="sugar" className="mt-8">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="sugar">Blood Sugar</TabsTrigger>
            <TabsTrigger value="bp">Blood Pressure</TabsTrigger>
            <TabsTrigger value="medication">Medication</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="sugar" className="space-y-6">
            <SugarTrendChart 
              logs={filteredLogs}
              targetFasting={profile?.target_sugar_fasting || 100}
              targetPostMeal={profile?.target_sugar_post_meal || 140}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <SugarDistributionChart 
                logs={filteredLogs}
                targetPostMeal={profile?.target_sugar_post_meal || 140}
              />
              <TimeOfDayChart logs={filteredLogs} />
            </div>
          </TabsContent>

          <TabsContent value="bp" className="space-y-6">
            <BPTrendChart logs={filteredLogs} />
            <Card className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Blood Pressure Summary</h3>
              <BPSummaryStats logs={filteredLogs} profile={profile} />
            </Card>
          </TabsContent>

          <TabsContent value="medication" className="space-y-6">
            <MedicationAdherenceChart 
              logs={filteredLogs}
              profile={profile}
              timeRange={parseInt(timeRange)}
            />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <LoggingActivityChart logs={filteredLogs} />
            <LoggingStreakCard achievements={achievements} logs={logs} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BPSummaryStats({ logs, profile }) {
  const bpLogs = logs.filter(l => l.log_type === "blood_pressure" && l.value);
  
  if (bpLogs.length === 0) {
    return <p className="text-slate-400 text-sm">No blood pressure data available</p>;
  }

  const bpValues = bpLogs.map(log => {
    const parts = log.value.match(/(\d+)\/(\d+)/);
    return parts ? { systolic: parseInt(parts[1]), diastolic: parseInt(parts[2]) } : null;
  }).filter(Boolean);

  const avgSystolic = Math.round(bpValues.reduce((a, b) => a + b.systolic, 0) / bpValues.length);
  const avgDiastolic = Math.round(bpValues.reduce((a, b) => a + b.diastolic, 0) / bpValues.length);
  const maxSystolic = Math.max(...bpValues.map(v => v.systolic));
  const minSystolic = Math.min(...bpValues.map(v => v.systolic));

  const targetSystolic = profile?.target_bp_systolic || 120;
  const targetDiastolic = profile?.target_bp_diastolic || 80;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-blue-700">{avgSystolic}/{avgDiastolic}</p>
        <p className="text-xs text-blue-600 mt-1">Average BP</p>
      </div>
      <div className="bg-slate-50 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-slate-700">{maxSystolic}/{Math.max(...bpValues.map(v => v.diastolic))}</p>
        <p className="text-xs text-slate-500 mt-1">Highest</p>
      </div>
      <div className="bg-slate-50 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-slate-700">{minSystolic}/{Math.min(...bpValues.map(v => v.diastolic))}</p>
        <p className="text-xs text-slate-500 mt-1">Lowest</p>
      </div>
      <div className="bg-green-50 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-green-700">{targetSystolic}/{targetDiastolic}</p>
        <p className="text-xs text-green-600 mt-1">Target</p>
      </div>
    </div>
  );
}

function LoggingActivityChart({ logs }) {
  const days = Array.from({ length: 30 }, (_, i) => subDays(new Date(), 29 - i));
  
  const data = days.map(day => {
    const dayLogs = logs.filter(log => {
      const logDate = startOfDay(new Date(log.created_date));
      return logDate.getTime() === startOfDay(day).getTime();
    });

    return {
      date: format(day, "MMM d"),
      count: dayLogs.length,
      types: {
        sugar: dayLogs.filter(l => l.log_type === "sugar").length,
        bp: dayLogs.filter(l => l.log_type === "blood_pressure").length,
        meal: dayLogs.filter(l => l.log_type === "meal").length,
        medication: dayLogs.filter(l => l.log_type === "medication").length,
      }
    };
  });

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-slate-800 mb-4">Daily Logging Activity</h3>
      <div className="grid grid-cols-7 gap-2">
        {data.slice(-28).map((day, idx) => (
          <div key={idx} className="text-center">
            <div 
              className={`h-12 rounded-lg flex items-center justify-center text-sm font-semibold ${
                day.count === 0 ? 'bg-slate-100 text-slate-300' :
                day.count < 3 ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}
            >
              {day.count}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{format(new Date(day.date), 'd')}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-slate-100" /> No logs
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-amber-100" /> 1-2 logs
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-100" /> 3+ logs
        </div>
      </div>
    </Card>
  );
}

function LoggingStreakCard({ achievements, logs }) {
  const currentStreak = achievements?.current_streak || 0;
  const longestStreak = achievements?.longest_streak || 0;
  
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-orange-500" />
        Logging Consistency
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 text-center border border-orange-100">
          <p className="text-4xl font-bold text-orange-600 mb-1">{currentStreak}</p>
          <p className="text-sm text-orange-700">Current Streak (days)</p>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 text-center border border-violet-100">
          <p className="text-4xl font-bold text-violet-600 mb-1">{longestStreak}</p>
          <p className="text-sm text-violet-700">Longest Streak (days)</p>
        </div>
      </div>
    </Card>
  );
}
import React from "react";
import { Droplet, Heart, Pill, Activity, TrendingUp, TrendingDown } from "lucide-react";

export default function ProgressStats({ currentLogs, previousLogs, profile, achievements }) {
  // Sugar stats
  const currentSugarLogs = currentLogs.filter(l => l.log_type === "sugar" && l.numeric_value);
  const prevSugarLogs = previousLogs.filter(l => l.log_type === "sugar" && l.numeric_value);
  
  const currentAvgSugar = currentSugarLogs.length > 0 
    ? Math.round(currentSugarLogs.reduce((a, b) => a + b.numeric_value, 0) / currentSugarLogs.length)
    : null;
  const prevAvgSugar = prevSugarLogs.length > 0 
    ? Math.round(prevSugarLogs.reduce((a, b) => a + b.numeric_value, 0) / prevSugarLogs.length)
    : null;
  
  const sugarTrend = currentAvgSugar && prevAvgSugar 
    ? Math.round(((currentAvgSugar - prevAvgSugar) / prevAvgSugar) * 100)
    : null;

  // BP stats
  const currentBPLogs = currentLogs.filter(l => l.log_type === "blood_pressure");
  const prevBPLogs = previousLogs.filter(l => l.log_type === "blood_pressure");

  // Medication adherence
  const expectedMeds = profile?.medications?.length || 0;
  const daysInPeriod = 30;
  const expectedTotal = expectedMeds * daysInPeriod;
  const actualMeds = currentLogs.filter(l => l.log_type === "medication").length;
  const adherence = expectedTotal > 0 ? Math.round((actualMeds / expectedTotal) * 100) : 0;

  // Activity
  const totalLogs = currentLogs.length;

  const stats = [
    {
      label: "Avg Blood Sugar",
      value: currentAvgSugar ? `${currentAvgSugar} mg/dL` : "--",
      icon: Droplet,
      color: "blue",
      trend: sugarTrend,
      improving: sugarTrend !== null && sugarTrend < 0
    },
    {
      label: "BP Readings",
      value: currentBPLogs.length,
      icon: Heart,
      color: "red",
      subtext: "readings logged"
    },
    {
      label: "Med Adherence",
      value: `${adherence}%`,
      icon: Pill,
      color: "purple",
      improving: adherence >= 80
    },
    {
      label: "Total Logs",
      value: totalLogs,
      icon: Activity,
      color: "green",
      subtext: "health entries"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, trend, improving, subtext }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600"
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend !== null && trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${
            improving ? 'text-green-600' : 'text-red-600'
          }`}>
            {improving ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
        {improving !== undefined && trend === null && (
          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
            improving ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {improving ? "Good" : "Needs attention"}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  );
}
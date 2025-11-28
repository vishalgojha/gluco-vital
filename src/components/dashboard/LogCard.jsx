import { format } from "date-fns";
import { Droplet, Heart, Utensils, Pill, Activity, Weight, Smile, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const logIcons = {
  sugar: Droplet,
  blood_pressure: Heart,
  meal: Utensils,
  medication: Pill,
  exercise: Activity,
  weight: Weight,
  mood: Smile,
  symptom: AlertCircle
};

const logColors = {
  sugar: "bg-blue-50 text-blue-600 border-blue-100",
  blood_pressure: "bg-red-50 text-red-600 border-red-100",
  meal: "bg-amber-50 text-amber-600 border-amber-100",
  medication: "bg-green-50 text-green-600 border-green-100",
  exercise: "bg-violet-50 text-violet-600 border-violet-100",
  weight: "bg-slate-50 text-slate-600 border-slate-100",
  mood: "bg-pink-50 text-pink-600 border-pink-100",
  symptom: "bg-orange-50 text-orange-600 border-orange-100"
};

export default function LogCard({ log }) {
  const Icon = logIcons[log.log_type] || Activity;
  const colorClass = logColors[log.log_type] || "bg-slate-50 text-slate-600 border-slate-100";

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 hover:border-slate-200 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className={cn("p-2.5 rounded-lg border", colorClass)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700 capitalize">
              {log.log_type.replace("_", " ")}
            </span>
            <span className="text-xs text-slate-400">
              {format(new Date(log.created_date), "h:mm a")}
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{log.value}</p>
          {log.time_of_day && (
            <span className="inline-block text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full mt-1.5 capitalize">
              {log.time_of_day.replace(/_/g, " ")}
            </span>
          )}
          {log.ai_insight && (
            <div className="mt-2 p-2.5 bg-gradient-to-r from-violet-50 to-blue-50 rounded-lg border border-violet-100">
              <p className="text-xs text-slate-600 leading-relaxed">💡 {log.ai_insight}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
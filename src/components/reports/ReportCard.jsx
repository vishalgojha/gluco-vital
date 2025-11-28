import { format } from "date-fns";
import { FileText, Calendar, Share2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ReportCard({ report, onClick }) {
  const typeColors = {
    weekly: "bg-blue-50 text-blue-700 border-blue-200",
    monthly: "bg-violet-50 text-violet-700 border-violet-200",
    quarterly: "bg-amber-50 text-amber-700 border-amber-200"
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-4 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-slate-50 rounded-lg">
          <FileText className="w-5 h-5 text-slate-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={cn("capitalize", typeColors[report.report_type])}>
              {report.report_type}
            </Badge>
            {report.shared_with_doctor && (
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Share2 className="w-3 h-3 mr-1" />
                Shared
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(report.start_date), "MMM d")} - {format(new Date(report.end_date), "MMM d, yyyy")}
          </p>
          {report.sugar_stats?.average && (
            <p className="text-xs text-slate-400 mt-1">
              Avg Sugar: {report.sugar_stats.average} mg/dL • {report.sugar_stats.readings_count} readings
            </p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300" />
      </div>
    </div>
  );
}
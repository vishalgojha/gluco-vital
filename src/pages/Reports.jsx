import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReportGenerator from "@/components/reports/ReportGenerator";
import ReportCard from "@/components/reports/ReportCard";
import ReportViewer from "@/components/reports/ReportViewer";

export default function Reports() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['health-reports', user?.email],
    queryFn: () => base44.entities.HealthReport.filter({ user_email: user?.email }, '-created_date'),
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

  const handleReportGenerated = (report) => {
    queryClient.invalidateQueries({ queryKey: ['health-reports'] });
    setShowGenerator(false);
    setSelectedReport(report);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Health Reports</h1>
            <p className="text-slate-500 mt-1">AI-generated health summaries for you & your doctor</p>
          </div>
          <Button onClick={() => setShowGenerator(!showGenerator)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>

        {showGenerator && (
          <div className="mb-8">
            <ReportGenerator 
              userEmail={user?.email} 
              onReportGenerated={handleReportGenerated}
            />
          </div>
        )}

        <div className="space-y-4">
          <h2 className="font-semibold text-slate-700">Previous Reports</h2>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No reports yet</p>
              <p className="text-sm text-slate-400 mt-1">Generate your first health report above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map(report => (
                <ReportCard 
                  key={report.id} 
                  report={report} 
                  onClick={() => setSelectedReport(report)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedReport && (
        <ReportViewer 
          report={selectedReport}
          profile={profile}
          onClose={() => setSelectedReport(null)}
          onUpdate={() => queryClient.invalidateQueries({ queryKey: ['health-reports'] })}
        />
      )}
    </div>
  );
}
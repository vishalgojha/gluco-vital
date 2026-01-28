import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, FileText, Calendar, Brain, Droplet, Heart, TrendingUp, 
  Clock, Pill, Loader2, ChevronRight, AlertTriangle, CheckCircle,
  Stethoscope, MessageCircle, Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, subDays, isToday, startOfWeek, endOfWeek } from "date-fns";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function PatientPortal() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['patient-profile', user?.email],
    queryFn: () => base44.entities.PatientProfile.filter({ user_email: user?.email }),
    select: data => data?.[0],
    enabled: !!user?.email
  });

  const { data: healthLogs = [] } = useQuery({
    queryKey: ['health-logs', user?.email],
    queryFn: () => base44.entities.HealthLog.filter({ user_email: user?.email }, '-created_date', 100),
    enabled: !!user?.email
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['health-documents', user?.email],
    queryFn: () => base44.entities.HealthDocument.filter({ owner_email: user?.email }, '-created_date', 20),
    enabled: !!user?.email
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['doctor-visits', user?.email],
    queryFn: () => base44.entities.DoctorVisit.filter({ user_email: user?.email }, '-visit_date', 10),
    enabled: !!user?.email
  });

  const { data: medications = [] } = useQuery({
    queryKey: ['medications', user?.email],
    queryFn: () => base44.entities.MedicationReminder.filter({ user_email: user?.email, is_active: true }),
    enabled: !!user?.email
  });

  const { data: doctorConnections = [] } = useQuery({
    queryKey: ['doctor-connections', user?.email],
    queryFn: () => base44.entities.DoctorConnection.filter({ patient_email: user?.email, status: "active" }),
    enabled: !!user?.email
  });

  const { data: feedback = [] } = useQuery({
    queryKey: ['doctor-feedback', user?.email],
    queryFn: () => base44.entities.DoctorFeedback.filter({ patient_email: user?.email }, '-created_date', 10),
    enabled: !!user?.email
  });

  // Process data
  const sugarLogs = healthLogs.filter(l => l.log_type === "sugar" && l.numeric_value);
  const bpLogs = healthLogs.filter(l => l.log_type === "blood_pressure");
  const todayLogs = healthLogs.filter(l => isToday(new Date(l.created_date)));

  const lastSugar = sugarLogs[0];
  const avgSugar = sugarLogs.length > 0
    ? Math.round(sugarLogs.slice(0, 7).reduce((a, b) => a + b.numeric_value, 0) / Math.min(sugarLogs.length, 7))
    : null;

  const chartData = sugarLogs.slice(0, 14).reverse().map(log => ({
    date: format(new Date(log.created_date), "MMM d"),
    value: log.numeric_value
  }));

  const upcomingAppointments = appointments.filter(a => 
    a.status === "scheduled" && new Date(a.visit_date) >= new Date()
  );

  const unreadFeedback = feedback.filter(f => !f.is_read_by_patient);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5b9a8b]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f4] via-[#f8faf9] to-[#faf8f5]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Patient Portal</h1>
          <p className="text-slate-500 text-sm mt-1">Your health at a glance</p>
        </div>

        {/* Alerts */}
        {(unreadFeedback.length > 0 || upcomingAppointments.length > 0) && (
          <div className="space-y-2 mb-6">
            {unreadFeedback.length > 0 && (
              <Link to={createPageUrl("PatientFeedback")}>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3 hover:bg-blue-100 transition-colors">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-700 flex-1">
                    You have {unreadFeedback.length} unread feedback from your doctor
                  </span>
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                </div>
              </Link>
            )}
            {upcomingAppointments.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-amber-700 flex-1">
                  Upcoming: {upcomingAppointments[0].doctor_name || "Doctor visit"} on {format(new Date(upcomingAppointments[0].visit_date), "MMM d, h:mm a")}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Droplet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{lastSugar?.numeric_value || "--"}</p>
                  <p className="text-xs text-slate-500">Last Sugar</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{avgSugar || "--"}</p>
                  <p className="text-xs text-slate-500">7-Day Avg</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{todayLogs.length}</p>
                  <p className="text-xs text-slate-500">Today's Logs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Pill className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{medications.length}</p>
                  <p className="text-xs text-slate-500">Active Meds</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Sugar Trend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-blue-500" />
                  Sugar Trend (Last 14 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#5b9a8b" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-slate-400">
                    No sugar readings yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  Recent Activity
                </CardTitle>
                <Link to={createPageUrl("History")}>
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        {log.log_type === "sugar" && <Droplet className="w-4 h-4 text-blue-500" />}
                        {log.log_type === "blood_pressure" && <Heart className="w-4 h-4 text-red-500" />}
                        {log.log_type === "medication" && <Pill className="w-4 h-4 text-amber-500" />}
                        {!["sugar", "blood_pressure", "medication"].includes(log.log_type) && <Activity className="w-4 h-4 text-slate-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{log.value}</p>
                        <p className="text-xs text-slate-400">{log.time_of_day?.replace(/_/g, ' ')}</p>
                      </div>
                      <span className="text-xs text-slate-400">
                        {format(new Date(log.created_date), "MMM d, h:mm a")}
                      </span>
                    </div>
                  ))}
                  {healthLogs.length === 0 && (
                    <p className="text-center text-slate-400 py-4">No logs yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Care Team */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#5b9a8b]" />
                  My Care Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                {doctorConnections.length > 0 ? (
                  <div className="space-y-2">
                    {doctorConnections.map(conn => (
                      <div key={conn.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-[#5b9a8b]/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-[#5b9a8b]">
                            {conn.doctor_name?.[0]?.toUpperCase() || "D"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{conn.doctor_name || "Doctor"}</p>
                          <p className="text-xs text-slate-400">Connected</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-400 mb-2">No doctors connected</p>
                    <Link to={createPageUrl("DoctorShare")}>
                      <Button size="sm" variant="outline">Connect Doctor</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  Recent Documents
                </CardTitle>
                <Link to={createPageUrl("Documents")}>
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.slice(0, 4).map(doc => (
                      <a key={doc.id} href={doc.file_url} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 truncate flex-1">{doc.title}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-400 mb-2">No documents yet</p>
                    <Link to={createPageUrl("Documents")}>
                      <Button size="sm" variant="outline">
                        <Upload className="w-3 h-3 mr-1" /> Upload
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Appointments */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-2">
                    {upcomingAppointments.slice(0, 3).map(apt => (
                      <div key={apt.id} className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                        <p className="text-sm font-medium text-slate-700">{apt.doctor_name || "Doctor Visit"}</p>
                        <p className="text-xs text-amber-600">{format(new Date(apt.visit_date), "MMM d, h:mm a")}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-400 py-4 text-sm">No upcoming appointments</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  <Link to={createPageUrl("Dashboard")}>
                    <Button variant="outline" className="w-full h-auto py-3 flex-col">
                      <Activity className="w-5 h-5 mb-1" />
                      <span className="text-xs">Log Data</span>
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Reports")}>
                    <Button variant="outline" className="w-full h-auto py-3 flex-col">
                      <Brain className="w-5 h-5 mb-1" />
                      <span className="text-xs">Reports</span>
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Documents")}>
                    <Button variant="outline" className="w-full h-auto py-3 flex-col">
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-xs">Upload</span>
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Progress")}>
                    <Button variant="outline" className="w-full h-auto py-3 flex-col">
                      <TrendingUp className="w-5 h-5 mb-1" />
                      <span className="text-xs">Progress</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
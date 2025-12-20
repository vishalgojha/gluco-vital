import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Clock, 
  Pill,
  AlertTriangle
} from "lucide-react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isToday, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  parseISO
} from "date-fns";
import { cn } from "@/lib/utils";

const STATUS_COLORS = {
  taken: "bg-green-500",
  missed: "bg-red-500",
  skipped: "bg-amber-500",
  late: "bg-orange-500",
  pending: "bg-slate-300"
};

export default function MedicationCalendar({ userEmail, reminders = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: adherenceRecords = [] } = useQuery({
    queryKey: ['medication-adherence-calendar', userEmail, format(currentMonth, 'yyyy-MM')],
    queryFn: async () => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      const records = await base44.entities.MedicationAdherence.filter({ 
        user_email: userEmail 
      });
      return records.filter(r => {
        const date = new Date(r.scheduled_time);
        return date >= start && date <= end;
      });
    },
    enabled: !!userEmail
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAdherenceForDay = (date) => {
    return adherenceRecords.filter(r => 
      isSameDay(new Date(r.scheduled_time), date)
    );
  };

  const getDayStatus = (date) => {
    const dayRecords = getAdherenceForDay(date);
    if (dayRecords.length === 0) return null;
    
    const taken = dayRecords.filter(r => r.status === 'taken').length;
    const total = dayRecords.length;
    
    if (taken === total) return 'complete';
    if (taken > 0) return 'partial';
    return 'missed';
  };

  const selectedDayRecords = getAdherenceForDay(selectedDate);
  const selectedDaySchedule = reminders.filter(r => r.is_active);

  // Calculate monthly stats
  const monthlyStats = {
    total: adherenceRecords.length,
    taken: adherenceRecords.filter(r => r.status === 'taken').length,
    missed: adherenceRecords.filter(r => r.status === 'missed').length,
    skipped: adherenceRecords.filter(r => r.status === 'skipped').length
  };
  const adherenceRate = monthlyStats.total > 0 
    ? Math.round((monthlyStats.taken / monthlyStats.total) * 100) 
    : 0;

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="w-5 h-5 text-violet-500" />
            Medication Schedule
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium text-slate-700 min-w-[140px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Monthly Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="p-2 bg-slate-50 rounded-lg text-center">
            <p className="text-lg font-bold text-slate-800">{adherenceRate}%</p>
            <p className="text-xs text-slate-500">Adherence</p>
          </div>
          <div className="p-2 bg-green-50 rounded-lg text-center">
            <p className="text-lg font-bold text-green-600">{monthlyStats.taken}</p>
            <p className="text-xs text-green-600">Taken</p>
          </div>
          <div className="p-2 bg-red-50 rounded-lg text-center">
            <p className="text-lg font-bold text-red-600">{monthlyStats.missed}</p>
            <p className="text-xs text-red-600">Missed</p>
          </div>
          <div className="p-2 bg-amber-50 rounded-lg text-center">
            <p className="text-lg font-bold text-amber-600">{monthlyStats.skipped}</p>
            <p className="text-xs text-amber-600">Skipped</p>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
              {day}
            </div>
          ))}
          {days.map((day, idx) => {
            const status = getDayStatus(day);
            const dayRecords = getAdherenceForDay(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "aspect-square p-1 rounded-lg text-sm relative transition-all",
                  isCurrentMonth ? "text-slate-700" : "text-slate-300",
                  isToday(day) && "ring-2 ring-violet-400",
                  isSelected && "bg-violet-100",
                  !isSelected && "hover:bg-slate-50"
                )}
              >
                <span className="block">{format(day, 'd')}</span>
                {dayRecords.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {status === 'complete' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    )}
                    {status === 'partial' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                    {status === 'missed' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Details */}
        <div className="border-t border-slate-100 pt-4">
          <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {isToday(selectedDate) ? "Today's Schedule" : format(selectedDate, "EEEE, MMMM d")}
          </h4>
          
          {selectedDayRecords.length > 0 ? (
            <div className="space-y-2">
              {selectedDayRecords.map((record, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    record.status === 'taken' && "bg-green-50 border-green-200",
                    record.status === 'missed' && "bg-red-50 border-red-200",
                    record.status === 'skipped' && "bg-amber-50 border-amber-200",
                    record.status === 'pending' && "bg-slate-50 border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Pill className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">{record.medication_name}</p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(record.scheduled_time), "h:mm a")}
                      </p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "capitalize",
                    record.status === 'taken' && "bg-green-100 text-green-700",
                    record.status === 'missed' && "bg-red-100 text-red-700",
                    record.status === 'skipped' && "bg-amber-100 text-amber-700",
                    record.status === 'pending' && "bg-slate-100 text-slate-700"
                  )}>
                    {record.status === 'taken' && <Check className="w-3 h-3 mr-1" />}
                    {record.status === 'missed' && <X className="w-3 h-3 mr-1" />}
                    {record.status === 'skipped' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : isToday(selectedDate) && selectedDaySchedule.length > 0 ? (
            <div className="space-y-2">
              {selectedDaySchedule.map((reminder, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <Pill className="w-4 h-4 text-violet-500" />
                    <div>
                      <p className="font-medium text-slate-700">{reminder.medication_name}</p>
                      <p className="text-xs text-slate-500">{reminder.dosage}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-slate-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Scheduled
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">
              No medication records for this day
            </p>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500" /> All taken
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Partial
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Missed
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
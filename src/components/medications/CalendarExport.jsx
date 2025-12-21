import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Clock, Repeat } from "lucide-react";
import { toast } from "sonner";
import { format, addDays, setHours, setMinutes, parseISO } from "date-fns";

// Generate ICS file content for a medication reminder
const generateICS = (reminder, days = 30) => {
  const events = [];
  const now = new Date();
  
  // Get times to create events for
  const times = reminder.specific_times || ["08:00"];
  
  for (let day = 0; day < days; day++) {
    const date = addDays(now, day);
    
    times.forEach((timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const eventDate = setMinutes(setHours(date, hours), minutes);
      
      const startStr = format(eventDate, "yyyyMMdd'T'HHmmss");
      const endStr = format(new Date(eventDate.getTime() + 15 * 60000), "yyyyMMdd'T'HHmmss");
      const uid = `glucovital-${reminder.id}-${day}-${timeStr.replace(":", "")}@glucovital.fit`;
      
      events.push(`BEGIN:VEVENT
DTSTART:${startStr}
DTEND:${endStr}
DTSTAMP:${format(now, "yyyyMMdd'T'HHmmss'Z'")}
UID:${uid}
SUMMARY:💊 ${reminder.medication_name} - ${reminder.dosage || "Take medication"}
DESCRIPTION:Time to take ${reminder.medication_name}${reminder.dosage ? ` (${reminder.dosage})` : ""}.\\n\\n${reminder.notes || ""}\\n\\nLogged via GlucoVital.fit
LOCATION:Home
STATUS:CONFIRMED
TRANSP:TRANSPARENT
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Time for ${reminder.medication_name}
TRIGGER:-PT5M
END:VALARM
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Take ${reminder.medication_name} NOW
TRIGGER:PT0M
END:VALARM
END:VEVENT`);
    });
  }
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GlucoVital.fit//Medication Reminders//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${reminder.medication_name} Reminders
X-WR-TIMEZONE:Asia/Kolkata
${events.join("\n")}
END:VCALENDAR`;
};

// Generate ICS for all reminders combined
const generateCombinedICS = (reminders, days = 30) => {
  const events = [];
  const now = new Date();
  
  reminders.forEach((reminder) => {
    if (!reminder.is_active) return;
    
    const times = reminder.specific_times || ["08:00"];
    
    for (let day = 0; day < days; day++) {
      const date = addDays(now, day);
      
      times.forEach((timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const eventDate = setMinutes(setHours(date, hours), minutes);
        
        const startStr = format(eventDate, "yyyyMMdd'T'HHmmss");
        const endStr = format(new Date(eventDate.getTime() + 15 * 60000), "yyyyMMdd'T'HHmmss");
        const uid = `glucovital-${reminder.id}-${day}-${timeStr.replace(":", "")}@glucovital.fit`;
        
        events.push(`BEGIN:VEVENT
DTSTART:${startStr}
DTEND:${endStr}
DTSTAMP:${format(now, "yyyyMMdd'T'HHmmss'Z'")}
UID:${uid}
SUMMARY:💊 ${reminder.medication_name}${reminder.dosage ? ` - ${reminder.dosage}` : ""}
DESCRIPTION:Time to take ${reminder.medication_name}${reminder.dosage ? ` (${reminder.dosage})` : ""}.\\n\\n${reminder.notes || ""}\\n\\nLogged via GlucoVital.fit
LOCATION:Home
STATUS:CONFIRMED
TRANSP:TRANSPARENT
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Time for ${reminder.medication_name}
TRIGGER:-PT5M
END:VALARM
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Take ${reminder.medication_name} NOW
TRIGGER:PT0M
END:VALARM
END:VEVENT`);
      });
    }
  });
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GlucoVital.fit//Medication Reminders//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:GlucoVital Medication Reminders
X-WR-TIMEZONE:Asia/Kolkata
${events.join("\n")}
END:VCALENDAR`;
};

const downloadICS = (content, filename) => {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function CalendarExport({ reminders = [], singleReminder = null }) {
  const [days, setDays] = useState(30);
  
  const handleExportSingle = (reminder) => {
    const ics = generateICS(reminder, days);
    const filename = `${reminder.medication_name.replace(/\s+/g, "_")}_reminders.ics`;
    downloadICS(ics, filename);
    toast.success(`Calendar file downloaded! Add it to your calendar app.`);
  };
  
  const handleExportAll = () => {
    const activeReminders = reminders.filter(r => r.is_active);
    if (activeReminders.length === 0) {
      toast.error("No active reminders to export");
      return;
    }
    
    const ics = generateCombinedICS(activeReminders, days);
    downloadICS(ics, "glucovital_medication_reminders.ics");
    toast.success(`Calendar file with ${activeReminders.length} medications downloaded!`);
  };
  
  // Single reminder export mode
  if (singleReminder) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleExportSingle(singleReminder)}
        className="gap-2"
      >
        <Calendar className="w-4 h-4" />
        Add to Calendar
      </Button>
    );
  }
  
  // Full export panel
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#5b9a8b]" />
        <h3 className="font-semibold text-slate-800">Export to Calendar</h3>
      </div>
      
      <p className="text-sm text-slate-600">
        Download calendar files (.ics) to add medication reminders to Google Calendar, Apple Calendar, or Outlook.
      </p>
      
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Create reminders for:</span>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm"
        >
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
          <option value={60}>60 days</option>
          <option value={90}>90 days</option>
        </select>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button onClick={handleExportAll} className="w-full bg-[#5b9a8b] hover:bg-[#4a8a7b]">
          <Download className="w-4 h-4 mr-2" />
          Download All Reminders
        </Button>
        
        <p className="text-xs text-slate-500 text-center">
          After downloading, open the .ics file to add events to your calendar
        </p>
      </div>
      
      {reminders.filter(r => r.is_active).length > 0 && (
        <div className="pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-2">Or export individually:</p>
          <div className="flex flex-wrap gap-2">
            {reminders.filter(r => r.is_active).map((reminder) => (
              <Button
                key={reminder.id}
                size="sm"
                variant="outline"
                onClick={() => handleExportSingle(reminder)}
                className="text-xs"
              >
                <Calendar className="w-3 h-3 mr-1" />
                {reminder.medication_name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
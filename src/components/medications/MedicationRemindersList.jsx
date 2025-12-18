import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pill, Clock, Bell, BellRing, BellOff, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import MedicationReminderForm from "./MedicationReminderForm";

const TIMING_LABELS = {
  specific_time: "At set times",
  before_meal: "Before meal",
  after_meal: "After meal",
  with_meal: "With meal",
  bedtime: "At bedtime",
  wakeup: "After waking",
  interval: "Every X hours"
};

const NOTIFICATION_ICONS = {
  gentle: Bell,
  urgent: BellRing,
  silent: BellOff
};

export default function MedicationRemindersList({ reminders = [], profile, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  const handleSave = async (formData) => {
    if (!formData.medication_name || formData.medication_name === "__custom__") {
      toast.error("Please enter a medication name");
      return;
    }
    
    try {
      const payload = {
        ...formData,
        user_email: profile?.user_email
      };
      
      if (editingReminder) {
        await base44.entities.MedicationReminder.update(editingReminder.id, payload);
        toast.success("Reminder updated!");
      } else {
        await base44.entities.MedicationReminder.create(payload);
        toast.success("Reminder created!");
      }
      setShowForm(false);
      setEditingReminder(null);
      onUpdate?.();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save reminder");
    }
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.MedicationReminder.delete(id);
      toast.success("Reminder deleted");
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const toggleActive = async (reminder) => {
    try {
      await base44.entities.MedicationReminder.update(reminder.id, {
        is_active: !reminder.is_active
      });
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const markTaken = async (reminder) => {
    try {
      const now = new Date().toISOString();
      
      // Update the reminder
      await base44.entities.MedicationReminder.update(reminder.id, {
        last_taken: now
      });
      
      // Log to HealthLog
      await base44.entities.HealthLog.create({
        user_email: profile?.user_email,
        log_type: "medication",
        value: `${reminder.medication_name} ${reminder.dosage}`,
        notes: "Marked via reminder"
      });
      
      // Create adherence record
      await base44.entities.MedicationAdherence.create({
        user_email: profile?.user_email,
        reminder_id: reminder.id,
        medication_name: reminder.medication_name,
        scheduled_time: now,
        status: "taken",
        taken_at: now,
        confirmed_via: "app"
      });
      
      toast.success(`${reminder.medication_name} marked as taken!`);
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to mark as taken");
    }
  };

  const markSkipped = async (reminder, reason = "") => {
    try {
      await base44.entities.MedicationAdherence.create({
        user_email: profile?.user_email,
        reminder_id: reminder.id,
        medication_name: reminder.medication_name,
        scheduled_time: new Date().toISOString(),
        status: "skipped",
        confirmed_via: "app",
        skip_reason: reason
      });
      toast.info(`${reminder.medication_name} marked as skipped`);
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const getTimingDisplay = (reminder) => {
    if (reminder.timing_type === "specific_time" && reminder.specific_times?.length) {
      return reminder.specific_times.map(t => format(new Date(`2000-01-01T${t}`), "h:mm a")).join(", ");
    }
    if (reminder.timing_type === "interval") {
      return `Every ${reminder.interval_hours} hours`;
    }
    if (["before_meal", "after_meal", "with_meal"].includes(reminder.timing_type)) {
      const offset = reminder.meal_offset_minutes || 0;
      if (offset < 0) return `${Math.abs(offset)} mins before meal`;
      if (offset > 0) return `${offset} mins after meal`;
      return "With meal";
    }
    return TIMING_LABELS[reminder.timing_type] || reminder.timing_type;
  };

  const NotifIcon = (style) => NOTIFICATION_ICONS[style] || Bell;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Pill className="w-5 h-5 text-violet-500" />
          Medication Reminders
        </h3>
        <Button size="sm" onClick={() => { setEditingReminder(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl">
          <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No medication reminders set</p>
          <Button variant="link" onClick={() => setShowForm(true)} className="mt-2">
            Add your first reminder
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder) => {
            const Icon = NotifIcon(reminder.notification_style);
            return (
              <div
                key={reminder.id}
                className={`p-4 rounded-xl border transition-all ${
                  reminder.is_active 
                    ? "bg-white border-slate-200" 
                    : "bg-slate-50 border-slate-100 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-800">{reminder.medication_name}</h4>
                      <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full">
                        {reminder.dosage}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {getTimingDisplay(reminder)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon className="w-3.5 h-3.5" />
                        {reminder.notification_style}
                      </span>
                    </div>
                    {reminder.notes && (
                      <p className="text-xs text-slate-400 mt-1">📝 {reminder.notes}</p>
                    )}
                    {reminder.last_taken && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Last taken: {format(new Date(reminder.last_taken), "MMM d, h:mm a")}
                      </p>
                    )}
                  </div>
                  <Switch
                    checked={reminder.is_active}
                    onCheckedChange={() => toggleActive(reminder)}
                  />
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markTaken(reminder)}
                    className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Check className="w-4 h-4 mr-1" /> Taken
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markSkipped(reminder)}
                    className="text-slate-500 border-slate-200 hover:bg-slate-50"
                  >
                    <X className="w-4 h-4 mr-1" /> Skip
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => { setEditingReminder(reminder); setShowForm(true); }}
                  >
                    <Pencil className="w-4 h-4 text-slate-400" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(reminder.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingReminder ? "Edit Reminder" : "Add Medication Reminder"}
            </DialogTitle>
          </DialogHeader>
          <MedicationReminderForm
            reminder={editingReminder}
            existingMedications={profile?.medications || []}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingReminder(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
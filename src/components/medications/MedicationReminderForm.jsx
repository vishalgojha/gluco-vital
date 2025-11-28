import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Clock, Plus, X, Bell, BellRing, BellOff } from "lucide-react";

const TIMING_OPTIONS = [
  { value: "specific_time", label: "At specific times", icon: "⏰" },
  { value: "before_meal", label: "Before meal", icon: "🍽️" },
  { value: "after_meal", label: "After meal", icon: "🍴" },
  { value: "with_meal", label: "With meal", icon: "🥗" },
  { value: "bedtime", label: "At bedtime", icon: "🌙" },
  { value: "wakeup", label: "After waking up", icon: "🌅" },
  { value: "interval", label: "Every X hours", icon: "🔄" },
];

const FREQUENCY_OPTIONS = [
  { value: "once_daily", label: "Once daily" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "thrice_daily", label: "Three times daily" },
  { value: "four_times", label: "Four times daily" },
  { value: "every_x_hours", label: "Every X hours" },
  { value: "weekly", label: "Weekly" },
  { value: "as_needed", label: "As needed" },
];

const MEAL_OFFSETS = [
  { value: -60, label: "1 hour before" },
  { value: -30, label: "30 mins before" },
  { value: -15, label: "15 mins before" },
  { value: 0, label: "With meal" },
  { value: 15, label: "15 mins after" },
  { value: 30, label: "30 mins after" },
  { value: 60, label: "1 hour after" },
  { value: 120, label: "2 hours after" },
];

export default function MedicationReminderForm({ reminder, onSave, onCancel, existingMedications = [] }) {
  const [form, setForm] = useState(reminder || {
    medication_name: "",
    dosage: "",
    timing_type: "specific_time",
    specific_times: ["08:00"],
    meal_offset_minutes: -30,
    interval_hours: 6,
    frequency: "once_daily",
    days_of_week: [],
    notification_style: "gentle",
    custom_message: "",
    notes: "",
    is_active: true
  });

  const addTime = () => {
    setForm({ ...form, specific_times: [...form.specific_times, "12:00"] });
  };

  const removeTime = (idx) => {
    setForm({ ...form, specific_times: form.specific_times.filter((_, i) => i !== idx) });
  };

  const updateTime = (idx, value) => {
    const times = [...form.specific_times];
    times[idx] = value;
    setForm({ ...form, specific_times: times });
  };

  const toggleDay = (day) => {
    const days = form.days_of_week.includes(day)
      ? form.days_of_week.filter(d => d !== day)
      : [...form.days_of_week, day];
    setForm({ ...form, days_of_week: days });
  };

  return (
    <div className="space-y-5">
      {/* Medication Selection or Input */}
      <div className="space-y-2">
        <Label>Medication Name</Label>
        {existingMedications.length > 0 ? (
          <Select value={form.medication_name} onValueChange={(v) => setForm({ ...form, medication_name: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select medication" />
            </SelectTrigger>
            <SelectContent>
              {existingMedications.map((med, idx) => (
                <SelectItem key={idx} value={med.name}>{med.name} - {med.dosage}</SelectItem>
              ))}
              <SelectItem value="__custom__">+ Add new medication</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={form.medication_name}
            onChange={(e) => setForm({ ...form, medication_name: e.target.value })}
            placeholder="e.g., Metformin, Insulin Glargine"
          />
        )}
        {form.medication_name === "__custom__" && (
          <Input
            className="mt-2"
            onChange={(e) => setForm({ ...form, medication_name: e.target.value })}
            placeholder="Enter medication name"
          />
        )}
      </div>

      {/* Dosage */}
      <div className="space-y-2">
        <Label>Dosage</Label>
        <Input
          value={form.dosage}
          onChange={(e) => setForm({ ...form, dosage: e.target.value })}
          placeholder="e.g., 500mg, 10 units"
        />
      </div>

      {/* Timing Type */}
      <div className="space-y-2">
        <Label>When to take</Label>
        <div className="grid grid-cols-2 gap-2">
          {TIMING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setForm({ ...form, timing_type: opt.value })}
              className={`p-3 rounded-lg border text-left text-sm transition-all ${
                form.timing_type === opt.value
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="mr-2">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Specific Times */}
      {form.timing_type === "specific_time" && (
        <div className="space-y-2">
          <Label>Set times</Label>
          <div className="space-y-2">
            {form.specific_times.map((time, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => updateTime(idx, e.target.value)}
                  className="flex-1"
                />
                {form.specific_times.length > 1 && (
                  <Button size="icon" variant="ghost" onClick={() => removeTime(idx)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addTime} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add another time
            </Button>
          </div>
        </div>
      )}

      {/* Meal Offset */}
      {["before_meal", "after_meal", "with_meal"].includes(form.timing_type) && (
        <div className="space-y-2">
          <Label>Timing relative to meal</Label>
          <Select 
            value={String(form.meal_offset_minutes)} 
            onValueChange={(v) => setForm({ ...form, meal_offset_minutes: parseInt(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEAL_OFFSETS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Interval Hours */}
      {form.timing_type === "interval" && (
        <div className="space-y-2">
          <Label>Every how many hours?</Label>
          <Select 
            value={String(form.interval_hours)} 
            onValueChange={(v) => setForm({ ...form, interval_hours: parseInt(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[4, 6, 8, 12].map((h) => (
                <SelectItem key={h} value={String(h)}>Every {h} hours</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Frequency */}
      <div className="space-y-2">
        <Label>Frequency</Label>
        <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FREQUENCY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Weekly Days */}
      {form.frequency === "weekly" && (
        <div className="space-y-2">
          <Label>Which days?</Label>
          <div className="flex flex-wrap gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  form.days_of_week.includes(day)
                    ? "bg-violet-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notification Style */}
      <div className="space-y-2">
        <Label>Notification style</Label>
        <div className="flex gap-2">
          {[
            { value: "gentle", icon: Bell, label: "Gentle" },
            { value: "urgent", icon: BellRing, label: "Urgent" },
            { value: "silent", icon: BellOff, label: "Silent" },
          ].map((style) => (
            <button
              key={style.value}
              onClick={() => setForm({ ...form, notification_style: style.value })}
              className={`flex-1 p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                form.notification_style === style.value
                  ? "border-violet-500 bg-violet-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <style.icon className={`w-5 h-5 ${form.notification_style === style.value ? "text-violet-600" : "text-slate-400"}`} />
              <span className="text-xs">{style.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div className="space-y-2">
        <Label>Custom reminder message (optional)</Label>
        <Textarea
          value={form.custom_message}
          onChange={(e) => setForm({ ...form, custom_message: e.target.value })}
          placeholder="e.g., Take with a full glass of water"
          rows={2}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label>Special instructions</Label>
        <Textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="e.g., Avoid dairy products, take on empty stomach"
          rows={2}
        />
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
        <Label>Reminder active</Label>
        <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button onClick={() => onSave(form)} className="flex-1 bg-violet-600 hover:bg-violet-700">
          Save Reminder
        </Button>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Droplets, Footprints, Moon, Apple, Salad, Heart, 
  Plus, Check, Flame, Target, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { format, isToday, parseISO } from "date-fns";

const HABIT_CONFIG = {
  water_intake: { icon: Droplets, color: "text-blue-500", bg: "bg-blue-50", label: "Water Intake", unit: "glasses", defaultTarget: 8 },
  exercise: { icon: Footprints, color: "text-green-500", bg: "bg-green-50", label: "Exercise", unit: "minutes", defaultTarget: 30 },
  walking: { icon: Footprints, color: "text-emerald-500", bg: "bg-emerald-50", label: "Walking", unit: "steps", defaultTarget: 5000 },
  sleep: { icon: Moon, color: "text-indigo-500", bg: "bg-indigo-50", label: "Sleep", unit: "hours", defaultTarget: 7 },
  foot_check: { icon: Heart, color: "text-pink-500", bg: "bg-pink-50", label: "Foot Check", unit: "times", defaultTarget: 1 },
  weight_check: { icon: Target, color: "text-purple-500", bg: "bg-purple-50", label: "Weight Check", unit: "times", defaultTarget: 1 },
  vegetable_intake: { icon: Salad, color: "text-lime-500", bg: "bg-lime-50", label: "Vegetables", unit: "servings", defaultTarget: 3 },
  meditation: { icon: Sparkles, color: "text-amber-500", bg: "bg-amber-50", label: "Meditation", unit: "minutes", defaultTarget: 10 },
  yoga: { icon: Heart, color: "text-rose-500", bg: "bg-rose-50", label: "Yoga", unit: "minutes", defaultTarget: 20 },
  no_sugar: { icon: Apple, color: "text-red-500", bg: "bg-red-50", label: "No Added Sugar", unit: "day", defaultTarget: 1 },
  other: { icon: Target, color: "text-slate-500", bg: "bg-slate-50", label: "Custom", unit: "", defaultTarget: 1 }
};

export default function HabitTracker({ userEmail }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ habit_type: "water_intake", habit_name: "", target_value: 8, target_unit: "glasses" });
  const [logValue, setLogValue] = useState({});
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: habits = [] } = useQuery({
    queryKey: ['daily-habits', userEmail],
    queryFn: () => base44.entities.DailyHabit.filter({ user_email: userEmail }),
    enabled: !!userEmail
  });

  const { data: todayLogs = [] } = useQuery({
    queryKey: ['habit-logs', userEmail, today],
    queryFn: () => base44.entities.HabitLog.filter({ user_email: userEmail, log_date: today }),
    enabled: !!userEmail
  });

  const createHabitMutation = useMutation({
    mutationFn: (data) => base44.entities.DailyHabit.create({ 
      ...data, 
      user_email: userEmail,
      is_active: true,
      current_streak: 0,
      longest_streak: 0
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-habits'] });
      toast.success("Habit added!");
      setShowForm(false);
      setFormData({ habit_type: "water_intake", habit_name: "", target_value: 8, target_unit: "glasses" });
    }
  });

  const logHabitMutation = useMutation({
    mutationFn: async ({ habitId, habitType, value, target }) => {
      const completed = value >= target;
      await base44.entities.HabitLog.create({
        user_email: userEmail,
        habit_id: habitId,
        habit_type: habitType,
        log_date: today,
        value: value,
        completed: completed,
        source: 'app'
      });
      // Update streak if completed
      if (completed) {
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          const newStreak = (habit.current_streak || 0) + 1;
          await base44.entities.DailyHabit.update(habitId, {
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, habit.longest_streak || 0),
            last_completed_date: today
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit-logs'] });
      queryClient.invalidateQueries({ queryKey: ['daily-habits'] });
      toast.success("Logged! 🎉");
    }
  });

  const getTodayLog = (habitId) => todayLogs.find(l => l.habit_id === habitId);

  const handleTypeChange = (type) => {
    const config = HABIT_CONFIG[type];
    setFormData(prev => ({
      ...prev,
      habit_type: type,
      target_value: config.defaultTarget,
      target_unit: config.unit
    }));
  };

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Daily Habits
          </CardTitle>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {habits.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-lg">
            <Target className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No habits tracked yet</p>
            <p className="text-xs text-slate-400">Build healthy routines!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.filter(h => h.is_active).map(habit => {
              const config = HABIT_CONFIG[habit.habit_type] || HABIT_CONFIG.other;
              const Icon = config.icon;
              const todayLog = getTodayLog(habit.id);
              const currentValue = todayLog?.value || logValue[habit.id] || 0;
              const progress = Math.min((currentValue / habit.target_value) * 100, 100);
              const isCompleted = todayLog?.completed;

              return (
                <div key={habit.id} className={`p-3 rounded-lg ${config.bg} border border-slate-100`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${config.color}`} />
                      <span className="font-medium text-sm">
                        {habit.habit_name || config.label}
                      </span>
                      {habit.current_streak > 0 && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Flame className="w-3 h-3" /> {habit.current_streak}
                        </span>
                      )}
                    </div>
                    {isCompleted && (
                      <span className="text-green-600">
                        <Check className="w-5 h-5" />
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Progress value={progress} className="flex-1 h-2" />
                    <span className="text-xs text-slate-600 min-w-[60px] text-right">
                      {currentValue}/{habit.target_value} {habit.target_unit}
                    </span>
                  </div>

                  {!isCompleted && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={logValue[habit.id] || ""}
                        onChange={(e) => setLogValue(prev => ({ ...prev, [habit.id]: parseInt(e.target.value) || 0 }))}
                        placeholder={`Enter ${habit.target_unit}`}
                        className="h-8 text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => logHabitMutation.mutate({
                          habitId: habit.id,
                          habitType: habit.habit_type,
                          value: logValue[habit.id] || 0,
                          target: habit.target_value
                        })}
                        disabled={!logValue[habit.id]}
                      >
                        Log
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Habit Form */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Daily Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Habit Type</Label>
                <Select value={formData.habit_type} onValueChange={handleTypeChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(HABIT_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Custom Name (optional)</Label>
                <Input
                  value={formData.habit_name}
                  onChange={(e) => setFormData(p => ({ ...p, habit_name: e.target.value }))}
                  placeholder="My morning routine"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Target</Label>
                  <Input
                    type="number"
                    value={formData.target_value}
                    onChange={(e) => setFormData(p => ({ ...p, target_value: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Input
                    value={formData.target_unit}
                    onChange={(e) => setFormData(p => ({ ...p, target_unit: e.target.value }))}
                  />
                </div>
              </div>
              <Button 
                onClick={() => createHabitMutation.mutate(formData)} 
                disabled={createHabitMutation.isPending}
                className="w-full"
              >
                Add Habit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
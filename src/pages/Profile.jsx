import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Target, Globe, Plus, X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [newCondition, setNewCondition] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    conditions: [],
    medications: [],
    disability_type: "",
    language_preference: "english",
    target_sugar_fasting: 100,
    target_sugar_post_meal: 140,
    target_bp_systolic: 120,
    target_bp_diastolic: 80,
    doctor_email: ""
  });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['patient-profile'],
    queryFn: () => base44.entities.PatientProfile.filter({ user_email: user?.email }),
    enabled: !!user?.email,
    select: data => data?.[0]
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || user?.full_name || "",
        age: profile.age || "",
        conditions: profile.conditions || [],
        medications: profile.medications || [],
        disability_type: profile.disability_type || "",
        language_preference: profile.language_preference || "english",
        target_sugar_fasting: profile.target_sugar_fasting || 100,
        target_sugar_post_meal: profile.target_sugar_post_meal || 140,
        target_bp_systolic: profile.target_bp_systolic || 120,
        target_bp_diastolic: profile.target_bp_diastolic || 80,
        doctor_email: profile.doctor_email || ""
      });
    } else if (user) {
      setFormData(prev => ({ ...prev, name: user.full_name || "" }));
    }
  }, [profile, user]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data, user_email: user.email };
      if (profile?.id) {
        return base44.entities.PatientProfile.update(profile.id, payload);
      }
      return base44.entities.PatientProfile.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-profile'] });
      toast.success("Profile saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save profile");
    }
  });

  const addCondition = () => {
    if (newCondition.trim() && !formData.conditions.includes(newCondition.trim())) {
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }));
      setNewCondition("");
    }
  };

  const removeCondition = (condition) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c !== condition)
    }));
  };

  const addMedication = () => {
    if (newMedication.trim() && !formData.medications.includes(newMedication.trim())) {
      setFormData(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()]
      }));
      setNewMedication("");
    }
  };

  const removeMedication = (medication) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m !== medication)
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your health profile and targets</p>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-blue-500" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || "" }))}
                    placeholder="Your age"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Language Preference</Label>
                  <Select
                    value={formData.language_preference}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, language_preference: value }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="hinglish">Hinglish</SelectItem>
                      <SelectItem value="chinese">中文 (Chinese) - 🇨🇳 141M diabetics</SelectItem>
                      <SelectItem value="spanish">Español (Spanish)</SelectItem>
                      <SelectItem value="portuguese">Português (Portuguese)</SelectItem>
                      <SelectItem value="urdu">اردو (Urdu) - 🇵🇰 33M diabetics</SelectItem>
                      <SelectItem value="indonesian">Bahasa (Indonesian) - 🇮🇩 19M diabetics</SelectItem>
                      <SelectItem value="german">Deutsch (German) - 🇩🇪 8M diabetics</SelectItem>
                      <SelectItem value="arabic">العربية (Arabic)</SelectItem>
                      <SelectItem value="bengali">বাংলা (Bengali) - 🇧🇩 13M diabetics</SelectItem>
                      <SelectItem value="russian">Русский (Russian) - 🇷🇺 9M diabetics</SelectItem>
                      <SelectItem value="japanese">日本語 (Japanese) - 🇯🇵 11M diabetics</SelectItem>
                      <SelectItem value="turkish">Türkçe (Turkish) - 🇹🇷 9M diabetics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Accessibility Needs</Label>
                  <Input
                    value={formData.disability_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, disability_type: e.target.value }))}
                    placeholder="e.g., Visual impairment, Motor disability"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Conditions */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-red-500" />
                Health Conditions & Medications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Health Conditions</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="e.g., Diabetes, Hypertension"
                    onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                  />
                  <Button onClick={addCondition} size="icon" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.conditions.map(condition => (
                    <Badge key={condition} variant="secondary" className="pl-3 pr-1 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100">
                      {condition}
                      <button onClick={() => removeCondition(condition)} className="ml-1.5 hover:bg-blue-200 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Current Medications</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    placeholder="e.g., Metformin 500mg"
                    onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                  />
                  <Button onClick={addMedication} size="icon" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.medications.map(medication => (
                    <Badge key={medication} variant="secondary" className="pl-3 pr-1 py-1.5 bg-green-50 text-green-700 hover:bg-green-100">
                      {medication}
                      <button onClick={() => removeMedication(medication)} className="ml-1.5 hover:bg-green-200 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Targets */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-violet-500" />
                Health Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-700">Sugar Targets (mg/dL)</h4>
                  <div>
                    <Label className="text-slate-500">Fasting Target</Label>
                    <Input
                      type="number"
                      value={formData.target_sugar_fasting}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_sugar_fasting: parseInt(e.target.value) }))}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-500">Post-Meal Target</Label>
                    <Input
                      type="number"
                      value={formData.target_sugar_post_meal}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_sugar_post_meal: parseInt(e.target.value) }))}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-700">Blood Pressure Target (mmHg)</h4>
                  <div>
                    <Label className="text-slate-500">Systolic (upper)</Label>
                    <Input
                      type="number"
                      value={formData.target_bp_systolic}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_bp_systolic: parseInt(e.target.value) }))}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-500">Diastolic (lower)</Label>
                    <Input
                      type="number"
                      value={formData.target_bp_diastolic}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_bp_diastolic: parseInt(e.target.value) }))}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctor */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-emerald-500" />
                Doctor Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Doctor's Email (Optional)</Label>
                <Input
                  type="email"
                  value={formData.doctor_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, doctor_email: e.target.value }))}
                  placeholder="doctor@example.com"
                  className="mt-1.5"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Share your health data with your doctor for better care coordination.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={() => saveMutation.mutate(formData)}
            disabled={saveMutation.isPending}
            className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white rounded-xl"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
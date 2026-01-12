import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Pill, 
  Droplet, 
  ArrowRight, 
  ArrowLeft,
  X,
  Sparkles,
  Heart,
  User,
  Activity,
  FileText,
  Stethoscope,
  Check,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CONDITIONS = [
  { value: "type2_diabetes", label: "Type 2 Diabetes" },
  { value: "type1_diabetes", label: "Type 1 Diabetes" },
  { value: "prediabetes", label: "Prediabetes" },
  { value: "hypertension", label: "Hypertension (High BP)" },
  { value: "gestational_diabetes", label: "Gestational Diabetes" }
];

const FEATURES = [
  { icon: MessageCircle, title: "WhatsApp Logging", desc: "Just text 'Sugar 120' – no forms needed", color: "bg-green-100 text-green-600" },
  { icon: Activity, title: "AI Insights", desc: "Spot patterns & get personalized tips", color: "bg-blue-100 text-blue-600" },
  { icon: Pill, title: "Med Reminders", desc: "Never miss a dose with smart alerts", color: "bg-violet-100 text-violet-600" },
  { icon: FileText, title: "Doctor Reports", desc: "Share clean PDFs with your doctor", color: "bg-amber-100 text-amber-600" }
];

export default function OnboardingFlow({ user, onComplete, onStepAction }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile data
  const [profileData, setProfileData] = useState({
    age: "",
    gender: "",
    conditions: [],
    is_on_insulin: false,
    target_sugar_fasting: 100,
    target_sugar_post_meal: 140,
    target_bp_systolic: 120,
    target_bp_diastolic: 80
  });

  // Doctor connection
  const [doctorEmail, setDoctorEmail] = useState("");

  useEffect(() => {
    if (user?.onboarding_completed) {
      setIsVisible(false);
    }
  }, [user]);

  const totalSteps = 5;
  const progress = ((currentStep) / (totalSteps - 1)) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleCondition = (value) => {
    setProfileData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(value)
        ? prev.conditions.filter(c => c !== value)
        : [...prev.conditions, value]
    }));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      // Save patient profile
      const existingProfiles = await base44.entities.PatientProfile.filter({ user_email: user.email });
      
      const profilePayload = {
        user_email: user.email,
        name: user.full_name,
        age: parseInt(profileData.age) || null,
        gender: profileData.gender,
        conditions: profileData.conditions,
        is_on_insulin: profileData.is_on_insulin,
        target_sugar_fasting: profileData.target_sugar_fasting,
        target_sugar_post_meal: profileData.target_sugar_post_meal,
        target_bp_systolic: profileData.target_bp_systolic,
        target_bp_diastolic: profileData.target_bp_diastolic
      };

      if (existingProfiles?.length > 0) {
        await base44.entities.PatientProfile.update(existingProfiles[0].id, profilePayload);
      } else {
        await base44.entities.PatientProfile.create(profilePayload);
      }
    } catch (e) {
      console.error("Failed to save profile:", e);
    }
    setIsSaving(false);
  };

  const handleConnectDoctor = async () => {
    if (!doctorEmail) {
      handleNext();
      return;
    }
    
    try {
      // Create a pending connection request
      await base44.entities.DoctorConnection.create({
        patient_email: user.email,
        patient_name: user.full_name,
        doctor_email: doctorEmail,
        status: "pending",
        permissions: ["view_logs", "view_reports", "view_insights"],
        invited_at: new Date().toISOString()
      });
    } catch (e) {
      console.error("Failed to create doctor connection:", e);
    }
    handleNext();
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      await saveProfile();
      await base44.auth.updateMe({ onboarding_completed: true });
    } catch (e) {
      console.error("Failed to complete onboarding:", e);
    }
    setIsSaving(false);
    setIsVisible(false);
    onComplete?.();
  };

  const handleDismiss = async () => {
    try {
      await base44.auth.updateMe({ onboarding_completed: true });
    } catch (e) {
      console.error("Failed to save onboarding status");
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <motion.div
            key="welcome"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#5b9a8b] to-[#7eb8a8] flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Welcome to Gluco Vital! 🎉
            </h2>
            <p className="text-slate-600 mb-6">
              Let's personalize your experience in just a few steps. This helps us give you better insights and support.
            </p>
            <div className="bg-[#5b9a8b]/10 rounded-xl p-4 text-left">
              <p className="text-sm font-medium text-[#3d6b5f] mb-2">What we'll set up:</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#5b9a8b]" /> Your health profile</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#5b9a8b]" /> Target ranges</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#5b9a8b]" /> Doctor connection</li>
              </ul>
            </div>
          </motion.div>
        );

      case 1: // Profile basics
        return (
          <motion.div
            key="profile"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1 text-center">About You</h2>
            <p className="text-slate-500 text-sm mb-6 text-center">Basic info for personalized care</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Age</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 45"
                    value={profileData.age}
                    onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Gender</Label>
                  <Select
                    value={profileData.gender}
                    onValueChange={(v) => setProfileData(prev => ({ ...prev, gender: v }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs">Health Conditions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CONDITIONS.map(cond => (
                    <Badge
                      key={cond.value}
                      variant={profileData.conditions.includes(cond.value) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        profileData.conditions.includes(cond.value)
                          ? "bg-[#5b9a8b] hover:bg-[#4a8a7b]"
                          : "hover:bg-slate-100"
                      }`}
                      onClick={() => toggleCondition(cond.value)}
                    >
                      {cond.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-violet-50 rounded-xl">
                <div>
                  <p className="font-medium text-sm text-slate-800">On Insulin?</p>
                  <p className="text-xs text-slate-500">Helps with reading schedules</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={profileData.is_on_insulin ? "default" : "outline"}
                    className={profileData.is_on_insulin ? "bg-[#5b9a8b]" : ""}
                    onClick={() => setProfileData(prev => ({ ...prev, is_on_insulin: true }))}
                  >
                    Yes
                  </Button>
                  <Button
                    size="sm"
                    variant={!profileData.is_on_insulin ? "default" : "outline"}
                    className={!profileData.is_on_insulin ? "bg-slate-600" : ""}
                    onClick={() => setProfileData(prev => ({ ...prev, is_on_insulin: false }))}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2: // Target ranges
        return (
          <motion.div
            key="targets"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Droplet className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1 text-center">Your Target Ranges</h2>
            <p className="text-slate-500 text-sm mb-6 text-center">We'll alert you when readings go outside these</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="font-medium text-blue-800 text-sm mb-3">Blood Sugar Targets</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-blue-600">Fasting (mg/dL)</Label>
                    <Input
                      type="number"
                      value={profileData.target_sugar_fasting}
                      onChange={(e) => setProfileData(prev => ({ ...prev, target_sugar_fasting: parseInt(e.target.value) || 100 }))}
                      className="mt-1 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-blue-600">Post-Meal (mg/dL)</Label>
                    <Input
                      type="number"
                      value={profileData.target_sugar_post_meal}
                      onChange={(e) => setProfileData(prev => ({ ...prev, target_sugar_post_meal: parseInt(e.target.value) || 140 }))}
                      className="mt-1 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-xl">
                <p className="font-medium text-red-800 text-sm mb-3">Blood Pressure Targets</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-red-600">Systolic (mmHg)</Label>
                    <Input
                      type="number"
                      value={profileData.target_bp_systolic}
                      onChange={(e) => setProfileData(prev => ({ ...prev, target_bp_systolic: parseInt(e.target.value) || 120 }))}
                      className="mt-1 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-red-600">Diastolic (mmHg)</Label>
                    <Input
                      type="number"
                      value={profileData.target_bp_diastolic}
                      onChange={(e) => setProfileData(prev => ({ ...prev, target_bp_diastolic: parseInt(e.target.value) || 80 }))}
                      className="mt-1 bg-white"
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center">
                💡 These are common targets. Adjust based on your doctor's advice.
              </p>
            </div>
          </motion.div>
        );

      case 3: // Features overview
        return (
          <motion.div
            key="features"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1 text-center">What You Can Do</h2>
            <p className="text-slate-500 text-sm mb-6 text-center">Here's how Gluco Vital helps you</p>
            
            <div className="space-y-3">
              {FEATURES.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-800">{feature.title}</p>
                    <p className="text-xs text-slate-500">{feature.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-700 text-center">
                📱 <strong>Pro tip:</strong> Connect WhatsApp after setup for the easiest logging experience!
              </p>
            </div>
          </motion.div>
        );

      case 4: // Doctor connection
        return (
          <motion.div
            key="doctor"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1 text-center">Connect with Your Doctor</h2>
            <p className="text-slate-500 text-sm mb-6 text-center">Share your health data securely (optional)</p>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Doctor's Email</Label>
                <Input
                  type="email"
                  placeholder="doctor@clinic.com"
                  value={doctorEmail}
                  onChange={(e) => setDoctorEmail(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-slate-400 mt-1">We'll send them an invitation to connect</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <p className="font-medium text-sm text-slate-700">Benefits of connecting:</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Doctor sees your logs & trends</li>
                  <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Get feedback directly in the app</li>
                  <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Better coordinated care</li>
                </ul>
              </div>

              <p className="text-xs text-slate-500 text-center">
                You can always add or change this later in Settings.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header with progress */}
          <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm text-slate-500">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <Progress value={progress} className="h-1.5 sm:h-2" />
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            {renderStep()}
          </div>

          {/* Actions */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2 sm:space-y-3 sticky bottom-0 bg-white">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              
              {currentStep === 4 ? (
                <Button
                  onClick={doctorEmail ? handleConnectDoctor : handleComplete}
                  disabled={isSaving}
                  className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-[#5b9a8b] to-[#7eb8a8] hover:opacity-90 rounded-xl"
                >
                  {isSaving ? "Saving..." : doctorEmail ? "Send Invite & Finish" : "Complete Setup"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={currentStep === 1 || currentStep === 2 ? async () => { await saveProfile(); handleNext(); } : handleNext}
                  disabled={isSaving}
                  className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-[#5b9a8b] to-[#7eb8a8] hover:opacity-90 rounded-xl"
                >
                  {isSaving ? "Saving..." : "Continue"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>

            {currentStep === 4 && !doctorEmail && (
              <Button
                variant="ghost"
                onClick={handleComplete}
                className="w-full text-slate-500 text-sm"
              >
                Skip for now
              </Button>
            )}
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-1.5 sm:gap-2 pb-4 sm:pb-6">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                  idx === currentStep
                    ? "bg-[#5b9a8b]"
                    : idx < currentStep
                    ? "bg-[#5b9a8b]/50"
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
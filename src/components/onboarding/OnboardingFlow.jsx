import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  MessageCircle, 
  Pill, 
  Droplet, 
  CheckCircle, 
  ArrowRight, 
  X,
  Sparkles,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome to Gluco Vital! 🎉",
    description: "Let's get you set up in just 3 simple steps. Your personal AI nurse is ready to help you manage your health.",
    icon: Heart,
    color: "from-rose-500 to-pink-500"
  },
  {
    id: "whatsapp",
    title: "Connect WhatsApp",
    description: "Log your health data anytime by sending simple messages like 'Sugar 120' or 'BP 130/80'. No app needed!",
    icon: MessageCircle,
    color: "from-green-500 to-emerald-500",
    action: "connect_whatsapp"
  },
  {
    id: "medication",
    title: "Set Medication Reminders",
    description: "Never miss a dose! Add your medications and we'll remind you at the right times.",
    icon: Pill,
    color: "from-violet-500 to-purple-500",
    action: "add_medication"
  },
  {
    id: "first_log",
    title: "Log Your First Reading",
    description: "Start tracking! Enter your current sugar level or blood pressure to begin your health journey.",
    icon: Droplet,
    color: "from-blue-500 to-cyan-500",
    action: "first_log"
  },
  {
    id: "complete",
    title: "You're All Set! 🌟",
    description: "Congratulations! You've completed the setup. Nurse Priya is now ready to help you stay healthy.",
    icon: Sparkles,
    color: "from-amber-500 to-orange-500"
  }
];

export default function OnboardingFlow({ user, onComplete, onStepAction }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    if (user?.onboarding_completed) {
      setIsVisible(false);
    }
  }, [user]);

  const progress = ((currentStep) / (ONBOARDING_STEPS.length - 1)) * 100;
  const step = ONBOARDING_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCompletedSteps([...completedSteps, step.id]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleAction = () => {
    if (step.action) {
      onStepAction?.(step.action);
    }
    handleNext();
  };

  const handleComplete = async () => {
    try {
      await base44.auth.updateMe({ onboarding_completed: true });
    } catch (e) {
      console.error("Failed to save onboarding status");
    }
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
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header with progress */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </span>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Content */}
          <div className="px-6 py-8 text-center">
            <motion.div
              key={step.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                <step.icon className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                {step.title}
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>

              {/* Step-specific content */}
              {step.id === "whatsapp" && (
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-sm text-green-700 font-medium mb-2">Example messages:</p>
                  <div className="space-y-1 text-sm text-green-600">
                    <p>"Sugar 120"</p>
                    <p>"BP 130/80"</p>
                    <p>"Took my medicine"</p>
                  </div>
                </div>
              )}

              {step.id === "medication" && (
                <div className="mt-6 p-4 bg-violet-50 rounded-xl border border-violet-100">
                  <p className="text-sm text-violet-700">
                    Set reminders for breakfast, lunch, dinner, or custom times.
                  </p>
                </div>
              )}

              {step.id === "first_log" && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-700">
                    Track sugar, BP, meals, medications, and symptoms all in one place.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 space-y-3">
            {step.id === "complete" ? (
              <Button
                onClick={handleComplete}
                className="w-full h-12 bg-gradient-to-r from-[#5b9a8b] to-[#7eb8a8] hover:opacity-90 text-lg rounded-xl"
              >
                Start Using Gluco Vital
              </Button>
            ) : step.action ? (
              <>
                <Button
                  onClick={handleAction}
                  className={`w-full h-12 bg-gradient-to-r ${step.color} hover:opacity-90 text-lg rounded-xl`}
                >
                  {step.id === "whatsapp" && "Connect WhatsApp"}
                  {step.id === "medication" && "Add Medication"}
                  {step.id === "first_log" && "Log Now"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="w-full text-slate-500"
                >
                  Skip for now
                </Button>
              </>
            ) : (
              <Button
                onClick={handleNext}
                className="w-full h-12 bg-gradient-to-r from-[#5b9a8b] to-[#7eb8a8] hover:opacity-90 text-lg rounded-xl"
              >
                Get Started <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 pb-6">
            {ONBOARDING_STEPS.map((s, idx) => (
              <div
                key={s.id}
                className={`w-2 h-2 rounded-full transition-colors ${
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
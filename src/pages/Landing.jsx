import React from "react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Smartphone, 
  TrendingUp, 
  Shield, 
  Globe, 
  Heart,
  Droplet,
  Bell,
  Trophy,
  ArrowRight,
  Check
} from "lucide-react";

export default function Landing() {
  const features = [
    { icon: MessageCircle, title: "WhatsApp Logging", desc: "Log sugar, BP, meals via simple messages" },
    { icon: TrendingUp, title: "AI Insights", desc: "Personalized health trends & recommendations" },
    { icon: Bell, title: "Smart Reminders", desc: "Medication alerts that fit your schedule" },
    { icon: Trophy, title: "Gamification", desc: "Earn points, badges & stay motivated" },
    { icon: Globe, title: "14 Languages", desc: "Hindi, Chinese, Spanish, Arabic & more" },
    { icon: Shield, title: "Doctor Reports", desc: "Share health summaries with your doctor" },
  ];

  const stats = [
    { value: "537M", label: "People with diabetes globally" },
    { value: "14", label: "Languages supported" },
    { value: "24/7", label: "AI health companion" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f4] via-white to-[#e8f4f0]">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5b9a8b]/10 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5b9a8b] to-[#7eb8a8] flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#3d6b5f]">VitalSpark</span>
            </div>
            <Button 
              onClick={() => base44.auth.redirectToLogin(createPageUrl("Home"))}
              className="bg-[#5b9a8b] hover:bg-[#4a8a7b]"
            >
              Get Started
            </Button>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm text-[#5b9a8b] font-medium mb-6 border border-[#5b9a8b]/20">
            <Droplet className="w-4 h-4" />
            Diabetes & Health Management Made Simple
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Your Personal <span className="text-[#5b9a8b]">AI Nurse</span><br />
            on WhatsApp
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Log sugar, BP & meals via WhatsApp. Get personalized insights, medication reminders, 
            and health reports in your language. Like having a caring nurse in your pocket! 🩺
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => base44.auth.redirectToLogin(createPageUrl("Home"))}
              className="bg-[#5b9a8b] hover:bg-[#4a8a7b] h-14 px-8 text-lg rounded-xl shadow-lg shadow-[#5b9a8b]/20"
            >
              Start Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg rounded-xl border-2"
            >
              <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
              Try on WhatsApp
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-[#5b9a8b]">{stat.value}</p>
                <p className="text-xs md:text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* How it Works */}
      <section className="py-16 bg-white/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-4">
            Simple as Sending a Message
          </h2>
          <p className="text-center text-slate-500 mb-12 max-w-xl mx-auto">
            No complex apps to learn. Just text your health data on WhatsApp.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg text-slate-800 mb-2">1. Send a Message</h3>
              <p className="text-slate-500 text-sm">
                Text "Sugar 120" or "BP 130/80" on WhatsApp. That's it!
              </p>
              <div className="mt-4 p-3 bg-slate-50 rounded-lg text-left text-sm">
                <p className="text-green-600 font-mono">"Fasting sugar 110"</p>
                <p className="text-green-600 font-mono">"Ate roti dal sabzi"</p>
                <p className="text-green-600 font-mono">"Took medicine"</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="font-semibold text-lg text-slate-800 mb-2">2. Get AI Insights</h3>
              <p className="text-slate-500 text-sm">
                Nurse Priya analyzes your data and gives personalized tips.
              </p>
              <div className="mt-4 p-3 bg-violet-50 rounded-lg text-left text-sm text-violet-700">
                "Beta, dinner ke baad sugar thodi zyada hai. Roti ek kam kar ke dekho! 🙏"
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-slate-800 mb-2">3. Track Progress</h3>
              <p className="text-slate-500 text-sm">
                Beautiful charts, reports & achievements on the app.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <div className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">🏆 7-day streak</div>
                <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">✓ On target</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Everything You Need
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/80 transition-colors">
                <div className="p-2.5 bg-[#5b9a8b]/10 rounded-xl shrink-0">
                  <feature.icon className="w-5 h-5 text-[#5b9a8b]" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{feature.title}</h3>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-16 bg-gradient-to-br from-[#5b9a8b] to-[#4a8a7b] text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Speaks Your Language</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Supporting the countries with highest diabetes populations
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["🇮🇳 Hindi", "🇨🇳 中文", "🇺🇸 English", "🇵🇰 اردو", "🇧🇷 Português", "🇸🇦 العربية", "🇮🇩 Bahasa", "🇯🇵 日本語", "🇷🇺 Русский", "🇹🇷 Türkçe", "🇧🇩 বাংলা", "🇩🇪 Deutsch", "🇪🇸 Español", "🇲🇽 Hinglish"].map((lang, idx) => (
              <span key={idx} className="px-4 py-2 bg-white/10 rounded-full text-sm backdrop-blur">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Start Your Health Journey Today
          </h2>
          <p className="text-slate-500 mb-8">
            Free to use. No credit card required. Takes 30 seconds.
          </p>
          <Button 
            size="lg"
            onClick={() => base44.auth.redirectToLogin(createPageUrl("Home"))}
            className="bg-[#5b9a8b] hover:bg-[#4a8a7b] h-14 px-10 text-lg rounded-xl shadow-lg"
          >
            Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> Free forever</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> WhatsApp based</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> AI powered</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2024 VitalSpark. Your health, ignited. 💚</p>
        </div>
      </footer>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  TrendingUp, 
  Shield, 
  Globe, 
  Heart,
  Bell,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Lock,
  FileText,
  Award,
  Mic,
  Smartphone,
  Play
} from "lucide-react";

export default function Landing() {
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  
  useEffect(() => {
    document.title = "Gluco Vital - AI Diabetes Management on WhatsApp";
    
    const metaTags = [
      { name: "description", content: "Manage diabetes with AI-powered WhatsApp assistant. Log sugar, BP & meals via simple messages. Get personalized insights in 21 languages. Free forever." },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { property: "og:title", content: "Gluco Vital - Your Health Companion on WhatsApp" },
      { property: "og:description", content: "Log sugar, BP & meals via WhatsApp. Get gentle insights and clear summaries in your language." },
      { name: "theme-color", content: "#5b9a8b" },
    ];

    metaTags.forEach(({ name, property, content }) => {
      let meta = document.querySelector(`meta[${name ? 'name' : 'property'}="${name || property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.setAttribute('name', name);
        if (property) meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    return () => { document.title = "Gluco Vital"; };
  }, []);

  const handleGetStarted = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (isAuth) {
      window.location.href = createPageUrl("Home");
    } else {
      base44.auth.redirectToLogin(createPageUrl("Home"));
    }
  };

  const handleDemo = () => {
    window.location.href = createPageUrl("Home") + "?demo=true";
  };

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur border-t border-slate-200 p-3 shadow-lg">
        <Button 
          onClick={handleGetStarted}
          className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] h-12 rounded-xl text-base font-semibold shadow-lg"
        >
          <MessageCircle className="w-5 h-5 mr-2" /> Call or text on WhatsApp
        </Button>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pb-20 md:pb-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5f1] via-[#f0f9f6] to-[#faf8f5]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5b9a8b]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#7eb8a8]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative px-4 py-4 max-w-6xl mx-auto">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-6 md:mb-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5b9a8b] to-[#4a8a7b] flex items-center justify-center shadow-lg shadow-[#5b9a8b]/25">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-[#3d6b5f]">Gluco Vital</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleDemo} className="hidden sm:block text-sm font-medium text-slate-600 hover:text-[#5b9a8b]">
                Try Demo
              </button>
              <Button onClick={handleGetStarted} className="bg-[#5b9a8b] hover:bg-[#4a8a7b] text-white rounded-xl px-5 h-10 text-sm shadow-md">
                Sign In
              </Button>
            </div>
          </nav>

          {/* Hero Content - Two Column */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-6 md:py-12">
            {/* Left - Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-[#5b9a8b]/20 shadow-sm mb-5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-[#5b9a8b]">AI-Powered Diabetes Management</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 leading-[1.1] mb-3 tracking-tight">
                Gluco<span className="text-[#5b9a8b]">Vital</span>
              </h1>
              
              <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-4">
                <span className="text-[#5b9a8b] underline decoration-[#5b9a8b]/30 decoration-4 underline-offset-4">Call or text</span> on WhatsApp
              </h2>

              <p className="text-slate-600 text-base md:text-lg mb-6 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Speak or type your sugar, BP, or meals. Get instant AI insights and doctor-ready reports — in <strong>21 languages</strong>.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-6">
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] h-14 px-8 text-base rounded-2xl shadow-xl shadow-green-500/25 w-full sm:w-auto"
                >
                  <MessageCircle className="w-5 h-5 mr-2" /> Get Started Free
                </Button>
                
                <button 
                  onClick={handleDemo}
                  className="text-sm font-medium text-slate-600 hover:text-[#5b9a8b] transition-colors flex items-center gap-1 py-2"
                >
                  <Play className="w-4 h-4" /> Try the demo
                </button>
              </div>

              {/* Trust line */}
              <p className="text-sm text-slate-500 mb-4">Free. No credit card. Setup in 30 seconds.</p>
            </div>

            {/* Right - Product Mock */}
            <div className="relative max-w-[340px] mx-auto lg:mx-0 lg:ml-auto">
              {/* Phone Frame */}
              <div className="bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl shadow-slate-900/30">
                <div className="bg-[#e5ddd5] rounded-[2rem] overflow-hidden">
                  {/* WhatsApp Header */}
                  <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5b9a8b] to-[#4a8a7b] flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Asha • GlucoVital</p>
                      <p className="text-xs text-green-200">online</p>
                    </div>
                    <Mic className="w-5 h-5 text-white/70" />
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="p-3 space-y-2.5 min-h-[280px]">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-[#dcf8c6] rounded-xl rounded-tr-sm px-3 py-2 max-w-[80%] shadow-sm">
                        <p className="text-sm text-slate-800">Sugar 120 fasting</p>
                        <p className="text-[10px] text-slate-500 text-right mt-0.5">9:15 AM ✓✓</p>
                      </div>
                    </div>
                    
                    {/* Bot response */}
                    <div className="flex justify-start">
                      <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%] shadow-sm">
                        <p className="text-sm text-slate-800 font-medium">✅ Logged: 120 mg/dL (Fasting)</p>
                        <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-100">
                          <p className="text-xs text-green-700 font-medium">🎯 In target range!</p>
                          <p className="text-[11px] text-green-600 mt-1">Your 7-day avg: 118 mg/dL ↓3%</p>
                        </div>
                        <p className="text-[10px] text-slate-500 text-right mt-1.5">9:15 AM</p>
                      </div>
                    </div>

                    {/* Report preview hint */}
                    <div className="flex justify-start">
                      <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%] shadow-sm">
                        <div className="flex items-center gap-2 text-xs text-[#5b9a8b]">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">Weekly report ready</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Tap to view doctor-ready PDF</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -left-4 top-1/4 bg-white rounded-xl px-3 py-2 shadow-lg border border-slate-100 animate-pulse">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#5b9a8b]" />
                  <span className="text-xs font-medium text-slate-700">Voice enabled</span>
                </div>
              </div>
              <div className="absolute -right-2 bottom-1/3 bg-white rounded-xl px-3 py-2 shadow-lg border border-slate-100">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-medium text-slate-700">21 languages</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white border-y border-slate-100 py-4 md:py-5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              { icon: Check, text: "Free forever", color: "text-green-500" },
              { icon: Mic, text: "Voice & text", color: "text-[#5b9a8b]" },
              { icon: Globe, text: "21 languages", color: "text-blue-500" },
              { icon: FileText, text: "Doctor reports", color: "text-violet-500" },
              { icon: Lock, text: "Encrypted", color: "text-amber-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">How it works</h2>
            <p className="text-slate-600">Simple as texting a friend</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* WhatsApp Preview - Larger */}
            <div className="bg-[#e5ddd5] rounded-2xl overflow-hidden shadow-2xl max-w-[320px] mx-auto">
              <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5b9a8b] to-[#4a8a7b] flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Gluco Vital</p>
                  <p className="text-xs text-green-200">online</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-end">
                  <div className="bg-[#dcf8c6] rounded-xl px-4 py-2.5 max-w-[85%] shadow-sm">
                    <p className="text-sm text-slate-800">Fasting sugar 118</p>
                    <p className="text-[10px] text-slate-500 text-right mt-1">9:15 AM ✓✓</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white rounded-xl px-4 py-2.5 max-w-[90%] shadow-sm">
                    <p className="text-sm text-slate-800">✅ 118 mg/dL — in range! 🌅</p>
                    <p className="text-[10px] text-slate-500 mt-1.5">Your 7-day average: 124 mg/dL (improving!)</p>
                    <p className="text-[10px] text-slate-500 text-right mt-1">9:15 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {[
                { icon: MessageCircle, num: "1", title: "Call or text", desc: 'Say "Sugar 120" or type it — voice or text, your choice' },
                { icon: TrendingUp, num: "2", title: "See patterns", desc: "AI analyzes your readings and spots trends you might miss" },
                { icon: Shield, num: "3", title: "Share with doctor", desc: "Generate clean PDF reports for better consultations" },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5b9a8b]/20 to-[#5b9a8b]/5 flex items-center justify-center flex-shrink-0 border border-[#5b9a8b]/10">
                    <step.icon className="w-6 h-6 text-[#5b9a8b]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{step.title}</h3>
                    <p className="text-slate-600 text-sm mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features - Grid */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">What you get</h2>
            <p className="text-slate-600">Everything you need to manage diabetes better</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: MessageCircle, title: "Voice & text logging", desc: "Call or message — your choice" },
              { icon: TrendingUp, title: "Pattern insights", desc: "AI spots what affects your sugar" },
              { icon: Bell, title: "Gentle reminders", desc: "Helpful nudges, never shaming" },
              { icon: Shield, title: "Doctor reports", desc: "Clean PDF summaries" },
              { icon: Globe, title: "21 languages", desc: "Hindi, Tamil, Chinese & more" },
              { icon: Heart, title: "Streaks & badges", desc: "Stay motivated daily" },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-[#5b9a8b]/20 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5b9a8b]/15 to-[#5b9a8b]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-[#5b9a8b]" />
                </div>
                <h3 className="font-bold text-base text-slate-800 mb-1">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Banner */}
      <section className="py-10 md:py-12 px-4 bg-gradient-to-r from-[#5b9a8b] to-[#4a8a7b]">
        <div className="max-w-3xl mx-auto text-center text-white">
          <Globe className="w-10 h-10 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-3">Speaks your language</h3>
          <p className="text-sm text-white/90 leading-relaxed">
            Hindi • Tamil • Telugu • Marathi • Gujarati • Kannada • Malayalam • Bengali • Chinese • English • Urdu • Arabic • Spanish • Portuguese • Japanese • Russian • Turkish • German • Indonesian • Punjabi • Hinglish
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Simple, transparent pricing</h2>
            <p className="text-slate-600">Start free, upgrade when you're ready</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {/* Basic - Free */}
            <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white hover:border-slate-300 transition-colors">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Basic</p>
              <p className="text-3xl font-black text-slate-800 mt-1">₹0</p>
              <p className="text-green-600 text-xs font-medium mb-4">Always free</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {["Unlimited logging", "WhatsApp text", "7-day history", "Basic trends"].map((f,i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
            </div>
            
            {/* Starter */}
            <div className="border-2 border-blue-300 rounded-2xl p-5 bg-gradient-to-b from-blue-50 to-white relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full shadow">1ST MONTH FREE</span>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mt-1">Starter</p>
              <p className="text-3xl font-black text-slate-800 mt-1">₹99<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <p className="text-slate-500 text-xs mb-4">After free trial</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {["Everything in Basic", "30-day history", "Weekly AI insights", "PDF reports", "Medication reminders"].map((f,i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
            </div>
            
            {/* Premium */}
            <div className="border-2 border-[#5b9a8b] rounded-2xl p-5 bg-gradient-to-b from-[#5b9a8b]/10 to-white relative shadow-xl shadow-[#5b9a8b]/10 md:scale-105">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-[#5b9a8b] to-[#4a8a7b] text-white text-[10px] font-bold rounded-full shadow-lg">MOST POPULAR</span>
              <p className="text-xs text-[#5b9a8b] font-bold uppercase tracking-wide mt-1">Premium</p>
              <p className="text-3xl font-black text-slate-800 mt-1">₹499<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <p className="text-slate-500 text-xs mb-4">Best for active users</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {["Everything in Starter", "Unlimited history", "Daily AI coaching", "Voice reminders", "Doctor sharing", "Lab analysis"].map((f,i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-[#5b9a8b] flex-shrink-0" />{f}</li>
                ))}
              </ul>
            </div>
            
            {/* Family */}
            <div className="border-2 border-violet-200 rounded-2xl p-5 bg-white hover:border-violet-300 transition-colors">
              <p className="text-xs text-violet-600 font-bold uppercase tracking-wide">Family</p>
              <p className="text-3xl font-black text-slate-800 mt-1">₹799<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <p className="text-slate-500 text-xs mb-4">For caregivers</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {["Everything in Premium", "Up to 5 members", "Caregiver dashboard", "Real-time alerts", "Emergency escalation"].map((f,i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <p className="text-center text-xs text-slate-500 mt-6">
            All plans include 21 languages • Cancel anytime • Secure payments via Stripe
          </p>
        </div>
      </section>

      {/* FAQ - Accordion */}
      <section className="py-10 md:py-14 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 text-center mb-6">FAQ</h2>
          <div className="space-y-2">
            {[
              { q: "Do I need a CGM?", a: "No. Works with finger-stick readings." },
              { q: "Is it a replacement for my doctor?", a: "No. It helps you log and track, not diagnose." },
              { q: "How do I log readings?", a: 'Text "Sugar 120" or "BP 130/80" on WhatsApp.' },
              { q: "Is my data secure?", a: "Yes. Encrypted and never shared." },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-lg border border-slate-200">
                <summary className="flex items-center justify-between p-3 cursor-pointer text-sm font-medium text-slate-800">
                  {faq.q}
                  <span className="text-slate-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-3 pb-3 text-xs text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-[#e8f5f1] via-[#f0f9f6] to-[#faf8f5] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#5b9a8b]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#7eb8a8]/10 rounded-full blur-3xl" />
        <div className="max-w-lg mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Ready to take control?</h2>
          <p className="text-lg text-slate-600 mb-8">Free. No credit card. Setup in 30 seconds.</p>
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-[#5b9a8b] to-[#4a8a7b] hover:from-[#4a8a7b] hover:to-[#3d7a6b] h-14 px-10 text-lg rounded-2xl shadow-xl shadow-[#5b9a8b]/25"
          >
            Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-6 px-4 border-t border-slate-200 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <a href="https://elevenlabs.io/startup-grants" target="_blank" rel="noopener noreferrer" className="inline-block mb-3">
            <img src="https://eleven-public-cdn.elevenlabs.io/payloadcms/pwsc4vchsqt-ElevenLabsGrants.webp" alt="ElevenLabs Grants" className="h-6 mx-auto opacity-60 hover:opacity-100 transition-opacity" />
          </a>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <a href={createPageUrl("About")} className="hover:text-[#5b9a8b]">About</a>
            <a href={createPageUrl("PrivacyPolicy")} className="hover:text-[#5b9a8b]">Privacy</a>
            <a href={createPageUrl("Terms")} className="hover:text-[#5b9a8b]">Terms</a>
            <a href={createPageUrl("CancellationRefund")} className="hover:text-[#5b9a8b]">Refunds</a>
            <a href={createPageUrl("ContactUs")} className="hover:text-[#5b9a8b]">Contact</a>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            <a href="https://www.chaoscraftlabs.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#5b9a8b]">Chaos Craft Labs LLP</a> • Made in India 🇮🇳 • © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
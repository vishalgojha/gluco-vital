import React, { useEffect } from "react";
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
  ChevronDown
} from "lucide-react";

export default function Landing() {
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
      {/* Hero - Bold, impactful */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5f1] via-[#f0f9f6] to-[#faf8f5]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5b9a8b]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#7eb8a8]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative px-4 py-4">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-8 md:mb-12">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5b9a8b] to-[#4a8a7b] flex items-center justify-center shadow-lg shadow-[#5b9a8b]/25">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-[#3d6b5f]">Gluco Vital</span>
            </div>
            <Button onClick={handleGetStarted} className="bg-[#5b9a8b] hover:bg-[#4a8a7b] text-white rounded-xl px-5 h-10 text-sm shadow-md">
              Sign In
            </Button>
          </nav>

          {/* Hero Content */}
          <div className="max-w-2xl mx-auto text-center py-8 md:py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-[#5b9a8b]/20 shadow-sm mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-[#5b9a8b]">AI-Powered Diabetes Management</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-800 leading-[1.1] mb-4 tracking-tight">
              Gluco<span className="text-[#5b9a8b]">Vital</span>
            </h1>
            
            <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-4">
              Log your health via <span className="text-[#5b9a8b] underline decoration-[#5b9a8b]/30 decoration-4 underline-offset-4">WhatsApp</span>
            </h2>
            
            <p className="text-slate-600 text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Text your sugar, BP, or meals. Get insights, reminders, and doctor-ready reports — in <strong>21 languages</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-[#5b9a8b] to-[#4a8a7b] hover:from-[#4a8a7b] hover:to-[#3d7a6b] h-14 px-8 text-base rounded-2xl shadow-xl shadow-[#5b9a8b]/25 w-full sm:w-auto"
              >
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <button 
                onClick={handleDemo}
                className="text-sm font-medium text-slate-600 hover:text-[#5b9a8b] transition-colors flex items-center gap-1"
              >
                Try the demo <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> Free forever</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> No app needed</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> 21 languages</span>
            </div>
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
                { icon: MessageCircle, num: "1", title: "Text your data", desc: 'Just say "Sugar 120" or "Ate rice dal" — no forms, no apps' },
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
              { icon: MessageCircle, title: "WhatsApp logging", desc: "No app to learn — just text" },
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Simple pricing</h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">All features free during early access!</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-5">
            {/* Free */}
            <div className="border-2 border-slate-200 rounded-2xl p-6 bg-white hover:border-slate-300 transition-colors">
              <p className="text-sm text-green-600 font-bold">FREE FOREVER</p>
              <p className="text-4xl font-black text-slate-800 mt-2">₹0</p>
              <p className="text-slate-500 text-sm mb-5">Forever free</p>
              <ul className="space-y-3 text-sm text-slate-700">
                {["Unlimited logging", "WhatsApp integration", "7-day history"].map((f,i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" />{f}</li>
                ))}
              </ul>
            </div>
            
            {/* Premium */}
            <div className="border-2 border-[#5b9a8b] rounded-2xl p-6 bg-gradient-to-b from-[#5b9a8b]/5 to-white relative shadow-xl shadow-[#5b9a8b]/10 scale-105">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#5b9a8b] to-[#4a8a7b] text-white text-xs font-bold rounded-full shadow-lg">MOST POPULAR</span>
              <p className="text-sm text-[#5b9a8b] font-bold mt-2">PREMIUM</p>
              <p className="text-4xl font-black text-slate-800 mt-2">₹299<span className="text-lg font-normal text-slate-500">/mo</span></p>
              <p className="text-slate-500 text-sm mb-5">Best value</p>
              <ul className="space-y-3 text-sm text-slate-700">
                {["Unlimited history", "AI insights", "Doctor reports", "Smart reminders"].map((f,i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-5 h-5 text-[#5b9a8b]" />{f}</li>
                ))}
              </ul>
            </div>
            
            {/* Family */}
            <div className="border-2 border-violet-200 rounded-2xl p-6 bg-white hover:border-violet-300 transition-colors">
              <p className="text-sm text-violet-600 font-bold">FAMILY</p>
              <p className="text-4xl font-black text-slate-800 mt-2">₹499<span className="text-lg font-normal text-slate-500">/mo</span></p>
              <p className="text-slate-500 text-sm mb-5">For caregivers</p>
              <ul className="space-y-3 text-sm text-slate-700">
                {["3 family members", "Caregiver dashboard", "Real-time alerts"].map((f,i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-5 h-5 text-violet-500" />{f}</li>
                ))}
              </ul>
            </div>
          </div>
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
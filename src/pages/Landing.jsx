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
      {/* Hero - Compact, no wasted space */}
      <section className="px-4 py-3">
        {/* Nav */}
        <nav className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5b9a8b] flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#3d6b5f]">Gluco Vital</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleGetStarted} className="text-[#5b9a8b] text-sm">
            Sign In
          </Button>
        </nav>

        {/* Hero Content */}
        <div className="max-w-lg mx-auto text-center py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-2">
            Gluco Vital
          </h1>
          <p className="text-[#5b9a8b] text-xs font-medium mb-4 tracking-wide">DIABETES MANAGEMENT MADE SIMPLE</p>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-3">
            Log your health via <span className="text-[#5b9a8b]">WhatsApp</span>
          </h2>
          <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto">
            Text your sugar, BP, or meals. Get insights, reminders, and doctor-ready reports — in 21 languages.
          </p>

          {/* Primary CTA */}
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-[#5b9a8b] hover:bg-[#4a8a7b] h-11 px-6 text-sm rounded-xl shadow-md"
          >
            Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          {/* Secondary CTA */}
          <button 
            onClick={handleDemo}
            className="ml-3 text-sm text-slate-500 hover:text-[#5b9a8b] transition-colors"
          >
            or try the demo →
          </button>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-4 mt-5 text-xs text-slate-500">
            <span>✓ Free forever</span>
            <span>✓ No app needed</span>
            <span>✓ 21 languages</span>
          </div>
        </div>
      </section>

      {/* How it Works - Compact */}
      <section className="py-10 md:py-14 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 text-center mb-6">How it works</h2>
          
          {/* WhatsApp Preview */}
          <div className="bg-[#e5ddd5] rounded-xl overflow-hidden shadow-lg max-w-[280px] mx-auto mb-8">
            <div className="bg-[#075e54] text-white px-3 py-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#5b9a8b] flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="font-medium text-xs">Gluco Vital</p>
                <p className="text-[9px] text-green-200">online</p>
              </div>
            </div>
            <div className="p-2.5 space-y-1.5">
              <div className="flex justify-end">
                <div className="bg-[#dcf8c6] rounded-lg px-2.5 py-1.5 max-w-[85%]">
                  <p className="text-xs text-slate-800">Fasting sugar 118</p>
                  <p className="text-[8px] text-slate-500 text-right mt-0.5">9:15 AM ✓✓</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white rounded-lg px-2.5 py-1.5 max-w-[90%]">
                  <p className="text-xs text-slate-800">✅ 118 mg/dL — in range! 🌅</p>
                  <p className="text-[8px] text-slate-500 text-right mt-0.5">9:15 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="grid gap-4 md:grid-cols-3 text-center">
            {[
              { icon: MessageCircle, title: "Text your data", desc: '"Sugar 120" or "Ate rice dal"' },
              { icon: TrendingUp, title: "See patterns", desc: "AI spots trends in your logs" },
              { icon: Shield, title: "Share with doctor", desc: "Clean reports, better visits" },
            ].map((step, i) => (
              <div key={i} className="p-3">
                <div className="w-10 h-10 rounded-xl bg-[#5b9a8b]/10 flex items-center justify-center mx-auto mb-2">
                  <step.icon className="w-5 h-5 text-[#5b9a8b]" />
                </div>
                <h3 className="font-semibold text-sm text-slate-800">{step.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Grid */}
      <section className="py-10 md:py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 text-center mb-6">What you get</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              { icon: MessageCircle, title: "WhatsApp logging", desc: "No app to learn" },
              { icon: TrendingUp, title: "Pattern insights", desc: "Spot what affects you" },
              { icon: Bell, title: "Gentle reminders", desc: "Never shaming" },
              { icon: Shield, title: "Doctor reports", desc: "PDF summaries" },
              { icon: Globe, title: "21 languages", desc: "Hindi, Tamil, Chinese..." },
              { icon: Heart, title: "Streaks & badges", desc: "Stay motivated" },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-3 md:p-4 border border-slate-100">
                <f.icon className="w-5 h-5 text-[#5b9a8b] mb-2" />
                <h3 className="font-medium text-sm text-slate-800">{f.title}</h3>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages - Compact banner */}
      <section className="py-6 md:py-8 px-4 bg-[#5b9a8b]">
        <div className="max-w-2xl mx-auto text-center text-white">
          <p className="font-semibold mb-2">Speaks your language</p>
          <p className="text-xs text-white/80 leading-relaxed">
            Hindi • Tamil • Telugu • Marathi • Gujarati • Kannada • Malayalam • Bengali • Chinese • English • Urdu • Arabic • Spanish • Portuguese • Japanese • Russian • Turkish • German • Indonesian • Punjabi • Hinglish
          </p>
        </div>
      </section>

      {/* Pricing - Compact */}
      <section className="py-10 md:py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 text-center mb-2">Simple pricing</h2>
          <p className="text-center text-sm text-slate-500 mb-6">Free during early access</p>
          
          <div className="grid md:grid-cols-3 gap-3">
            {/* Free */}
            <div className="border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-green-600 font-medium">FREE FOREVER</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">₹0</p>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                {["Unlimited logging", "WhatsApp integration", "7-day history"].map((f,i) => (
                  <li key={i} className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-500" />{f}</li>
                ))}
              </ul>
            </div>
            
            {/* Premium */}
            <div className="border-2 border-[#5b9a8b] rounded-xl p-4 bg-[#5b9a8b]/5 relative">
              <span className="absolute -top-2.5 left-3 px-2 py-0.5 bg-[#5b9a8b] text-white text-[10px] font-medium rounded-full">POPULAR</span>
              <p className="text-xs text-[#5b9a8b] font-medium">PREMIUM</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">₹299<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                {["Unlimited history", "AI insights", "Doctor reports", "Reminders"].map((f,i) => (
                  <li key={i} className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#5b9a8b]" />{f}</li>
                ))}
              </ul>
            </div>
            
            {/* Family */}
            <div className="border border-violet-200 rounded-xl p-4">
              <p className="text-xs text-violet-600 font-medium">FAMILY</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">₹499<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                {["3 family members", "Caregiver dashboard", "Real-time alerts"].map((f,i) => (
                  <li key={i} className="flex items-center gap-1.5"><Check className="w-3 h-3 text-violet-500" />{f}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-center text-xs text-[#5b9a8b] mt-4">🎉 All features free during early access</p>
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
      <section className="py-10 md:py-14 px-4 bg-[#f0f7f4]">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Ready to start?</h2>
          <p className="text-sm text-slate-600 mb-5">Free. No credit card. 30 seconds.</p>
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-[#5b9a8b] hover:bg-[#4a8a7b] h-12 px-8 text-base rounded-xl shadow-md"
          >
            Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
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
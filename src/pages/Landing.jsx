import React, { useEffect } from "react";
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
  useEffect(() => {
    // SEO Meta Tags
    document.title = "Gluco Vital - AI Diabetes Management on WhatsApp | Free Health Tracker";
    
    const metaTags = [
      { name: "description", content: "Manage diabetes with AI-powered WhatsApp assistant. Log sugar, BP & meals via simple messages. Get personalized insights in 14 languages. Free forever. Start tracking your health today!" },
      { name: "keywords", content: "diabetes management, blood sugar tracker, AI health assistant, WhatsApp health app, glucose monitoring, diabetes care, health tracking app, insulin management, multilingual health app" },
      { name: "author", content: "Gluco Vital" },
      { name: "robots", content: "index, follow" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      
      // Open Graph
      { property: "og:title", content: "Gluco Vital - Your Personal Health Companion on WhatsApp" },
      { property: "og:description", content: "Log sugar, BP & meals via WhatsApp. Get gentle insights, reminders, and clear summaries in your language. Free health tracking made simple." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://glucovital.fit" },
      { property: "og:site_name", content: "Gluco Vital" },
      { property: "og:locale", content: "en_US" },
      
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Gluco Vital - AI Diabetes Management on WhatsApp" },
      { name: "twitter:description", content: "Manage diabetes with AI-powered WhatsApp assistant. Free, multilingual, and easy to use." },
      
      // Mobile
      { name: "theme-color", content: "#5b9a8b" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Gluco Vital" },
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

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://glucovital.fit');

    // JSON-LD Schema Markup
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HealthAndBeautyBusiness",
      "name": "Gluco Vital",
      "description": "AI-powered diabetes management platform accessible via WhatsApp. Personalized health tracking, insights, and reminders in 14 languages.",
      "url": "https://glucovital.fit",
      "logo": "https://glucovital.fit/logo.png",
      "sameAs": [],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      },
      "areaServed": "Worldwide",
      "availableLanguage": ["Hindi", "English", "Chinese", "Spanish", "Portuguese", "Arabic", "Bengali", "Russian", "Japanese", "Turkish", "Indonesian", "German", "Urdu"],
      "priceRange": "Free",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "500"
      }
    });
    document.head.appendChild(schemaScript);

    return () => {
      document.title = "Gluco Vital";
      if (schemaScript.parentNode) {
        schemaScript.parentNode.removeChild(schemaScript);
      }
    };
  }, []);
  const features = [
    { icon: MessageCircle, title: "WhatsApp Logging", desc: "Log sugar, BP, meals or notes — no app learning curve" },
    { icon: TrendingUp, title: "Pattern Insights", desc: "See trends over time and what influences your numbers" },
    { icon: Bell, title: "Gentle Reminders", desc: "Timely nudges that fit your routine — never shaming" },
    { icon: Trophy, title: "Consistency Signals", desc: "Simple streaks that reward showing up, not perfect numbers" },
    { icon: Globe, title: "14 Languages", desc: "Hindi, Chinese, Spanish, Arabic & more" },
    { icon: Shield, title: "Doctor-Ready Reports", desc: "Clear summaries for better doctor conversations" },
  ];

  const stats = [
    { value: "537M", label: "People with diabetes globally" },
    { value: "21", label: "Languages supported" },
    { value: "24/7", label: "Health companion" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f4] via-white to-[#e8f4f0]">
      {/* Hero Section - optimized for above-fold on 768px+ */}
      <header className="relative overflow-hidden min-h-[calc(100vh-60px)] lg:min-h-0 lg:h-auto flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5b9a8b]/10 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 py-2 lg:py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-[#5b9a8b] to-[#7eb8a8] flex items-center justify-center shadow-md" role="img" aria-label="Gluco Vital logo">
                <Heart className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
              </div>
              <span className="text-base lg:text-lg font-bold text-[#3d6b5f]">Gluco Vital</span>
            </div>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-2 lg:py-4 relative flex-1 flex items-center">
          <div className="grid md:grid-cols-2 gap-3 lg:gap-6 items-center w-full">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur px-2.5 py-1 rounded-full text-[10px] lg:text-xs text-[#5b9a8b] font-medium mb-2 lg:mb-3 border border-[#5b9a8b]/20">
                <Droplet className="w-3 h-3" aria-hidden="true" />
                Diabetes & Health Management Made Simple
              </div>
              <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] lg:text-[clamp(2rem,4vw,3rem)] font-bold text-slate-800 mb-2 lg:mb-3 leading-[1.15]">
                Your Personal <span className="text-[#5b9a8b]">Health Companion</span><br />on WhatsApp
              </h1>
              <p className="text-sm lg:text-base text-slate-600 max-w-xl mb-3 lg:mb-4 leading-snug">
                Log your sugar, BP, and meals via WhatsApp. Get gentle insights, reminders, and clear summaries — in your language.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 justify-center md:justify-start">
                <Button 
                  size="lg"
                  onClick={async () => {
                    const isAuth = await base44.auth.isAuthenticated();
                    if (isAuth) {
                      window.location.href = createPageUrl("Home");
                    } else {
                      base44.auth.redirectToLogin(createPageUrl("Home"));
                    }
                  }}
                  className="bg-[#5b9a8b] hover:bg-[#4a8a7b] h-9 lg:h-10 px-5 lg:px-6 text-sm lg:text-base rounded-xl shadow-lg"
                >
                  Get Started Free <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    window.location.href = createPageUrl("Home") + "?demo=true";
                  }}
                  className="h-9 lg:h-10 px-5 lg:px-6 text-sm lg:text-base rounded-xl border-2 border-[#5b9a8b] text-[#5b9a8b] hover:bg-[#5b9a8b]/10"
                >
                  Try Demo 👀
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 lg:gap-3 max-w-xs lg:max-w-sm mt-3 lg:mt-4 mx-auto md:mx-0">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center md:text-left">
                    <p className="text-lg lg:text-xl font-bold text-[#5b9a8b]">{stat.value}</p>
                    <p className="text-[9px] lg:text-[10px] text-slate-500 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="relative w-full max-w-[200px] lg:max-w-[280px] mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop&q=80" 
                  alt="Healthcare technology concept"
                  className="rounded-xl lg:rounded-2xl shadow-xl shadow-[#5b9a8b]/20 object-cover w-full aspect-square"
                />
                <div className="absolute -bottom-1.5 -left-1.5 lg:-bottom-2 lg:-left-2 bg-white rounded-lg lg:rounded-xl p-1.5 lg:p-2 shadow-lg border border-slate-100">
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <div className="w-6 h-6 lg:w-7 lg:h-7 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] lg:text-xs font-medium text-slate-800">Sugar Logged</p>
                      <p className="text-[8px] lg:text-[10px] text-slate-500">120 mg/dL • In Range</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-1.5 -right-1.5 lg:-top-2 lg:-right-2 bg-white rounded-lg lg:rounded-xl p-1.5 lg:p-2 shadow-lg border border-slate-100">
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <div className="w-6 h-6 lg:w-7 lg:h-7 bg-violet-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-[10px] lg:text-xs font-medium text-slate-800">WhatsApp</p>
                      <p className="text-[8px] lg:text-[10px] text-slate-500">Connected ✓</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* How it Works */}
      <section className="py-8 bg-white/50">
                    <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                        <div className="md:w-1/3">
                          {/* WhatsApp Chat Mockup */}
                          <div className="bg-[#e5ddd5] rounded-2xl shadow-lg w-full max-w-xs mx-auto overflow-hidden">
                            {/* WhatsApp Header */}
                            <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5b9a8b] to-[#7eb8a8] flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">Gluco Vital</p>
                                <p className="text-xs text-green-200">online</p>
                              </div>
                            </div>
                            {/* Chat Messages */}
                            <div className="p-3 space-y-2">
                              {/* User message */}
                              <div className="flex justify-end">
                                <div className="bg-[#dcf8c6] rounded-lg px-3 py-2 max-w-[80%] shadow-sm">
                                  <p className="text-sm text-slate-800">Fasting sugar 118</p>
                                  <p className="text-[10px] text-slate-500 text-right mt-1">9:15 AM ✓✓</p>
                                </div>
                              </div>
                              {/* Bot response */}
                              <div className="flex justify-start">
                                <div className="bg-white rounded-lg px-3 py-2 max-w-[85%] shadow-sm">
                                  <p className="text-sm text-slate-800">✅ Logged! Fasting sugar 118 mg/dL — within your target range. Great start to the day! 🌅</p>
                                  <p className="text-[10px] text-slate-500 text-right mt-1">9:15 AM</p>
                                </div>
                              </div>
                              {/* User message */}
                              <div className="flex justify-end">
                                <div className="bg-[#dcf8c6] rounded-lg px-3 py-2 max-w-[80%] shadow-sm">
                                  <p className="text-sm text-slate-800">Took metformin</p>
                                  <p className="text-[10px] text-slate-500 text-right mt-1">9:16 AM ✓✓</p>
                                </div>
                              </div>
                              {/* Bot response */}
                              <div className="flex justify-start">
                                <div className="bg-white rounded-lg px-3 py-2 max-w-[85%] shadow-sm">
                                  <p className="text-sm text-slate-800">💊 Medication logged! Keep up the consistency.</p>
                                  <p className="text-[10px] text-slate-500 text-right mt-1">9:16 AM</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="md:w-2/3 text-center md:text-left">
                          <h2 className="text-3xl font-bold text-slate-800 mb-4">
                            Simple as Sending a Message
                          </h2>
                          <p className="text-slate-500 max-w-xl">
                            No complex apps to learn. Just text your health data on WhatsApp. Our AI understands natural language in 14 languages.
                          </p>
                        </div>
                      </div>

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
              <h3 className="font-semibold text-lg text-slate-800 mb-2">2. Get Pattern Insights</h3>
              <p className="text-slate-500 text-sm">
                Gluco Vital analyzes your logs and highlights useful patterns.
              </p>
              <div className="mt-4 p-3 bg-violet-50 rounded-lg text-left text-sm text-violet-700">
                "Your post-dinner readings have been higher than usual. You could try a lighter dinner and see how it goes."
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-slate-800 mb-2">3. Track Progress</h3>
              <p className="text-slate-500 text-sm">
                Clear summaries that help you notice progress over time.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <div className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">🏆 7 days logged</div>
                <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">✓ Within range</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CGM Positioning Section */}
      <section className="py-12 bg-white/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Not sure if you need a CGM yet?
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Many people start with finger-stick testing and logging. Glucovital helps you understand patterns, habits, and context first — so you can decide if and when advanced monitoring like a CGM makes sense. Some users later add a CGM. Some never need one. Glucovital works in both cases.
          </p>
          <p className="text-slate-500 text-sm mt-3">
            Used by people managing diabetes at different stages.
          </p>
        </div>
      </section>

      {/* Features */}
                  <section className="py-16">
                    <div className="max-w-6xl mx-auto px-4">
                      <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">
                          Everything You Need
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                          Comprehensive diabetes management tools designed for real life
                        </p>
                      </div>
          
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
            Designed for people managing health in everyday life — across languages and cultures.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["🇮🇳 Hindi", "🇮🇳 Tamil", "🇮🇳 Telugu", "🇮🇳 Marathi", "🇮🇳 Gujarati", "🇮🇳 Kannada", "🇮🇳 Malayalam", "🇮🇳 Punjabi", "🇮🇳 Bengali", "🇨🇳 中文", "🇺🇸 English", "🇵🇰 اردو", "🇧🇷 Português", "🇸🇦 العربية", "🇮🇩 Bahasa", "🇯🇵 日本語", "🇷🇺 Русский", "🇹🇷 Türkçe", "🇩🇪 Deutsch", "🇪🇸 Español", "🇲🇽 Hinglish"].map((lang, idx) => (
              <span key={idx} className="px-4 py-2 bg-white/10 rounded-full text-sm backdrop-blur">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white/50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-slate-500 mb-12 max-w-xl mx-auto">
            Start free forever. Upgrade when you need more.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm">
              <div className="mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Free Forever</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Basic</h3>
              <p className="text-slate-500 text-sm mb-4">Start tracking your health</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-800">₹0</span>
                <span className="text-slate-500"> / forever</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Unlimited sugar & BP logging",
                  "Meal & medication tracking",
                  "WhatsApp integration",
                  "7-day history view",
                  "Basic trends & charts",
                  "14 language support"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline"
                className="w-full h-11 rounded-xl border-2"
                onClick={async () => {
                  const isAuth = await base44.auth.isAuthenticated();
                  if (isAuth) {
                    window.location.href = createPageUrl("Home");
                  } else {
                    base44.auth.redirectToLogin(createPageUrl("Home"));
                  }
                }}
              >
                Get Started Free
              </Button>
            </div>

            {/* Premium Tier */}
            <div className="bg-gradient-to-br from-[#5b9a8b] to-[#4a8a7b] rounded-2xl p-6 border-2 border-[#5b9a8b] shadow-lg text-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-amber-400 text-amber-900 rounded-full text-xs font-bold shadow-md">MOST POPULAR</span>
              </div>
              <div className="mb-4 mt-2">
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">Premium</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-white/80 text-sm mb-4">Advanced insights & AI</p>
              <div className="mb-2">
                <span className="text-4xl font-bold">₹299</span>
                <span className="text-white/80"> / month</span>
              </div>
              <p className="text-white/60 text-xs mb-6">or $5/month international</p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Everything in Basic",
                  "Unlimited history & reports",
                  "AI-powered insights",
                  "Doctor sharing & reports",
                  "Medication reminders",
                  "Weekly health summaries",
                  "Priority support",
                  "Works with finger-stick testing"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-white/90">
                    <Check className="w-4 h-4 text-amber-300 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full h-11 rounded-xl bg-white text-[#5b9a8b] hover:bg-white/90 font-semibold"
                onClick={async () => {
                  const isAuth = await base44.auth.isAuthenticated();
                  if (isAuth) {
                    window.location.href = createPageUrl("Home");
                  } else {
                    base44.auth.redirectToLogin(createPageUrl("Home"));
                  }
                }}
              >
                Start Free, Upgrade Later
              </Button>
            </div>

            {/* Family Tier */}
            <div className="bg-white rounded-2xl p-6 border-2 border-violet-200 shadow-sm relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold">FOR FAMILIES</span>
              </div>
              <div className="mb-4 mt-2">
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">Family</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Family Care</h3>
              <p className="text-slate-500 text-sm mb-4">Care for your loved ones</p>
              <div className="mb-2">
                <span className="text-4xl font-bold text-slate-800">₹499</span>
                <span className="text-slate-500"> / month</span>
              </div>
              <p className="text-slate-400 text-xs mb-6">or $9/month international</p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Everything in Premium",
                  "Up to 3 family members",
                  "Caregiver dashboard",
                  "Real-time alerts for family",
                  "Shared health reports",
                  "Emergency notifications",
                  "Family health insights",
                  "Dedicated family support"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-violet-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold"
                onClick={async () => {
                  const isAuth = await base44.auth.isAuthenticated();
                  if (isAuth) {
                    window.location.href = createPageUrl("Home");
                  } else {
                    base44.auth.redirectToLogin(createPageUrl("Home"));
                  }
                }}
              >
                Start Free, Upgrade Later
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            🎉 Currently all features are free during our early access period!
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50/50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-slate-500 mb-10">
            Everything you need to know about Gluco Vital
          </p>
          
          <div className="space-y-4">
            {[
                {
                                      q: "Do I need a CGM to use Gluco Vital?",
                                      a: "No. Gluco Vital works with finger-stick readings and manual logs. Many people use Gluco Vital before considering a CGM to build consistency, understand patterns, and share clearer data with their doctor. Some later add a CGM. Some never need one. Gluco Vital works in both cases. Your doctor can help you decide when—or if—a CGM makes sense."
                                    },
                {
                  q: "Is Gluco Vital a replacement for my doctor?",
                  a: "No. Gluco Vital helps you log and track your health data, but it does not diagnose, treat, or replace medical care. Always consult your doctor for medical decisions."
                },
              {
                q: "How do I log my readings?",
                a: "Simply send a WhatsApp message like 'Sugar 120' or 'BP 130/80'. You can also log meals, medications, and symptoms using natural language."
              },
              {
                q: "Is my health data private and secure?",
                a: "Yes. Your data is encrypted and stored securely. We never share your personal health information with third parties. You control your data."
              },
              {
                q: "What languages are supported?",
                a: "We support 14 languages including Hindi, English, Chinese, Spanish, Arabic, Bengali, Urdu, Portuguese, and more. The app responds in your preferred language."
              },
              {
                q: "Is Gluco Vital free to use?",
                a: "Yes. Gluco Vital is currently free to use, with no credit card required. We may introduce optional paid features in the future, but basic logging will always remain simple and accessible."
              },
              {
                q: "Can I share my reports with my doctor?",
                a: "Absolutely! You can generate clear, organized health reports and share them directly with your doctor via email or as a PDF."
              },
              {
                q: "What if I have an emergency reading?",
                a: "If your sugar is very high (>300) or very low (<70), or BP is critically high (>180/120), Gluco Vital will immediately advise you to seek medical help. It does not replace emergency care."
              }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-white rounded-xl border border-slate-200 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors">
                  <span className="font-medium text-slate-800 pr-4">{faq.q}</span>
                  <span className="text-[#5b9a8b] text-xl font-light group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
                  <section className="py-20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <img 
                        src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&h=600&fit=crop&q=60"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
                      <h2 className="text-3xl font-bold text-slate-800 mb-4">
                        Start with One Simple Log
                      </h2>
                      <p className="text-slate-500 mb-8">
                        Free to use. No credit card. Takes less than 30 seconds to send your first message.
                      </p>
          <Button 
            size="lg"
            onClick={async () => {
              const isAuth = await base44.auth.isAuthenticated();
              if (isAuth) {
                window.location.href = createPageUrl("Home");
              } else {
                base44.auth.redirectToLogin(createPageUrl("Home"));
              }
            }}
            className="bg-[#5b9a8b] hover:bg-[#4a8a7b] h-14 px-10 text-lg rounded-xl shadow-lg"
          >
            Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-slate-500 mt-4">
            After signing up, connect WhatsApp to log your health data via messages
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> Free to use</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> WhatsApp-based</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> AI-assisted (not medical advice)</span>
          </div>
        </div>
      </section>

      {/* Supported By */}
      <section className="py-8 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-500 mb-3">Supported by</p>
          <a href="https://elevenlabs.io/startup-grants" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://eleven-public-cdn.elevenlabs.io/payloadcms/pwsc4vchsqt-ElevenLabsGrants.webp" 
              alt="ElevenLabs Grants" 
              className="mx-auto"
              style={{ width: '180px' }}
            />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
            <a href={createPageUrl("About")} className="hover:text-[#5b9a8b] transition-colors">About</a>
            <span>•</span>
            <a href={createPageUrl("PrivacyPolicy")} className="hover:text-[#5b9a8b] transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href={createPageUrl("Terms")} className="hover:text-[#5b9a8b] transition-colors">Terms of Service</a>
            <span>•</span>
            <a href={createPageUrl("CancellationRefund")} className="hover:text-[#5b9a8b] transition-colors">Refund Policy</a>
            <span>•</span>
            <a href={createPageUrl("ContactUs")} className="hover:text-[#5b9a8b] transition-colors">Contact Us</a>
          </div>
          <p className="text-xs text-slate-400 mb-2">
            GlucoVital.fit is an experimental health project by <a href="https://www.chaoscraftlabs.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#5b9a8b]">Chaos Craft Labs LLP</a>,<br/>
            built to explore frictionless diabetes logging and care.
          </p>
          <p className="flex items-center justify-center gap-1 mb-1">
            Made with <span className="text-red-500">❤️</span> in India 🇮🇳
          </p>
          <p>© 2025 GlucoVital.fit • All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
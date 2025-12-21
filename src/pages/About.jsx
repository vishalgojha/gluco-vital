import React from "react";
import { Heart, MessageCircle, Globe, Shield, Users, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={createPageUrl("Landing")}>
            <Button variant="ghost" size="sm" className="gap-2 text-slate-600">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
        </div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5b9a8b] to-[#7eb8a8] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">About GlucoVital.fit</h1>
          <p className="text-slate-500 mt-2">Your AI-powered diabetes companion</p>
        </div>

        <div className="space-y-6">
          {/* Mission */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#5b9a8b]/10 rounded-lg">
                <Heart className="w-5 h-5 text-[#5b9a8b]" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Our Mission</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              GlucoVital.fit helps people with diabetes track, understand, and improve their health through smart insights. 
              We believe managing diabetes should be simple, accessible, and empowering for everyone.
            </p>
          </div>

          {/* What We Do */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">What We Offer</h2>
            </div>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-[#5b9a8b]">✓</span>
                <span><strong>Easy WhatsApp Logging</strong> — Just message your readings naturally</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#5b9a8b]">✓</span>
                <span><strong>AI-Powered Insights</strong> — Understand your patterns and trends</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#5b9a8b]">✓</span>
                <span><strong>Smart Reminders</strong> — Never miss a medication or reading</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#5b9a8b]">✓</span>
                <span><strong>Doctor Reports</strong> — Share progress with your healthcare provider</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#5b9a8b]">✓</span>
                <span><strong>Gamification</strong> — Stay motivated with streaks and badges</span>
              </li>
            </ul>
          </div>

          {/* Before Advanced Monitoring */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Before Advanced Monitoring</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              GlucoVital helps you build consistent logs, capture context, and generate longitudinal summaries — often before considering advanced glucose monitoring like CGMs. 
              Many users find this leads to more informed monitoring decisions and better readiness for conversations with their healthcare provider.
            </p>
          </div>

          {/* Global Reach */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Global & Multilingual</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              With over 537 million people living with diabetes worldwide, we're committed to making GlucoVital accessible 
              to everyone. We support <strong>14 languages</strong> including Hindi, Chinese, Spanish, Arabic, and more.
            </p>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Your Data, Protected</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              We take your privacy seriously. Your health data is encrypted, securely stored, and only accessible to you. 
              We follow industry-standard security practices to protect your information.
            </p>
          </div>

          {/* Team */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Made in India 🇮🇳</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              GlucoVital.fit is built with love in India, where over 77 million people live with diabetes. 
              We understand the challenges and are committed to making diabetes management easier for everyone.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-[#5b9a8b]/10 to-[#7eb8a8]/10 rounded-2xl p-6 border border-[#5b9a8b]/20 text-center">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Get in Touch</h2>
            <p className="text-slate-600 mb-4">Have questions or feedback? We'd love to hear from you.</p>
            <a 
              href="mailto:support@glucovital.fit" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5b9a8b] text-white rounded-xl font-medium hover:bg-[#4a8a7b] transition-colors"
            >
              support@glucovital.fit
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect } from "react";
import { Shield, Database, Eye, Lock, UserCheck, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy - GlucoVital";
    return () => { document.title = "Gluco Vital"; };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link to={createPageUrl("Landing")} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#5b9a8b] mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <h1 className="text-2xl font-bold text-slate-800 mb-1">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mb-6">Last updated: December 2025</p>

        <div className="space-y-4">
          <p className="text-sm text-slate-600 bg-white rounded-xl p-4 border border-slate-100">
            At GlucoVital.fit, we take your privacy seriously. This policy explains how we collect, use, and protect your information.
          </p>

          <section className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-500" />
              <h2 className="font-semibold text-slate-800 text-sm">What We Collect</h2>
            </div>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Account info: name, email</li>
              <li>• Health data: sugar, BP, meals, medications</li>
              <li>• Profile: age, conditions, language</li>
              <li>• WhatsApp messages for logging</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-green-500" />
              <h2 className="font-semibold text-slate-800 text-sm">How We Use It</h2>
            </div>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Provide personalized insights</li>
              <li>• Send reminders</li>
              <li>• Generate reports</li>
              <li>• Improve our AI</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-violet-500" />
              <h2 className="font-semibold text-slate-800 text-sm">How We Protect It</h2>
            </div>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Encrypted in transit and at rest</li>
              <li>• Only you access your data</li>
              <li>• Never sold to third parties</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-orange-500" />
              <h2 className="font-semibold text-slate-800 text-sm">Who Sees Your Data</h2>
            </div>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• You: full access</li>
              <li>• Doctor: only if you share</li>
              <li>• Us: limited, for support</li>
              <li>• Third parties: never identifiable data</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#5b9a8b]" />
              <h2 className="font-semibold text-slate-800 text-sm">Your Rights</h2>
            </div>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Access your data anytime</li>
              <li>• Correct or delete it</li>
              <li>• Export in portable format</li>
              <li>• Opt-out of communications</li>
            </ul>
          </section>

          <section className="bg-[#5b9a8b]/5 rounded-xl p-4 border border-[#5b9a8b]/20">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-[#5b9a8b]" />
              <h2 className="font-semibold text-slate-800 text-sm">Questions?</h2>
            </div>
            <a href="mailto:support@glucovital.fit" className="text-[#5b9a8b] text-sm hover:underline">
              support@glucovital.fit
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
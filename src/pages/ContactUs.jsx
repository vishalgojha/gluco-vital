import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MessageCircle, Clock, MapPin } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f4] via-white to-[#e8f4f0]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to={createPageUrl("Landing")}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#5b9a8b]/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-[#5b9a8b]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Contact Us</h1>
              <p className="text-sm text-slate-500">We're here to help</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Email Support */}
            <div className="bg-[#5b9a8b]/5 rounded-xl p-6 border border-[#5b9a8b]/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#5b9a8b] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 mb-1">Email Support</h2>
                  <p className="text-slate-600 text-sm mb-3">
                    For general inquiries, support requests, or feedback
                  </p>
                  <a 
                    href="mailto:support@glucovital.fit" 
                    className="inline-flex items-center gap-2 text-[#5b9a8b] font-medium hover:underline"
                  >
                    support@glucovital.fit
                  </a>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 mb-1">Response Time</h2>
                  <p className="text-slate-600 text-sm">
                    We typically respond within <strong>24-48 hours</strong> on business days (Monday to Friday).
                  </p>
                </div>
              </div>
            </div>

            {/* Business Address */}
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 mb-1">Business Address</h2>
                  <p className="text-slate-600 text-sm">
                    Chaos Craft Labs LLP<br />
                    India 🇮🇳
                  </p>
                </div>
              </div>
            </div>

            {/* What to Include */}
            <div className="border border-slate-200 rounded-xl p-6">
              <h2 className="font-semibold text-slate-800 mb-3">When Contacting Us, Please Include:</h2>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b]"></span>
                  Your registered email address
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b]"></span>
                  A clear description of your question or issue
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b]"></span>
                  Screenshots if reporting a technical problem
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b]"></span>
                  Your subscription plan (if applicable)
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="border-t border-slate-100 pt-6">
              <h2 className="font-semibold text-slate-800 mb-3">Helpful Links</h2>
              <div className="flex flex-wrap gap-3">
                <Link to={createPageUrl("About")} className="text-sm text-[#5b9a8b] hover:underline">
                  About Us
                </Link>
                <span className="text-slate-300">•</span>
                <Link to={createPageUrl("PrivacyPolicy")} className="text-sm text-[#5b9a8b] hover:underline">
                  Privacy Policy
                </Link>
                <span className="text-slate-300">•</span>
                <Link to={createPageUrl("Terms")} className="text-sm text-[#5b9a8b] hover:underline">
                  Terms of Service
                </Link>
                <span className="text-slate-300">•</span>
                <Link to={createPageUrl("CancellationRefund")} className="text-sm text-[#5b9a8b] hover:underline">
                  Refund Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Shield, Database, Eye, Lock, UserCheck, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Privacy Policy</h1>
          <p className="text-slate-500 mt-2">Last updated: December 2025</p>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <p className="text-slate-600 leading-relaxed">
              At GlucoVital.fit, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, and protect your personal and health information when you use our service.
            </p>
          </div>

          {/* Data Collection */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">What Data We Collect</h2>
            </div>
            <ul className="space-y-3 text-slate-600">
              <li><strong>Account Information:</strong> Name, email address</li>
              <li><strong>Health Data:</strong> Blood sugar readings, blood pressure, meals, medications, symptoms, exercise logs</li>
              <li><strong>Profile Information:</strong> Age, gender, health conditions, language preferences</li>
              <li><strong>Usage Data:</strong> How you interact with the app to improve our service</li>
              <li><strong>WhatsApp Messages:</strong> Messages you send to our health assistant for logging purposes</li>
            </ul>
          </div>

          {/* How We Use Data */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">How We Use Your Data</h2>
            </div>
            <ul className="space-y-3 text-slate-600">
              <li>• Provide personalized health insights and trends</li>
              <li>• Send medication and logging reminders</li>
              <li>• Generate health reports for you and your doctor</li>
              <li>• Improve our AI assistant and recommendations</li>
              <li>• Communicate important service updates</li>
            </ul>
          </div>

          {/* Data Storage */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Lock className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">How We Protect Your Data</h2>
            </div>
            <ul className="space-y-3 text-slate-600">
              <li>• <strong>Encryption:</strong> Your data is encrypted in transit and at rest</li>
              <li>• <strong>Access Control:</strong> Only you can access your health data</li>
              <li>• <strong>Secure Infrastructure:</strong> We use industry-standard cloud security</li>
              <li>• <strong>No Selling:</strong> We never sell your personal or health data to third parties</li>
            </ul>
          </div>

          {/* Data Sharing */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Who Can Access Your Data</h2>
            </div>
            <ul className="space-y-3 text-slate-600">
              <li>• <strong>You:</strong> Full access to all your data</li>
              <li>• <strong>Your Doctor:</strong> Only if you explicitly share reports with them</li>
              <li>• <strong>Our Team:</strong> Limited access for technical support, anonymized for improvements</li>
              <li>• <strong>Third Parties:</strong> We do not share identifiable health data with advertisers or data brokers</li>
            </ul>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#5b9a8b]/20 rounded-lg">
                <Shield className="w-5 h-5 text-[#5b9a8b]" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Your Rights</h2>
            </div>
            <ul className="space-y-3 text-slate-600">
              <li>• <strong>Access:</strong> Request a copy of your data anytime</li>
              <li>• <strong>Correction:</strong> Update or correct your information</li>
              <li>• <strong>Deletion:</strong> Request deletion of your account and data</li>
              <li>• <strong>Export:</strong> Download your health data in a portable format</li>
              <li>• <strong>Opt-out:</strong> Unsubscribe from non-essential communications</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-[#5b9a8b]/10 to-[#7eb8a8]/10 rounded-2xl p-6 border border-[#5b9a8b]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#5b9a8b]/20 rounded-lg">
                <Mail className="w-5 h-5 text-[#5b9a8b]" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Questions?</h2>
            </div>
            <p className="text-slate-600 mb-4">
              If you have any questions about this Privacy Policy or your data, please contact us:
            </p>
            <a 
              href="mailto:support@glucovital.fit" 
              className="text-[#5b9a8b] font-medium hover:underline"
            >
              support@glucovital.fit
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
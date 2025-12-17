import React from "react";
import { FileText, AlertTriangle, UserCheck, Ban, Scale, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Terms of Service</h1>
          <p className="text-slate-500 mt-2">Last updated: December 2025</p>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <p className="text-slate-600 leading-relaxed">
              Welcome to GlucoVital.fit. By using our service, you agree to these Terms of Service. 
              Please read them carefully before using the app.
            </p>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-amber-800">Important Medical Disclaimer</h2>
            </div>
            <div className="space-y-3 text-amber-800">
              <p>
                <strong>GlucoVital.fit is NOT a medical device and is NOT intended to diagnose, treat, cure, or prevent any disease.</strong>
              </p>
              <p>
                The information provided by GlucoVital.fit is for informational and educational purposes only. 
                It is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <p>
                <strong>Always consult a qualified healthcare provider</strong> before making any decisions about your health, 
                medications, or treatment plans. Never disregard professional medical advice because of something you read or see on GlucoVital.fit.
              </p>
              <p>
                <strong>In case of emergency, call your local emergency services immediately.</strong>
              </p>
            </div>
          </div>

          {/* Service Description */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">What GlucoVital.fit Provides</h2>
            </div>
            <ul className="space-y-3 text-slate-600">
              <li>• A platform to log and track health data (blood sugar, blood pressure, etc.)</li>
              <li>• AI-generated insights based on your logged data</li>
              <li>• Medication and health reminders</li>
              <li>• Health reports you can share with your healthcare provider</li>
              <li>• Gamification features to encourage healthy habits</li>
            </ul>
          </div>

          {/* User Responsibilities */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Your Responsibilities</h2>
            </div>
            <ul className="space-y-3 text-slate-600">
              <li>• Provide accurate information when creating your account</li>
              <li>• Log your health data accurately and honestly</li>
              <li>• Keep your account credentials secure</li>
              <li>• Use the service for personal, non-commercial purposes only</li>
              <li>• Consult healthcare professionals for medical decisions</li>
              <li>• Report any bugs or security issues to us</li>
            </ul>
          </div>

          {/* Prohibited Uses */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Ban className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Prohibited Uses</h2>
            </div>
            <ul className="space-y-3 text-slate-600">
              <li>• Using the service for any illegal purpose</li>
              <li>• Attempting to access other users' data</li>
              <li>• Reverse engineering or copying our technology</li>
              <li>• Using automated systems to access the service</li>
              <li>• Providing medical advice to others based on our insights</li>
              <li>• Misrepresenting yourself or your health conditions</li>
            </ul>
          </div>

          {/* Limitations of Liability */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Scale className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Limitations of Liability</h2>
            </div>
            <div className="space-y-3 text-slate-600">
              <p>
                GlucoVital.fit is provided "as is" without warranties of any kind. We do not guarantee that:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• The service will be uninterrupted or error-free</li>
                <li>• AI insights will be 100% accurate</li>
                <li>• The service will meet all your requirements</li>
              </ul>
              <p className="mt-4">
                To the maximum extent permitted by law, GlucoVital.fit shall not be liable for any indirect, 
                incidental, or consequential damages arising from your use of the service.
              </p>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Changes to These Terms</h2>
            <p className="text-slate-600">
              We may update these Terms from time to time. We will notify you of significant changes via email 
              or through the app. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
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
              If you have any questions about these Terms of Service, please contact us:
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
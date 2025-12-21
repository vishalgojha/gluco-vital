import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw, XCircle, AlertCircle } from "lucide-react";

export default function CancellationRefund() {
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
              <RefreshCcw className="w-6 h-6 text-[#5b9a8b]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Cancellation & Refund Policy</h1>
              <p className="text-sm text-slate-500">Last updated: December 21, 2025</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            {/* Overview */}
            <section className="mb-8">
              <p className="text-slate-600">
                Please read this policy carefully before purchasing any subscription on GlucoVital.fit.
              </p>
            </section>

            {/* Free Tier */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Free (Basic) Plan
              </h2>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-slate-600">
                  The Basic plan is <strong>completely free</strong> with no payment required. You can use it indefinitely without any charges. No cancellation or refund applies as there is no payment involved.
                </p>
              </div>
            </section>

            {/* Cancellation Policy */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-[#5b9a8b]" />
                Subscription Cancellation
              </h2>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-medium text-slate-700 mb-2">How to Cancel</h3>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b] mt-2"></span>
                      Log in to your GlucoVital.fit account
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b] mt-2"></span>
                      Go to Profile → Subscription Settings
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b] mt-2"></span>
                      Click "Cancel Subscription"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b] mt-2"></span>
                      Or email us at <a href="mailto:support@glucovital.fit" className="text-[#5b9a8b] underline">support@glucovital.fit</a>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-medium text-slate-700 mb-2">What Happens After Cancellation</h3>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b] mt-2"></span>
                      Your subscription remains active until the end of the current billing period
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b] mt-2"></span>
                      No further charges will be made after cancellation
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b] mt-2"></span>
                      Your account will revert to the Free (Basic) plan
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b] mt-2"></span>
                      Your health data will be retained and accessible on the Basic plan
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Refund Policy */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Refund Policy
              </h2>
              
              <div className="space-y-4">
                {/* No Refund Policy */}
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2">No Refund Policy</h3>
                  <p className="text-red-700 text-sm">
                    All payments made for GlucoVital.fit subscriptions (Premium and Family plans) are <strong>final and non-refundable</strong>. Once a payment is processed, no refunds will be issued under any circumstances.
                  </p>
                </div>

                {/* Why No Refunds */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-medium text-slate-700 mb-2">Why We Have a No Refund Policy</h3>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2"></span>
                      Digital services are delivered instantly upon payment
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2"></span>
                      Full access to all premium features is granted immediately
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2"></span>
                      We offer a free Basic plan to try before upgrading
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2"></span>
                      Demo mode is available to preview all features before purchase
                    </li>
                  </ul>
                </div>

                {/* Recommendation */}
                <div className="bg-[#5b9a8b]/5 rounded-xl p-4 border border-[#5b9a8b]/20">
                  <h3 className="font-medium text-[#5b9a8b] mb-2">💡 Our Recommendation</h3>
                  <p className="text-slate-600 text-sm">
                    Before subscribing to a paid plan, we strongly encourage you to:
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm mt-2">
                    <li>• Use the <strong>Free Basic plan</strong> to experience core features</li>
                    <li>• Try the <strong>Demo Mode</strong> to explore premium features</li>
                    <li>• Contact us at <a href="mailto:support@glucovital.fit" className="text-[#5b9a8b] underline">support@glucovital.fit</a> with any questions</li>
                  </ul>
                </div>

                {/* Exceptions */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-medium text-slate-700 mb-2">Exceptions (At Our Sole Discretion)</h3>
                  <p className="text-slate-600 text-sm mb-2">
                    In rare cases, we may consider exceptions only for:
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2"></span>
                      Duplicate charges due to technical errors
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2"></span>
                      Unauthorized transactions (with proper documentation)
                    </li>
                  </ul>
                  <p className="text-slate-500 text-xs mt-3">
                    Such cases are reviewed individually and approval is not guaranteed.
                  </p>
                </div>
              </div>
            </section>

            {/* Important Note */}
            <section className="mb-8">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Important Note</h3>
                  <p className="text-amber-700 text-sm">
                    GlucoVital.fit is a health tracking tool and does not provide medical advice, diagnosis, or treatment. Refunds will not be granted based on medical outcomes or health-related expectations. Always consult a qualified healthcare provider for medical decisions.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-[#5b9a8b]/5 rounded-xl p-4 border border-[#5b9a8b]/20">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Questions?</h2>
              <p className="text-slate-600 text-sm">
                If you have any questions about our cancellation or refund policy, please contact us at{" "}
                <a href="mailto:support@glucovital.fit" className="text-[#5b9a8b] underline">
                  support@glucovital.fit
                </a>
              </p>
              <p className="text-slate-500 text-xs mt-2">
                We typically respond within 24-48 hours on business days.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
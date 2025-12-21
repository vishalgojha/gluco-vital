import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Globe, Clock } from "lucide-react";

export default function ShippingPolicy() {
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
              <Package className="w-6 h-6 text-[#5b9a8b]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Shipping & Delivery Policy</h1>
              <p className="text-sm text-slate-500">Last updated: December 21, 2025</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#5b9a8b]" />
                Digital Service Delivery
              </h2>
              <p className="text-slate-600 mb-4">
                GlucoVital.fit is a <strong>100% digital health management platform</strong>. We do not ship any physical products. All our services are delivered electronically and instantly upon subscription activation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#5b9a8b]" />
                Service Activation
              </h2>
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#5b9a8b] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="font-medium text-slate-700">Instant Access</p>
                    <p className="text-sm text-slate-500">Upon successful payment, your subscription is activated immediately.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#5b9a8b] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="font-medium text-slate-700">Email Confirmation</p>
                    <p className="text-sm text-slate-500">You will receive a confirmation email with your subscription details within minutes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#5b9a8b] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="font-medium text-slate-700">WhatsApp Integration</p>
                    <p className="text-sm text-slate-500">Connect your WhatsApp to start logging health data immediately after activation.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">What You Receive</h2>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b]"></span>
                  Access to GlucoVital.fit web platform
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b]"></span>
                  WhatsApp-based health logging assistant
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b]"></span>
                  AI-powered health insights (Premium/Family plans)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b]"></span>
                  Health reports and analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b]"></span>
                  Caregiver access features (Family plan)
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Service Availability</h2>
              <p className="text-slate-600 mb-3">
                Our digital services are available <strong>24/7 worldwide</strong>. There are no geographical restrictions on service delivery.
              </p>
              <p className="text-slate-600">
                In case of scheduled maintenance or service interruptions, users will be notified in advance via email and/or in-app notifications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Technical Requirements</h2>
              <p className="text-slate-600 mb-3">
                To access our services, you need:
              </p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b]"></span>
                  A stable internet connection
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b]"></span>
                  A modern web browser (Chrome, Safari, Firefox, Edge)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b9a8b]"></span>
                  WhatsApp installed on your smartphone (for WhatsApp logging feature)
                </li>
              </ul>
            </section>

            <section className="bg-[#5b9a8b]/5 rounded-xl p-4 border border-[#5b9a8b]/20">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Contact Us</h2>
              <p className="text-slate-600 text-sm">
                If you have any questions about service delivery or access issues, please contact us at{" "}
                <a href="mailto:support@glucovital.fit" className="text-[#5b9a8b] underline">
                  support@glucovital.fit
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
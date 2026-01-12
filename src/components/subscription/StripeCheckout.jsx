import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Users, Loader2, Crown, ExternalLink } from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Basic tracking",
    features: [
      "Unlimited logging",
      "WhatsApp integration",
      "7-day history"
    ],
    color: "bg-slate-100",
    popular: false
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹299",
    period: "/month",
    description: "Best for individuals",
    features: [
      "Unlimited history",
      "AI insights & patterns",
      "Doctor-ready reports",
      "Smart medication reminders",
      "Priority support"
    ],
    color: "bg-gradient-to-br from-[#5b9a8b] to-[#7eb8a8]",
    popular: true
  },
  {
    id: "family",
    name: "Family",
    price: "₹499",
    period: "/month",
    description: "For caregivers",
    features: [
      "Everything in Premium",
      "Up to 3 family members",
      "Caregiver dashboard",
      "Real-time alerts",
      "Shared reports"
    ],
    color: "bg-gradient-to-br from-violet-500 to-purple-600",
    popular: false
  }
];

export default function StripeCheckout({ currentPlan = "free", onSuccess }) {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckout = async (planId) => {
    // Check if in iframe
    if (window.self !== window.top) {
      alert("Please open the app in a new tab to complete checkout. Payments cannot be processed in preview mode.");
      return;
    }

    if (planId === "free") return;

    setLoading(planId);
    setError(null);

    try {
      const currentUrl = window.location.origin;
      const response = await base44.functions.invoke("stripeCheckout", {
        plan: planId,
        successUrl: `${currentUrl}/Subscription?success=true`,
        cancelUrl: `${currentUrl}/Subscription?cancelled=true`
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Failed to start checkout. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative overflow-hidden transition-all ${
              plan.popular ? "border-2 border-[#5b9a8b] shadow-lg scale-105" : "border border-slate-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-[#5b9a8b] text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                Most Popular
              </div>
            )}
            
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                {plan.id === "premium" && <Crown className="w-5 h-5 text-amber-500" />}
                {plan.id === "family" && <Users className="w-5 h-5 text-violet-500" />}
                <CardTitle className="text-lg">{plan.name}</CardTitle>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-slate-500 text-sm">{plan.period}</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.id === "free" ? (
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={currentPlan === "free"}
                >
                  {currentPlan === "free" ? "Current Plan" : "Downgrade"}
                </Button>
              ) : (
                <Button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading === plan.id || currentPlan === plan.id}
                  className={`w-full ${plan.popular ? "bg-[#5b9a8b] hover:bg-[#4a8a7b]" : ""}`}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : currentPlan === plan.id ? (
                    "Current Plan"
                  ) : (
                    <>
                      Upgrade <ExternalLink className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-slate-500">
        Secure payment powered by Stripe. Cancel anytime.
      </p>
    </div>
  );
}
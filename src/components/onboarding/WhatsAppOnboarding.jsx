import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, User, Phone, ArrowRight, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "919819471310";

export default function WhatsAppOnboarding({ profile, onComplete }) {
  const [open, setOpen] = useState(false);
  const [loading, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    whatsapp_number: "91"
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        whatsapp_number: profile.whatsapp_number || "91"
      });
    }
  }, [profile]);

  const isProfileComplete = profile?.name && profile?.whatsapp_number?.length >= 12;

  const handleOpenWhatsApp = () => {
    if (isProfileComplete) {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Mr.%20Gluco!%20I%20want%20to%20start%20tracking%20my%20health.`,
        "_blank"
      );
    } else {
      setOpen(true);
    }
  };

  const handleSaveAndConnect = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!form.whatsapp_number || form.whatsapp_number.length < 12) {
      toast.error("Please enter a valid WhatsApp number with country code (e.g., 919876543210)");
      return;
    }
    if (!form.whatsapp_number.startsWith("91")) {
      toast.error("WhatsApp number must start with 91 (India country code)");
      return;
    }

    setSaving(true);
    try {
      const user = await base44.auth.me();
      
      if (profile?.id) {
        await base44.entities.PatientProfile.update(profile.id, {
          name: form.name,
          whatsapp_number: form.whatsapp_number,
          whatsapp_connected: true
        });
      } else {
        await base44.entities.PatientProfile.create({
          user_email: user.email,
          name: form.name,
          whatsapp_number: form.whatsapp_number,
          whatsapp_connected: true
        });
      }

      toast.success("Profile saved! Opening WhatsApp...");
      setOpen(false);
      
      if (onComplete) onComplete();
      
      // Open WhatsApp
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Mr.%20Gluco!%20I%20want%20to%20start%20tracking%20my%20health.`,
        "_blank"
      );
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <div 
        onClick={handleOpenWhatsApp}
        className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Chat with Mr. Gluco</h3>
              <p className="text-green-100 text-sm">Log health data via WhatsApp</p>
            </div>
          </div>

          {isProfileComplete ? (
            <div className="flex items-center gap-2 text-green-100 text-sm mb-4">
              <CheckCircle className="w-4 h-4" />
              <span>Connected as {profile.name}</span>
            </div>
          ) : (
            <p className="text-green-100 text-sm mb-4">
              Quick setup required to connect
            </p>
          )}

          <Button className="w-full bg-white text-emerald-600 hover:bg-green-50 font-semibold h-12 rounded-xl">
            <MessageCircle className="w-5 h-5 mr-2" />
            {isProfileComplete ? "Open WhatsApp" : "Setup & Connect"}
          </Button>
        </div>
      </div>

      {/* Onboarding Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              Connect WhatsApp
            </DialogTitle>
            <DialogDescription>
              Enter your details to connect with Mr. Gluco on WhatsApp
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                Your Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                WhatsApp Number *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+</span>
                <Input
                  id="whatsapp"
                  placeholder="919876543210"
                  value={form.whatsapp_number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setForm({ ...form, whatsapp_number: value });
                  }}
                  className="pl-7"
                  maxLength={12}
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter with country code 91 (e.g., 919876543210)
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAndConnect} 
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? "Saving..." : "Save & Connect"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
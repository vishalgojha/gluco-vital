import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Smartphone, Share, Plus, MoreVertical } from "lucide-react";

export default function AddToHomeScreen() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem("a2hs_dismissed");
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    
    if (dismissed || isStandalone) return;

    // Detect platform
    const ua = navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(ua);
    const android = /android/.test(ua);
    
    setIsIOS(iOS);
    setIsAndroid(android);
    
    // Show after 3 seconds
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = (permanent = false) => {
    setShow(false);
    if (permanent) {
      localStorage.setItem("a2hs_dismissed", "true");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#5b9a8b] to-[#7eb8a8] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Add VitalSpark to Home</h3>
                <p className="text-sm text-white/80">Quick access, anytime!</p>
              </div>
            </div>
            <button onClick={() => dismiss(false)} className="p-1 hover:bg-white/20 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          {isIOS ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">To install VitalSpark:</p>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Share className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-slate-700">1. Tap the <strong>Share</strong> button below</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-slate-700">2. Scroll & tap <strong>"Add to Home Screen"</strong></p>
              </div>
            </div>
          ) : isAndroid ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">To install VitalSpark:</p>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                  <MoreVertical className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-sm text-slate-700">1. Tap <strong>⋮ menu</strong> (top right)</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-slate-700">2. Tap <strong>"Add to Home screen"</strong></p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              Add this app to your home screen for quick access to your health dashboard!
            </p>
          )}

          <div className="flex gap-2 mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => dismiss(true)}
              className="flex-1 text-slate-500"
            >
              Don't show again
            </Button>
            <Button 
              size="sm" 
              onClick={() => dismiss(false)}
              className="flex-1 bg-[#5b9a8b] hover:bg-[#4a8a7b]"
            >
              Got it!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
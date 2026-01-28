import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";
import Home from "./Home";
import DoctorDashboard from "./DoctorDashboard";
import CoachDashboard from "./CoachDashboard";
import CaregiverDashboard from "./CaregiverDashboard";
import RoleSelection from "@/components/onboarding/RoleSelection";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const demoMode = urlParams.get('demo') === 'true';
    
    if (demoMode) {
      setUser({ user_type: 'patient' });
      setLoading(false);
      return;
    }

    base44.auth.me()
      .then((userData) => {
        setUser(userData);
        // Show role selection if user_type is not set
        if (!userData?.user_type) {
          setShowRoleSelection(true);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleSelected = (role) => {
    setUser(prev => ({ ...prev, user_type: role }));
    setShowRoleSelection(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5b9a8b]" />
      </div>
    );
  }

  // Show role selection for new users
  if (showRoleSelection) {
    return <RoleSelection onComplete={handleRoleSelected} />;
  }

  // Route based on user type
  const userType = user?.user_type || 'patient';

  switch (userType) {
    case 'doctor':
      return <DoctorDashboard />;
    case 'coach':
      return <CoachDashboard />;
    case 'caregiver':
      return <CaregiverDashboard />;
    default:
      return <Home />;
  }
}
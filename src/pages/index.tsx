"use client";

import { useState, useEffect } from "react";
// Import your actual components
import LoginPage from "./login";
import Dashboard from "./dashboard";
import ActivationPage from "@/components/ActivationPage";
import { verifyActivation } from "@/util/licenseManager";

export default function Home() {
  // State Types: boolean
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check Activation (Device Lock)
    const activeStatus = verifyActivation();
    setIsActivated(activeStatus);

    // 2. Check Login (Simulated check)
    // Replace "user_token" with however you normally check login
    const token = localStorage.getItem("pos_user");
    if (token) {
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  const handleActivationSuccess = () => {
    setIsActivated(true);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"></div>;
  }

  // --- LOGIC GATES ---

  // GATE 1: Is the app activated on this machine?
  if (!isActivated) {
    return <ActivationPage onActivate={handleActivationSuccess} />;
  }

  // GATE 2: Is the user logged in?
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  // GATE 3: Dashboard
  return (
    <div className="bg-gray-100 min-h-screen">
      <Dashboard />
    </div>
  );
}
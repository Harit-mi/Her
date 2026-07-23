"use client";

import React, { useEffect, useState } from "react";
import { useSunriseStore } from "@/lib/store";
import LoginModal from "./LoginModal";
import UserSwitcher from "./UserSwitcher";
import Navbar from "./Navbar";
import SunriseAnimation from "./SunriseAnimation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useSunriseStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before hydration on client or if unauthenticated, render ONLY the LoginModal.
  // Never render UserSwitcher, Navbar, or private page content to unauthenticated HTML requests.
  if (!mounted || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0] dark:bg-[#1E1A16]">
        <LoginModal />
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FAF6F0]/80 dark:bg-[#1E1A16]/80 backdrop-blur-md border-b border-[#EDE0D0]/60 dark:border-[#3D352E]/60">
        <UserSwitcher />
      </header>
      <main className="flex-1 pb-24 pt-4">{children}</main>
      <Navbar />
      <SunriseAnimation />
    </>
  );
}

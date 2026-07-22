"use client";

import React from "react";
import { useSunriseStore } from "@/lib/store";
import { PROFILES } from "@/lib/initialData";
import { UserRole } from "@/lib/types";
import { LogOut, Moon, Sun, MapPin } from "lucide-react";

export default function UserSwitcher() {
  const { loggedInUser, logout, theme, toggleTheme, unreadLetterForCurrent, isLoggedIn } = useSunriseStore();
  const activeProfile = PROFILES[loggedInUser];
  const partnerRole: UserRole = loggedInUser === "Harit" ? "Ameera" : "Harit";
  const partnerProfile = PROFILES[partnerRole];

  if (!isLoggedIn) return null;

  return (
    <div className="flex items-center justify-between w-full max-w-5xl mx-auto px-4 py-3">
      {/* Brand & Inter-State Connection Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4A857] via-orange-400 to-amber-200 dark:from-[#D4A857] dark:to-orange-700 flex items-center justify-center text-lg shadow-sm animate-pulse">
          ☀️
        </div>
        <div>
          <h1 className="text-lg font-serif font-medium tracking-tight text-[#3A342C] dark:text-[#F7F3ED] flex items-center gap-2">
            Sunrise
            <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#EDE0D0] dark:bg-[#3D352E] text-[#3A342C] dark:text-[#F7F3ED] border border-[#EDE0D0] font-medium">
              Gujarat 🇮🇳 ↔ Maharashtra 🇮🇳
            </span>
          </h1>
          <p className="text-xs text-[#7A7267] dark:text-[#B0A79C] font-sans flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#D4A857]" /> {activeProfile.name} ({activeProfile.city}) & {partnerProfile.name} ({partnerProfile.city})
          </p>
        </div>
      </div>

      {/* Account Info & Logout */}
      <div className="flex items-center gap-2">
        {/* Unread indicator */}
        {unreadLetterForCurrent && (
          <span className="animate-pulse bg-[#D4A857] text-white text-[10px] font-sans font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <span>✉️</span> New Letter!
          </span>
        )}

        {/* Current Active Account Badge */}
        <div className="glass-panel px-3 py-1 rounded-full flex items-center gap-2 text-xs font-sans text-[#3A342C] dark:text-[#F7F3ED] shadow-xs">
          <img
            src={activeProfile.avatar}
            alt={activeProfile.name}
            className="w-5 h-5 rounded-full object-cover border border-[#D4A857]"
          />
          <span className="font-semibold">{activeProfile.name}</span>
          <span className="text-[10px] text-[#7A7267] font-normal hidden sm:inline">({activeProfile.city})</span>
        </div>

        {/* Sign Out / Switch Account */}
        <button
          onClick={logout}
          className="p-1.5 rounded-full glass-panel text-[#7A7267] hover:text-rose-500 transition-colors cursor-pointer"
          title="Sign Out / Switch Account"
        >
          <LogOut className="w-4 h-4" />
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-[#3A342C] dark:text-[#F7F3ED] hover:text-[#D4A857] transition-colors cursor-pointer"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#D4A857]" />}
        </button>
      </div>
    </div>
  );
}

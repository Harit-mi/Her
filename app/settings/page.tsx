"use client";

import React from "react";
import { useSunriseStore } from "@/lib/store";
import { PROFILES } from "@/lib/initialData";
import { Settings as SettingsIcon, Moon, Sun, Type, Download, ShieldCheck, UserCheck, Smartphone } from "lucide-react";

export default function SettingsPage() {
  const {
    currentUser,
    setCurrentUser,
    theme,
    toggleTheme,
    fontStyle,
    setFontStyle,
    letters,
    dinners,
    gratitudes,
    memories,
  } = useSunriseStore();

  const handleExportData = () => {
    const data = { letters, dinners, gratitudes, memories, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sunrise_memories_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-amber-500" /> Settings & Customization
        </h1>
        <p className="text-xs font-sans text-stone-500">
          Preferences, theme controls, data backups, and user switching.
        </p>
      </div>

      {/* Dual User Switcher Card */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-stone-200/80 dark:border-stone-800">
        <h2 className="text-lg font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-amber-500" /> Switch Active Persona (Couple Demo Mode)
        </h2>
        <p className="text-xs font-sans text-stone-500">
          Currently viewing as <strong>{PROFILES[currentUser].name}</strong> in {PROFILES[currentUser].city} {PROFILES[currentUser].flag}.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {(["Alex", "Sam"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setCurrentUser(role)}
              className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-sans transition-all ${
                currentUser === role
                  ? "bg-amber-100 dark:bg-amber-950/60 border-amber-400 font-medium shadow-xs"
                  : "bg-white/80 dark:bg-stone-800 border-stone-200 dark:border-stone-700 opacity-80"
              }`}
            >
              <img src={PROFILES[role].avatar} alt={role} className="w-9 h-9 rounded-full object-cover" />
              <div className="text-left">
                <p className="font-semibold text-stone-800 dark:text-stone-200">{PROFILES[role].name}</p>
                <p className="text-[10px] text-stone-400">{PROFILES[role].city} {PROFILES[role].flag}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme & Fonts */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-stone-200/80 dark:border-stone-800">
        <h2 className="text-lg font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
          <Moon className="w-5 h-5 text-amber-500" /> Theme & Aesthetic
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-800 dark:text-stone-200">Dark Mode (Warm Charcoal)</p>
              <p className="text-[10px] text-stone-400">Not pure black, soft warm stone tones</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white font-medium shadow-xs"
            >
              {theme === "light" ? "Enable Dark" : "Enable Light"}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-800 dark:text-stone-200">Typography Font Style</p>
              <p className="text-[10px] text-stone-400">Serif romantic vs Modern Sans</p>
            </div>
            <button
              onClick={() => setFontStyle(fontStyle === "serif" ? "sans" : "serif")}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white font-medium shadow-xs"
            >
              {fontStyle === "serif" ? "Use Sans" : "Use Serif"}
            </button>
          </div>
        </div>
      </div>

      {/* Export & PWA */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-stone-200/80 dark:border-stone-800">
        <h2 className="text-lg font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
          <Download className="w-5 h-5 text-amber-500" /> Backup & Progressive Web App (PWA)
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs pt-1">
          <div>
            <p className="font-medium text-stone-800 dark:text-stone-200">Export All Shared Memories</p>
            <p className="text-stone-400">Download a full JSON archive of all letters, dinners, and notes.</p>
          </div>
          <button
            onClick={handleExportData}
            className="px-5 py-2.5 rounded-xl bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 font-medium flex items-center gap-2 shadow-xs shrink-0"
          >
            <Download className="w-4 h-4" /> Download Backup JSON
          </button>
        </div>
      </div>
    </div>
  );
}

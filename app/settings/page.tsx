"use client";

import React from "react";
import { useSunriseStore } from "@/lib/store";
import { PROFILES } from "@/lib/initialData";
import { Settings, Moon, Sun, Download, Trash2, UserCheck, Smartphone } from "lucide-react";

export default function SettingsPage() {
  const {
    currentUser,
    setCurrentUser,
    theme,
    toggleTheme,
    fontStyle,
    setFontStyle,
    resetAllData,
    letters,
    dinners,
    gratitudes,
    memories,
    voiceNotes,
    wishes,
  } = useSunriseStore();

  const handleExportData = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      letters,
      dinners,
      gratitudes,
      memories,
      voiceNotes,
      wishes,
    };
    const jsonStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `sunrise_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data back to original initial defaults?")) {
      resetAllData();
      alert("All local data has been reset to default state.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium flex items-center gap-2">
          <Settings className="w-7 h-7 text-[#D4A857]" /> App Settings & PWA ⚙️
        </h1>
        <p className="text-xs font-sans text-[#7A7267]">
          Customize themes, view account information, and export your private memory archives.
        </p>
      </div>

      {/* Account Info */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-[#EDE0D0] dark:border-[#3D352E]">
        <h2 className="text-lg font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#D4A857]" /> Switch Active Account
        </h2>
        <p className="text-xs font-sans text-[#7A7267]">
          Currently logged in as <strong>{PROFILES[currentUser]?.name || "Harit"}</strong> in {PROFILES[currentUser]?.city || "Ahmedabad"}.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {(["Harit", "Ameera"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setCurrentUser(role)}
              className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-sans transition-all ${
                currentUser === role
                  ? "bg-[#EDE0D0] dark:bg-[#3D352E] border-[#D4A857] font-medium shadow-xs"
                  : "bg-white/80 dark:bg-[#2A241F] border-[#EDE0D0] dark:border-[#3D352E] opacity-80"
              }`}
            >
              <img src={PROFILES[role].avatar} alt={role} className="w-9 h-9 rounded-full object-cover" />
              <div className="text-left">
                <p className="font-semibold text-[#3A342C] dark:text-[#F7F3ED]">{PROFILES[role].name}</p>
                <p className="text-[10px] text-[#7A7267]">{PROFILES[role].city} {PROFILES[role].flag}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-[#EDE0D0] dark:border-[#3D352E]">
        <h2 className="text-lg font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium">
          Appearance & Typography
        </h2>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/70 dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E]">
          <div>
            <p className="text-xs font-sans font-medium text-[#3A342C] dark:text-[#F7F3ED]">Theme Mode</p>
            <p className="text-[10px] font-sans text-[#7A7267]">Soft Cream (#FAF6F0) vs Warm Dark (#1E1A16)</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-full bg-[#EDE0D0] dark:bg-[#3D352E] text-xs font-sans font-semibold flex items-center gap-2 cursor-pointer"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#D4A857]" />}
            <span>{theme === "light" ? "Switch to Warm Dark" : "Switch to Soft Cream"}</span>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/70 dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E]">
          <div>
            <p className="text-xs font-sans font-medium text-[#3A342C] dark:text-[#F7F3ED]">Letter Font Style</p>
            <p className="text-[10px] font-sans text-[#7A7267]">Elegant Serif vs Modern Sans-Serif</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFontStyle("serif")}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif ${
                fontStyle === "serif"
                  ? "bg-[#D4A857] text-white font-semibold shadow-xs"
                  : "bg-white dark:bg-[#2A241F] text-[#7A7267]"
              }`}
            >
              Serif
            </button>
            <button
              onClick={() => setFontStyle("sans")}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans ${
                fontStyle === "sans"
                  ? "bg-[#D4A857] text-white font-semibold shadow-xs"
                  : "bg-white dark:bg-[#2A241F] text-[#7A7267]"
              }`}
            >
              Sans
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-[#EDE0D0] dark:border-[#3D352E]">
        <h2 className="text-lg font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium">
          Data Backup & Management
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportData}
            className="flex-1 p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export All Data (JSON Backup)
          </button>
          <button
            onClick={handleReset}
            className="flex-1 p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-sans font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Reset All Local Data
          </button>
        </div>
      </div>
    </div>
  );
}

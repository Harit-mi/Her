"use client";

import React, { useState } from "react";
import { useSunriseStore } from "@/lib/store";
import { Moon, Sun, Clock, Plus, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function SleepPage() {
  const { sleepLogs, logSleep, currentUser } = useSunriseStore();
  const [goodnight, setGoodnight] = useState("01:30");
  const [wakeTime, setWakeTime] = useState("08:15");
  const [quality, setQuality] = useState("😌 Peaceful");

  const handleLogSleep = (e: React.FormEvent) => {
    e.preventDefault();
    logSleep({
      user: currentUser,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      goodnightTime: goodnight,
      wakeTime: wakeTime,
      totalHours: 7.2,
      qualityMood: quality,
    });
    confetti({ particleCount: 25, spread: 40 });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
          <Moon className="w-7 h-7 text-amber-500" /> Sleep Tracker & Overlap Matrix
        </h1>
        <p className="text-xs font-sans text-stone-500">
          Tracking goodnight times and overlapping hours across timezones.
        </p>
      </div>

      {/* Visual Sleep Matrix Chart */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-stone-200/80 dark:border-stone-800">
        <h2 className="text-xl font-serif text-stone-800 dark:text-stone-100 font-medium">
          Overlapping Sleep Hours Matrix 🌌
        </h2>

        {/* Overlap Visualizer */}
        <div className="space-y-4 font-sans text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span className="font-semibold">Alex (Tokyo 🇯🇵)</span>
              <span>02:18 AM - 08:30 AM (6.2 hrs)</span>
            </div>
            <div className="w-full h-4 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden flex">
              <div className="w-[10%] bg-transparent" />
              <div className="w-[45%] bg-indigo-500/80 rounded-full" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span className="font-semibold">Sam (San Francisco 🇺🇸)</span>
              <span>11:45 PM - 07:15 AM (7.5 hrs)</span>
            </div>
            <div className="w-full h-4 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden flex">
              <div className="w-[30%] bg-purple-500/80 rounded-full" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700 flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
            <span>✨ You were both sleeping peacefully together for <strong>3.5 overlapping hours</strong> tonight.</span>
          </div>
        </div>
      </div>

      {/* Log Goodnight / Morning Form */}
      <form onSubmit={handleLogSleep} className="glass-panel p-6 rounded-3xl space-y-4 font-sans text-xs">
        <h3 className="text-base font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" /> Log Sleep for {currentUser}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-stone-500">Goodnight Time</label>
            <input
              type="text"
              value={goodnight}
              onChange={(e) => setGoodnight(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div>
            <label className="text-stone-500">Wake Time</label>
            <input
              type="text"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div>
            <label className="text-stone-500">Sleep Quality</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            >
              <option value="😌 Peaceful">😌 Peaceful</option>
              <option value="😴 Deep Sleep">😴 Deep Sleep</option>
              <option value="😔 Restless">😔 Restless</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Save Sleep Log
          </button>
        </div>
      </form>
    </div>
  );
}

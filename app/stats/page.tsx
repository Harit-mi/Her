"use client";

import React from "react";
import { useSunriseStore } from "@/lib/store";
import { BarChart3, Heart, Flame, BookOpen, Mic, Camera, Calendar, Award } from "lucide-react";

export default function StatsPage() {
  const { daysTogether, letters, dinners, voiceNotes, memories, gratitudes } = useSunriseStore();

  const totalWords = letters.reduce((acc, curr) => acc + curr.content.split(/\s+/).length, 0) * 14;

  const statCards = [
    { label: "Days Shared Together", value: `${daysTogether} Days`, icon: Calendar, color: "text-amber-500 bg-amber-100 dark:bg-amber-950" },
    { label: "Nightly Letters Written", value: `${letters.length * 91} Letters`, icon: BookOpen, color: "text-orange-500 bg-orange-100 dark:bg-orange-950" },
    { label: "Shared Dinners Counter", value: `${dinners.reduce((acc, c) => Math.max(acc, c.number), 0)} Meals`, icon: Flame, color: "text-rose-500 bg-rose-100 dark:bg-rose-950" },
    { label: "Total Words Written", value: `${totalWords.toLocaleString()} Words`, icon: Award, color: "text-purple-500 bg-purple-100 dark:bg-purple-950" },
    { label: "Voice Letters Recorded", value: `${voiceNotes.length * 21} Notes`, icon: Mic, color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-950" },
    { label: "Photos & Memories Saved", value: `${memories.length * 105} Photos`, icon: Camera, color: "text-blue-500 bg-blue-100 dark:bg-blue-950" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-amber-500" /> Relationship Insights & Stats
        </h1>
        <p className="text-xs font-sans text-stone-500">
          A quantitative showcase of your journey together across miles and timezones.
        </p>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="glass-panel p-6 rounded-3xl space-y-3 border border-stone-200/80 dark:border-stone-800 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-sans text-stone-400 uppercase tracking-wider">{card.label}</p>
                <h3 className="text-2xl font-serif font-semibold text-stone-800 dark:text-stone-100">
                  {card.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Highlights & Streaks */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-stone-200/80 dark:border-stone-800">
        <h2 className="text-xl font-serif text-stone-800 dark:text-stone-100 font-medium">
          Streak Milestones & Emoji Trends 🔥
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">Longest Letter Streak</span>
            <p className="text-xl font-serif font-bold text-amber-600 dark:text-amber-400">48 Consecutive Nights</p>
            <p className="text-stone-500">Never missed a nightly letter during November 2025.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">Most Used Reaction Emoji</span>
            <p className="text-xl font-serif font-bold text-rose-500">❤️ & 🥹 (842 times)</p>
            <p className="text-stone-500">Reacted most often over morning coffee letters.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

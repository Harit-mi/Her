"use client";

import React from "react";
import { MapPin, Compass, Thermometer, Clock, Train } from "lucide-react";
import { PROFILES } from "@/lib/initialData";

export default function InteractiveMapCanvas() {
  const alex = PROFILES["Alex"];
  const sam = PROFILES["Sam"];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-stone-200/80 dark:border-stone-800 relative overflow-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#D9A752_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
            Interactive Inter-State Map
          </span>
          <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100 font-medium mt-1">
            Gujarat 🇮🇳 & Maharashtra 🇮🇳
          </h2>
          <p className="text-xs font-sans text-stone-500">
            Ahmedabad to Mumbai • 520 Kilometers (~5.5 hrs by Vande Bharat 🚆)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-white/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-sans text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Same Timezone (IST 🇮🇳)
          </div>
        </div>
      </div>

      {/* Visual Canvas Map Graphic */}
      <div className="relative w-full h-64 sm:h-72 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 rounded-2xl p-4 flex items-center justify-between border border-stone-800 shadow-inner overflow-hidden">
        {/* Animated Flight/Train Path Curve SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#EC4899" stopOpacity="1" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Curved connection line */}
          <path
            d="M 60,180 Q 300,40 540,180"
            fill="none"
            stroke="url(#glow)"
            strokeWidth="3"
            strokeDasharray="6,6"
            className="animate-pulse"
          />

          {/* Moving dot */}
          <circle r="4" fill="#FBBF24">
            <animateMotion path="M 60,180 Q 300,40 540,180" dur="6s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Ahmedabad, Gujarat City Card */}
        <div className="relative z-10 p-4 rounded-2xl bg-stone-900/90 border border-amber-500/40 text-amber-100 max-w-[160px] sm:max-w-[200px] shadow-lg space-y-1 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-amber-400">
            <MapPin className="w-4 h-4" /> {alex.name} in {alex.city} 🇮🇳
          </div>
          <p className="text-xl font-serif text-white font-normal">1:45 AM 🌙</p>
          <div className="flex items-center gap-1 text-[11px] font-sans text-stone-400">
            <Thermometer className="w-3 h-3 text-amber-400" /> 29°C • Soft Monsoon
          </div>
          <p className="text-[10px] text-stone-500 font-mono pt-1">Gujarat State</p>
        </div>

        {/* Center Distance Badge */}
        <div className="relative z-10 hidden sm:flex flex-col items-center justify-center p-3.5 rounded-full bg-stone-900/90 border border-stone-700 text-stone-300 text-xs font-sans text-center shadow-xl backdrop-blur-md">
          <Train className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="font-semibold text-amber-300 text-[11px] mt-1">520 km</span>
          <span className="text-[9px] text-stone-400">Coastal Route</span>
        </div>

        {/* Mumbai, Maharashtra City Card */}
        <div className="relative z-10 p-4 rounded-2xl bg-stone-900/90 border border-blue-500/40 text-blue-100 max-w-[160px] sm:max-w-[200px] shadow-lg space-y-1 backdrop-blur-md text-right">
          <div className="flex items-center justify-end gap-1.5 text-xs font-sans font-medium text-blue-400">
            {sam.name} in {sam.city} 🇮🇳 <MapPin className="w-4 h-4" />
          </div>
          <p className="text-xl font-serif text-white font-normal">1:45 AM 🌙</p>
          <div className="flex items-center justify-end gap-1 text-[11px] font-sans text-stone-400">
            27°C • Sea Breeze 🌊 <Thermometer className="w-3 h-3 text-amber-400" />
          </div>
          <p className="text-[10px] text-stone-500 font-mono pt-1">Maharashtra State</p>
        </div>
      </div>

      {/* Romantic Quote Footer */}
      <div className="text-center py-2">
        <p className="text-sm font-serif italic text-stone-700 dark:text-stone-300">
          "From the banks of Sabarmati to the shores of the Arabian Sea, dinner is still together." 🍷
        </p>
      </div>
    </div>
  );
}

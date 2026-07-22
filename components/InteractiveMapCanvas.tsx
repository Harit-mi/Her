"use client";

import React from "react";
import { PROFILES } from "@/lib/initialData";
import { MapPin, Navigation, Train } from "lucide-react";

export default function InteractiveMapCanvas() {
  const harit = PROFILES["Harit"];
  const ameera = PROFILES["Ameera"];

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-4 border border-[#EDE0D0] dark:border-[#3D352E]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#D4A857]" /> Gujarat 🇮🇳 ↔ Maharashtra 🇮🇳 Connection
          </h3>
          <p className="text-xs font-sans text-[#7A7267]">
            Vande Bharat Express route (520 km) • Indian Standard Time (IST)
          </p>
        </div>

        <span className="text-xs font-sans font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-200 self-start sm:self-auto flex items-center gap-1">
          <Train className="w-3.5 h-3.5 text-emerald-600" /> Route Active
        </span>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full h-64 rounded-2xl bg-[#EDE0D0]/30 dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] overflow-hidden flex items-center justify-center p-4">
        <svg className="w-full h-full" viewBox="0 0 500 220" fill="none">
          {/* Glowing Animated Route Path */}
          <path
            d="M 120,70 Q 250,110 380,150"
            stroke="#D4A857"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />

          {/* Harit Pin - Ahmedabad, Gujarat */}
          <g transform="translate(120, 70)">
            <circle r="14" fill="#D4A857" fillOpacity="0.3" className="animate-ping" />
            <circle r="8" fill="#D4A857" />
            <text x="0" y="-18" textAnchor="middle" fill="#3A342C" className="text-[11px] font-bold font-sans dark:fill-[#F7F3ED]">
              {harit.name} ({harit.city}, {harit.state} 🇮🇳)
            </text>
          </g>

          {/* Ameera Pin - Mumbai, Maharashtra */}
          <g transform="translate(380, 150)">
            <circle r="14" fill="#3B82F6" fillOpacity="0.3" className="animate-ping" />
            <circle r="8" fill="#3B82F6" />
            <text x="0" y="24" textAnchor="middle" fill="#3A342C" className="text-[11px] font-bold font-sans dark:fill-[#F7F3ED]">
              {ameera.name} ({ameera.city}, {ameera.state} 🇮🇳)
            </text>
          </g>
        </svg>

        {/* Distance Pill */}
        <div className="absolute top-4 right-4 glass-panel px-3 py-1.5 rounded-full text-xs font-sans font-medium text-[#3A342C] dark:text-[#F7F3ED] shadow-xs">
          📍 Distance: 520 km
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useSunriseStore } from "@/lib/store";
import { Image as ImageIcon, Filter, MapPin, Calendar } from "lucide-react";

export default function TimelinePage() {
  const { memories } = useSunriseStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");

  const categories = ["All", "Trips", "Call Screenshots", "Special Moments", "Photos", "Letters", "Voice Notes"];
  const years = ["All", "2026", "2025"];

  const filteredMemories = memories.filter((m) => {
    const matchCat = selectedCategory === "All" || m.category === selectedCategory;
    const matchYear = selectedYear === "All" || m.year.toString() === selectedYear;
    return matchCat && matchYear;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-amber-500" /> Memory Timeline
          </h1>
          <p className="text-xs font-sans text-stone-500">
            A Pinterest-style visual archive of trips, call screenshots, letters, and special moments.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-sans">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                selectedCategory === cat
                  ? "bg-amber-500 text-white border-amber-500 font-medium shadow-xs"
                  : "bg-white/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pinterest Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className="break-inside-avoid glass-panel rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 space-y-3 p-4 hover:shadow-xl transition-all duration-300 group"
          >
            {mem.mediaUrl && (
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={mem.mediaUrl}
                  alt={mem.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-sans uppercase font-semibold">
                  {mem.category}
                </span>
              </div>
            )}

            <div className="space-y-1.5 font-sans">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">
                {mem.date}
              </span>
              <h3 className="text-lg font-serif text-stone-800 dark:text-stone-100 font-medium">
                {mem.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-serif">
                {mem.description}
              </p>
              {mem.location && (
                <p className="text-[11px] text-stone-400 flex items-center gap-1 pt-1">
                  <MapPin className="w-3 h-3 text-amber-500" /> {mem.location}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

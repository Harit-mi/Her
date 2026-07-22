"use client";

import React, { useState } from "react";
import { useSunriseStore } from "@/lib/store";
import { Search as SearchIcon, Mail, BookOpen, Image as ImageIcon, UtensilsCrossed } from "lucide-react";

export default function SearchPage() {
  const { letters, dinners, memories, bookQuotes } = useSunriseStore();
  const [query, setQuery] = useState("");

  const matchingLetters = letters.filter(
    (l) => l.title.toLowerCase().includes(query.toLowerCase()) || l.content.toLowerCase().includes(query.toLowerCase())
  );

  const matchingDinners = dinners.filter(
    (d) => d.foodName.toLowerCase().includes(query.toLowerCase()) || d.funnyMoment?.toLowerCase().includes(query.toLowerCase())
  );

  const matchingMemories = memories.filter(
    (m) => m.title.toLowerCase().includes(query.toLowerCase()) || m.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
          <SearchIcon className="w-7 h-7 text-amber-500" /> Global Memory Search
        </h1>
        <p className="text-xs font-sans text-stone-500">
          Search across letters, quotes, dinners, photos, and voice notes.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search keywords (e.g. Kyoto, ramen, rain, coffee, salmon)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/90 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm font-sans focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-sm"
        />
        <SearchIcon className="w-5 h-5 text-stone-400 absolute left-4 top-4" />
      </div>

      {/* Results Stream */}
      <div className="space-y-6">
        {query.trim() && (
          <p className="text-xs font-sans text-stone-400">
            Found {matchingLetters.length + matchingDinners.length + matchingMemories.length} results matching "{query}"
          </p>
        )}

        {/* Letters Results */}
        {matchingLetters.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-sans font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> Matching Letters ({matchingLetters.length})
            </h3>
            {matchingLetters.map((l) => (
              <div key={l.id} className="glass-panel p-4 rounded-2xl space-y-1 font-sans text-xs">
                <p className="font-serif text-sm font-medium text-stone-800 dark:text-stone-200">{l.title}</p>
                <p className="text-stone-500 line-clamp-2 font-serif">{l.content}</p>
                <span className="text-[10px] text-stone-400">{l.dateStr}</span>
              </div>
            ))}
          </div>
        )}

        {/* Dinners Results */}
        {matchingDinners.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-sans font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <UtensilsCrossed className="w-4 h-4" /> Matching Dinners ({matchingDinners.length})
            </h3>
            {matchingDinners.map((d) => (
              <div key={d.id} className="glass-panel p-4 rounded-2xl space-y-1 font-sans text-xs">
                <p className="font-serif text-sm font-medium text-stone-800 dark:text-stone-200">Dinner #{d.number}: {d.foodName}</p>
                {d.funnyMoment && <p className="text-stone-500 italic font-serif">"{d.funnyMoment}"</p>}
                <span className="text-[10px] text-stone-400">{d.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useSunriseStore } from "@/lib/store";
import { BookOpen, Calendar, MapPin, Music, Film, Book, Mic, UtensilsCrossed } from "lucide-react";

export default function DiaryPage() {
  const { letters, dinners, voiceNotes, bookQuotes, animeList, playlist } = useSunriseStore();

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-amber-500" /> Shared Digital Diary
        </h1>
        <p className="text-xs font-sans text-stone-500">
          Daily chapters automatically compiled into a beautiful lifelong book.
        </p>
      </div>

      {/* Diary Pages Stream */}
      <div className="space-y-8">
        {letters.map((letter, idx) => {
          const matchingDinner = dinners.find((d) => d.date === letter.dateStr) || dinners[idx % dinners.length];
          const matchingVoice = voiceNotes[idx % voiceNotes.length];
          const matchingQuote = bookQuotes[idx % bookQuotes.length];
          const matchingAnime = animeList[idx % animeList.length];
          const matchingSong = playlist[idx % playlist.length];

          return (
            <div
              key={letter.id}
              className="glass-panel rounded-3xl p-6 sm:p-10 border border-stone-300/80 dark:border-stone-800 shadow-xl space-y-6 relative overflow-hidden bg-gradient-to-b from-white/90 via-amber-50/20 to-white/90 dark:from-stone-900 dark:to-stone-950"
            >
              {/* Page Number & Ribbon */}
              <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs font-sans uppercase font-bold text-amber-800 dark:text-amber-300 tracking-wider">
                    Chapter {letters.length - idx} • {letter.dateStr}
                  </span>
                </div>
                <span className="text-xs font-serif text-stone-400">Tokyo 🇯🇵 & SF 🇺🇸</span>
              </div>

              {/* Grid Content layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Column: Letter Content */}
                <div className="md:col-span-2 space-y-4">
                  <span className="text-xs font-sans px-2.5 py-1 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 font-medium">
                    {letter.mood}
                  </span>

                  <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100 font-medium">
                    {letter.title}
                  </h2>

                  <div className="prose prose-stone dark:prose-invert font-serif text-base leading-relaxed whitespace-pre-line text-stone-700 dark:text-stone-300">
                    {letter.content}
                  </div>

                  {letter.photoUrls && letter.photoUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {letter.photoUrls.map((url, pIdx) => (
                        <img
                          key={pIdx}
                          src={url}
                          alt="Diary photo"
                          className="w-full h-40 object-cover rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Sidebar Column: Daily Metadata Cards */}
                <div className="space-y-4 font-sans text-xs border-t md:border-t-0 md:border-l border-stone-200/80 dark:border-stone-800 pt-4 md:pt-0 md:pl-6">
                  {/* Dinner Card */}
                  {matchingDinner && (
                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                        <UtensilsCrossed className="w-4 h-4" /> Dinner #{matchingDinner.number}
                      </div>
                      <p className="font-serif text-stone-800 dark:text-stone-200">{matchingDinner.foodName}</p>
                      {matchingDinner.funnyMoment && (
                        <p className="text-[11px] text-stone-400 italic">"{matchingDinner.funnyMoment}"</p>
                      )}
                    </div>
                  )}

                  {/* Voice Note Card */}
                  {matchingVoice && (
                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-500 font-medium">
                        <Mic className="w-4 h-4" /> Voice Letter
                      </div>
                      <p className="font-serif text-stone-800 dark:text-stone-200">{matchingVoice.title}</p>
                      <p className="text-[11px] text-stone-400">{matchingVoice.duration} seconds audio</p>
                    </div>
                  )}

                  {/* Music Card */}
                  {matchingSong && (
                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
                        <Music className="w-4 h-4" /> Listening To
                      </div>
                      <p className="font-serif text-stone-800 dark:text-stone-200">{matchingSong.title}</p>
                      <p className="text-[11px] text-stone-400">{matchingSong.artist}</p>
                    </div>
                  )}

                  {/* Book Quote Card */}
                  {matchingQuote && (
                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                        <Book className="w-4 h-4" /> Book Quote
                      </div>
                      <p className="font-serif text-stone-800 dark:text-stone-200 italic">"{matchingQuote.quote}"</p>
                      <p className="text-[11px] text-stone-400">— {matchingQuote.author}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

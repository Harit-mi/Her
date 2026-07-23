"use client";

import React from "react";
import { useSunriseStore } from "@/lib/store";
import { BookOpen, Calendar, MapPin, Music, Film, Book, Mic, UtensilsCrossed, Eye } from "lucide-react";

export default function DiaryPage() {
  const { letters, dinners, voiceNotes, bookQuotes, animeList, playlist, openLetterModal } = useSunriseStore();

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-[#D4A857]" /> Shared Digital Diary
        </h1>
        <p className="text-xs font-sans text-[#7A7267]">
          Daily chapters automatically compiled into a beautiful lifelong book across Gujarat & Maharashtra 🇮🇳
        </p>
      </div>

      {/* Diary Pages Stream */}
      <div className="space-y-8">
        {letters.map((letter, idx) => {
          const matchingDinner = dinners.find((d) => d.date === letter.dateStr) || dinners[idx % dinners.length];
          const matchingVoice = voiceNotes[idx % voiceNotes.length];
          const matchingQuote = bookQuotes[idx % bookQuotes.length];
          const matchingSong = playlist[idx % playlist.length];

          return (
            <div
              key={letter.id}
              className="glass-panel rounded-3xl p-6 sm:p-10 border border-[#EDE0D0] dark:border-[#3D352E] shadow-xl space-y-6 relative overflow-hidden bg-gradient-to-b from-white/90 via-amber-50/20 to-white/90 dark:from-[#1E1A16] dark:to-[#2A241F]"
            >
              {/* Page Number & Ribbon */}
              <div className="flex items-center justify-between border-b border-[#EDE0D0] dark:border-[#3D352E] pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#D4A857]" />
                  <span className="text-xs font-sans uppercase font-bold text-[#D4A857] tracking-wider">
                    Chapter {letters.length - idx} • {letter.dateStr || "Nightly Note"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-sans text-[#7A7267]">Gujarat 🇮🇳 ↔ Maharashtra 🇮🇳</span>
                  <button
                    onClick={() => openLetterModal(letter.id)}
                    className="px-3 py-1 rounded-full bg-[#D4A857] text-white text-xs font-sans font-semibold cursor-pointer shadow-xs flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Read Full Letter
                  </button>
                </div>
              </div>

              {/* Grid Content layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Column: Letter Content */}
                <div
                  onClick={() => openLetterModal(letter.id)}
                  className="md:col-span-2 space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans px-2.5 py-1 rounded-full bg-amber-100 dark:bg-[#3D352E] text-amber-900 dark:text-amber-200 font-medium">
                      {letter.mood || "😌 Peaceful"}
                    </span>
                    <span className="text-xs font-sans text-[#7A7267]">
                      Written by {letter.author}
                    </span>
                  </div>

                  <h2 className="text-2xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium group-hover:text-[#D4A857] transition-colors">
                    {letter.title}
                  </h2>

                  <div className="font-serif text-base leading-relaxed whitespace-pre-line text-[#3A342C] dark:text-[#F7F3ED] line-clamp-4">
                    {letter.content}
                  </div>

                  {letter.photoUrls && letter.photoUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {letter.photoUrls.map((url, pIdx) => (
                        <img
                          key={pIdx}
                          src={url}
                          alt="Diary photo"
                          className="w-full h-40 object-cover rounded-2xl border border-[#EDE0D0] dark:border-[#3D352E] shadow-xs"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Sidebar Column: Daily Metadata Cards */}
                <div className="space-y-4 font-sans text-xs border-t md:border-t-0 md:border-l border-[#EDE0D0] dark:border-[#3D352E] pt-4 md:pt-0 md:pl-6">
                  {/* Dinner Card */}
                  {matchingDinner && (
                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                        <UtensilsCrossed className="w-4 h-4" /> Dinner #{matchingDinner.number}
                      </div>
                      <p className="font-serif text-[#3A342C] dark:text-[#F7F3ED]">{matchingDinner.foodName}</p>
                      {matchingDinner.funnyMoment && (
                        <p className="text-[11px] text-[#7A7267] italic">"{matchingDinner.funnyMoment}"</p>
                      )}
                    </div>
                  )}

                  {/* Voice Note Card */}
                  {matchingVoice && (
                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-500 font-medium">
                        <Mic className="w-4 h-4" /> Voice Letter
                      </div>
                      <p className="font-serif text-[#3A342C] dark:text-[#F7F3ED]">{matchingVoice.title}</p>
                      <p className="text-[11px] text-[#7A7267]">{matchingVoice.duration} seconds audio</p>
                    </div>
                  )}

                  {/* Music Card */}
                  {matchingSong && (
                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
                        <Music className="w-4 h-4" /> Listening To
                      </div>
                      <p className="font-serif text-[#3A342C] dark:text-[#F7F3ED]">{matchingSong.title}</p>
                      <p className="text-[11px] text-[#7A7267]">{matchingSong.artist}</p>
                    </div>
                  )}

                  {/* Book Quote Card */}
                  {matchingQuote && (
                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] space-y-1">
                      <div className="flex items-center gap-1.5 text-[#D4A857] font-medium">
                        <Book className="w-4 h-4" /> Book Quote
                      </div>
                      <p className="font-serif text-[#3A342C] dark:text-[#F7F3ED] italic">"{matchingQuote.quote}"</p>
                      <p className="text-[11px] text-[#7A7267]">— {matchingQuote.author}</p>
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

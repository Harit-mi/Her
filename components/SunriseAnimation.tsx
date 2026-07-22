"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSunriseStore } from "@/lib/store";
import { PROFILES } from "@/lib/initialData";
import { Reaction } from "@/lib/types";
import { X, Heart, Send, Music, BookOpen, Tv, Sparkles, MapPin } from "lucide-react";
import confetti from "canvas-confetti";

export default function SunriseAnimation() {
  const {
    unreadLetterForCurrent,
    showSunriseModal,
    setShowSunriseModal,
    markLetterRead,
    reactToLetter,
    replyToLetter,
    currentUser,
  } = useSunriseStore();

  const [replyText, setReplyText] = useState("");
  const [activeReaction, setActiveReaction] = useState<Reaction["emoji"] | null>(null);

  if (!showSunriseModal || !unreadLetterForCurrent) return null;

  const authorProfile = PROFILES[unreadLetterForCurrent.author];
  const paragraphs = unreadLetterForCurrent.content.split("\n\n");

  const handleClose = () => {
    markLetterRead(unreadLetterForCurrent.id);
    setShowSunriseModal(false);
  };

  const handleReaction = (emoji: Reaction["emoji"]) => {
    setActiveReaction(emoji);
    reactToLetter(unreadLetterForCurrent.id, emoji);
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.7 },
    });
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    replyToLetter(unreadLetterForCurrent.id, replyText.trim());
    setReplyText("");
    confetti({
      particleCount: 30,
      spread: 50,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1E1A16]/90 backdrop-blur-md overflow-y-auto">
        {/* Soft Animated Gradient Light Sweep Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-[#D4A857]/20 via-orange-400/10 to-amber-200/20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.4] }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full max-w-xl bg-[#FAF6F0] dark:bg-[#1E1A16] rounded-3xl p-5 sm:p-8 shadow-2xl border border-[#EDE0D0] dark:border-[#3D352E] space-y-6 my-auto"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#EDE0D0] dark:bg-[#3D352E] text-[#3A342C] dark:text-[#F7F3ED] hover:scale-105 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Ceremonial Header */}
          <div className="text-center space-y-2 pt-2">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4A857] to-amber-200 mx-auto flex items-center justify-center text-3xl shadow-md"
            >
              🌅
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xs uppercase tracking-widest text-[#D4A857] font-semibold font-sans"
            >
              "Written while you were asleep."
            </motion.p>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-2xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium"
            >
              {unreadLetterForCurrent.title}
            </motion.h2>

            <p className="text-xs font-sans text-[#7A7267] flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-[#D4A857]" /> From {authorProfile.name} in {authorProfile.city}, {authorProfile.state} 🇮🇳 • {unreadLetterForCurrent.writtenAt}
            </p>
          </div>

          {/* Staggered Paragraph Letter Body */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/70 dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] font-serif text-base sm:text-lg text-[#3A342C] dark:text-[#F7F3ED] leading-relaxed space-y-4 shadow-inner">
            {paragraphs.map((p, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + idx * 0.25 }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* Metadata Chips Strip */}
          <div className="flex flex-wrap gap-2 pt-1 font-sans text-xs">
            {unreadLetterForCurrent.mood && (
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-200 text-[11px] font-medium">
                {unreadLetterForCurrent.mood}
              </span>
            )}

            {unreadLetterForCurrent.listeningTo && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-200 text-[11px] font-medium flex items-center gap-1">
                <Music className="w-3 h-3" /> {unreadLetterForCurrent.listeningTo.songTitle}
              </span>
            )}

            {unreadLetterForCurrent.readingBook && (
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border border-blue-200 text-[11px] font-medium flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {unreadLetterForCurrent.readingBook.title}
              </span>
            )}
          </div>

          {/* 4 Tap-Animated Reaction Buttons */}
          <div className="space-y-2 pt-2 border-t border-[#EDE0D0] dark:border-[#3D352E]">
            <p className="text-xs font-sans text-[#7A7267] font-medium text-center">React to this letter</p>
            <div className="flex justify-center gap-4">
              {(["❤️", "🥹", "😂", "🤍"] as const).map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                    activeReaction === emoji
                      ? "scale-125 bg-[#D4A857] text-white shadow-md ring-2 ring-[#D4A857]"
                      : "bg-[#EDE0D0]/60 dark:bg-[#3D352E] hover:scale-110 active:scale-95"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Inline Reply Thread */}
          <form onSubmit={handleReplySubmit} className="space-y-2 pt-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Send a quick reply to ${authorProfile.name}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-full bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] text-xs font-sans focus:ring-2 focus:ring-[#D4A857] focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#D4A857] hover:bg-[#c39746] text-white text-xs font-sans font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

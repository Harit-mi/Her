"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSunriseStore } from "@/lib/store";
import { X, Heart, Sparkles, Send, Volume2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function SunriseAnimation() {
  const {
    showSunriseModal,
    setShowSunriseModal,
    unreadLetterForCurrent,
    latestLetter,
    markLetterRead,
    reactToLetter,
    replyToLetter,
    currentUser,
  } = useSunriseStore();

  const [step, setStep] = useState<"sunrise" | "envelope" | "read">("sunrise");
  const [replyText, setReplyText] = useState("");
  const [hasReplied, setHasReplied] = useState(false);

  const letterToDisplay = unreadLetterForCurrent || latestLetter;

  if (!showSunriseModal || !letterToDisplay) return null;

  const handleOpenEnvelope = () => {
    setStep("read");
    if (unreadLetterForCurrent) {
      markLetterRead(unreadLetterForCurrent.id);
    }
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#F59E0B", "#FBBF24", "#F472B6"],
    });
  };

  const handleReaction = (emoji: "❤️" | "🥹" | "😂" | "🤍") => {
    reactToLetter(letterToDisplay.id, emoji);
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.7 },
    });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    replyToLetter(letterToDisplay.id, replyText.trim());
    setReplyText("");
    setHasReplied(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-amber-50 via-orange-50 to-stone-100 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 rounded-3xl p-6 sm:p-10 shadow-2xl border border-amber-200/50 dark:border-stone-800 overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setShowSunriseModal(false)}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/60 dark:bg-stone-800/60 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* STEP 1: Atmospheric Sunrise Glow */}
          {step === "sunrise" && (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
              {/* Rising Sun Aura */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative w-32 h-32 rounded-full bg-gradient-to-t from-amber-400 via-orange-300 to-amber-100 flex items-center justify-center shadow-[0_0_80px_rgba(245,158,11,0.5)]"
              >
                <span className="text-5xl">☀️</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="space-y-2"
              >
                <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-sans font-medium">
                  Morning Experience
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif text-stone-800 dark:text-stone-100 font-normal">
                  "Written while you were asleep."
                </h2>
                <p className="text-sm font-sans text-stone-600 dark:text-stone-400 max-w-md mx-auto">
                  {letterToDisplay.author} left a new letter for you at {letterToDisplay.writtenAt} from {letterToDisplay.author === "Alex" ? "Tokyo 🇯🇵" : "San Francisco 🇺🇸"}.
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onClick={() => setStep("envelope")}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-sans text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Open Your Letter
              </motion.button>
            </div>
          )}

          {/* STEP 2: Sealed Envelope Unsealing */}
          {step === "envelope" && (
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-6">
              <motion.div
                initial={{ rotateX: 90 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-full max-w-md bg-amber-100/90 dark:bg-stone-800 p-8 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700/60 shadow-lg relative cursor-pointer hover:border-amber-400"
                onClick={handleOpenEnvelope}
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-200 dark:bg-stone-700 mx-auto flex items-center justify-center text-2xl shadow-inner">
                    ✉️
                  </div>
                  <h3 className="text-lg font-serif text-stone-800 dark:text-stone-200">
                    To: {letterToDisplay.recipient}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                    Stamped {letterToDisplay.dateStr} at {letterToDisplay.writtenAt}
                  </p>
                  <p className="text-xs font-sans italic text-amber-700 dark:text-amber-300 pt-2">
                    Click seal to open letter...
                  </p>
                </div>
              </motion.div>
            </div>
          )}

          {/* STEP 3: Full Letter Content */}
          {step === "read" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="border-b border-amber-200/60 dark:border-stone-800 pb-4 flex items-start justify-between">
                <div>
                  <span className="text-xs font-sans px-2.5 py-1 rounded-full bg-amber-200/80 dark:bg-stone-800 text-amber-900 dark:text-amber-200">
                    {letterToDisplay.mood}
                  </span>
                  <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100 mt-2 font-medium">
                    {letterToDisplay.title}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-1">
                    Written by {letterToDisplay.author} on {letterToDisplay.dateStr} at {letterToDisplay.writtenAt}
                  </p>
                </div>
              </div>

              {/* Body Content */}
              <div className="prose prose-stone dark:prose-invert font-serif leading-relaxed text-base whitespace-pre-line text-stone-700 dark:text-stone-300">
                {letterToDisplay.content}
              </div>

              {/* Photos Gallery */}
              {letterToDisplay.photoUrls && letterToDisplay.photoUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {letterToDisplay.photoUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Letter memory"
                      className="w-full h-44 object-cover rounded-2xl shadow-sm border border-amber-100 dark:border-stone-800 hover:scale-[1.02] transition-transform"
                    />
                  ))}
                </div>
              )}

              {/* Media Metadata Cards (Song, Book, Anime) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-sans text-xs">
                {letterToDisplay.listeningTo && (
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-800/70 border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="truncate">
                      <p className="text-[10px] text-stone-400 uppercase">Listening to</p>
                      <p className="font-medium text-stone-700 dark:text-stone-200 truncate">
                        {letterToDisplay.listeningTo.songTitle}
                      </p>
                    </div>
                  </div>
                )}
                {letterToDisplay.readingBook && (
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-800/70 border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-2">
                    <span className="text-sm">📖</span>
                    <div className="truncate">
                      <p className="text-[10px] text-stone-400 uppercase">Reading</p>
                      <p className="font-medium text-stone-700 dark:text-stone-200 truncate">
                        {letterToDisplay.readingBook.title}
                      </p>
                    </div>
                  </div>
                )}
                {letterToDisplay.watchingAnime && (
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-800/70 border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-2">
                    <span className="text-sm">🎬</span>
                    <div className="truncate">
                      <p className="text-[10px] text-stone-400 uppercase">Watching</p>
                      <p className="font-medium text-stone-700 dark:text-stone-200 truncate">
                        {letterToDisplay.watchingAnime.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reactions & Reply Section */}
              <div className="border-t border-amber-200/60 dark:border-stone-800 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans text-stone-500 dark:text-stone-400">React with:</span>
                  <div className="flex gap-2">
                    {(["❤️", "🥹", "😂", "🤍"] as const).map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(emoji)}
                        className="text-xl p-2 rounded-xl bg-white/80 dark:bg-stone-800 hover:scale-125 transition-transform shadow-xs"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display existing reactions */}
                {letterToDisplay.reactions.length > 0 && (
                  <div className="flex gap-2 text-xs font-sans text-stone-500">
                    <span>Reactions:</span>
                    {letterToDisplay.reactions.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200">
                        {r.emoji} by {r.by}
                      </span>
                    ))}
                  </div>
                )}

                {/* Quick inline reply */}
                <form onSubmit={handleSendReply} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${letterToDisplay.author}...`}
                    className="flex-1 px-4 py-2 rounded-xl bg-white/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-sans font-medium flex items-center gap-1 hover:bg-stone-800 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Reply
                  </button>
                </form>

                {hasReplied && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-sans italic">
                    ✓ Reply sent to {letterToDisplay.author}'s morning inbox!
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSunriseStore } from "@/lib/store";
import { PROFILES } from "@/lib/initialData";
import { MoodType } from "@/lib/types";
import { Mail, Send, Image as ImageIcon, Music, BookOpen, Sparkles, CheckCircle2, Clock } from "lucide-react";
import confetti from "canvas-confetti";

export default function LetterPage() {
  const { addLetter, currentUser, letters } = useSunriseStore();
  const partnerProfile = PROFILES[currentUser === "Harit" ? "Ameera" : "Harit"];
  const userProfile = PROFILES[currentUser];

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<MoodType>("😌 Peaceful");
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isSealing, setIsSealing] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSealing(true);

    setTimeout(() => {
      addLetter({
        author: currentUser,
        recipient: currentUser === "Harit" ? "Ameera" : "Harit",
        title: title.trim(),
        content: content.trim(),
        writtenAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        dateStr: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        mood,
        listeningTo: songTitle ? { songTitle, artist: artist || "Unknown Artist" } : undefined,
        readingBook: bookTitle ? { title: bookTitle, author: "" } : undefined,
        photoUrls: photoUrl ? [photoUrl] : undefined,
      });

      setIsSealing(false);
      setIsSent(true);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      {/* Sealing Envelope Animation Overlay */}
      <AnimatePresence>
        {isSealing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1E1A16]/90 backdrop-blur-md text-center p-6 space-y-4"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1.2, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-24 h-24 rounded-3xl bg-[#D4A857] text-white flex items-center justify-center text-5xl shadow-2xl"
            >
              ✉️
            </motion.div>
            <h3 className="text-2xl font-serif text-white font-medium">Sealing Your Nightly Letter...</h3>
            <p className="text-xs font-sans text-[#EDE0D0]">
              Sending across 520 km from {userProfile.city} to {partnerProfile.name} in {partnerProfile.city} 🇮🇳
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium flex items-center gap-2">
            <Mail className="w-7 h-7 text-[#D4A857]" /> Write Tonight's Letter 📜
          </h1>
          <p className="text-xs font-sans text-[#7A7267]">
            Written for {partnerProfile.name} ({partnerProfile.city}, {partnerProfile.state} 🇮🇳). She will wake up and read this tomorrow morning.
          </p>
        </div>
      </div>

      {isSent ? (
        <div className="glass-panel p-8 rounded-3xl text-center space-y-4 border border-[#EDE0D0] dark:border-[#3D352E]">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium">
            Your letter has been sealed and delivered!
          </h2>
          <p className="text-xs font-sans text-[#7A7267] max-w-md mx-auto">
            {partnerProfile.name} will be greeted by the morning sunrise reveal as soon as she wakes up.
          </p>
          <button
            onClick={() => setIsSent(false)}
            className="px-6 py-2.5 rounded-full bg-[#D4A857] text-white text-xs font-sans font-semibold cursor-pointer"
          >
            Write Another Note
          </button>
        </div>
      ) : (
        /* Fullscreen Distraction-Free Composer Card */
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 paper-texture border border-[#EDE0D0] dark:border-[#3D352E]">
          {/* Title */}
          <div>
            <label className="text-xs font-sans font-medium text-[#7A7267]">Letter Title</label>
            <input
              type="text"
              placeholder="e.g. Quiet Rain in Gujarat & Thoughts of Ameera"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1.5 p-3.5 rounded-2xl bg-white/80 dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] font-serif text-lg font-medium text-[#3A342C] dark:text-[#F7F3ED] focus:ring-2 focus:ring-[#D4A857] focus:outline-none"
              required
            />
          </div>

          {/* Letter Body */}
          <div>
            <label className="text-xs font-sans font-medium text-[#7A7267]">Your Handwritten Letter</label>
            <textarea
              rows={8}
              placeholder={`Dearest ${partnerProfile.name},\n\nWrite everything that touched your heart today...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mt-1.5 p-4 rounded-2xl bg-white/80 dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] font-serif text-base text-[#3A342C] dark:text-[#F7F3ED] leading-relaxed focus:ring-2 focus:ring-[#D4A857] focus:outline-none"
              required
            />
          </div>

          {/* Optional Attachments Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs">
            <div>
              <label className="text-[#7A7267] font-medium flex items-center gap-1">
                <span>Mood</span>
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as MoodType)}
                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E]"
              >
                <option value="😌 Peaceful">😌 Peaceful</option>
                <option value="😊 Happy">😊 Happy</option>
                <option value="🥹 Emotional">🥹 Emotional</option>
                <option value="😔 Missing You">😔 Missing You</option>
              </select>
            </div>

            <div>
              <label className="text-[#7A7267] font-medium flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-emerald-500" /> Song Title
              </label>
              <input
                type="text"
                placeholder="e.g. Tum Se Hi"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E]"
              />
            </div>

            <div>
              <label className="text-[#7A7267] font-medium flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> Photo URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E]"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-[#EDE0D0] dark:border-[#3D352E]">
            <p className="text-[11px] font-sans text-[#7A7267] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#D4A857]" /> Auto-stamped at {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>

            <button
              type="submit"
              className="px-7 py-3 rounded-full bg-[#D4A857] hover:bg-[#c39746] text-white font-sans text-xs font-semibold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" /> Seal & Send Letter ✉️
            </button>
          </div>
        </form>
      )}

      {/* Past Letters List */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium">
          Sent & Received Letters
        </h3>

        <div className="space-y-3">
          {letters.map((l) => (
            <div
              key={l.id}
              className="glass-panel p-5 rounded-2xl flex items-center justify-between gap-4 border border-[#EDE0D0] dark:border-[#3D352E]"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D4A857]">
                  From {l.author} to {l.recipient} • {l.dateStr}
                </span>
                <h4 className="text-base font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium mt-0.5">
                  {l.title}
                </h4>
              </div>

              <span className={`text-xs px-3 py-1 rounded-full font-sans font-medium ${l.isRead ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800 animate-pulse"}`}>
                {l.isRead ? "Read ✓" : "Unread ✉️"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

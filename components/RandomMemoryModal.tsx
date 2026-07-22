"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSunriseStore } from "@/lib/store";
import { X, Sparkles, RefreshCw, Heart } from "lucide-react";
import confetti from "canvas-confetti";

export default function RandomMemoryModal() {
  const { showRandomMemoryModal, setShowRandomMemoryModal, memories, letters, dinners, playlist } = useSunriseStore();

  const getRandomItem = () => {
    const allTypes = ["memory", "letter", "dinner", "song"];
    const chosenType = allTypes[Math.floor(Math.random() * allTypes.length)];

    if (chosenType === "memory" && memories.length > 0) {
      const item = memories[Math.floor(Math.random() * memories.length)];
      return { type: "Memory", title: item.title, subtitle: `${item.date} • ${item.location || ""}`, content: item.description, image: item.mediaUrl };
    } else if (chosenType === "letter" && letters.length > 0) {
      const item = letters[Math.floor(Math.random() * letters.length)];
      return { type: "Nightly Letter", title: item.title, subtitle: `Written by ${item.author} on ${item.dateStr}`, content: item.content.slice(0, 280) + "...", image: item.photoUrls?.[0] };
    } else if (chosenType === "dinner" && dinners.length > 0) {
      const item = dinners[Math.floor(Math.random() * dinners.length)];
      return { type: `Dinner #${item.number}`, title: item.foodName, subtitle: `Cooked/Ordered on ${item.date}`, content: item.funnyMoment || "Delicious meal shared across cities!", image: item.imageUrl };
    } else {
      const item = playlist[Math.floor(Math.random() * playlist.length)] || { title: "Lover", artist: "Taylor Swift", note: "Our song!", albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80" };
      return { type: "Shared Song", title: item.title, subtitle: `by ${item.artist}`, content: item.note, image: item.albumArt };
    }
  };

  const [currentMemory, setCurrentMemory] = useState(getRandomItem());

  if (!showRandomMemoryModal) return null;

  const handleNext = () => {
    setCurrentMemory(getRandomItem());
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.6 },
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-lg bg-stone-50 dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200/60 dark:border-stone-800 space-y-5"
        >
          <button
            onClick={() => setShowRandomMemoryModal(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-sans text-xs uppercase tracking-wider font-semibold">
            <Sparkles className="w-4 h-4" /> Remind Me Of Us
          </div>

          {/* Memory Card */}
          <div className="polaroid-frame space-y-3">
            {currentMemory.image && (
              <img
                src={currentMemory.image}
                alt={currentMemory.title}
                className="w-full h-56 object-cover rounded-md"
              />
            )}
            <div className="pt-2 font-serif">
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {currentMemory.type}
              </span>
              <h3 className="text-xl text-stone-800 dark:text-stone-100 font-normal mt-1">
                {currentMemory.title}
              </h3>
              <p className="text-xs font-sans text-stone-400 mt-0.5">
                {currentMemory.subtitle}
              </p>
              <p className="text-sm font-sans text-stone-600 dark:text-stone-300 mt-3 italic leading-relaxed">
                "{currentMemory.content}"
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-400 font-sans flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> A quiet moment saved forever
            </span>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-full bg-amber-500 text-white font-sans text-xs font-medium flex items-center gap-1.5 hover:bg-amber-600 active:scale-95 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Another Memory
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

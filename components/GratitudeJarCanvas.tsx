"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSunriseStore } from "@/lib/store";
import { GratitudeNote } from "@/lib/types";
import { Plus, X, HeartHandshake, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function GratitudeJarCanvas() {
  const { gratitudes, addGratitude, currentUser } = useSunriseStore();
  const [selectedNote, setSelectedNote] = useState<GratitudeNote | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-amber-100/90 text-amber-900 border-amber-200");

  const colors = [
    { label: "Warm Gold", value: "bg-amber-100/90 text-amber-900 border-amber-200" },
    { label: "Soft Rose", value: "bg-rose-100/90 text-rose-900 border-rose-200" },
    { label: "Mint Green", value: "bg-emerald-100/90 text-emerald-900 border-emerald-200" },
    { label: "Lavender", value: "bg-purple-100/90 text-purple-900 border-purple-200" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    addGratitude(newText.trim(), selectedColor);
    setNewText("");
    setShowAddForm(false);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-amber-500" /> Gratitude Jar
          </h2>
          <p className="text-xs font-sans text-stone-500">
            A quiet sanctuary for tiny thank-yous and appreciative notes.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-sans font-medium flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Note
        </button>
      </div>

      {/* 3D Glass Jar Container */}
      <div className="relative w-full max-w-md mx-auto min-h-[380px] bg-gradient-to-b from-white/40 via-amber-50/20 to-white/60 dark:from-stone-800/40 dark:to-stone-900/60 rounded-[40px] border-4 border-amber-200/60 dark:border-stone-700 p-6 flex flex-col items-center justify-end shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Lid */}
        <div className="absolute top-0 w-44 h-8 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 dark:from-amber-700 dark:to-amber-800 rounded-b-xl border-b-2 border-amber-400/50 shadow-md flex items-center justify-center text-[10px] font-sans font-semibold uppercase text-amber-900 dark:text-amber-100 tracking-wider">
          Glass Jar of Love
        </div>

        {/* Floating Paper Notes */}
        <div className="w-full flex flex-wrap justify-center gap-3 pt-12 pb-4 z-10 max-h-[300px] overflow-y-auto">
          {gratitudes.map((note, idx) => (
            <motion.div
              key={note.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedNote(note)}
              className={`paper-note cursor-pointer px-4 py-3 rounded-2xl border text-xs font-serif ${note.color} max-w-[170px] shadow-sm hover:scale-105 active:scale-95 transition-transform`}
            >
              <div className="line-clamp-2 italic">"{note.text}"</div>
              <div className="text-[10px] font-sans text-stone-500 mt-2 text-right">
                - {note.author}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-[11px] font-sans text-stone-400 italic pb-2 z-10">
          Tap any paper note to unfold and read...
        </p>
      </div>

      {/* Note Unfold Modal */}
      <AnimatePresence>
        {selectedNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative w-full max-w-sm p-6 sm:p-8 rounded-3xl border-2 shadow-2xl ${selectedNote.color}`}
            >
              <button
                onClick={() => setSelectedNote(null)}
                className="absolute top-4 right-4 p-1 rounded-full bg-white/60 text-stone-700 hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4 font-serif">
                <span className="text-[10px] font-sans uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/60 text-stone-700 font-semibold">
                  Gratitude Note
                </span>
                <p className="text-lg leading-relaxed italic text-stone-800">
                  "{selectedNote.text}"
                </p>
                <div className="border-t border-stone-300/60 pt-3 flex items-center justify-between text-xs font-sans text-stone-600">
                  <span>Written by {selectedNote.author}</span>
                  <span>{selectedNote.timestamp}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Gratitude Note Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-stone-50 dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4"
            >
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Drop a Note in the Jar
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-sans text-stone-500">Your Gratitude Note</label>
                  <textarea
                    rows={3}
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="e.g. Thank you for making me laugh when I was stressed today..."
                    className="w-full mt-1 p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-sans focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-sans text-stone-500">Paper Color</label>
                  <div className="flex gap-2 mt-1">
                    {colors.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setSelectedColor(c.value)}
                        className={`flex-1 py-1.5 text-[11px] font-sans rounded-xl border ${c.value} ${
                          selectedColor === c.value ? "ring-2 ring-amber-500 font-medium" : "opacity-80"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-sans text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-sans font-medium shadow-sm"
                  >
                    Drop into Jar 🫙
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

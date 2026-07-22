"use client";

import React, { useState } from "react";
import { useSunriseStore } from "@/lib/store";
import { Clock, Lock, Unlock, Plus, Sparkles, X } from "lucide-react";
import confetti from "canvas-confetti";

export default function TimeCapsulesPage() {
  const { timeCapsules, addTimeCapsule, currentUser } = useSunriseStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [condition, setCondition] = useState("200 Dinners");

  const [unlockedId, setUnlockedId] = useState<string | null>(null);

  const handleCreateCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addTimeCapsule({
      author: currentUser,
      title: title.trim(),
      letterContent: content.trim(),
      unlockCondition: condition,
      unlockType: "dinners",
    });

    setTitle("");
    setContent("");
    setShowAddModal(false);
    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
            <Clock className="w-7 h-7 text-amber-500" /> Time Capsules ⏳
          </h1>
          <p className="text-xs font-sans text-stone-500">
            Write letters that unlock on special future dates, milestones, or moods.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-sans text-xs font-medium flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Seal Time Capsule ✉️
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {timeCapsules.map((tc) => {
          const isOpened = unlockedId === tc.id || tc.isUnlocked;
          return (
            <div
              key={tc.id}
              className={`glass-panel p-6 rounded-3xl space-y-4 border transition-all ${
                isOpened
                  ? "border-amber-400 bg-amber-50/40 dark:bg-stone-900"
                  : "border-stone-200/80 dark:border-stone-800 opacity-95"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-sans uppercase px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                    Condition: {tc.unlockCondition}
                  </span>
                  <h3 className="text-lg font-serif text-stone-800 dark:text-stone-100 font-medium mt-2">
                    {tc.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-sans mt-0.5">Written by {tc.author}</p>
                </div>

                <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-amber-500">
                  {isOpened ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
              </div>

              {isOpened ? (
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-serif text-sm leading-relaxed text-stone-800 dark:text-stone-200 whitespace-pre-line">
                  {tc.letterContent}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-100/40 dark:bg-stone-800/40 border border-dashed border-amber-300 dark:border-amber-700 text-center space-y-2">
                  <p className="text-xs font-sans text-stone-600 dark:text-stone-400">
                    🔒 Sealed Digital Envelope
                  </p>
                  <button
                    onClick={() => {
                      setUnlockedId(tc.id);
                      confetti({ particleCount: 30, spread: 50 });
                    }}
                    className="px-4 py-1.5 rounded-full bg-amber-500 text-white font-sans text-xs font-medium hover:bg-amber-600 shadow-xs"
                  >
                    Unseal & Read Capsule
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-stone-50 dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Create Future Time Capsule
            </h3>

            <form onSubmit={handleCreateCapsule} className="space-y-4 font-sans text-xs">
              <div>
                <label className="text-stone-500">Capsule Title</label>
                <input
                  type="text"
                  placeholder="e.g. Open on Our 200th Shared Dinner..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                  required
                />
              </div>

              <div>
                <label className="text-stone-500">Unlock Condition</label>
                <input
                  type="text"
                  placeholder="e.g. 200 Dinners / Birthday / Dec 25 2026"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                  required
                />
              </div>

              <div>
                <label className="text-stone-500">Sealed Letter Message</label>
                <textarea
                  rows={5}
                  placeholder="Write something heartfelt to be opened in the future..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm font-serif"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-white font-medium shadow-sm"
                >
                  Seal Capsule 🔒
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

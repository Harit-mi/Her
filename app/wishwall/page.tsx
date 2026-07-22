"use client";

import React, { useState } from "react";
import { useSunriseStore } from "@/lib/store";
import { Sparkles, CheckCircle2, Circle, Plus, Heart, Compass, Utensils, Target, X } from "lucide-react";
import confetti from "canvas-confetti";

export default function WishWallPage() {
  const { wishes, toggleWish, addWish, currentUser } = useSunriseStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<any>("Travel");

  const categories = [
    { label: "Travel", icon: Compass },
    { label: "Food", icon: Utensils },
    { label: "Activity", icon: Sparkles },
    { label: "Goal", icon: Target },
  ];

  const handleToggle = (id: string, wasCompleted: boolean) => {
    toggleWish(id);
    if (!wasCompleted) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    }
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addWish(title.trim(), category);
    setTitle("");
    setShowAddForm(false);
    confetti({ particleCount: 25, spread: 40 });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-amber-500" /> Shared Wish Wall ✨
          </h1>
          <p className="text-xs font-sans text-stone-500">
            A wall of shared dreams, travel goals, and future adventures across Gujarat & Maharashtra.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-sans text-xs font-medium flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add New Wish
        </button>
      </div>

      {/* Wish Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wishes.map((wish) => {
          return (
            <div
              key={wish.id}
              onClick={() => handleToggle(wish.id, wish.completed)}
              className={`glass-panel p-5 rounded-3xl space-y-2 border transition-all cursor-pointer select-none ${
                wish.completed
                  ? "border-emerald-300 dark:border-emerald-900 bg-emerald-50/40 dark:bg-stone-900/60 opacity-80"
                  : "border-stone-200/80 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600 hover:scale-[1.01]"
              }`}
            >
              <div className="flex items-start gap-3">
                <button className="mt-0.5 text-amber-600 shrink-0">
                  {wish.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300 dark:text-stone-700 hover:text-amber-500 transition-colors" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-sans uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                    {wish.category}
                  </span>
                  <h3
                    className={`text-base font-serif font-medium ${
                      wish.completed
                        ? "line-through text-stone-400"
                        : "text-stone-800 dark:text-stone-100"
                    }`}
                  >
                    {wish.title}
                  </h3>
                  <p className="text-[11px] font-sans text-stone-400">
                    Added by {wish.addedBy} {wish.completedDate && `• Completed on ${wish.completedDate}`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-stone-50 dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 font-sans text-xs">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Add a Shared Wish
            </h3>

            <form onSubmit={handleAddWish} className="space-y-3">
              <div>
                <label className="text-stone-500">Wish Description</label>
                <input
                  type="text"
                  placeholder="e.g. Visit Gir National Park in Gujarat together..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                  required
                />
              </div>

              <div>
                <label className="text-stone-500">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                >
                  <option value="Travel">Travel ✈️</option>
                  <option value="Food">Food & Dining 🍲</option>
                  <option value="Activity">Activity / Concert 🎻</option>
                  <option value="Goal">Personal Goal 💖</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-white font-medium shadow-sm"
                >
                  Pin Wish ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

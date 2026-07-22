"use client";

import React, { useState } from "react";
import { useSunriseStore } from "@/lib/store";
import { UtensilsCrossed, Plus, Star, Camera, Smile, X, ChefHat } from "lucide-react";
import confetti from "canvas-confetti";

export default function DinnerPage() {
  const { dinners, addDinner } = useSunriseStore();
  const totalDinners = dinners.reduce((acc, curr) => Math.max(acc, curr.number), 0);

  const [showAddForm, setShowAddForm] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [type, setType] = useState<"cooked" | "ordered" | "both">("cooked");
  const [rating, setRating] = useState<number>(5);
  const [funnyMoment, setFunnyMoment] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [chef, setChef] = useState("");

  const handleAddDinner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    addDinner({
      date: dateStr,
      foodName: foodName.trim(),
      type,
      rating,
      funnyMoment: funnyMoment.trim() || undefined,
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
      chef: chef.trim() || "Alex & Sam",
    });

    setFoodName("");
    setFunnyMoment("");
    setImageUrl("");
    setChef("");
    setShowAddForm(false);
    confetti({ particleCount: 35, spread: 50 });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
            <UtensilsCrossed className="w-7 h-7 text-amber-500" /> Dinner Journal
          </h1>
          <p className="text-xs font-sans text-stone-500">
            Tracking every meal shared across Tokyo and San Francisco over FaceTime.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-sans text-xs font-medium flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Log Dinner #{totalDinners + 1}
        </button>
      </div>

      {/* Hero Stats Banner */}
      <div className="glass-panel p-8 rounded-3xl bg-gradient-to-r from-amber-100/60 via-orange-50/60 to-amber-50/60 dark:from-stone-900 dark:to-stone-900 border border-amber-200/80 dark:border-stone-800 text-center space-y-2">
        <p className="text-xs uppercase tracking-widest text-amber-800 dark:text-amber-300 font-sans font-semibold">
          Lifetime Dinner Milestone
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif text-stone-800 dark:text-stone-100 font-normal">
          "We've shared {totalDinners} dinners together."
        </h2>
        <p className="text-xs font-sans text-stone-500 max-w-md mx-auto">
          Every meal is counted automatically, building a memory bank of candles, laughs, and virtual toasts.
        </p>
      </div>

      {/* Dinner List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dinners.map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 space-y-4 hover:shadow-lg transition-shadow"
          >
            {item.imageUrl && (
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.foodName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white font-serif text-xs">
                  Dinner #{item.number}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-white font-sans text-[10px] uppercase font-semibold">
                  {item.type}
                </span>
              </div>
            )}

            <div className="p-5 space-y-3 font-sans">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-serif text-stone-800 dark:text-stone-100 font-medium">
                    {item.foodName}
                  </h3>
                  <p className="text-xs text-stone-400">{item.date}</p>
                </div>
                {/* Rating */}
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating ? "fill-amber-400 text-amber-400" : "text-stone-300 dark:text-stone-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {item.funnyMoment && (
                <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 italic">
                  " {item.funnyMoment} "
                </div>
              )}

              {item.chef && (
                <div className="text-[11px] text-stone-400 flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5 text-amber-500" /> Chef: {item.chef}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Dinner Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-stone-50 dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-amber-500" /> Log Dinner #{totalDinners + 1}
            </h3>

            <form onSubmit={handleAddDinner} className="space-y-4 font-sans text-xs">
              <div>
                <label className="text-stone-500">Dish Name</label>
                <input
                  type="text"
                  placeholder="e.g. Miso Glazed Salmon & FaceTime Candlelight"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-500">Meal Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs"
                  >
                    <option value="cooked">Home Cooked 🍳</option>
                    <option value="ordered">Ordered In 🥡</option>
                    <option value="both">Both / Special 🍷</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-500">Rating (1 to 5 Stars)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-500">Funny / Memorable Moment</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Smoke alarm went off in Tokyo while searing!"
                  value={funnyMoment}
                  onChange={(e) => setFunnyMoment(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs"
                />
              </div>

              <div>
                <label className="text-stone-500">Photo URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs"
                />
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
                  Save Dinner #{totalDinners + 1} 🍷
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

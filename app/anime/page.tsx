"use client";

import React, { useState } from "react";
import { useSunriseStore } from "@/lib/store";
import { Tv, Plus, Star, Sparkles, X } from "lucide-react";
import confetti from "canvas-confetti";

export default function AnimePage() {
  const { animeList, addAnime } = useSunriseStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<any>("Currently Watching");
  const [rating, setRating] = useState<number>(5);
  const [favoriteMoment, setFavoriteMoment] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const handleAddAnime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addAnime({
      title: title.trim(),
      status,
      rating,
      favoriteMoment: favoriteMoment.trim(),
      coverUrl: coverUrl.trim() || "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
    });

    setTitle("");
    setFavoriteMoment("");
    setCoverUrl("");
    setShowAddModal(false);
    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium flex items-center gap-2">
            <Tv className="w-7 h-7 text-purple-500" /> Anime & Movie Journal 🎬
          </h1>
          <p className="text-xs font-sans text-[#7A7267]">
            Currently watching lists, completed shows, and favorite shared watch party moments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-sans text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Anime / Movie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {animeList.map((item) => (
          <div
            key={item.id}
            className="glass-panel p-6 rounded-3xl space-y-4 border border-[#EDE0D0] dark:border-[#3D352E] flex gap-4 items-start"
          >
            {item.coverUrl && (
              <img
                src={item.coverUrl}
                alt={item.title}
                className="w-24 h-36 object-cover rounded-2xl border border-[#EDE0D0] dark:border-[#3D352E] shadow-sm shrink-0"
              />
            )}

            <div className="space-y-2 font-sans flex-1">
              <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200">
                {item.status}
              </span>

              <h3 className="text-lg font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium mt-1">
                {item.title}
              </h3>

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

              {item.favoriteMoment && (
                <p className="text-xs text-[#7A7267] dark:text-[#B0A79C] italic pt-1">
                  " {item.favoriteMoment} "
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#FAF6F0] dark:bg-[#1E1A16] rounded-3xl p-6 shadow-2xl border border-[#EDE0D0] dark:border-[#3D352E] space-y-4 font-sans text-xs">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-[#EDE0D0] dark:bg-[#3D352E] text-[#3A342C]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-serif text-[#3A342C] dark:text-[#F7F3ED] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" /> Log Anime / Movie
            </h3>

            <form onSubmit={handleAddAnime} className="space-y-3">
              <div>
                <label className="text-[#7A7267]">Show Title</label>
                <input
                  type="text"
                  placeholder="e.g. Frieren: Beyond Journey's End"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E]"
                  required
                />
              </div>

              <div>
                <label className="text-[#7A7267]">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E]"
                >
                  <option value="Currently Watching">Currently Watching 📺</option>
                  <option value="Completed">Completed 🎉</option>
                  <option value="Plan to Watch">Plan to Watch 📌</option>
                </select>
              </div>

              <div>
                <label className="text-[#7A7267]">Favorite Scene / Moment</label>
                <textarea
                  rows={2}
                  placeholder="Describe your favorite moment together..."
                  value={favoriteMoment}
                  onChange={(e) => setFavoriteMoment(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-[#7A7267]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-semibold shadow-xs"
                >
                  Save to Journal 🎬
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

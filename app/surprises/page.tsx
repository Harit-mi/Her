"use client";

import React, { useState } from "react";
import { useSunriseStore } from "@/lib/store";
import { Gift, Plus, Sparkles, X, Heart } from "lucide-react";
import confetti from "canvas-confetti";

export default function SurprisesPage() {
  const { surprises, openSurprise, addSurprise, currentUser } = useSunriseStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<any>("Song");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  const handleCreateSurprise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addSurprise({
      from: currentUser,
      title: title.trim(),
      type,
      content: content.trim(),
      mediaUrl: mediaUrl.trim() || undefined,
    });

    setTitle("");
    setContent("");
    setMediaUrl("");
    setShowAddForm(false);
    confetti({ particleCount: 35, spread: 50 });
  };

  const handleOpenGift = (id: string) => {
    openSurprise(id);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#F59E0B", "#EC4899", "#8B5CF6"],
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
            <Gift className="w-7 h-7 text-purple-500" /> Surprise Box Studio 🎁
          </h1>
          <p className="text-xs font-sans text-stone-500">
            Leave hidden surprises, jokes, acoustic recordings, and secret notes to unwrap like a gift.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-sans text-xs font-medium flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Leave a Surprise 🎁
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {surprises.map((item) => (
          <div
            key={item.id}
            className="glass-panel p-6 rounded-3xl space-y-4 border border-stone-200/80 dark:border-stone-800 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-sans uppercase px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 font-semibold">
                Gift Type: {item.type}
              </span>
              <span className="text-xs font-sans text-stone-400">From {item.from}</span>
            </div>

            <h3 className="text-xl font-serif text-stone-800 dark:text-stone-100 font-medium">
              {item.title}
            </h3>

            {item.isOpened ? (
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-stone-800/80 border border-purple-200 dark:border-stone-700 font-serif text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                  "{item.content}"
                </div>

                {item.mediaUrl && (
                  <img
                    src={item.mediaUrl}
                    alt="Surprise media"
                    className="w-full h-44 object-cover rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xs"
                  />
                )}

                <p className="text-[10px] font-sans text-emerald-600 dark:text-emerald-400">
                  Unwrapped on {item.openedAt || "Recently"} 🎉
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white text-center space-y-3 shadow-lg cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="text-4xl">🎁</div>
                <p className="text-sm font-serif font-medium">Ribbon Sealed Gift</p>
                <button
                  onClick={() => handleOpenGift(item.id)}
                  className="px-5 py-2 rounded-full bg-white text-purple-900 font-sans text-xs font-bold hover:bg-stone-100 shadow-sm"
                >
                  Unwrap Ribbon & Open 🎀
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
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
              <Gift className="w-5 h-5 text-purple-500" /> Wrap a Surprise Gift
            </h3>

            <form onSubmit={handleCreateSurprise} className="space-y-3">
              <div>
                <label className="text-stone-500">Surprise Title</label>
                <input
                  type="text"
                  placeholder="e.g. For your stressful afternoon..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                  required
                />
              </div>

              <div>
                <label className="text-stone-500">Surprise Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                >
                  <option value="Song">Song Cover / Audio 🎵</option>
                  <option value="Photo">Throwback Photo 📸</option>
                  <option value="Joke">Inside Joke / Meme 😂</option>
                  <option value="Message">Secret Love Note 💌</option>
                  <option value="Quote">Inspiring Quote ✨</option>
                </select>
              </div>

              <div>
                <label className="text-stone-500">Surprise Content</label>
                <textarea
                  rows={3}
                  placeholder="Write your secret message or joke..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm font-serif"
                  required
                />
              </div>

              <div>
                <label className="text-stone-500">Media URL (Optional Image/GIF)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
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
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-medium shadow-sm"
                >
                  Wrap & Hide Surprise 🎁
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

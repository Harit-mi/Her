"use client";

import React, { useState } from "react";
import { Plus, Sparkles, X, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface PolaroidItem {
  id: string;
  image: string;
  caption: string;
  date: string;
  rotation: string;
  tapeColor: string;
}

export default function ScrapbookBoard() {
  const [items, setItems] = useState<PolaroidItem[]>([
    {
      id: "scrap-1",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
      caption: "Midnight stroll through Shibuya 🌧️",
      date: "Tokyo • Oct 2025",
      rotation: "-rotate-2",
      tapeColor: "bg-amber-200/80",
    },
    {
      id: "scrap-2",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80",
      caption: "Golden Gate sunset picnic 🧺",
      date: "SF • Nov 2025",
      rotation: "rotate-3",
      tapeColor: "bg-rose-200/80",
    },
    {
      id: "scrap-3",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
      caption: "Kyoto bamboo sanctuary 🎋",
      date: "Kyoto • Dec 2025",
      rotation: "-rotate-1",
      tapeColor: "bg-emerald-200/80",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");

  const handleAddPolaroid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const rotations = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-4"];
    const tapes = ["bg-amber-200/80", "bg-rose-200/80", "bg-emerald-200/80", "bg-purple-200/80"];

    const newItem: PolaroidItem = {
      id: `scrap-${Date.now()}`,
      image: imageUrl.trim() || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      caption: caption.trim(),
      date: date.trim() || "Shared Moment",
      rotation: rotations[Math.floor(Math.random() * rotations.length)],
      tapeColor: tapes[Math.floor(Math.random() * tapes.length)],
    };

    setItems([newItem, ...items]);
    setImageUrl("");
    setCaption("");
    setDate("");
    setShowForm(false);
    confetti({ particleCount: 25, spread: 45 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" /> Digital Scrapbook
          </h2>
          <p className="text-xs font-sans text-stone-500">
            Polaroids, decorative tape, and handwritten memories pinned to our shared board.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-sans font-medium flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Polaroid
        </button>
      </div>

      {/* Scrapbook Board Canvas */}
      <div className="relative min-h-[420px] bg-[#F7F2EB] dark:bg-[#23201E] rounded-3xl p-6 sm:p-10 border border-stone-300 dark:border-stone-800 shadow-inner grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-start">
        {items.map((item) => (
          <div
            key={item.id}
            className={`relative polaroid-frame ${item.rotation} hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer group`}
          >
            {/* Decorative Washi Tape */}
            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 ${item.tapeColor} opacity-90 backdrop-blur-xs shadow-xs z-10`} />

            <img
              src={item.image}
              alt={item.caption}
              className="w-full h-48 object-cover rounded-xs"
            />

            <div className="pt-3 font-serif text-stone-800 dark:text-stone-200">
              <p className="text-sm font-medium">{item.caption}</p>
              <p className="text-[10px] font-sans text-stone-400 mt-1">{item.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-stone-50 dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Create Polaroid Memory
            </h3>

            <form onSubmit={handleAddPolaroid} className="space-y-3 font-sans text-xs">
              <div>
                <label className="text-stone-500">Image URL (Optional - defaults to cozy photo)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                />
              </div>

              <div>
                <label className="text-stone-500">Handwritten Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Cozy evening in Shibuya..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                  required
                />
              </div>

              <div>
                <label className="text-stone-500">Date & Location</label>
                <input
                  type="text"
                  placeholder="e.g. Tokyo • Oct 2026"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-white font-medium shadow-sm"
                >
                  Pin to Scrapbook 📌
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

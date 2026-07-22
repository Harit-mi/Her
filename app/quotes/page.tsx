"use client";

import React, { useState } from "react";
import { useSunriseStore } from "@/lib/store";
import { BookOpen, Plus, Sparkles, X, Heart } from "lucide-react";
import confetti from "canvas-confetti";

export default function BookQuotesPage() {
  const { bookQuotes, addBookQuote, currentUser } = useSunriseStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [quote, setQuote] = useState("");
  const [personalNote, setPersonalNote] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim() || !quote.trim()) return;

    addBookQuote({
      bookTitle: bookTitle.trim(),
      author: author.trim() || "Unknown Author",
      quote: quote.trim(),
      personalNote: personalNote.trim(),
      coverUrl: coverUrl.trim() || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
    });

    setBookTitle("");
    setAuthor("");
    setQuote("");
    setPersonalNote("");
    setCoverUrl("");
    setShowAddModal(false);
    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-[#D4A857]" /> Tonight's Book Quotes 📖
          </h1>
          <p className="text-xs font-sans text-[#7A7267]">
            Underlined passages and quiet literary thoughts shared before sleep.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-[#D4A857] hover:bg-[#c39746] text-white font-sans text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Save Tonight's Quote
        </button>
      </div>

      {/* Book Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookQuotes.map((item) => (
          <div
            key={item.id}
            className="glass-panel p-6 rounded-3xl space-y-4 border border-[#EDE0D0] dark:border-[#3D352E]"
          >
            <div className="flex items-start gap-4">
              {item.coverUrl && (
                <img
                  src={item.coverUrl}
                  alt={item.bookTitle}
                  className="w-20 h-28 object-cover rounded-xl border border-[#EDE0D0] dark:border-[#3D352E] shadow-sm shrink-0"
                />
              )}
              <div className="space-y-1 font-sans">
                <span className="text-[10px] text-[#D4A857] uppercase font-bold tracking-wider">
                  Saved by {item.addedBy} • {item.dateAdded}
                </span>
                <h3 className="text-lg font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium">
                  {item.bookTitle}
                </h3>
                <p className="text-xs text-[#7A7267]">by {item.author}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EDE0D0]/40 dark:bg-[#3D352E]/40 border border-[#EDE0D0] dark:border-[#3D352E] font-serif text-sm italic text-[#3A342C] dark:text-[#F7F3ED] leading-relaxed">
              "{item.quote}"
            </div>

            {item.personalNote && (
              <p className="text-xs font-sans text-[#7A7267] dark:text-[#B0A79C] pt-1">
                💬 Personal Note: "{item.personalNote}"
              </p>
            )}
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
              <Sparkles className="w-5 h-5 text-[#D4A857]" /> Save a Book Quote
            </h3>

            <form onSubmit={handleAddQuote} className="space-y-3">
              <div>
                <label className="text-[#7A7267]">Book Title</label>
                <input
                  type="text"
                  placeholder="e.g. The Palace of Illusions"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E]"
                  required
                />
              </div>

              <div>
                <label className="text-[#7A7267]">Author</label>
                <input
                  type="text"
                  placeholder="e.g. Chitra Banerjee Divakaruni"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E]"
                />
              </div>

              <div>
                <label className="text-[#7A7267]">Quote / Passage</label>
                <textarea
                  rows={3}
                  placeholder="Write the passage that touched your heart..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] text-sm font-serif"
                  required
                />
              </div>

              <div>
                <label className="text-[#7A7267]">Personal Note</label>
                <input
                  type="text"
                  placeholder="e.g. Thought of you while reading this in Gujarat..."
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E]"
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
                  className="px-5 py-2 rounded-xl bg-[#D4A857] text-white font-semibold shadow-xs"
                >
                  Save Quote 📖
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

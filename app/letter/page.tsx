"use client";

import React, { useState } from "react";
import { useSunriseStore } from "@/lib/store";
import { MoodType } from "@/lib/types";
import {
  Mail,
  PenTool,
  Sparkles,
  Volume2,
  BookOpen,
  Tv,
  Image as ImageIcon,
  Send,
  Heart,
  Smile,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function LetterPage() {
  const {
    currentUser,
    letters,
    addLetter,
    reactToLetter,
    replyToLetter,
  } = useSunriseStore();

  const partnerUser = currentUser === "Alex" ? "Sam" : "Alex";

  const [tab, setTab] = useState<"write" | "read">("read");

  // Form State for writing letter
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<MoodType>("😌 Peaceful");
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [animeTitle, setAnimeTitle] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const moods: MoodType[] = [
    "😊 Happy",
    "😌 Peaceful",
    "🥹 Emotional",
    "😴 Sleepy",
    "🤒 Unwell",
    "😔 Missing You",
    "😡 Frustrated",
  ];

  const handleWriteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " 🌙";
    const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    addLetter({
      author: currentUser,
      recipient: partnerUser,
      title: title.trim() || `Nightly Letter to ${partnerUser}`,
      content: content.trim(),
      writtenAt: timeStr,
      dateStr: dateStr,
      mood,
      listeningTo: songTitle ? { songTitle, artist: songArtist || "Favorite Artist" } : undefined,
      readingBook: bookTitle ? { title: bookTitle, author: bookAuthor || "Author" } : undefined,
      watchingAnime: animeTitle ? { title: animeTitle } : undefined,
      photoUrls: photoUrl ? [photoUrl] : undefined,
      themeColor: "from-amber-50 to-orange-50",
    });

    setIsSubmitted(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setIsSubmitted(false);
      setTitle("");
      setContent("");
      setSongTitle("");
      setBookTitle("");
      setAnimeTitle("");
      setPhotoUrl("");
      setTab("read");
    }, 1800);
  };

  const handleSendReply = (letterId: string) => {
    const text = replyText[letterId];
    if (!text || !text.trim()) return;
    replyToLetter(letterId, text.trim());
    setReplyText((prev) => ({ ...prev, [letterId]: "" }));
    confetti({ particleCount: 20, spread: 40 });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
            <Mail className="w-7 h-7 text-amber-500" /> Daily Letters
          </h1>
          <p className="text-xs font-sans text-stone-500">
            Written at night, opened in the morning like a handwritten letter.
          </p>
        </div>

        <div className="flex bg-stone-200/70 dark:bg-stone-800 p-1 rounded-full text-xs font-sans">
          <button
            onClick={() => setTab("read")}
            className={`px-5 py-2 rounded-full font-medium transition-all ${
              tab === "read"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-stone-600 dark:text-stone-300 hover:text-stone-900"
            }`}
          >
            Letters Inbox
          </button>
          <button
            onClick={() => setTab("write")}
            className={`px-5 py-2 rounded-full font-medium transition-all ${
              tab === "write"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-stone-600 dark:text-stone-300 hover:text-stone-900"
            }`}
          >
            Write Tonight's Letter ✍️
          </button>
        </div>
      </div>

      {/* WRITE TAB */}
      {tab === "write" && (
        <form onSubmit={handleWriteSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <h2 className="text-xl font-serif text-stone-800 dark:text-stone-100">
              Writing to {partnerUser} before sleep 🌙
            </h2>
            <p className="text-xs font-sans text-stone-500 mt-0.5">
              Your partner will discover this letter when their sun rises.
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-sans text-stone-500">Letter Title</label>
            <input
              type="text"
              placeholder="e.g. Rainy night in Shibuya & thinking of your smile..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm font-serif focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-sans text-stone-500">Your Letter Content</label>
            <textarea
              rows={8}
              placeholder="Dear love, tonight as the city calms down..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mt-1 p-4 rounded-2xl bg-white/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-base font-serif leading-relaxed focus:ring-2 focus:ring-amber-400 focus:outline-none"
              required
            />
          </div>

          {/* Mood Selector */}
          <div className="space-y-2">
            <label className="text-xs font-sans text-stone-500">Tonight's Mood</label>
            <div className="flex flex-wrap gap-2">
              {moods.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans border transition-all ${
                    mood === m
                      ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                      : "bg-white/80 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Attachments (Song, Book, Anime, Photo) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-sans text-xs">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
              <label className="font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-500" /> Listening to (Spotify Song)
              </label>
              <input
                type="text"
                placeholder="Song Title"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
              />
              <input
                type="text"
                placeholder="Artist"
                value={songArtist}
                onChange={(e) => setSongArtist(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
              <label className="font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-500" /> Reading (Book Quote)
              </label>
              <input
                type="text"
                placeholder="Book Title"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
              />
              <input
                type="text"
                placeholder="Author"
                value={bookAuthor}
                onChange={(e) => setBookAuthor(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
              <label className="font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-purple-500" /> Watching (Anime / Movie)
              </label>
              <input
                type="text"
                placeholder="Anime or Movie Title"
                value={animeTitle}
                onChange={(e) => setAnimeTitle(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
              <label className="font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-rose-500" /> Attach Photo (URL)
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-400 font-sans">
              Written with love from {currentUser}
            </span>

            <button
              type="submit"
              disabled={isSubmitted}
              className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-sans text-xs font-medium flex items-center gap-2 shadow-md"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Letter Placed in Envelope!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Seal & Send Letter ✉️
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* READ TAB */}
      {tab === "read" && (
        <div className="space-y-6">
          {letters.map((letter) => (
            <div
              key={letter.id}
              className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5 border border-stone-200/80 dark:border-stone-800"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-stone-200/60 dark:border-stone-800 pb-3">
                <div>
                  <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-medium">
                    {letter.mood}
                  </span>
                  <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-100 font-medium mt-1">
                    {letter.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-sans mt-0.5">
                    Written by {letter.author} on {letter.dateStr} at {letter.writtenAt}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="prose prose-stone dark:prose-invert font-serif leading-relaxed text-base whitespace-pre-line text-stone-700 dark:text-stone-300">
                {letter.content}
              </div>

              {/* Photos */}
              {letter.photoUrls && letter.photoUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {letter.photoUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Memory"
                      className="w-full h-48 object-cover rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs"
                    />
                  ))}
                </div>
              )}

              {/* Attachments Footer */}
              <div className="flex flex-wrap gap-3 pt-2 text-xs font-sans text-stone-600 dark:text-stone-300">
                {letter.listeningTo && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1">
                    🎵 {letter.listeningTo.songTitle} - {letter.listeningTo.artist}
                  </span>
                )}
                {letter.readingBook && (
                  <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 flex items-center gap-1">
                    📖 {letter.readingBook.title}
                  </span>
                )}
                {letter.watchingAnime && (
                  <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 flex items-center gap-1">
                    🎬 {letter.watchingAnime.title}
                  </span>
                )}
              </div>

              {/* Reactions & Replies */}
              <div className="border-t border-stone-200/60 dark:border-stone-800 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {(["❤️", "🥹", "😂", "🤍"] as const).map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => reactToLetter(letter.id, emoji)}
                        className="text-lg p-1.5 rounded-xl bg-white/80 dark:bg-stone-800 hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {letter.reactions.length > 0 && (
                    <div className="flex gap-1.5 text-xs font-sans">
                      {letter.reactions.map((r, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200">
                          {r.emoji} {r.by}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Replies Thread */}
                {letter.replies.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {letter.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="p-3 rounded-2xl bg-amber-50/70 dark:bg-stone-800/70 border border-amber-200/50 dark:border-stone-700 text-xs font-sans"
                      >
                        <span className="font-semibold text-stone-800 dark:text-stone-200">{reply.sender}: </span>
                        <span className="text-stone-700 dark:text-stone-300">{reply.text}</span>
                        <span className="text-[10px] text-stone-400 block mt-1">{reply.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder={`Reply to ${letter.author}...`}
                    value={replyText[letter.id] || ""}
                    onChange={(e) => setReplyText({ ...replyText, [letter.id]: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-xl bg-white/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    onClick={() => handleSendReply(letter.id)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-sans font-medium hover:bg-amber-600"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

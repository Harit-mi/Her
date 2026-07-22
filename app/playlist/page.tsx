"use client";

import React, { useState } from "react";
import { useSunriseStore } from "@/lib/store";
import { Music, Plus, Play, Pause, Sparkles, X } from "lucide-react";
import confetti from "canvas-confetti";

export default function PlaylistPage() {
  const { playlist, addPlaylistSong, currentUser } = useSunriseStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [note, setNote] = useState("");
  const [albumArt, setAlbumArt] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;

    addPlaylistSong({
      title: title.trim(),
      artist: artist.trim(),
      note: note.trim(),
      albumArt: albumArt.trim() || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
    });

    setTitle("");
    setArtist("");
    setNote("");
    setAlbumArt("");
    setShowAddModal(false);
    confetti({ particleCount: 30, spread: 50 });
  };

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium flex items-center gap-2">
            <Music className="w-7 h-7 text-emerald-500" /> Shared Spotify Playlist 🎵
          </h1>
          <p className="text-xs font-sans text-[#7A7267]">
            Songs that remind us of each other across Gujarat & Maharashtra.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Shared Song
        </button>
      </div>

      <div className="space-y-4">
        {playlist.map((song) => {
          const isPlaying = playingId === song.id;
          return (
            <div
              key={song.id}
              className="glass-panel p-5 rounded-3xl flex items-center justify-between gap-4 border border-[#EDE0D0] dark:border-[#3D352E]"
            >
              <div className="flex items-center gap-4">
                <img
                  src={song.albumArt}
                  alt={song.title}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#EDE0D0] dark:border-[#3D352E] shadow-sm"
                />

                <div className="space-y-1 font-sans">
                  <h3 className="text-base font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium">
                    {song.title}
                  </h3>
                  <p className="text-xs text-[#7A7267]">{song.artist}</p>
                  {song.note && <p className="text-[11px] text-[#D4A857] italic">"{song.note}"</p>}
                </div>
              </div>

              <button
                onClick={() => togglePlay(song.id)}
                className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-all shrink-0 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
            </div>
          );
        })}
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
              <Sparkles className="w-5 h-5 text-emerald-500" /> Add Song to Playlist
            </h3>

            <form onSubmit={handleAddSong} className="space-y-3">
              <div>
                <label className="text-[#7A7267]">Song Title</label>
                <input
                  type="text"
                  placeholder="e.g. Tum Se Hi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E]"
                  required
                />
              </div>

              <div>
                <label className="text-[#7A7267]">Artist</label>
                <input
                  type="text"
                  placeholder="e.g. Pritam & Mohit Chauhan"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E]"
                  required
                />
              </div>

              <div>
                <label className="text-[#7A7267]">Personal Memory Note</label>
                <input
                  type="text"
                  placeholder="e.g. Played at Marine Drive, Mumbai..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-xs"
                >
                  Add Song 🎵
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

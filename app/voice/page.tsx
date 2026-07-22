"use client";

import React, { useState } from "react";
import { useSunriseStore } from "@/lib/store";
import VoiceRecorder from "@/components/VoiceRecorder";
import { Mic, Play, Pause, FastForward, Clock } from "lucide-react";

export default function VoicePage() {
  const { voiceNotes } = useSunriseStore();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [speed, setSpeed] = useState<number>(1.0);

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center gap-2">
          <Mic className="w-7 h-7 text-amber-500" /> Voice Letters Studio
        </h1>
        <p className="text-xs font-sans text-stone-500">
          Record cozy audio notes before sleep so your partner can listen in the morning.
        </p>
      </div>

      {/* Recording Studio Component */}
      <VoiceRecorder />

      {/* Saved Voice Letters Archive */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-serif text-stone-800 dark:text-stone-100 font-medium flex items-center justify-between">
          <span>Saved Voice Letters Archive</span>
          <button
            onClick={cycleSpeed}
            className="text-xs font-sans px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1"
          >
            <FastForward className="w-3 h-3 text-amber-500" /> Speed: {speed}x
          </button>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {voiceNotes.map((note) => {
            const isPlaying = playingId === note.id;
            return (
              <div
                key={note.id}
                className="glass-panel p-5 rounded-3xl space-y-3 border border-stone-200/80 dark:border-stone-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-sans uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium">
                      By {note.author}
                    </span>
                    <h3 className="text-base font-serif text-stone-800 dark:text-stone-100 font-medium mt-1">
                      {note.title}
                    </h3>
                    <p className="text-[11px] font-sans text-stone-400">{note.timestamp}</p>
                  </div>

                  <button
                    onClick={() => togglePlay(note.id)}
                    className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-all"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                </div>

                {/* Animated Waveform bars */}
                <div className="h-10 bg-stone-100 dark:bg-stone-900 rounded-xl p-2 flex items-center gap-1 overflow-hidden">
                  {(note.waveform || [20, 50, 70, 40, 60, 85, 90, 65, 30, 70]).map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlaying ? "bg-amber-500 animate-pulse" : "bg-amber-300/60 dark:bg-amber-700/60"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] font-sans text-stone-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {note.duration} seconds
                  </span>
                  <span>{note.isMorningRead ? "Listened ✓" : "New Audio"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

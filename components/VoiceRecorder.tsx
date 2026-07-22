"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, FastForward, Trash2, CheckCircle2 } from "lucide-react";
import { useSunriseStore } from "@/lib/store";

export default function VoiceRecorder() {
  const { addVoiceNote, currentUser } = useSunriseStore();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [title, setTitle] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animate mock visualizer wave when recording
  useEffect(() => {
    let animationFrameId: number;
    if (isRecording && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#D9A752";
          const bars = 30;
          const width = canvas.width / bars;
          for (let i = 0; i < bars; i++) {
            const height = Math.random() * (canvas.height - 10) + 10;
            ctx.fillRect(i * width + 2, (canvas.height - height) / 2, width - 4, height);
          }
          animationFrameId = requestAnimationFrame(render);
        };
        render();
      }
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setIsSaved(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch {
      // Fallback mock recording for demo environment without mic access
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);

    if (!audioUrl) {
      setAudioUrl("mock_voice.webm");
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => setIsPlaying(true));
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
  };

  const handleSaveVoiceNote = () => {
    addVoiceNote({
      author: currentUser,
      title: title.trim() || `Voice Note from ${currentUser}`,
      duration: recordingTime || 32,
      timestamp: new Date().toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true, month: "short", day: "numeric" }),
      waveform: [20, 45, 60, 80, 75, 40, 90, 65, 30, 50, 85, 40, 60, 75, 30],
      isMorningRead: false,
    });
    setIsSaved(true);
    setTitle("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-5 border border-stone-200/80 dark:border-stone-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-serif font-medium text-stone-800 dark:text-stone-100">
            Voice Letter Recorder 🎙️
          </h3>
          <p className="text-xs font-sans text-stone-500">
            Record a cozy message for {currentUser === "Alex" ? "Sam" : "Alex"} to hear in the morning.
          </p>
        </div>
        {recordingTime > 0 && (
          <span className="font-mono text-sm px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
            {formatTime(recordingTime)}
          </span>
        )}
      </div>

      {/* Visualizer Canvas */}
      <div className="w-full h-20 bg-stone-100 dark:bg-stone-900 rounded-2xl flex items-center justify-center relative overflow-hidden border border-stone-200/60 dark:border-stone-800">
        {isRecording ? (
          <canvas ref={canvasRef} width={360} height={70} className="w-full h-full" />
        ) : (
          <div className="flex items-center gap-1">
            {[20, 45, 60, 80, 75, 40, 90, 65, 30, 50, 85, 40, 60, 75, 30].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="w-1.5 bg-amber-400/60 dark:bg-amber-600/60 rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Mic className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all animate-pulse"
          >
            <Square className="w-6 h-6" />
          </button>
        )}

        {audioUrl && !isRecording && (
          <>
            <button
              onClick={togglePlayback}
              className="w-12 h-12 rounded-full bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 flex items-center justify-center shadow-md hover:scale-105 transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={handleSpeedChange}
              className="px-3 py-1.5 rounded-full bg-stone-200 dark:bg-stone-800 text-xs font-mono text-stone-700 dark:text-stone-300 flex items-center gap-1 hover:bg-stone-300"
            >
              <FastForward className="w-3.5 h-3.5" /> {playbackSpeed}x
            </button>
          </>
        )}
      </div>

      {/* Save Title Form */}
      {audioUrl && !isRecording && (
        <div className="space-y-3 pt-2">
          <input
            type="text"
            placeholder="Title your voice letter (e.g. Goodnight Rain in Tokyo)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setAudioUrl(null);
                setRecordingTime(0);
              }}
              className="text-xs font-sans text-rose-500 flex items-center gap-1 hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" /> Discard
            </button>

            <button
              onClick={handleSaveVoiceNote}
              disabled={isSaved}
              className={`px-5 py-2 rounded-xl text-xs font-sans font-medium flex items-center gap-1.5 transition-all shadow-sm ${
                isSaved
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Saved Forever!
                </>
              ) : (
                "Save Voice Letter"
              )}
            </button>
          </div>
        </div>
      )}

      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} hidden />}
    </div>
  );
}

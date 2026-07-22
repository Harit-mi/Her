"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSunriseStore } from "@/lib/store";
import { PROFILES } from "@/lib/initialData";
import { Mic, Square, Play, Pause, Trash2, Send, Sparkles, Volume2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function VoiceRecorder() {
  const { addVoiceNote, currentUser } = useSunriseStore();
  const partnerProfile = PROFILES[currentUser === "Harit" ? "Ameera" : "Harit"];

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Recording Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Canvas visualizer animation loop
  useEffect(() => {
    if (!canvasRef.current || !isRecording) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 24;
      const width = canvas.width / bars;
      for (let i = 0; i < bars; i++) {
        const height = Math.random() * (canvas.height - 8) + 4;
        ctx.fillStyle = "#D4A857";
        ctx.fillRect(i * width + 2, (canvas.height - height) / 2, width - 4, height);
      }
      animId = requestAnimationFrame(drawWave);
    };
    drawWave();

    return () => cancelAnimationFrame(animId);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch {
      alert("Microphone access is required to record voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !recordedAudioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleSendVoiceNote = () => {
    if (!recordedAudioUrl) return;
    addVoiceNote({
      author: currentUser,
      title: `Voice Note for ${partnerProfile.name}`,
      duration: recordingTime || 15,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      audioUrl: recordedAudioUrl,
      waveform: [20, 45, 70, 90, 60, 40, 85, 100, 75, 50, 30, 65, 80, 55, 30, 45, 60, 75, 40, 20],
      isMorningRead: false,
    });

    setRecordedAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);

    confetti({
      particleCount: 35,
      spread: 50,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6 border border-[#EDE0D0] dark:border-[#3D352E]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#D4A857]" /> Voice Studio
          </h3>
          <p className="text-xs font-sans text-[#7A7267]">
            Record a cozy voice note for {partnerProfile.name} in {partnerProfile.city} 🇮🇳
          </p>
        </div>
        {recordingTime > 0 && (
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 font-semibold animate-pulse">
            ● {formatTime(recordingTime)}
          </span>
        )}
      </div>

      {/* Recording Visualizer Canvas */}
      {isRecording && (
        <div className="w-full h-16 rounded-2xl bg-[#EDE0D0]/40 dark:bg-[#2A241F] flex items-center justify-center p-2 border border-[#EDE0D0] dark:border-[#3D352E]">
          <canvas ref={canvasRef} width={280} height={40} className="w-full h-full" />
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {!isRecording && !recordedAudioUrl && (
          <button
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-[#D4A857] hover:bg-[#c39746] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Mic className="w-7 h-7" />
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
          >
            <Square className="w-6 h-6 fill-white" />
          </button>
        )}

        {recordedAudioUrl && (
          <div className="w-full space-y-4">
            <audio
              ref={audioRef}
              src={recordedAudioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/70 dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E]">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayback}
                  className="w-10 h-10 rounded-full bg-[#D4A857] text-white flex items-center justify-center shadow-md cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div>
                  <p className="text-xs font-sans font-semibold text-[#3A342C] dark:text-[#F7F3ED]">
                    Voice Letter ({formatTime(recordingTime)})
                  </p>
                  <p className="text-[10px] text-[#7A7267]">Ready to send</p>
                </div>
              </div>

              {/* Speed Controls */}
              <div className="flex items-center gap-1">
                {[1, 1.25, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                      playbackSpeed === speed
                        ? "bg-[#D4A857] text-white"
                        : "bg-[#EDE0D0] dark:bg-[#3D352E] text-[#7A7267]"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setRecordedAudioUrl(null);
                  setRecordingTime(0);
                }}
                className="flex-1 py-2.5 rounded-full border border-rose-300 text-rose-600 text-xs font-sans font-medium flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Discard
              </button>
              <button
                onClick={handleSendVoiceNote}
                className="flex-1 py-2.5 rounded-full bg-[#D4A857] text-white text-xs font-sans font-semibold flex items-center justify-center gap-1 shadow-md"
              >
                <Send className="w-4 h-4" /> Send Voice Note 🎙️
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

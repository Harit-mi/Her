"use client";

import React, { useState, useEffect } from "react";

interface LiveCountdownProps {
  targetDate: string;
}

export default function LiveCountdown({ targetDate }: LiveCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return <span className="animate-pulse">Loading...</span>;

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return <span className="text-amber-500 font-bold">Today! 🎉</span>;
  }

  return (
    <div className="flex items-center gap-1 font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">
      <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80">{timeLeft.days}d</span>
      <span>:</span>
      <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80">{timeLeft.hours}h</span>
      <span>:</span>
      <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80">{timeLeft.minutes}m</span>
      <span>:</span>
      <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-rose-500">{timeLeft.seconds}s</span>
    </div>
  );
}

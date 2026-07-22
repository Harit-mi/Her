"use client";

import React from "react";
import { useSunriseStore } from "@/lib/store";
import { PROFILES } from "@/lib/initialData";
import SunriseAnimation from "@/components/SunriseAnimation";
import RandomMemoryModal from "@/components/RandomMemoryModal";
import LiveCountdown from "@/components/LiveCountdown";
import SunriseSVGIllustration from "@/components/SunriseSVGIllustration";
import LoginModal from "@/components/LoginModal";
import Link from "next/link";
import {
  Mail,
  Sparkles,
  UtensilsCrossed,
  HeartHandshake,
  Gift,
  Clock,
  CheckCircle2,
  Circle,
  Calendar,
  CloudSun,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Home() {
  const {
    isLoggedIn,
    currentUser,
    unreadLetterForCurrent,
    dinners,
    setShowSunriseModal,
    setShowRandomMemoryModal,
    dailyMission,
    toggleMission,
    countdowns,
  } = useSunriseStore();

  if (!isLoggedIn) {
    return <LoginModal />;
  }

  const userProfile = PROFILES[currentUser] || PROFILES["Harit"];
  const partnerProfile = PROFILES[currentUser === "Harit" ? "Ameera" : "Harit"];

  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 5 && currentHour < 17;
  const greeting = isMorning ? "Good Morning, Sunshine ☀️" : "Good Evening, Sweetheart 🌙";

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const totalDinners = dinners.reduce((acc, curr) => Math.max(acc, curr.number), 0);

  const isMissionDone =
    currentUser === "Harit" ? dailyMission.completedByAlex : dailyMission.completedBySam;

  const handleMissionCheck = () => {
    toggleMission(currentUser);
    if (!isMissionDone) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8">
      {/* Home Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-sans text-[#7A7267] dark:text-[#B0A79C]">
            <Calendar className="w-3.5 h-3.5 text-[#D4A857]" /> {todayStr}
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-normal">
            {greeting}
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#7A7267] dark:text-[#B0A79C]">
            Private Space • {userProfile.city} ({userProfile.state}) ↔ {partnerProfile.city} ({partnerProfile.state}) 🇮🇳
          </p>
        </div>

        {/* Inter-State Live Weather Badges: Gujarat (Ahmedabad) & Maharashtra (Nashik) */}
        <div className="flex items-center gap-2 text-xs font-sans">
          <div className="glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-xs">
            <CloudSun className="w-4 h-4 text-[#D4A857]" />
            <div>
              <p className="font-medium text-[#3A342C] dark:text-[#F7F3ED]">
                Gujarat 🇮🇳 29°C
              </p>
              <p className="text-[10px] text-[#7A7267] dark:text-[#B0A79C]">Ahmedabad • Rain 🌧️</p>
            </div>
          </div>
          <div className="glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-xs">
            <CloudSun className="w-4 h-4 text-emerald-500" />
            <div>
              <p className="font-medium text-[#3A342C] dark:text-[#F7F3ED]">
                Maharashtra 🇮🇳 25°C
              </p>
              <p className="text-[10px] text-[#7A7267] dark:text-[#B0A79C]">Nashik • Pleasant Breeze 🍃</p>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Animated Sunrise Illustration & Status Card */}
      <div className="space-y-4">
        <SunriseSVGIllustration />

        <div className="glass-panel p-6 rounded-3xl text-center space-y-4 border border-[#EDE0D0] dark:border-[#3D352E]">
          <div className="w-12 h-12 rounded-full bg-[#EDE0D0]/60 dark:bg-[#3D352E] mx-auto flex items-center justify-center text-2xl shadow-inner">
            ✉️
          </div>

          <h2 className="text-xl sm:text-2xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium">
            {unreadLetterForCurrent ? "You have a new letter waiting." : "No new letter today, but someone is thinking about you."}
          </h2>

          {unreadLetterForCurrent ? (
            <button
              onClick={() => setShowSunriseModal(true)}
              className="px-6 py-3 rounded-full bg-[#D4A857] hover:bg-[#c39746] text-white font-sans text-xs font-semibold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Open Morning Sunrise Reveal
            </button>
          ) : (
            <Link
              href="/letter"
              className="px-6 py-3 rounded-full bg-[#3A342C] dark:bg-[#F7F3ED] text-white dark:text-[#3A342C] font-sans text-xs font-semibold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto inline-flex cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Write Tonight's Letter for {partnerProfile.name}
            </Link>
          )}
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setShowRandomMemoryModal(true)}
          className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:border-[#D4A857] hover:scale-[1.02] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#EDE0D0]/80 dark:bg-[#3D352E] text-[#D4A857] flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
            ✨
          </div>
          <span className="text-xs font-serif font-medium text-[#3A342C] dark:text-[#F7F3ED]">
            Remind Me of Us
          </span>
          <span className="text-[10px] font-sans text-[#7A7267]">Random Memory</span>
        </button>

        <Link
          href="/dinner"
          className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:border-[#D4A857] hover:scale-[1.02] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
            🍷
          </div>
          <span className="text-xs font-serif font-medium text-[#3A342C] dark:text-[#F7F3ED]">
            Dinner Journal
          </span>
          <span className="text-[10px] font-sans text-[#7A7267]">Dinner #{totalDinners}</span>
        </Link>

        <Link
          href="/gratitude"
          className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:border-[#D4A857] hover:scale-[1.02] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
            🫙
          </div>
          <span className="text-xs font-serif font-medium text-[#3A342C] dark:text-[#F7F3ED]">
            Gratitude Jar
          </span>
          <span className="text-[10px] font-sans text-[#7A7267]">Drop a note</span>
        </Link>

        <Link
          href="/surprises"
          className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:border-[#D4A857] hover:scale-[1.02] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
            🎁
          </div>
          <span className="text-xs font-serif font-medium text-[#3A342C] dark:text-[#F7F3ED]">
            Surprise Box
          </span>
          <span className="text-[10px] font-sans text-[#7A7267]">Hidden gifts</span>
        </Link>
      </div>

      {/* Dinner Counter Banner */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#EDE0D0] dark:border-[#3D352E]">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE0D0] dark:bg-[#3D352E] text-[#D4A857] flex items-center justify-center text-2xl shrink-0">
            🍽️
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-[#D4A857] font-sans font-semibold">
              Shared Meals Milestone
            </p>
            <h3 className="text-xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-normal">
              {totalDinners > 0
                ? `"We've shared ${totalDinners} dinners together."`
                : "Log your very first shared dinner date together!"}
            </h3>
            <p className="text-xs text-[#7A7267] dark:text-[#B0A79C] font-sans mt-0.5">
              Cooked or ordered across Ahmedabad & Nashik over video calls.
            </p>
          </div>
        </div>

        <Link
          href="/dinner"
          className="px-5 py-2 rounded-full bg-[#D4A857] hover:bg-[#c39746] text-white text-xs font-sans font-semibold shrink-0 shadow-xs cursor-pointer"
        >
          Log Tonight's Dinner
        </Link>
      </div>

      {/* Daily Mission Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4A857]" />
            <h3 className="text-lg font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium">
              Today's Couple Mission
            </h3>
          </div>
          <span className="text-xs font-sans text-[#7A7267]">{dailyMission.date}</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#EDE0D0]/40 dark:bg-[#3D352E]/40 border border-[#EDE0D0] dark:border-[#3D352E] flex items-start gap-3">
          <button onClick={handleMissionCheck} className="mt-0.5 text-[#D4A857] cursor-pointer">
            {isMissionDone ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
            ) : (
              <Circle className="w-5 h-5 text-stone-400 hover:text-[#D4A857] transition-colors" />
            )}
          </button>
          <div className="flex-1">
            <p className={`text-sm font-sans ${isMissionDone ? "line-through text-stone-400" : "text-[#3A342C] dark:text-[#F7F3ED]"}`}>
              {dailyMission.text}
            </p>
            <p className="text-[11px] font-sans text-[#7A7267] mt-1">
              Status: Harit ({dailyMission.completedByAlex ? "Done ✓" : "Pending"}) • Ameera ({dailyMission.completedBySam ? "Done ✓" : "Pending"})
            </p>
          </div>
        </div>
      </div>

      {/* Live Countdown Cards */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D4A857]" /> Live Upcoming Countdowns
          </h3>
          <Link href="/capsules" className="text-xs text-[#D4A857] hover:underline">
            View All Capsules
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {countdowns.map((cd) => (
            <div
              key={cd.id}
              className="p-4 rounded-2xl bg-white/70 dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] space-y-2"
            >
              <div className="text-2xl">{cd.icon}</div>
              <h4 className="text-xs font-sans font-medium text-[#3A342C] dark:text-[#F7F3ED] truncate">
                {cd.title}
              </h4>
              <LiveCountdown targetDate={cd.targetDate} />
            </div>
          ))}
        </div>
      </div>

      {/* Sunrise & Random Memory Modals */}
      <SunriseAnimation />
      <RandomMemoryModal />
    </div>
  );
}

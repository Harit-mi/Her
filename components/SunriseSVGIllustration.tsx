"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SunriseSVGIllustration() {
  return (
    <div className="relative w-full h-48 sm:h-56 rounded-3xl overflow-hidden glass-panel flex items-center justify-center border border-[#EDE0D0] dark:border-[#3D352E]">
      <svg className="w-full h-full" viewBox="0 0 600 240" fill="none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#EDE0D0" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#F9ECE0" stopOpacity="1" />
            <stop offset="100%" stopColor="#FAF6F0" stopOpacity="1" />
          </linearGradient>

          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4A857" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#F5C06B" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FAF6F0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky Background */}
        <rect width="600" height="240" fill="url(#skyGrad)" />

        {/* Animated Horizon Mountains Curve */}
        <path
          d="M -20,200 Q 150,140 300,180 T 620,160 L 620,240 L -20,240 Z"
          fill="#EDE0D0"
          opacity="0.6"
        />

        {/* Rising Sun */}
        <motion.circle
          cx="300"
          cy="150"
          r="48"
          fill="#D4A857"
          initial={{ cy: 200, opacity: 0.5 }}
          animate={{ cy: 120, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Sun Glow Overlay */}
        <motion.circle
          cx="300"
          cy="120"
          r="100"
          fill="url(#sunGlow)"
          initial={{ scale: 0.8, opacity: 0.3 }}
          animate={{ scale: 1.2, opacity: 0.8 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Forefront Soft Hills */}
        <path
          d="M -20,210 Q 200,170 400,210 T 620,190 L 620,240 L -20,240 Z"
          fill="#3A342C"
          opacity="0.12"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
        <span className="text-xs uppercase tracking-widest text-[#D4A857] font-semibold font-sans">
          Morning Horizon • Gujarat 🇮🇳 & Maharashtra 🇮🇳
        </span>
        <h3 className="text-xl sm:text-2xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-normal mt-1">
          "Written while you were asleep."
        </h3>
      </div>
    </div>
  );
}

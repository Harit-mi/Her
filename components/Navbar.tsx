"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Mail,
  UtensilsCrossed,
  BookOpen,
  Image as ImageIcon,
  HeartHandshake,
  Mic,
  MapPin,
  Sparkles,
  Gift,
  Clock,
  BarChart3,
  Search,
  Settings,
  Star,
  Tv,
  Music,
} from "lucide-react";
import { useSunriseStore } from "@/lib/store";

export default function Navbar() {
  const pathname = usePathname();
  const { unreadLetterForCurrent } = useSunriseStore();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/letter", label: "Letter", icon: Mail, badge: !!unreadLetterForCurrent },
    { href: "/dinner", label: "Dinners", icon: UtensilsCrossed },
    { href: "/diary", label: "Diary", icon: BookOpen },
    { href: "/timeline", label: "Timeline", icon: ImageIcon },
    { href: "/gratitude", label: "Jar", icon: HeartHandshake },
    { href: "/voice", label: "Voice", icon: Mic },
    { href: "/scrapbook", label: "Scrapbook", icon: Sparkles },
    { href: "/map", label: "Map", icon: MapPin },
    { href: "/wishwall", label: "Wishes", icon: Star },
    { href: "/quotes", label: "Quotes", icon: BookOpen },
    { href: "/anime", label: "Anime", icon: Tv },
    { href: "/playlist", label: "Music", icon: Music },
    { href: "/capsules", label: "Capsules", icon: Clock },
    { href: "/surprises", label: "Surprise", icon: Gift },
    { href: "/stats", label: "Stats", icon: BarChart3 },
    { href: "/search", label: "Search", icon: Search },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-5xl w-[95vw] glass-nav rounded-2xl p-1.5 shadow-xl border border-[#EDE0D0]/80 dark:border-[#3D352E]/80 transition-all">
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-1 px-1 py-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center min-w-[52px] py-1.5 px-2 rounded-xl transition-all font-sans text-[11px] ${
                isActive
                  ? "bg-[#EDE0D0] text-[#3A342C] dark:bg-[#3D352E] dark:text-[#F7F3ED] font-medium shadow-xs"
                  : "text-[#7A7267] dark:text-[#B0A79C] hover:text-[#3A342C] dark:hover:text-[#F7F3ED]"
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? "text-[#D4A857]" : ""}`} />
              <span className="truncate max-w-[48px] text-[10px]">{item.label}</span>

              {/* Notification Badge */}
              {item.badge && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#D4A857] animate-ping" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

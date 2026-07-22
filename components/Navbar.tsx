"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Mail,
  UtensilsCrossed,
  HeartHandshake,
  Mic,
  MapPin,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import { useSunriseStore } from "@/lib/store";

export default function Navbar() {
  const pathname = usePathname();
  const { unreadLetterForCurrent } = useSunriseStore();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/letter", label: "Letter", icon: Mail, badge: !!unreadLetterForCurrent },
    { href: "/dinner", label: "Dinners", icon: UtensilsCrossed },
    { href: "/gratitude", label: "Jar", icon: HeartHandshake },
    { href: "/voice", label: "Voice", icon: Mic },
    { href: "/timeline", label: "Timeline", icon: ImageIcon },
    { href: "/map", label: "Map", icon: MapPin },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[94vw] glass-nav rounded-full p-1.5 shadow-xl border border-[#EDE0D0]/80 dark:border-[#3D352E]/80 transition-all">
      <div className="flex items-center justify-around px-2 py-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all font-sans text-[11px] ${
                isActive
                  ? "bg-[#EDE0D0] text-[#3A342C] dark:bg-[#3D352E] dark:text-[#F7F3ED] font-medium shadow-xs"
                  : "text-[#7A7267] dark:text-[#B0A79C] hover:text-[#3A342C] dark:hover:text-[#F7F3ED]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#D4A857]" : ""}`} />
              <span className="truncate max-w-[48px] text-[10px] hidden sm:inline mt-0.5">{item.label}</span>

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

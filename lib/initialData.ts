import {
  UserProfile,
  Letter,
  DinnerItem,
  GratitudeNote,
  MemoryItem,
  VoiceNoteItem,
  WishItem,
  SurpriseItem,
  CountdownItem,
  TimeCapsuleItem,
  SleepLogItem,
  BookQuoteItem,
  AnimeItem,
  PlaylistSongItem,
  DailyMissionItem,
} from "./types";

export const PROFILES: Record<"Harit" | "Ameera", UserProfile> = {
  Harit: {
    id: "Harit",
    name: "Harit",
    partnerName: "Ameera",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    flag: "🇮🇳",
    timezone: "Asia/Kolkata",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  Ameera: {
    id: "Ameera",
    name: "Ameera",
    partnerName: "Harit",
    city: "Nashik",
    state: "Maharashtra",
    country: "India",
    flag: "🇮🇳",
    timezone: "Asia/Kolkata",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
};

// Clean initial start state for Harit & Ameera
export const INITIAL_LETTERS: Letter[] = [];

export const INITIAL_DINNERS: DinnerItem[] = [];

export const INITIAL_GRATITUDES: GratitudeNote[] = [];

export const INITIAL_MEMORIES: MemoryItem[] = [];

export const INITIAL_VOICE_NOTES: VoiceNoteItem[] = [];

export const INITIAL_WISHES: WishItem[] = [
  {
    id: "wish-1",
    title: "Reunion trip together in Mumbai 🚆",
    category: "Travel",
    completed: false,
    addedBy: "Ameera",
  },
  {
    id: "wish-2",
    title: "Explore Gir National Park in Gujarat 🦁",
    category: "Travel",
    completed: false,
    addedBy: "Harit",
  },
];

export const INITIAL_SURPRISES: SurpriseItem[] = [];

export const INITIAL_COUNTDOWNS: CountdownItem[] = [
  {
    id: "cd-1",
    title: "Reunion in Mumbai 🚆",
    targetDate: "2026-08-15T10:00:00Z",
    category: "Visit",
    icon: "🚆",
  },
];

export const INITIAL_TIME_CAPSULES: TimeCapsuleItem[] = [];

export const INITIAL_SLEEP_LOGS: SleepLogItem[] = [];

export const INITIAL_BOOK_QUOTES: BookQuoteItem[] = [];

export const INITIAL_ANIME: AnimeItem[] = [];

export const INITIAL_PLAYLIST: PlaylistSongItem[] = [];

export const INITIAL_DAILY_MISSION: DailyMissionItem = {
  id: "mission-today",
  date: "July 23, 2026",
  text: "Send your partner a 10-second voice note of the rain or street sounds outside your balcony.",
  completedByAlex: false,
  completedBySam: false,
};

import fs from "fs";
import path from "path";
import { getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
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
import { PROFILES, INITIAL_WISHES, INITIAL_COUNTDOWNS, INITIAL_DAILY_MISSION } from "./initialData";

const DB_PATH = path.join(process.cwd(), "data", "sunrise_db.json");

export interface DatabaseSchema {
  profiles: Record<"Harit" | "Ameera", UserProfile>;
  letters: Letter[];
  dinners: DinnerItem[];
  gratitudes: GratitudeNote[];
  memories: MemoryItem[];
  voiceNotes: VoiceNoteItem[];
  wishes: WishItem[];
  surprises: SurpriseItem[];
  countdowns: CountdownItem[];
  timeCapsules: TimeCapsuleItem[];
  sleepLogs: SleepLogItem[];
  bookQuotes: BookQuoteItem[];
  animeList: AnimeItem[];
  playlist: PlaylistSongItem[];
  dailyMission: DailyMissionItem;
}

export const SEED_DATA: DatabaseSchema = {
  profiles: PROFILES,
  letters: [],
  dinners: [],
  gratitudes: [],
  memories: [],
  voiceNotes: [],
  wishes: INITIAL_WISHES,
  surprises: [],
  countdowns: INITIAL_COUNTDOWNS,
  timeCapsules: [],
  sleepLogs: [],
  bookQuotes: [],
  animeList: [],
  playlist: [],
  dailyMission: INITIAL_DAILY_MISSION,
};

declare global {
  // eslint-disable-next-line no-var
  var __sunrise_db_cache: DatabaseSchema | undefined;
}

export function sanitizeDatabase(data: DatabaseSchema): DatabaseSchema {
  // Filter strictly legacy initial seed letter-1 and letter-2 by ID only
  const cleanLetters = (data.letters || []).filter((l) => l.id !== "letter-1" && l.id !== "letter-2");

  // Enforce profiles for Harit (Ahmedabad, Gujarat) & Ameera (Nashik, Maharashtra)
  const cleanProfiles = {
    Harit: { ...PROFILES.Harit },
    Ameera: { ...PROFILES.Ameera, city: "Nashik", state: "Maharashtra" },
  };

  const cleanCountdowns = (data.countdowns || INITIAL_COUNTDOWNS).map((cd) => {
    if (cd.title.toLowerCase().includes("nashik")) {
      return { ...cd, title: "Reunion in Mumbai 🚆", targetDate: "2026-08-15T10:00:00Z" };
    }
    return cd;
  });

  return {
    ...data,
    profiles: cleanProfiles,
    letters: cleanLetters,
    countdowns: cleanCountdowns,
  };
}

export function getDatabase(): DatabaseSchema {
  if (globalThis.__sunrise_db_cache) {
    return sanitizeDatabase(globalThis.__sunrise_db_cache);
  }

  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(SEED_DATA, null, 2), "utf-8");
      globalThis.__sunrise_db_cache = SEED_DATA;
      return SEED_DATA;
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(data);
    const sanitized = sanitizeDatabase(parsed);
    globalThis.__sunrise_db_cache = sanitized;
    return sanitized;
  } catch {
    globalThis.__sunrise_db_cache = SEED_DATA;
    return SEED_DATA;
  }
}

export function saveDatabase(data: DatabaseSchema): void {
  const sanitized = sanitizeDatabase(data);
  globalThis.__sunrise_db_cache = sanitized;
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(sanitized, null, 2), "utf-8");
  } catch {
    // Non-blocking in serverless environments
  }
}

export async function getCloudDatabase(): Promise<DatabaseSchema> {
  if (getApps().length) {
    try {
      const adminDb = getFirestore();
      const docRef = adminDb.collection("app_state").doc("sunrise_main");
      const snap = await docRef.get();
      if (snap.exists) {
        const rawData = snap.data() as DatabaseSchema;
        const merged: DatabaseSchema = sanitizeDatabase({
          ...SEED_DATA,
          ...rawData,
          letters: rawData.letters || [],
          dinners: rawData.dinners || [],
          gratitudes: rawData.gratitudes || [],
          memories: rawData.memories || [],
          voiceNotes: rawData.voiceNotes || [],
          wishes: rawData.wishes || INITIAL_WISHES,
          surprises: rawData.surprises || [],
          countdowns: rawData.countdowns || INITIAL_COUNTDOWNS,
          timeCapsules: rawData.timeCapsules || [],
          sleepLogs: rawData.sleepLogs || [],
          bookQuotes: rawData.bookQuotes || [],
          animeList: rawData.animeList || [],
          playlist: rawData.playlist || [],
          dailyMission: rawData.dailyMission || INITIAL_DAILY_MISSION,
        });

        globalThis.__sunrise_db_cache = merged;

        if (rawData.letters && rawData.letters.some((l) => l.id === "letter-1" || l.id === "letter-2")) {
          await saveCloudDatabase(merged);
        }

        return merged;
      }
    } catch (err) {
      console.error("Firestore Admin read notice:", err);
    }
  }
  return getDatabase();
}

export async function saveCloudDatabase(data: DatabaseSchema): Promise<void> {
  const sanitized = sanitizeDatabase(data);
  saveDatabase(sanitized);
  if (getApps().length) {
    try {
      const adminDb = getFirestore();
      const docRef = adminDb.collection("app_state").doc("sunrise_main");
      await docRef.set(sanitized, { merge: true });
    } catch (err) {
      console.error("Firestore Admin save notice:", err);
    }
  }
}

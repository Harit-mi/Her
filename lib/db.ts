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
import { PROFILES, INITIAL_DAILY_MISSION } from "./initialData";

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
  wishes: [],
  surprises: [],
  countdowns: [],
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
  // Filter out all legacy mock/seed items across all collections
  const cleanLetters = (data.letters || []).filter((l) => l.id !== "letter-1" && l.id !== "letter-2");
  const cleanDinners = (data.dinners || []).filter((d) => !d.id.startsWith("dinner-18"));
  const cleanGratitudes = (data.gratitudes || []).filter((g) => g.id !== "gratitude-1" && g.id !== "gratitude-2");
  const cleanMemories = (data.memories || []).filter((m) => m.id !== "mem-1");
  const cleanVoiceNotes = (data.voiceNotes || []).filter((v) => v.id !== "voice-1" && v.id !== "voice-2");
  const cleanWishes = (data.wishes || []).filter((w) => w.id !== "wish-1" && w.id !== "wish-2");
  const cleanSurprises = (data.surprises || []).filter((s) => s.id !== "surp-1");
  const cleanCountdowns = (data.countdowns || []).filter((c) => c.id !== "cd-1" && c.id !== "cd-2");
  const cleanTimeCapsules = (data.timeCapsules || []).filter((t) => t.id !== "tc-1");
  const cleanSleepLogs = (data.sleepLogs || []).filter((s) => s.id !== "sleep-1");
  const cleanBookQuotes = (data.bookQuotes || []).filter((b) => b.id !== "quote-1");
  const cleanAnimeList = (data.animeList || []).filter((a) => a.id !== "anime-1");
  const cleanPlaylist = (data.playlist || []).filter((p) => p.id !== "song-1");

  // Enforce profiles for Harit (Ahmedabad, Gujarat) & Ameera (Nashik, Maharashtra)
  const cleanProfiles = {
    Harit: { ...PROFILES.Harit },
    Ameera: { ...PROFILES.Ameera, city: "Nashik", state: "Maharashtra" },
  };

  return {
    ...data,
    profiles: cleanProfiles,
    letters: cleanLetters,
    dinners: cleanDinners,
    gratitudes: cleanGratitudes,
    memories: cleanMemories,
    voiceNotes: cleanVoiceNotes,
    wishes: cleanWishes,
    surprises: cleanSurprises,
    countdowns: cleanCountdowns,
    timeCapsules: cleanTimeCapsules,
    sleepLogs: cleanSleepLogs,
    bookQuotes: cleanBookQuotes,
    animeList: cleanAnimeList,
    playlist: cleanPlaylist,
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
          wishes: rawData.wishes || [],
          surprises: rawData.surprises || [],
          countdowns: rawData.countdowns || [],
          timeCapsules: rawData.timeCapsules || [],
          sleepLogs: rawData.sleepLogs || [],
          bookQuotes: rawData.bookQuotes || [],
          animeList: rawData.animeList || [],
          playlist: rawData.playlist || [],
          dailyMission: rawData.dailyMission || INITIAL_DAILY_MISSION,
        });

        globalThis.__sunrise_db_cache = merged;

        // Persist clean state back to Firestore if legacy mock items were sanitized
        await saveCloudDatabase(merged);

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

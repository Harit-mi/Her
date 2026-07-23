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

export function getDatabase(): DatabaseSchema {
  if (globalThis.__sunrise_db_cache) {
    return globalThis.__sunrise_db_cache;
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
    globalThis.__sunrise_db_cache = parsed;
    return parsed;
  } catch {
    globalThis.__sunrise_db_cache = SEED_DATA;
    return SEED_DATA;
  }
}

export function saveDatabase(data: DatabaseSchema): void {
  globalThis.__sunrise_db_cache = data;
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
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
        const data = snap.data() as DatabaseSchema;
        const merged: DatabaseSchema = {
          ...SEED_DATA,
          ...data,
          letters: data.letters || [],
          dinners: data.dinners || [],
          gratitudes: data.gratitudes || [],
          memories: data.memories || [],
          voiceNotes: data.voiceNotes || [],
          wishes: data.wishes || INITIAL_WISHES,
          surprises: data.surprises || [],
          countdowns: data.countdowns || INITIAL_COUNTDOWNS,
          timeCapsules: data.timeCapsules || [],
          sleepLogs: data.sleepLogs || [],
          bookQuotes: data.bookQuotes || [],
          animeList: data.animeList || [],
          playlist: data.playlist || [],
          dailyMission: data.dailyMission || INITIAL_DAILY_MISSION,
        };
        globalThis.__sunrise_db_cache = merged;
        return merged;
      }
    } catch (err) {
      console.error("Firestore Admin read notice:", err);
    }
  }
  return getDatabase();
}

export async function saveCloudDatabase(data: DatabaseSchema): Promise<void> {
  saveDatabase(data);
  if (getApps().length) {
    try {
      const adminDb = getFirestore();
      const docRef = adminDb.collection("app_state").doc("sunrise_main");
      await docRef.set(data, { merge: true });
    } catch (err) {
      console.error("Firestore Admin save notice:", err);
    }
  }
}

import fs from "fs";
import path from "path";
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

export function getDatabase(): DatabaseSchema {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(SEED_DATA, null, 2), "utf-8");
      return SEED_DATA;
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return SEED_DATA;
  }
}

export function saveDatabase(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write database file:", err);
  }
}

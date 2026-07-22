"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
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
  Reaction,
} from "./types";
import {
  PROFILES,
  INITIAL_LETTERS,
  INITIAL_DINNERS,
  INITIAL_GRATITUDES,
  INITIAL_MEMORIES,
  INITIAL_VOICE_NOTES,
  INITIAL_WISHES,
  INITIAL_SURPRISES,
  INITIAL_COUNTDOWNS,
  INITIAL_TIME_CAPSULES,
  INITIAL_SLEEP_LOGS,
  INITIAL_BOOK_QUOTES,
  INITIAL_ANIME,
  INITIAL_PLAYLIST,
  INITIAL_DAILY_MISSION,
} from "./initialData";

interface SunriseContextType {
  // Auth state
  isLoggedIn: boolean;
  loggedInUser: UserRole;
  currentUser: UserRole;
  setCurrentUser: (user: UserRole) => void;
  login: (user: UserRole) => void;
  logout: () => void;

  theme: "light" | "dark";
  toggleTheme: () => void;
  fontStyle: "serif" | "sans";
  setFontStyle: (font: "serif" | "sans") => void;
  
  // Sunrise Morning Reveal State
  showSunriseModal: boolean;
  setShowSunriseModal: (show: boolean) => void;
  showRandomMemoryModal: boolean;
  setShowRandomMemoryModal: (show: boolean) => void;

  // Data collections
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

  // Mutators
  addLetter: (letter: Omit<Letter, "id" | "isRead" | "reactions" | "replies">) => void;
  markLetterRead: (letterId: string) => void;
  reactToLetter: (letterId: string, emoji: Reaction["emoji"]) => void;
  replyToLetter: (letterId: string, text: string) => void;

  addDinner: (dinner: Omit<DinnerItem, "id" | "number">) => void;
  addGratitude: (text: string, color?: string) => void;
  addMemory: (memory: Omit<MemoryItem, "id">) => void;
  addVoiceNote: (voice: Omit<VoiceNoteItem, "id">) => void;
  toggleWish: (wishId: string) => void;
  addWish: (title: string, category: WishItem["category"]) => void;
  openSurprise: (surpriseId: string) => void;
  addSurprise: (surprise: Omit<SurpriseItem, "id" | "isOpened">) => void;
  addCountdown: (item: Omit<CountdownItem, "id">) => void;
  addTimeCapsule: (item: Omit<TimeCapsuleItem, "id" | "isUnlocked">) => void;
  logSleep: (log: Omit<SleepLogItem, "id">) => void;
  addBookQuote: (item: Omit<BookQuoteItem, "id" | "dateAdded" | "addedBy">) => void;
  addAnime: (item: Omit<AnimeItem, "id">) => void;
  addPlaylistSong: (song: Omit<PlaylistSongItem, "id" | "addedBy">) => void;
  toggleMission: (user: UserRole) => void;
  resetAllData: () => void;

  // Helpers
  unreadLetterForCurrent: Letter | undefined;
  latestLetter: Letter;
  daysTogether: number;
}

const SunriseContext = createContext<SunriseContextType | undefined>(undefined);

export function SunriseProvider({ children }: { children: React.ReactNode }) {
  // Security Default: Unauthenticated by default
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<UserRole>("Harit");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontStyle, setFontStyle] = useState<"serif" | "sans">("serif");
  const [showSunriseModal, setShowSunriseModal] = useState<boolean>(false);
  const [showRandomMemoryModal, setShowRandomMemoryModal] = useState<boolean>(false);

  // Data state (starts clean with Reunion in Mumbai)
  const [letters, setLetters] = useState<Letter[]>(INITIAL_LETTERS);
  const [dinners, setDinners] = useState<DinnerItem[]>(INITIAL_DINNERS);
  const [gratitudes, setGratitudes] = useState<GratitudeNote[]>(INITIAL_GRATITUDES);
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNoteItem[]>(INITIAL_VOICE_NOTES);
  const [wishes, setWishes] = useState<WishItem[]>(INITIAL_WISHES);
  const [surprises, setSurprises] = useState<SurpriseItem[]>(INITIAL_SURPRISES);
  const [countdowns, setCountdowns] = useState<CountdownItem[]>(INITIAL_COUNTDOWNS);
  const [timeCapsules, setTimeCapsules] = useState<TimeCapsuleItem[]>(INITIAL_TIME_CAPSULES);
  const [sleepLogs, setSleepLogs] = useState<SleepLogItem[]>(INITIAL_SLEEP_LOGS);
  const [bookQuotes, setBookQuotes] = useState<BookQuoteItem[]>(INITIAL_BOOK_QUOTES);
  const [animeList, setAnimeList] = useState<AnimeItem[]>(INITIAL_ANIME);
  const [playlist, setPlaylist] = useState<PlaylistSongItem[]>(INITIAL_PLAYLIST);
  const [dailyMission, setDailyMission] = useState<DailyMissionItem>(INITIAL_DAILY_MISSION);

  // Load state from localStorage safely on mount with automatic state migration
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("sunrise_auth_user");
      if (savedAuth === "Harit" || savedAuth === "Ameera") {
        setLoggedInUser(savedAuth);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }

      const savedTheme = localStorage.getItem("sunrise_theme");
      if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);

      const l = localStorage.getItem("sunrise_letters");
      if (l) setLetters(JSON.parse(l));

      const cd = localStorage.getItem("sunrise_countdowns");
      if (cd) {
        const parsed: CountdownItem[] = JSON.parse(cd);
        // Automatically migrate any old "Reunion in Nashik" entry to "Reunion in Mumbai 🚆"
        const updated = parsed.map((item) =>
          item.title.toLowerCase().includes("nashik")
            ? { ...item, title: "Reunion in Mumbai 🚆", targetDate: "2026-08-15T10:00:00Z" }
            : item
        );
        setCountdowns(updated);
      } else {
        setCountdowns(INITIAL_COUNTDOWNS);
      }
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      if (isLoggedIn) {
        localStorage.setItem("sunrise_auth_user", loggedInUser);
      } else {
        localStorage.removeItem("sunrise_auth_user");
      }
      localStorage.setItem("sunrise_theme", theme);
      localStorage.setItem("sunrise_letters", JSON.stringify(letters));
      localStorage.setItem("sunrise_countdowns", JSON.stringify(countdowns));
    } catch {
      // fallback
    }
  }, [isLoggedIn, loggedInUser, theme, letters, countdowns]);

  const login = (user: UserRole) => {
    setLoggedInUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("sunrise_auth_user");
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  // Mutators
  const addLetter = (letterData: Omit<Letter, "id" | "isRead" | "reactions" | "replies">) => {
    const newLetter: Letter = {
      ...letterData,
      id: `letter-${Date.now()}`,
      isRead: false,
      reactions: [],
      replies: [],
    };
    setLetters((prev) => [newLetter, ...prev]);
  };

  const markLetterRead = (letterId: string) => {
    setLetters((prev) =>
      prev.map((l) => (l.id === letterId ? { ...l, isRead: true } : l))
    );
  };

  const reactToLetter = (letterId: string, emoji: Reaction["emoji"]) => {
    const reactionObj: Reaction = {
      emoji,
      by: loggedInUser,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setLetters((prev) =>
      prev.map((l) =>
        l.id === letterId
          ? {
              ...l,
              reactions: [...l.reactions.filter((r) => r.by !== loggedInUser), reactionObj],
            }
          : l
      )
    );
  };

  const replyToLetter = (letterId: string, text: string) => {
    const replyObj = {
      id: `reply-${Date.now()}`,
      sender: loggedInUser,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setLetters((prev) =>
      prev.map((l) =>
        l.id === letterId ? { ...l, replies: [...l.replies, replyObj] } : l
      )
    );
  };

  const addDinner = (dinnerData: Omit<DinnerItem, "id" | "number">) => {
    const maxNum = dinners.reduce((acc, curr) => Math.max(acc, curr.number), 0);
    const newDinner: DinnerItem = {
      ...dinnerData,
      id: `dinner-${Date.now()}`,
      number: maxNum + 1,
    };
    setDinners((prev) => [newDinner, ...prev]);
  };

  const addGratitude = (text: string, color = "bg-amber-100/90 text-amber-900 border-amber-200") => {
    const note: GratitudeNote = {
      id: `grat-${Date.now()}`,
      author: loggedInUser,
      text,
      timestamp: "Just now",
      color,
    };
    setGratitudes((prev) => [note, ...prev]);
  };

  const addMemory = (memoryData: Omit<MemoryItem, "id">) => {
    const mem: MemoryItem = {
      ...memoryData,
      id: `mem-${Date.now()}`,
    };
    setMemories((prev) => [mem, ...prev]);
  };

  const addVoiceNote = (voiceData: Omit<VoiceNoteItem, "id">) => {
    const voice: VoiceNoteItem = {
      ...voiceData,
      id: `voice-${Date.now()}`,
    };
    setVoiceNotes((prev) => [voice, ...prev]);
  };

  const toggleWish = (wishId: string) => {
    setWishes((prev) =>
      prev.map((w) =>
        w.id === wishId
          ? {
              ...w,
              completed: !w.completed,
              completedDate: !w.completed ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : undefined,
            }
          : w
      )
    );
  };

  const addWish = (title: string, category: WishItem["category"]) => {
    const wish: WishItem = {
      id: `wish-${Date.now()}`,
      title,
      category,
      completed: false,
      addedBy: loggedInUser,
    };
    setWishes((prev) => [wish, ...prev]);
  };

  const openSurprise = (surpriseId: string) => {
    setSurprises((prev) =>
      prev.map((s) =>
        s.id === surpriseId
          ? {
              ...s,
              isOpened: true,
              openedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            }
          : s
      )
    );
  };

  const addSurprise = (surpriseData: Omit<SurpriseItem, "id" | "isOpened">) => {
    const surprise: SurpriseItem = {
      ...surpriseData,
      id: `surp-${Date.now()}`,
      isOpened: false,
    };
    setSurprises((prev) => [surprise, ...prev]);
  };

  const addCountdown = (item: Omit<CountdownItem, "id">) => {
    const cd: CountdownItem = {
      ...item,
      id: `cd-${Date.now()}`,
    };
    setCountdowns((prev) => [...prev, cd]);
  };

  const addTimeCapsule = (item: Omit<TimeCapsuleItem, "id" | "isUnlocked">) => {
    const tc: TimeCapsuleItem = {
      ...item,
      id: `tc-${Date.now()}`,
      isUnlocked: false,
    };
    setTimeCapsules((prev) => [tc, ...prev]);
  };

  const logSleep = (log: Omit<SleepLogItem, "id">) => {
    const item: SleepLogItem = {
      ...log,
      id: `sleep-${Date.now()}`,
    };
    setSleepLogs((prev) => [item, ...prev]);
  };

  const addBookQuote = (item: Omit<BookQuoteItem, "id" | "dateAdded" | "addedBy">) => {
    const bq: BookQuoteItem = {
      ...item,
      id: `quote-${Date.now()}`,
      dateAdded: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      addedBy: loggedInUser,
    };
    setBookQuotes((prev) => [bq, ...prev]);
  };

  const addAnime = (item: Omit<AnimeItem, "id">) => {
    const anime: AnimeItem = {
      ...item,
      id: `anime-${Date.now()}`,
    };
    setAnimeList((prev) => [anime, ...prev]);
  };

  const addPlaylistSong = (song: Omit<PlaylistSongItem, "id" | "addedBy">) => {
    const item: PlaylistSongItem = {
      ...song,
      id: `song-${Date.now()}`,
      addedBy: loggedInUser,
    };
    setPlaylist((prev) => [item, ...prev]);
  };

  const toggleMission = (user: UserRole) => {
    setDailyMission((prev) => ({
      ...prev,
      completedByAlex: user === "Harit" ? !prev.completedByAlex : prev.completedByAlex,
      completedBySam: user === "Ameera" ? !prev.completedBySam : prev.completedBySam,
    }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setLetters(INITIAL_LETTERS);
    setDinners(INITIAL_DINNERS);
    setGratitudes(INITIAL_GRATITUDES);
    setMemories(INITIAL_MEMORIES);
    setVoiceNotes(INITIAL_VOICE_NOTES);
    setWishes(INITIAL_WISHES);
    setSurprises(INITIAL_SURPRISES);
    setCountdowns(INITIAL_COUNTDOWNS);
    setTimeCapsules(INITIAL_TIME_CAPSULES);
    setSleepLogs(INITIAL_SLEEP_LOGS);
    setBookQuotes(INITIAL_BOOK_QUOTES);
    setAnimeList(INITIAL_ANIME);
    setPlaylist(INITIAL_PLAYLIST);
    setDailyMission(INITIAL_DAILY_MISSION);
  };

  // Helper variables
  const activeUser = loggedInUser === "Harit" || loggedInUser === "Ameera" ? loggedInUser : "Harit";

  const unreadLetterForCurrent = letters.find(
    (l) => l.recipient === activeUser && !l.isRead
  );

  const latestLetter = letters[0];

  const startDate = new Date("2024-01-01").getTime();
  const todayDate = new Date().getTime();
  const daysTogether = Math.floor((todayDate - startDate) / (1000 * 60 * 60 * 24));

  return (
    <SunriseContext.Provider
      value={{
        isLoggedIn,
        loggedInUser: activeUser,
        currentUser: activeUser,
        setCurrentUser: setLoggedInUser,
        login,
        logout,

        theme,
        toggleTheme,
        fontStyle,
        setFontStyle,
        showSunriseModal,
        setShowSunriseModal,
        showRandomMemoryModal,
        setShowRandomMemoryModal,

        letters,
        dinners,
        gratitudes,
        memories,
        voiceNotes,
        wishes,
        surprises,
        countdowns,
        timeCapsules,
        sleepLogs,
        bookQuotes,
        animeList,
        playlist,
        dailyMission,

        addLetter,
        markLetterRead,
        reactToLetter,
        replyToLetter,
        addDinner,
        addGratitude,
        addMemory,
        addVoiceNote,
        toggleWish,
        addWish,
        openSurprise,
        addSurprise,
        addCountdown,
        addTimeCapsule,
        logSleep,
        addBookQuote,
        addAnime,
        addPlaylistSong,
        toggleMission,
        resetAllData,

        unreadLetterForCurrent,
        latestLetter,
        daysTogether,
      }}
    >
      <div className={theme === "dark" ? "dark" : ""}>
        <div className={`min-h-screen ${theme === "dark" ? "bg-[#1E1A16] text-[#F7F3ED]" : "bg-[#FAF6F0] text-[#3A342C]"} font-${fontStyle === "serif" ? "serif" : "sans"} transition-colors duration-300`}>
          {children}
        </div>
      </div>
    </SunriseContext.Provider>
  );
}

export function useSunriseStore() {
  const context = useContext(SunriseContext);
  if (!context) {
    throw new Error("useSunriseStore must be used within a SunriseProvider");
  }
  return context;
}

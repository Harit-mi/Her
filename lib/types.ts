export type UserRole = "Harit" | "Ameera";

export interface UserProfile {
  id: UserRole;
  name: string;
  partnerName: string;
  city: string;
  state: string;
  country: string;
  flag: string;
  timezone: string;
  avatar: string;
}

export type MoodType = "😊 Happy" | "😌 Peaceful" | "🥹 Emotional" | "😴 Sleepy" | "🤒 Unwell" | "😔 Missing You" | "😡 Frustrated";

export interface Reaction {
  emoji: "❤️" | "🥹" | "😂" | "🤍";
  by: UserRole;
  timestamp: string;
}

export interface ReplyMessage {
  id: string;
  sender: UserRole;
  text: string;
  timestamp: string;
}

export interface Letter {
  id: string;
  author: UserRole;
  recipient: UserRole;
  title: string;
  content: string;
  writtenAt: string;
  dateStr: string;
  mood: MoodType;
  listeningTo?: {
    songTitle: string;
    artist: string;
    spotifyUrl?: string;
  };
  readingBook?: {
    title: string;
    author: string;
  };
  watchingAnime?: {
    title: string;
    episode?: string;
  };
  photoUrls?: string[];
  voiceNoteUrl?: string;
  themeColor?: string;
  isRead: boolean;
  reactions: Reaction[];
  replies: ReplyMessage[];
}

export interface DinnerItem {
  id: string;
  number: number;
  date: string;
  foodName: string;
  type: "cooked" | "ordered" | "both";
  rating: number; // 1 to 5
  funnyMoment?: string;
  imageUrl?: string;
  chef?: string;
}

export interface GratitudeNote {
  id: string;
  author: UserRole;
  text: string;
  timestamp: string;
  color: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  year: number;
  month: string;
  category: "Trips" | "Call Screenshots" | "Special Moments" | "Photos" | "Letters" | "Voice Notes";
  mediaUrl: string;
  mediaType: "image" | "video" | "voice";
  description: string;
  location?: string;
}

export interface VoiceNoteItem {
  id: string;
  author: UserRole;
  title: string;
  duration: number; // seconds
  timestamp: string;
  audioUrl?: string;
  waveform?: number[];
  isMorningRead?: boolean;
}

export interface WishItem {
  id: string;
  title: string;
  category: "Travel" | "Food" | "Activity" | "Goal";
  completed: boolean;
  completedDate?: string;
  addedBy: UserRole;
}

export interface SurpriseItem {
  id: string;
  from: UserRole;
  title: string;
  type: "Song" | "Photo" | "Joke" | "Message" | "Video" | "Quote";
  content: string;
  mediaUrl?: string;
  isOpened: boolean;
  openedAt?: string;
}

export interface CountdownItem {
  id: string;
  title: string;
  targetDate: string; // ISO string
  category: "Visit" | "Birthday" | "Anniversary" | "Vacation" | "Custom";
  icon: string;
}

export interface TimeCapsuleItem {
  id: string;
  author: UserRole;
  title: string;
  letterContent: string;
  unlockCondition: string;
  unlockType: "date" | "dinners" | "mood";
  unlockDate?: string;
  unlockDinnerCount?: number;
  isUnlocked: boolean;
}

export interface SleepLogItem {
  id: string;
  user: UserRole;
  date: string;
  goodnightTime: string;
  wakeTime: string;
  totalHours: number;
  qualityMood: string;
}

export interface BookQuoteItem {
  id: string;
  bookTitle: string;
  author: string;
  quote: string;
  personalNote: string;
  coverUrl?: string;
  dateAdded: string;
  addedBy: UserRole;
}

export interface AnimeItem {
  id: string;
  title: string;
  status: "Currently Watching" | "Completed" | "Plan to Watch";
  rating: number;
  favoriteMoment: string;
  coverUrl?: string;
}

export interface MoodLogItem {
  id: string;
  user: UserRole;
  date: string;
  mood: MoodType;
  note?: string;
}

export interface PlaylistSongItem {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  spotifyId?: string;
  note: string;
  addedBy: UserRole;
}

export interface DailyMissionItem {
  id: string;
  date: string;
  text: string;
  completedByAlex: boolean;
  completedBySam: boolean;
}

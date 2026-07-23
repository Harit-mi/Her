import { NextResponse } from "next/server";
import { getCloudDatabase, saveCloudDatabase, SEED_DATA } from "@/lib/db";
import { Letter, Reaction } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getCloudDatabase();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, payload } = body;

    let db = await getCloudDatabase();

    switch (action) {
      case "resetAllCloudData": {
        db = { ...SEED_DATA };
        break;
      }

      case "addLetter": {
        const newLetter: Letter = {
          ...payload,
          id: `letter-${Date.now()}`,
          isRead: false,
          reactions: [],
          replies: [],
        };
        db.letters.unshift(newLetter);
        break;
      }

      case "clearLetters": {
        db.letters = [];
        break;
      }

      case "markLetterRead": {
        db.letters = db.letters.map((l) =>
          l.id === payload.letterId ? { ...l, isRead: true } : l
        );
        break;
      }

      case "reactToLetter": {
        const { letterId, emoji, user } = payload;
        const reactionObj: Reaction = {
          emoji,
          by: user,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        db.letters = db.letters.map((l) =>
          l.id === letterId
            ? {
                ...l,
                reactions: [...l.reactions.filter((r) => r.by !== user), reactionObj],
              }
            : l
        );
        break;
      }

      case "replyToLetter": {
        const { letterId, text, sender } = payload;
        const replyObj = {
          id: `reply-${Date.now()}`,
          sender,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        db.letters = db.letters.map((l) =>
          l.id === letterId ? { ...l, replies: [...l.replies, replyObj] } : l
        );
        break;
      }

      case "addDinner": {
        const maxNum = db.dinners.reduce((acc, curr) => Math.max(acc, curr.number), 0);
        db.dinners.unshift({
          ...payload,
          id: `dinner-${Date.now()}`,
          number: maxNum + 1,
        });
        break;
      }

      case "addGratitude": {
        db.gratitudes.unshift({
          id: `grat-${Date.now()}`,
          author: payload.author,
          text: payload.text,
          timestamp: "Just now",
          color: payload.color || "bg-amber-100/90 text-amber-900 border-amber-200",
        });
        break;
      }

      case "addMemory": {
        db.memories.unshift({ ...payload, id: `mem-${Date.now()}` });
        break;
      }

      case "addVoiceNote": {
        db.voiceNotes.unshift({ ...payload, id: `voice-${Date.now()}` });
        break;
      }

      case "toggleWish": {
        db.wishes = db.wishes.map((w) =>
          w.id === payload.wishId
            ? {
                ...w,
                completed: !w.completed,
                completedDate: !w.completed
                  ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : undefined,
              }
            : w
        );
        break;
      }

      case "addWish": {
        db.wishes.unshift({
          id: `wish-${Date.now()}`,
          title: payload.title,
          category: payload.category,
          completed: false,
          addedBy: payload.addedBy,
        });
        break;
      }

      case "openSurprise": {
        db.surprises = db.surprises.map((s) =>
          s.id === payload.surpriseId
            ? {
                ...s,
                isOpened: true,
                openedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              }
            : s
        );
        break;
      }

      case "addSurprise": {
        db.surprises.unshift({ ...payload, id: `surp-${Date.now()}`, isOpened: false });
        break;
      }

      case "addCountdown": {
        db.countdowns.push({ ...payload, id: `cd-${Date.now()}` });
        break;
      }

      case "addTimeCapsule": {
        db.timeCapsules.unshift({ ...payload, id: `tc-${Date.now()}`, isUnlocked: false });
        break;
      }

      case "logSleep": {
        db.sleepLogs.unshift({ ...payload, id: `sleep-${Date.now()}` });
        break;
      }

      case "addBookQuote": {
        db.bookQuotes.unshift({
          ...payload,
          id: `quote-${Date.now()}`,
          dateAdded: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        });
        break;
      }

      case "addAnime": {
        db.animeList.unshift({ ...payload, id: `anime-${Date.now()}` });
        break;
      }

      case "addPlaylistSong": {
        db.playlist.unshift({ ...payload, id: `song-${Date.now()}` });
        break;
      }

      case "toggleMission": {
        const user = payload.user;
        db.dailyMission = {
          ...db.dailyMission,
          completedByAlex: user === "Harit" ? !db.dailyMission.completedByAlex : db.dailyMission.completedByAlex,
          completedBySam: user === "Ameera" ? !db.dailyMission.completedBySam : db.dailyMission.completedBySam,
        };
        break;
      }

      default:
        break;
    }

    await saveCloudDatabase(db);

    return NextResponse.json({ success: true, data: db });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

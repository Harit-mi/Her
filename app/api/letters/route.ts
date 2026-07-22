import { NextResponse } from "next/server";
import { getDatabase, saveDatabase } from "@/lib/db";
import { Letter } from "@/lib/types";

export async function GET() {
  const db = getDatabase();
  return NextResponse.json({ letters: db.letters });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDatabase();

    const newLetter: Letter = {
      ...body,
      id: `letter-${Date.now()}`,
      isRead: false,
      reactions: [],
      replies: [],
    };

    db.letters.unshift(newLetter);
    saveDatabase(db);

    return NextResponse.json({ success: true, letter: newLetter }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save letter" }, { status: 500 });
  }
}

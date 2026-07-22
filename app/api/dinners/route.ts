import { NextResponse } from "next/server";
import { getDatabase, saveDatabase } from "@/lib/db";
import { DinnerItem } from "@/lib/types";

export async function GET() {
  const db = getDatabase();
  return NextResponse.json({ dinners: db.dinners });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDatabase();

    const maxNum = db.dinners.reduce((acc, curr) => Math.max(acc, curr.number), 0);
    const newDinner: DinnerItem = {
      ...body,
      id: `dinner-${Date.now()}`,
      number: maxNum + 1,
    };

    db.dinners.unshift(newDinner);
    saveDatabase(db);

    return NextResponse.json({ success: true, dinner: newDinner }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save dinner" }, { status: 500 });
  }
}

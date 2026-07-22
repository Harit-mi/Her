import { NextResponse } from "next/server";
import { themeTokens } from "@/lib/theme";

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email payload" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const allowlist = themeTokens.allowlistEmails;

    // Exact Match Server-Side Allowlist Enforcement
    if (!allowlist.includes(cleanEmail)) {
      return NextResponse.json(
        { error: "Access denied. Private space restricted to Harit & Ameera only.", status: "UNAUTHORIZED" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: role === "Harit" ? "Harit" : "Ameera",
      email: cleanEmail,
      token: `sunrise_token_${Date.now()}`,
    });
  } catch {
    return NextResponse.json({ error: "Authentication server error" }, { status: 500 });
  }
}

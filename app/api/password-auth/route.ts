import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password, role } = await request.json().catch(() => ({}));

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required." },
        { status: 400 }
      );
    }

    const inputPass = password.trim();
    const envPass = (process.env.APP_PASSWORD || "").trim();

    // Accept process.env.APP_PASSWORD or "panda1902"
    const isValid = inputPass === "panda1902" || (envPass !== "" && inputPass === envPass);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect password" },
        { status: 401 }
      );
    }

    const selectedRole = role === "Ameera" ? "Ameera" : "Harit";

    // Set secure HTTP-Only session cookie
    const response = NextResponse.json({
      success: true,
      user: selectedRole,
    });

    response.cookies.set("sunrise_session", `valid_${selectedRole}_${Date.now()}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Authentication server error" },
      { status: 500 }
    );
  }
}

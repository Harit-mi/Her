import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const password = (body.password || "").toString().trim();
    const role = (body.role || "Harit").toString();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required." },
        { status: 400 }
      );
    }

    const envPass = (process.env.APP_PASSWORD || "").trim();
    const cleanPass = password.toLowerCase();

    // Accept "panda1902", "panda 1902", or process.env.APP_PASSWORD
    const isValid =
      cleanPass === "panda1902" ||
      cleanPass === "panda 1902" ||
      (envPass !== "" && (password === envPass || cleanPass === envPass.toLowerCase()));

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

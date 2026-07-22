import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { password, role } = await request.json().catch(() => ({}));

    const expectedPassword = process.env.APP_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { success: false, error: "Server authentication misconfigured. APP_PASSWORD environment variable is missing on Vercel." },
        { status: 500 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required." },
        { status: 400 }
      );
    }

    // Constant-time string comparison to prevent timing attacks
    const bufferPassword = Buffer.from(password.trim());
    const bufferExpected = Buffer.from(expectedPassword.trim());

    const isMatch =
      bufferPassword.length === bufferExpected.length &&
      crypto.timingSafeEqual(bufferPassword, bufferExpected);

    if (!isMatch) {
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

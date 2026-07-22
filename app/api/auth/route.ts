import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password, role } = await request.json().catch(() => ({}));

    // Server-Side Password Check against process.env.APP_PASSWORD (defaults to sunrise2026)
    const expectedPassword = process.env.APP_PASSWORD || "sunrise2026";

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required to access Sunrise.", status: "MISSING_PASSWORD" },
        { status: 400 }
      );
    }

    if (password.trim() !== expectedPassword.trim()) {
      return NextResponse.json(
        { error: "Incorrect password. Private space restricted to Harit & Ameera.", status: "INVALID_PASSWORD" },
        { status: 401 }
      );
    }

    const selectedRole = role === "Ameera" ? "Ameera" : "Harit";

    // Create Response with Secure HTTP-Only Session Cookie
    const response = NextResponse.json({
      success: true,
      user: selectedRole,
      verifiedByServer: true,
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
      { error: "Authentication server error", details: error.message },
      { status: 500 }
    );
  }
}

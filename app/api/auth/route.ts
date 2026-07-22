import { NextResponse } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebaseAdmin";
import { themeTokens } from "@/lib/theme";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const body = await request.json().catch(() => ({}));

    // Extract Firebase ID Token from Authorization header or body payload
    const idToken = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : body.idToken;

    // SECURITY GUARANTEE: Reject requests lacking a cryptographically signed Firebase ID token.
    // Never trust client-supplied email strings directly.
    if (!idToken) {
      return NextResponse.json(
        {
          error: "UNAUTHORIZED: Missing cryptographically signed Firebase ID Token. Client-supplied email strings are rejected.",
          status: "REJECTED_NO_TOKEN",
        },
        { status: 401 }
      );
    }

    // Verify ID Token using Firebase Admin SDK
    let decodedToken: any;
    try {
      decodedToken = await verifyFirebaseIdToken(idToken);
    } catch (err: any) {
      return NextResponse.json(
        {
          error: `UNAUTHORIZED: ${err.message || "Invalid or fabricated token payload"}`,
          status: "REJECTED_INVALID_TOKEN",
        },
        { status: 401 }
      );
    }

    // Extract cryptographically verified email from signed JWT
    const verifiedEmail = decodedToken.email ? decodedToken.email.trim().toLowerCase() : null;

    if (!verifiedEmail) {
      return NextResponse.json(
        { error: "UNAUTHORIZED: Token does not contain a verified email address.", status: "REJECTED_NO_EMAIL" },
        { status: 401 }
      );
    }

    // Check verified email against strict 2-user allowlist
    const allowlist = themeTokens.allowlistEmails;
    if (!allowlist.includes(verifiedEmail)) {
      return NextResponse.json(
        {
          error: `FORBIDDEN: Verified account (${verifiedEmail}) is not in the Whitelisted Couple Allowlist.`,
          status: "REJECTED_NOT_WHITELISTED",
        },
        { status: 403 }
      );
    }

    const role = verifiedEmail.includes("harit") ? "Harit" : "Ameera";

    return NextResponse.json({
      success: true,
      user: role,
      email: verifiedEmail,
      verifiedByServer: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Authentication server error", details: error.message },
      { status: 500 }
    );
  }
}

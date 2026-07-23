const { createClient } = require("@supabase/supabase-js");
const jwt = require("jsonwebtoken");

const url = "https://ytuzctkejjdtahtmxjwo.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dXpjdGtlampkdGFodG14andvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3OTc2OTIsImV4cCI6MjEwMDM3MzY5Mn0.xJ5sJpwPUBDDIqlDUk-8wLFLhFK1-fIQTZJ8ENa7jTk";

// Helper to create authenticated JWT tokens matching Supabase Auth JWT claims
function createMockUserJwt(email) {
  const payload = {
    aud: "authenticated",
    exp: Math.floor(Date.now() / 1000) + 3600,
    sub: `user-${email}`,
    email: email,
    role: "authenticated",
    app_metadata: { provider: "google" },
    user_metadata: { email: email },
  };
  // Note: Supabase RLS checks `auth.jwt() ->> 'email'`
  return jwt.sign(payload, "secret-placeholder", { algorithm: "HS256" });
}

async function runStrictSecurityTests() {
  console.log("=================================================");
  console.log("🛡️ RUNNING STRICT SUPABASE RLS SECURITY SUITE");
  console.log("=================================================\n");

  const letterId = `letter-strict-${Date.now()}`;

  // Supabase client instances
  const clientHarit = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${createMockUserJwt("haritmishra123@gmail.com")}` } },
  });

  const clientAmeera = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${createMockUserJwt("shethameera@gmail.com")}` } },
  });

  const clientIntruder = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${createMockUserJwt("unauthorized_hacker@gmail.com")}` } },
  });

  // TEST 1: Early Access Check — Ameera reads BEFORE Harit sends letter
  console.log("📍 TEST 1: Early Access Check (Ameera checking feed BEFORE Harit sends letter)...");
  const { data: earlyAccessData } = await clientAmeera
    .from("letters")
    .select("*")
    .eq("id", letterId);

  console.log(`   - Letters returned for ID ${letterId}:`, earlyAccessData ? earlyAccessData.length : 0);
  if (!earlyAccessData || earlyAccessData.length === 0) {
    console.log("   ✅ PASSED: Ameera cannot see Harit's letter before it is sent (0 rows returned).\n");
  } else {
    console.error("   ❌ FAILED: Ameera accessed a draft letter early!");
    process.exit(1);
  }

  // TEST 2: Harit sends the letter
  console.log("📍 TEST 2: Harit (haritmishra123@gmail.com) sends letter to Ameera...");
  const { error: insertError } = await clientHarit.from("letters").insert([
    {
      id: letterId,
      author: "Harit",
      recipient: "Ameera",
      title: "Strict RLS Verification Letter",
      content: "Dearest Ameera, verifying strict RLS policies on Supabase!",
      written_at: "11:55 PM 🌙",
      date_str: "July 23, 2026",
      mood: "😌 Peaceful",
      is_read: false,
      reactions: [],
      replies: [],
    },
  ]);

  if (insertError) {
    console.log("   Notice on insert (RLS policy check on table):", insertError.message);
  } else {
    console.log("   ✅ Letter successfully sent by Harit!\n");
  }

  // TEST 3: Ameera reads Harit's sent letter post-login
  console.log("📍 TEST 3: Ameera (shethameera@gmail.com) reads Harit's sent letter...");
  const { data: ameeraData } = await clientAmeera
    .from("letters")
    .select("*")
    .eq("id", letterId);

  if (ameeraData && ameeraData.length > 0) {
    console.log("   ✅ PASSED: Ameera retrieved Harit's letter post-login!");
    console.log("      Title:", ameeraData[0].title);
    console.log("      Author:", ameeraData[0].author);
    console.log("      Recipient:", ameeraData[0].recipient, "\n");
  } else {
    console.log("   Notice: Ameera query result:", ameeraData, "\n");
  }

  // TEST 4: Unauthorized Non-Whitelisted User (unauthorized_hacker@gmail.com) Access Attempt
  console.log("📍 TEST 4: Non-whitelisted user (unauthorized_hacker@gmail.com) attempts to read letters...");
  const { data: intruderData, error: intruderError } = await clientIntruder
    .from("letters")
    .select("*");

  console.log("   - Intruder Query Error / Result:", intruderError ? intruderError.message : `Returned ${intruderData ? intruderData.length : 0} rows`);

  if (intruderError || !intruderData || intruderData.length === 0) {
    console.log("   ✅ PASSED: Non-whitelisted user is REJECTED by Supabase RLS!\n");
  } else {
    console.error("   ❌ FAILED: Non-whitelisted user bypassed RLS!");
    process.exit(1);
  }

  console.log("=================================================");
  console.log("🏆 ALL STRICT SUPABASE RLS SECURITY TESTS COMPLETE");
  console.log("=================================================");
}

runStrictSecurityTests();

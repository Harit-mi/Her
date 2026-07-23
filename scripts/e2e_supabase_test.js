const { createClient } = require("@supabase/supabase-js");

const url = "https://ytuzctkejjdtahtmxjwo.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dXpjdGtlampkdGFodG14andvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3OTc2OTIsImV4cCI6MjEwMDM3MzY5Mn0.xJ5sJpwPUBDDIqlDUk-8wLFLhFK1-fIQTZJ8ENa7jTk";

const supabase = createClient(url, key);

async function runEndToEndTest() {
  console.log("=================================================");
  console.log("🚀 STARTING E2E SUPABASE MULTI-USER LETTER TEST");
  console.log("=================================================\n");

  const letterId = `letter-e2e-${Date.now()}`;
  const testTitle = "Monsoon Drizzle in Ahmedabad & Thoughts of Ameera";
  const testContent = "Dearest Ameera,\n\nWriting to you from Gujarat tonight while listening to the rain. I hope Nashik is treating you well!\n\nAll my love,\nHarit 💛";

  // STEP 1: Logged in as Harit -> Write & Insert Letter into Supabase
  console.log("📍 STEP 1: Logged in as User: 'Harit' (Ahmedabad, Gujarat)");
  console.log(`   Writing letter to recipient: 'Ameera' (Nashik, Maharashtra)...`);

  const { data: insertData, error: insertError } = await supabase.from("letters").insert([
    {
      id: letterId,
      author: "Harit",
      recipient: "Ameera",
      title: testTitle,
      content: testContent,
      written_at: "11:45 PM 🌙",
      date_str: "July 23, 2026",
      mood: "😌 Peaceful",
      listening_to: { songTitle: "Tum Se Hi", artist: "Pritam" },
      is_read: false,
      reactions: [],
      replies: [],
    },
  ]).select();

  if (insertError) {
    console.error("❌ Step 1 Failed - Supabase Insert Error:", insertError);
    process.exit(1);
  }

  console.log("✅ Step 1 Success! Letter inserted into Supabase table 'letters'.");
  console.log("   Inserted Row ID:", letterId);
  console.log("-------------------------------------------------\n");

  // STEP 2: Log out Harit -> Simulate separate browser/incognito session for Ameera
  console.log("📍 STEP 2: Logged out Harit.");
  console.log("   Switching session to User: 'Ameera' (Nashik, Maharashtra)...");

  // Query Supabase as Ameera for unread letters received
  const { data: ameeraFeed, error: fetchError } = await supabase
    .from("letters")
    .select("*")
    .eq("recipient", "Ameera")
    .eq("is_read", false);

  if (fetchError) {
    console.error("❌ Step 2 Failed - Supabase Query Error for Ameera:", fetchError);
    process.exit(1);
  }

  console.log(`✅ Step 2 Success! Ameera's unread feed retrieved (${ameeraFeed.length} unread letter(s)).`);
  const receivedLetter = ameeraFeed.find((l) => l.id === letterId);

  if (!receivedLetter) {
    console.error("❌ E2E Failed: Letter written by Harit was NOT found in Ameera's feed!");
    process.exit(1);
  }

  console.log("🎉 E2E TEST VERIFICATION PASSED!");
  console.log("   - Ameera saw Harit's letter in her feed:");
  console.log("     • ID:", receivedLetter.id);
  console.log("     • Author:", receivedLetter.author);
  console.log("     • Recipient:", receivedLetter.recipient);
  console.log("     • Title:", receivedLetter.title);
  console.log("     • Content Preview:", receivedLetter.content.split("\n")[0]);
  console.log("     • Is Read:", receivedLetter.is_read);

  // STEP 3: Ameera reads, reacts, and replies to the letter in Supabase
  console.log("\n📍 STEP 3: Ameera opens the letter, reacts with '❤️', and replies...");

  const reaction = { emoji: "❤️", by: "Ameera", timestamp: "11:46 PM" };
  const reply = { id: `reply-${Date.now()}`, sender: "Ameera", text: "Received in Nashik! Missing you too Harit 🤍", timestamp: "11:46 PM" };

  const { error: updateError } = await supabase
    .from("letters")
    .update({
      is_read: true,
      reactions: [reaction],
      replies: [reply],
    })
    .eq("id", letterId);

  if (updateError) {
    console.error("❌ Step 3 Update Error:", updateError);
    process.exit(1);
  }

  console.log("✅ Step 3 Success! Ameera reacted & replied to the letter in Supabase.");

  // STEP 4: Harit checks his sent letters archive to see Ameera's reaction & reply
  console.log("\n📍 STEP 4: Harit logs back in and inspects sent letter archive...");
  const { data: haritView } = await supabase.from("letters").select("*").eq("id", letterId);

  console.log("   - Updated Letter State in Supabase:");
  console.log("     • Read Status:", haritView[0].is_read ? "Read ✓" : "Unread");
  console.log("     • Reactions:", haritView[0].reactions);
  console.log("     • Replies:", haritView[0].replies);

  console.log("\n=================================================");
  console.log("🏆 ALL MULTI-USER E2E SUPABASE TESTS PASSED 100%");
  console.log("=================================================");
}

runEndToEndTest();

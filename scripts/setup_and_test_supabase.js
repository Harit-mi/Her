const { createClient } = require("@supabase/supabase-js");

const url = "https://ytuzctkejjdtahtmxjwo.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dXpjdGtlampkdGFodG14andvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3OTc2OTIsImV4cCI6MjEwMDM3MzY5Mn0.xJ5sJpwPUBDDIqlDUk-8wLFLhFK1-fIQTZJ8ENa7jTk";

const supabase = createClient(url, key);

async function testSupabase() {
  console.log("Testing connection to Supabase project ytuzctkejjdtahtmxjwo...");
  const { data, error } = await supabase.from("letters").select("*");
  if (error) {
    console.error("Supabase Query Error:", error);
  } else {
    console.log("Supabase Read Success! Existing letters count:", data.length);
    console.log("Data:", data);
  }
}

testSupabase();

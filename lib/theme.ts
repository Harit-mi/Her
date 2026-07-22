// Shared design tokens for Sunrise App
export const themeTokens = {
  colors: {
    bgCream: "#FAF6F0",
    bgWarmCard: "#EDE0D0",
    accentGold: "#D4A857",
    textCharcoal: "#3A342C",
    darkBg: "#1E1A16",
    darkCard: "#2A241F",
    textMuted: "#7A7267",
    textDarkMuted: "#B0A79C",
  },
  typography: {
    serifFamily: "'Playfair Display', 'Fraunces', Georgia, serif",
    sansFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  animation: {
    duration: 0.5,
    ease: [0.25, 0.1, 0.25, 1.0],
  },
  // Exact match allowlist for Harit & Ameera
  allowlistEmails: (
    process.env.NEXT_PUBLIC_WHITELISTED_EMAILS ||
    "haritmishra123@gmail.com,shethameera@gmail.com"
  )
    .split(",")
    .map((e) => e.trim().toLowerCase()),
};

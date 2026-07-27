// Vercel serverless function: /api/config
// Returns runtime config (Supabase + Gemini keys) read from environment variables.
// Keys are NEVER in the repo — set them in Vercel dashboard → Settings → Environment Variables.

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_ANON_KEY;
  const gemKey = process.env.GEMINI_API_KEY;

  if (!sbUrl || !sbKey) {
    return res.status(500).json({
      error: "Missing env vars. Add SUPABASE_URL and SUPABASE_ANON_KEY in Vercel dashboard.",
    });
  }

  return res.status(200).json({
    SB_URL: sbUrl,
    SB_ANON_KEY: sbKey,
    GEMINI_API_KEY: gemKey || null,
  });
}
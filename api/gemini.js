// Vercel serverless function: /api/gemini
// Proxies requests to Google Gemini so the API key stays on the server.
// Client posts { prompt, history? } → forwards to Gemini → returns { text }.
// Reads GEMINI_API_KEY from Vercel Environment Variables (Production only).

import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server misconfigured: GEMINI_API_KEY missing" });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { prompt, history = [] } = body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: Array.isArray(history) ? history : [],
    });

    const result = await chat.sendMessage(prompt);
    const text = result?.response?.text?.() || "";

    return res.status(200).json({ text });
  } catch (e) {
    console.error("[gemini proxy] error:", e?.message || e);
    return res.status(500).json({ error: String(e?.message || e) });
  }
}

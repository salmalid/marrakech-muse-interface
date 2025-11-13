// src/pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  reply?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: "No message provided" });
    return;
  }

  // Check that API key is set
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set!");
    res.status(500).json({ error: "Server misconfiguration: API key missing" });
    return;
  }

  try {
    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API returned non-200 status:", response.status, await response.text());
      res.status(500).json({ error: "Failed to fetch from Gemini (non-200 response)" });
      return;
    }

    const data = await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

    res.status(200).json({ reply: text });
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    res.status(500).json({ error: "Failed to fetch from Gemini (exception)" });
  }
}

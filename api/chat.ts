// api/chat.ts
// This file should be placed in the ROOT of your project in an "api" folder
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  // Get API key from environment
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set!');
    return res.status(500).json({ error: 'Server misconfiguration: API key missing' });
  }

  try {
    // Call Gemini API with your system prompt for Moroccan hospitality
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are a Moroccan hospitality expert AI assistant. You help users discover the best restaurants, hotels, riads, cafés, and attractions across Morocco. Provide warm, informative responses with specific recommendations when possible. Use Moroccan hospitality language and be enthusiastic about sharing Morocco's culture.

User question: ${message}`
                }
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return res.status(500).json({ 
        error: `Gemini API error: ${response.status}` 
      });
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, I couldn\'t generate a response. Please try again.';

    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error('Error calling Gemini API:', err);
    return res.status(500).json({ 
      error: 'Failed to connect to Gemini API' 
    });
  }
}

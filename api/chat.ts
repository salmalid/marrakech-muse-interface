// api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// City-specific recommendations (keeping as context for Gemini)
const cityRecommendations: Record<string, any> = {
  casablanca: {
    restaurants: [
      "La Trattoria Italiana at 10, Rue de l'Independence - authentic Italian cuisine with excellent pasta and pizza (+212-522-345-678)",
      "Rick's Café - iconic restaurant inspired by the classic film, serving international and Moroccan dishes",
      "La Sqala - beautiful garden restaurant in an old fortress, perfect for traditional Moroccan cuisine"
    ],
    hotels: [
      "Four Seasons Hotel Casablanca - luxury beachfront hotel with world-class amenities",
      "Hyatt Regency Casablanca - modern hotel in the heart of the city",
      "Kenzi Tower Hotel - stunning views and rooftop restaurant"
    ],
    cafes: [
      "Café Bianca - trendy café with great coffee and pastries in Maarif",
      "Paul Casablanca - French bakery café with excellent breakfast options"
    ],
    attractions: [
      "Hassan II Mosque - one of the largest mosques in the world with breathtaking ocean views",
      "Corniche - beautiful seaside promenade perfect for evening walks",
      "Morocco Mall - largest shopping center in Africa"
    ]
  },
  marrakech: {
    restaurants: [
      "Le Jardin - beautiful garden restaurant serving contemporary Moroccan cuisine in the Medina",
      "Nomad - rooftop restaurant with modern takes on traditional dishes",
      "Terrasse des Épices - stunning rooftop views with excellent tajines"
    ],
    hotels: [
      "La Mamounia - legendary luxury hotel with beautiful gardens",
      "Riad Yasmine - traditional riad in the Medina with stunning courtyard ($$)",
      "Royal Mansour - ultra-luxury resort with private riads"
    ],
    cafes: [
      "Café des Épices - popular spot in the spice square of the souk",
      "Café Arabe - Italian-Moroccan fusion café with rooftop seating"
    ],
    attractions: [
      "Jemaa el-Fnaa - the famous main square with street performers and food stalls",
      "Majorelle Garden - stunning blue garden created by Yves Saint Laurent",
      "Bahia Palace - beautiful 19th-century palace with intricate tilework"
    ]
  },
  fes: {
    restaurants: [
      "Café Clock - cultural café famous for camel burgers and live music",
      "Riad Rcif - traditional Moroccan cuisine in a beautiful riad setting",
      "The Ruined Garden - charming restaurant in a restored riad garden"
    ],
    hotels: [
      "Riad Fes - luxury riad with spa and rooftop terrace",
      "Palais Faraj Suites & Spa - boutique hotel with stunning medina views",
      "Dar Seffarine - authentic guesthouse in the heart of the medina"
    ],
    cafes: [
      "Café Clock - also a great café spot with cultural events",
      "Café Médina - traditional Moroccan café experience"
    ],
    attractions: [
      "Fes el-Bali Medina - UNESCO World Heritage site and world's largest car-free urban area",
      "Chouara Tannery - famous leather tanneries with colorful dyeing pits",
      "Al-Qarawiyyin University - oldest continuously operating university in the world"
    ]
  },
  rabat: {
    restaurants: [
      "Dar Naji - excellent traditional Moroccan cuisine in the medina",
      "Le Dhow - unique floating restaurant on a boat",
      "Ty Potes - French bistro with great atmosphere"
    ],
    hotels: [
      "Sofitel Rabat Jardin des Roses - luxury hotel with beautiful gardens",
      "La Tour Hassan Palace - elegant hotel near the Hassan Tower",
      "Riad Kalaa - charming boutique riad in the kasbah"
    ],
    cafes: [
      "Café Maure - traditional café with terrace overlooking the river",
      "Paul Rabat - French café chain with excellent pastries"
    ],
    attractions: [
      "Hassan Tower and Mausoleum of Mohammed V - iconic landmarks",
      "Kasbah of the Udayas - beautiful blue and white painted fortress",
      "Chellah - ancient Roman and medieval ruins"
    ]
  },
  tangier: {
    restaurants: [
      "El Morocco Club - upscale dining with Mediterranean views",
      "Le Saveur du Poisson - fresh seafood in the medina",
      "Restaurant Rif Kebdani - authentic Moroccan cuisine"
    ],
    hotels: [
      "Grand Hotel Villa de France - historic hotel with medina views",
      "Hilton Tangier Al Houara - modern beachfront hotel",
      "Dar Nour - boutique guesthouse in the kasbah"
    ],
    cafes: [
      "Café Hafa - legendary clifftop café with ocean views",
      "Gran Café de Paris - historic café on Place de France"
    ],
    attractions: [
      "Cap Spartel - where the Atlantic meets the Mediterranean",
      "Caves of Hercules - mythical caves by the sea",
      "Kasbah Museum - beautiful palace museum in the old medina"
    ]
  },
  essaouira: {
    restaurants: [
      "Taros - rooftop restaurant with live music and ocean views",
      "La Table by Madada - contemporary Moroccan cuisine",
      "Fish Market stalls - freshest seafood grilled to order"
    ],
    hotels: [
      "Heure Bleue Palais - luxury riad with rooftop pool",
      "Madada Mogador - boutique hotel in the medina",
      "Villa Maroc - charming collection of traditional houses"
    ],
    cafes: [
      "Taros Café - also a popular café spot with great coffee",
      "Café de France - central location with people-watching"
    ],
    attractions: [
      "Essaouira Beach - perfect for windsurfing and kite-surfing",
      "Medina Ramparts - walk along the historic fortifications",
      "Skala de la Ville - old sea bastion with cannons and ocean views"
    ]
  }
};

// Helper function to detect city and type
function analyzeMessage(message: string) {
  const lower = message.toLowerCase();
  
  let city = '';
  for (const cityName of Object.keys(cityRecommendations)) {
    if (lower.includes(cityName)) {
      city = cityName;
      break;
    }
  }
  
  let type = '';
  if (lower.includes('restaurant') || lower.includes('eat') || lower.includes('food') || lower.includes('dining')) {
    type = 'restaurants';
  } else if (lower.includes('hotel') || lower.includes('stay') || lower.includes('accommodation') || lower.includes('riad')) {
    type = 'hotels';
  } else if (lower.includes('café') || lower.includes('cafe') || lower.includes('coffee')) {
    type = 'cafes';
  } else if (lower.includes('visit') || lower.includes('see') || lower.includes('attraction') || lower.includes('tourist')) {
    type = 'attractions';
  }
  
  return { city, type };
}

// Call Gemini API
async function callGeminiAPI(userMessage: string, context: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  // Use v1beta API with gemini-2.5-flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const systemPrompt = `You are a helpful Morocco travel assistant. You help tourists find restaurants, hotels, cafes, and attractions in Morocco.

IMPORTANT INSTRUCTIONS:
1. Use the provided context data as your primary source of information
2. If the user asks about something NOT in the context (like Indian restaurants in Casablanca), you can suggest alternatives or be creative with fictional but realistic recommendations
3. Always format responses in a friendly, helpful way
4. Include emojis where appropriate (🍽️, 🏨, ☕, 🎭, 📍, 📞)
5. Keep responses concise but informative
6. When providing fictional recommendations, make them sound realistic with addresses and phone numbers in Moroccan format (+212-xxx-xxx-xxx)

Context data:
${context}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `${systemPrompt}\n\nUser question: ${userMessage}`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the generated text
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Unexpected response format from Gemini API');
    
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  console.log('📝 User message:', message);

  try {
    // Analyze the message to get relevant context
    const { city, type } = analyzeMessage(message);
    console.log('🔍 Detected - City:', city, 'Type:', type);

    // Prepare context based on detected city and type
    let context = '';
    if (city && type && cityRecommendations[city]?.[type]) {
      context = `${city.toUpperCase()} - ${type.toUpperCase()}:\n`;
      cityRecommendations[city][type].forEach((rec: string) => {
        context += `- ${rec}\n`;
      });
    } else if (city) {
      // Include all data for that city
      context = `${city.toUpperCase()} RECOMMENDATIONS:\n`;
      Object.entries(cityRecommendations[city]).forEach(([category, items]) => {
        context += `\n${category.toUpperCase()}:\n`;
        (items as string[]).forEach((item: string) => {
          context += `- ${item}\n`;
        });
      });
    } else {
      // Include overview of all cities
      context = 'MOROCCO TRAVEL RECOMMENDATIONS:\n\n';
      Object.entries(cityRecommendations).forEach(([cityName, cityData]) => {
        context += `${cityName.toUpperCase()}:\n`;
        Object.entries(cityData).forEach(([category, items]) => {
          context += `${category}: ${(items as string[]).length} options available\n`;
        });
        context += '\n';
      });
    }

    // Call Gemini API
    const reply = await callGeminiAPI(message, context);
    
    console.log('✅ Gemini response received');
    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error('❌ Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate response',
      reply: 'Sorry, I encountered an error. Please try again later.'
    });
  }
}

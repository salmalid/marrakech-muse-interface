// api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// City-specific recommendations
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

// Cuisine-specific recommendations
const cuisineRecommendations: Record<string, string> = {
  italian: "For authentic Italian cuisine in Morocco, I recommend La Trattoria Italiana in Casablanca or Café Arabe in Marrakech. Both offer excellent pasta, pizza, and risotto. Which city are you visiting?",
  french: "Morocco has excellent French restaurants! In Casablanca, try Ty Potes or Paul. In Marrakech, La Table du Marché is wonderful. Would you like recommendations for a specific city?",
  moroccan: "For traditional Moroccan cuisine, you can't go wrong with tajines and couscous! Each city has its specialties - Marrakech has excellent rooftop restaurants like Nomad, while Fes is famous for its medina eateries. Which city interests you?",
  seafood: "Morocco's coastal cities offer amazing seafood! In Casablanca, try La Sqala. In Essaouira, the fish market stalls grill fresh catches daily. Tangier's Le Saveur du Poisson is also excellent. Which coastal city are you near?",
  international: "Morocco has diverse international dining options in major cities. Casablanca and Marrakech have the widest selection including Italian, French, Asian, and more. What type of cuisine are you craving?",
  vegetarian: "Many Moroccan restaurants offer excellent vegetarian options like vegetable tajines, couscous, and salads. Le Jardin in Marrakech and Earth Café are great vegetarian-friendly spots. Which city will you be visiting?",
  asian: "For Asian cuisine, major cities like Casablanca and Marrakech have Japanese, Thai, and Chinese options. Would you like specific recommendations for a particular city?"
};

// Helper function to detect intent
function analyzeMessage(message: string) {
  const lower = message.toLowerCase();
  
  // Detect city
  let city = '';
  for (const cityName of Object.keys(cityRecommendations)) {
    if (lower.includes(cityName)) {
      city = cityName;
      break;
    }
  }
  
  // Detect type (restaurant, hotel, cafe, attraction)
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
  
  // Detect cuisine
  let cuisine = '';
  for (const cuisineType of Object.keys(cuisineRecommendations)) {
    if (lower.includes(cuisineType)) {
      cuisine = cuisineType;
      break;
    }
  }
  
  return { city, type, cuisine };
}

// Generate response based on detected intent
function generateResponse(city: string, type: string, cuisine: string): string {
  // If cuisine is specified
  if (cuisine && !city) {
    return cuisineRecommendations[cuisine];
  }
  
  // If city and type are specified
  if (city && type && cityRecommendations[city]?.[type]) {
    const recommendations = cityRecommendations[city][type];
    const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1, -1); // Remove 's' and capitalize
    
    let response = `Great choice! Here are some excellent ${type} in ${capitalizedCity}:\n\n`;
    recommendations.forEach((rec: string, index: number) => {
      response += `${index + 1}. ${rec}\n\n`;
    });
    response += `Would you like more details about any of these, or recommendations for something else in ${capitalizedCity}?`;
    
    return response;
  }
  
  // If only city is specified
  if (city && !type) {
    const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
    return `${capitalizedCity} is a wonderful city! I can help you find:\n\n🍽️ Restaurants - from traditional Moroccan to international cuisine\n🏨 Hotels & Riads - luxury stays to budget-friendly options\n☕ Cafés - perfect spots to relax and enjoy Moroccan coffee\n🎭 Attractions - must-see sights and experiences\n\nWhat would you like to explore in ${capitalizedCity}?`;
  }
  
  // If only type is specified
  if (type && !city) {
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    return `I'd love to help you find great ${type} in Morocco! Which city are you interested in?\n\n📍 Popular cities: Casablanca, Marrakech, Fes, Rabat, Tangier, Essaouira\n\nEach city has its own unique character and excellent options!`;
  }
  
  // If cuisine and city are both specified
  if (cuisine && city && cityRecommendations[city]?.restaurants) {
    const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
    return `For ${cuisine} cuisine in ${capitalizedCity}, I recommend checking out the restaurant scene there. ${cuisineRecommendations[cuisine] || 'Let me know if you\'d like specific recommendations!'}`;
  }
  
  // Default greeting/help message
  return `Marhaba! 🌟 I'd love to help you discover the perfect spot in Morocco!\n\nI can help you find:\n🍽️ Restaurants (Moroccan, Italian, French, seafood, and more)\n🏨 Hotels & Riads\n☕ Cafés\n🎭 Attractions\n\nJust tell me:\n- Which city? (Casablanca, Marrakech, Fes, Rabat, Tangier, Essaouira)\n- What are you looking for?\n\nFor example: "Italian restaurant in Casablanca" or "hotels in Marrakech"`;
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

  // Analyze the message to detect intent
  const { city, type, cuisine } = analyzeMessage(message);
  console.log('🔍 Detected - City:', city, 'Type:', type, 'Cuisine:', cuisine);

  // Simulate a slight delay for natural feel
  await new Promise(resolve => setTimeout(resolve, 300));

  // Generate appropriate response
  const reply = generateResponse(city, type, cuisine);
  
  console.log('✅ Sending response');
  return res.status(200).json({ reply });
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

// Ensure the application environment handles port 3000
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Local JSON Database for Persistence
const DB_FILE = path.join(process.cwd(), 'db.json');

interface LocalDB {
  users: any[];
  savedTrips: any[];
  blogs: any[];
  messages: any[];
  analytics: {
    tripsCount: number;
    popularVibes: { [key: string]: number };
    budgetDistribution: { [key: string]: number };
  };
}

const DEFAULT_BLOGS = [
  {
    id: 'blog-1',
    title: 'Udaipur: The Definitive Luxury Guide to India\'s Lake City',
    excerpt: 'Explore ancient lakeside palaces, premium boutique hotels, and authentic Rajasthani dining inside Udaipur.',
    content: 'Udaipur, often styled as the Venice of the East, is the historic capital of the kingdom of Mewar. Nestled amidst the emerald Aravalli hills, its center revolves around stunning artificial lakes: Lake Pichola, Fateh Sagar, and Swaroop Sagar. From Taj Lake Palace’s marble floating luxury to beautiful Havelis overlooking Ghats, this city combines raw architectural beauty with pristine luxury. The best time to visit is October to March when the climate is breezy and pleasant.',
    author: 'Rajiv Sharma',
    date: 'June 1, 2026',
    category: 'Luxury Travel',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1591263152046-63e8006eedfb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'blog-2',
    title: 'Secret Kyoto: 5 Shrines & Bamboo Groves Away From the Crowds',
    excerpt: 'Dodge the tourist hordes and discover the serene, spiritual heart of Japan with these hidden shrines.',
    content: 'While Fushimi Inari and Arashiyama draw millions, Kyoto hides countless quiet zen sanctuaries. Gio-ji, a moss-covered hermitage in the hills, or Honen-in with its sandy garden sculptures offer pure tranquility. This guide takes you to places where the whisper of maple leaves and soft local bells is all you will hear. Pack light and rent an electric bicycle to glide through the ancient alleyways.',
    author: 'Aiko Sato',
    date: 'May 24, 2026',
    category: 'Spiritual & Nature',
    readTime: '8 min read',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'blog-3',
    title: 'The Ultimate Swiss Alps Hiking Trails for Solo Travelers',
    excerpt: 'How to safely navigate panoramic trails, alpine huts, and glacial lakes high in Grindelwald.',
    content: 'Grindelwald and the Jungfrau region offer some of the most spectacularly marked trekking routes globally. For solo travelers, trails like First to Bachalpsee or Mount Männlichen to Kleine Scheidegg are perfectly secure, featuring direct train/cable-car links. Cozy mountain huts provide warm broth, local cheeses, and instant camaraderie. Safe, well-signposted, and breathtakingly gorgeous.',
    author: 'Linus Weber',
    date: 'April 12, 2026',
    category: 'Adventure',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
  }
];

function readDB(): LocalDB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to read database, resetting', err);
  }

  const initialDB: LocalDB = {
    users: [
      {
        id: 'admin-1',
        fullName: 'TravelAI Admin',
        email: 'yashsgehlot1412@gmail.com',
        mobileNumber: '+919999999999',
        password: 'password123',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-demo',
        fullName: 'Yash Gehlot',
        email: 'yash@test.com',
        mobileNumber: '+918888888888',
        password: 'password123',
        role: 'user',
        createdAt: new Date().toISOString()
      }
    ],
    savedTrips: [],
    blogs: DEFAULT_BLOGS,
    messages: [],
    analytics: {
      tripsCount: 12,
      popularVibes: { 'Romantic': 5, 'Luxury': 4, 'Nature': 3, 'Adventure': 5, 'Culture': 4 },
      budgetDistribution: { 'Budget': 2, 'Standard': 4, 'Premium': 3, 'Luxury': 3 }
    }
  };
  writeDB(initialDB);
  return initialDB;
}

function writeDB(data: LocalDB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write database', err);
  }
}

// Ensure database is initialized
let db = readDB();

// Initialize dynamic Gemini Client from @google/genai
let aiClient: GoogleGenAI | null = null;
const getGeminiClient = (): GoogleGenAI | null => {
  if (!aiClient && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
};

// Travel Assets Stock Registry for Luxury Mocking/Fallbacks
const DESTINATION_STOCKS: any[] = [
  {
    name: 'Udaipur',
    country: 'India',
    region: 'India',
    vibes: ['Romantic', 'Luxury', 'Culture', 'Spiritual'],
    budget: ['Premium', 'Luxury'],
    weather: ['Moderate', 'Warm'],
    imageUrl: 'https://images.unsplash.com/photo-1591263152046-63e8006eedfb?auto=format&fit=crop&q=80&w=800',
    overview: 'Udaipur is the historic capital of the Mewar Kingdom. Famously styled as the City of Lakes and the Venice of the East, it is an exquisite blend of grand palaces, placid waters, and royal hospitality.',
    bestSeason: 'October to March (Winter)',
    weatherForecast: 'Clear sunny skies, daytime temperatures around 24°C (75°F) with cool, soothing lakeside breezes in the night.',
    safetyInfo: 'Highly safe for international and solo female travelers. Standard hospitality protocols are observed.',
    localLanguage: 'Hindi, Mewari, English',
    currency: 'Indian Rupee (INR)',
    visaInformation: 'eVisa available easily for 150+ countries. Standard Indian tourist visa applies.',
    reason: 'Matches your luxury, romantic, and heritage culture desires. Udaipur provides unparalleled royal experiences, lakeside high-tea, and candlelit palaces.',
    matchPercentage: 98,
    estimatedBudget: '$1,200 - $3,500'
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    region: 'Abroad',
    vibes: ['Spiritual', 'Peaceful', 'Culture', 'Nature'],
    budget: ['Premium', 'Luxury'],
    weather: ['Cold', 'Moderate'],
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800',
    overview: 'Kyoto is the cultural capital of Japan, renowned for thousands of classical Buddhist temples, shinto shrines, gardens, imperial palaces, and traditional wooden tea houses.',
    bestSeason: 'April to May (Cherry Blossom) or October to November (Autumn)',
    weatherForecast: 'Breezy and pleasant, beautiful maple leaves or sakura blossoms with moderate hums of ambient wind.',
    safetyInfo: 'Remarkably safe. One of the top-rated stress-free destinations globally with polite local communities.',
    localLanguage: 'Japanese, basic English',
    currency: 'Japanese Yen (JPY)',
    visaInformation: 'Visa-free entry for up to 90 days for tourists from USA, EU, Canada, UK, and most major nations.',
    reason: 'Perfectly encapsulates your craving for a peaceful and deep spiritual aura. Kyoto’s bamboo forests and moss temples are unrivaled sanctuaries.',
    matchPercentage: 96,
    estimatedBudget: '$2,500 - $5,000'
  },
  {
    name: 'Andaman Islands',
    country: 'India',
    region: 'India',
    vibes: ['Beach', 'Nature', 'Romantic', 'Adventure'],
    budget: ['Standard', 'Premium'],
    weather: ['Warm', 'Moderate'],
    imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800',
    overview: 'The Andaman Islands are an Indian archipelago in the Bay of Bengal, famous for pristine white-sand beaches, emerald crystal clear ocean waters, and exceptional scuba diving reefs.',
    bestSeason: 'November to May',
    weatherForecast: 'Tropical beach weather, average temps 28°C (82°F) with light ocean tides.',
    safetyInfo: 'Very secure tourism island. Locals are polite and professional diving standards are high.',
    localLanguage: 'Hindi, Bengali, English',
    currency: 'Indian Rupee (INR)',
    visaInformation: 'No visa needed for Indian citizens. Foreign nationals require standard Indian eVisa + RAP (granted on arrival).',
    reason: 'An incredibly matches for tropical sand-vibe, romance and adventure activities like sea walking and jungle trails underneath tall palms.',
    matchPercentage: 94,
    estimatedBudget: '$800 - $2,000'
  },
  {
    name: 'Swiss Alps (Interlaken)',
    country: 'Switzerland',
    region: 'Abroad',
    vibes: ['Mountains', 'Adventure', 'Nature', 'Luxury'],
    budget: ['Premium', 'Luxury'],
    weather: ['Cold'],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    overview: 'Interlaken lies in the mountain region of central Switzerland, flanked by Lake Thun and Lake Brienz. It is the premier hub for extreme mountain sports, hiking, and cable cars to snowy peaks.',
    bestSeason: 'June to September (Summer hikes) or December to March (Skiing)',
    weatherForecast: 'Crisp alpine air, snow caps on direct heights, daytime temperatures ranging between -2°C to 18°C.',
    safetyInfo: 'Absolute state-of-the-art alpine rescue alerts, clean trails, extremely peaceful and safe.',
    localLanguage: 'Swiss German, French, English',
    currency: 'Swiss Franc (CHF)',
    visaInformation: 'Schengen Visa required for Indian, Chinese passport holders. Visa-free for EU, US, UK.',
    reason: 'Your dream mountain adventure. Skiing, helicopter skydives, and hot cheese fondues matched with luxury alpine lodges.',
    matchPercentage: 97,
    estimatedBudget: '$3,000 - $7,000'
  }
];

// Fallback Helper to Get Curated Destination Array
function getFallbackDestination(prefs: any): any {
  // Find match in our inventory
  let matches = DESTINATION_STOCKS.filter(d => 
    d.region === prefs.region || d.vibes.some((v: string) => prefs.vibes.includes(v))
  );

  if (matches.length === 0) {
    matches = DESTINATION_STOCKS;
  }

  // Shuffle & Pick 1
  const picked = matches[Math.floor(Math.random() * matches.length)];

  // Inject user inputs to make it highly tailored
  const budgetTier = prefs.budget;
  const days = prefs.duration === 'Weekend' ? 2 : prefs.duration === '3 Days' ? 3 : prefs.duration === '5 Days' ? 5 : prefs.duration === '7 Days' ? 7 : 10;
  
  // Custom Attractions based on picked name
  const attractions = [
    {
      name: picked.name === 'Udaipur' ? 'City Palace Grand Tour' : picked.name === 'Kyoto' ? 'Fushimi Inari Shrine Hike' : picked.name === 'Andaman Islands' ? 'Radhanagar White Beach Sunset' : 'Jungfraujoch Snow Ridge Ride',
      rating: 4.9,
      reviewsCount: 14205,
      distance: '1.2 km from City Center',
      timings: '09:00 AM - 05:30 PM',
      entryFee: picked.name === 'Udaipur' ? '₹250 per Person' : picked.name === 'Kyoto' ? 'Free Entrance' : picked.name === 'Andaman Islands' ? 'Free Entrance' : 'CHF 180 (Cable Roundtip)',
      description: 'The iconic landmark highlight of the destination offering magnificent vistas, historic architecture, and incredible photographic backdrops.',
      imageUrl: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&q=80&w=500'
    },
    {
      name: picked.name === 'Udaipur' ? 'Lake Pichola Amber Sunset Cruise' : picked.name === 'Kyoto' ? 'Arashiyama Quiet Bamboo Walk' : picked.name === 'Andaman Islands' ? 'Haveland Coral Scuba Expedition' : 'Interlaken Tandem Paraglide Launch',
      rating: 4.8,
      reviewsCount: 8940,
      distance: '0.5 km from City Center',
      timings: '04:00 PM - 07:00 PM',
      entryFee: picked.name === 'Udaipur' ? '₹700 per cruise' : picked.name === 'Kyoto' ? 'Free Entrance' : '₹3500 per dive session',
      description: 'An immersive natural experience that connects you deeply with the raw spirit of the destination, perfect for couples and explorers.',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=500'
    },
    {
      name: picked.name === 'Udaipur' ? 'Sajjangarh Monsoon Hill Fort' : picked.name === 'Kyoto' ? 'Gion Geisha Historic Alleyways' : picked.name === 'Andaman Islands' ? 'Chidiya Tapu Forest Canopy' : 'Lauterbrunnen Valley of 72 Waterfalls',
      rating: 4.7,
      reviewsCount: 5410,
      distance: '4.5 km from Center',
      timings: '08:00 AM - 06:00 PM',
      entryFee: 'Standard Entry Token',
      description: 'A gorgeous lookout point giving a 360-degree epic vista over green forests, mountains, or clear lakes.',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=500'
    }
  ];

  // Custom Hotels
  const hotels = [
    {
      name: picked.name === 'Udaipur' ? 'The Taj Lake Palace Floating Marvel' : picked.name === 'Kyoto' ? 'The Ritz-Carlton Riverside Kyoto Sanctuary' : picked.name === 'Andaman Islands' ? 'Taj Exotica Resort & Spa Radhanagar' : 'Victoria Jungfrau Grand Hotel & Spa',
      price: budgetTier === 'Luxury' ? '$650/night' : budgetTier === 'Premium' ? '$320/night' : budgetTier === 'Standard' ? '$180/night' : '$90/night',
      rating: 4.9,
      reviewsCount: 1850,
      amenities: ['Lakeside Infinity Pool', '24/7 Royal butler butler', 'Luxury Wellness Ayurveda Spa', 'Premium Free High-speed Wifi'],
      locationDesc: 'Suspended in absolute premium serenity with direct private views of the landmark scenery.',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=500'
    },
    {
      name: picked.name === 'Udaipur' ? 'Ambrai Haveli boutique inn' : picked.name === 'Kyoto' ? 'Ryokan Gion Morisho Traditional Mat' : picked.name === 'Andaman Islands' ? 'Symphony Palms Beach Cottage' : 'Hotel Interlaken Historic Alpine Chalet',
      price: budgetTier === 'Luxury' ? '$380/night' : budgetTier === 'Premium' ? '$190/night' : budgetTier === 'Standard' ? '$110/night' : '$60/night',
      rating: 4.7,
      reviewsCount: 2980,
      amenities: ['Authentic rooftop dinery', 'Traditional wooden garden', 'Open patio beach hammocks', 'Organic complimentary breakfast'],
      locationDesc: 'Steps away from historic pathways, boutique markets, and delightful tea cafes.',
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=500'
    }
  ];

  // Custom Foods
  const foods = [
    {
      name: picked.name === 'Udaipur' ? 'Classic Mewari Dal Baati Churma' : picked.name === 'Kyoto' ? 'Premium Kaiseki Multi-Course Feast' : picked.name === 'Andaman Islands' ? 'Butter Garlic Saltwater Lobster' : 'Hot Bubbling Swiss Gruyère Fondue',
      description: 'The hallmark traditional delicacy prepared using ancestral culinary methods, representing the deepest soul of local identity.',
      priceRange: budgetTier === 'Luxury' ? 'Luxury Dining (Included)' : 'Premium $40-60',
      recommendedRestaurants: ['Ambrai Heritage Restaurant', 'Gion Traditional Houses', 'Something Something Beach Shack', 'Schuh Glacier Dining Room'],
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500'
    },
    {
      name: picked.name === 'Udaipur' ? 'Laal Maas (Spicy Mewari Mutton)' : picked.name === 'Kyoto' ? 'Uji Matcha Ceremonial Soba' : picked.name === 'Andaman Islands' ? 'Grilled Coconut Crab Skewers' : 'Fluffy Glacial Chocolate Rosti',
      description: 'A delicious combination of sweet, savory, and deep earthy herbs loved by generations.',
      priceRange: '$12 - $30',
      recommendedRestaurants: ['Palace Courtyard Grill', 'Teahouse Sho-an', 'Barefoot Beach Dining', 'Chalet Interlaken Cafe'],
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500'
    }
  ];

  // Dynamic Day-by-day Itinerary Builder
  const itinerary: any[] = [];
  const transportationType = prefs.transport;
  for (let i = 1; i <= days; i++) {
    itinerary.push({
      dayNumber: i,
      morning: {
        activity: i === 1 
          ? `Arrival, luggage dropoff, private check-in, and morning briefing with local guide.` 
          : `Scenic early morning trek to witness the sunrise. Ambient photo opportunity.`,
        cost: budgetTier === 'Luxury' || budgetTier === 'Premium' ? 'Included' : '$10 per Person',
        duration: '2.5 Hours'
      },
      afternoon: {
        activity: `Guided historic heritage walk in the artisan markets. Lunch at a premium panoramic view patio.`,
        cost: '$15 - $45',
        duration: '3.5 Hours'
      },
      evening: {
        activity: `Private lakeside or mountain sunset cruise by ${transportationType === 'Flight' ? 'VIP transfer' : 'Premium Shuttle'}, followed by authentic local live music performance and royal dinner.`,
        cost: budgetTier === 'Luxury' ? 'Included in Package' : '$25',
        duration: '3 Hours'
      },
      totalDistanceCovered: `${3 + i * 2} km (using private premium travel suite)`,
      dailyAdvice: `Wear highly breathable walking shoes. Keep your camera charged as sunsets here are absolute visual highlights.`
    });
  }

  return {
    name: picked.name,
    country: picked.country,
    matchPercentage: picked.matchPercentage,
    reasonForRecommendation: picked.reason,
    estimatedBudget: picked.estimatedBudget,
    bestSeason: picked.bestSeason,
    overview: picked.overview,
    weatherForecast: picked.weatherForecast,
    safetyInfo: picked.safetyInfo,
    localLanguage: picked.localLanguage,
    currency: picked.currency,
    visaInformation: picked.visaInformation,
    imageUrl: picked.imageUrl,
    attractions,
    hotels,
    foods,
    itinerary
  };
}

// Helper to parse cookies from headers
function parseCookies(cookieHeader?: string) {
  const cookies: { [key: string]: string } = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      cookies[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
  return cookies;
}

// REST APIs for Authentication
app.get('/api/auth/session', (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies['session_id'];
  if (!sessionId) {
    return res.json({ user: null });
  }
  const user = db.users.find(u => u.id === sessionId);
  if (!user) {
    return res.json({ user: null });
  }
  res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict');
  res.json({ success: true });
});

app.post('/api/auth/register', (req, res) => {
  const { fullName, email, mobileNumber, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'All primary fields are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = db.users.find(u => u.email === normalizedEmail);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: 'user-' + Date.now(),
    fullName,
    email: normalizedEmail,
    mobileNumber: mobileNumber || '',
    password,
    role: (normalizedEmail === 'yashsgehlot1412@gmail.com') ? 'admin' : 'user',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  // Set Cookie for session mapping
  res.setHeader('Set-Cookie', `session_id=${newUser.id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000`);

  // Return session info
  res.json({
    token: 'jwt-token-mock-' + newUser.id,
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      mobileNumber: newUser.mobileNumber,
      role: newUser.role,
      createdAt: newUser.createdAt
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password, mobileNumber, mode } = req.body;

  if (mode === 'mobile') {
    const user = db.users.find(u => u.mobileNumber === mobileNumber);
    if (!user) {
      return res.status(400).json({ error: 'Mobile number not registered. Please register first.' });
    }
    // Set Cookie for session mapping
    res.setHeader('Set-Cookie', `session_id=${user.id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000`);

    // Simulate mobile login bypass after OTP
    return res.json({
      token: 'jwt-token-mock-' + user.id,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  }

  const normalizedEmail = email?.toLowerCase().trim();
  const user = db.users.find(u => u.email === normalizedEmail && u.password === password);

  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password credentials.' });
  }

  // Set Cookie for session mapping
  res.setHeader('Set-Cookie', `session_id=${user.id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000`);

  res.json({
    token: 'jwt-token-mock-' + user.id,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// Simulate Sending email or OTP code
app.post('/api/auth/send-otp', (req, res) => {
  const { mobileNumber } = req.body;
  if (!mobileNumber) return res.status(400).json({ error: 'Missing mobile number' });
  // Dynamic random OTP simulated code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  res.json({ success: true, message: `Simulated SMS sent! Your verification code is ${code}`, otpCode: code });
});

app.post('/api/auth/send-reset-link', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email parameter required.' });
  res.json({ success: true, message: `Simulated Reset Request: A recovery Link has been dispatched to ${email}.` });
});

// REST APIs for Saved Trips and Itineraries
app.post('/api/trips/generate', async (req, res) => {
  const { region, companion, vibes, budget, duration, transport, weather } = req.body;
  
  if (!region || !companion || !vibes || !budget || !duration || !transport || !weather) {
    return res.status(400).json({ error: 'Some options are missing from the planning workflow.' });
  }

  // Update backend analytics internally
  db.analytics.tripsCount += 1;
  vibes.forEach((v: string) => {
    db.analytics.popularVibes[v] = (db.analytics.popularVibes[v] || 0) + 1;
  });
  db.analytics.budgetDistribution[budget] = (db.analytics.budgetDistribution[budget] || 0) + 1;
  writeDB(db);

  const gemini = getGeminiClient();

  if (!gemini) {
    // If API key is missing, respond instantly with beautiful curated matching stock from database
    console.log('Gemini API key is not active. Using custom premium stock matching.');
    const fallbackDestination = getFallbackDestination({ region, companion, vibes, budget, duration, transport, weather });
    return res.json({ success: true, isUsingFallback: true, destination: fallbackDestination });
  }

  try {
    const prompt = `You are a world-class luxury AI Travel Architect Planner for TravelAI.
Your goal is to recommend the single absolute BEST matching travel destination and generate a complete premium trip plan for a user with these choices:
- Destination Region: ${region} (India or Abroad matching)
- Travelling Companions: ${companion}
- Core Ambience Vibes: ${vibes.join(', ')}
- Budget Tier: ${budget}
- Trip Length: ${duration}
- Transportation Mode Preferred: ${transport}
- Weather Vibe: ${weather}

Recommend ONE specific, breathtaking destination. Provide a professional detailed payload matching this precise structural JSON declaration. Make the recommendations highly realistic, detailed, containing real top attractions, premium hotel names suitable to the budget tier, local culinary foods, and a comprehensive day-by-day morning/afternoon/evening itinerary. Do not truncate the JSON response under any circumstances. Ensure every itinerary day has unique premium local activity names.

JSON schema structure:
{
  "name": "Specific City/Region Name",
  "country": "Country Name",
  "matchPercentage": 97,
  "reasonForRecommendation": "Brief luxury reason explaining why it fits companion, vibes, and budget.",
  "estimatedBudget": "Budget estimate string (e.g. $1,500 - $3,000)",
  "bestSeason": "Best months to visit",
  "overview": "Immersive luxury editorial overview paragraph.",
  "weatherForecast": "Detailed description of weather in best season.",
  "safetyInfo": "Precise traveler safety advice.",
  "localLanguage": "Spoken languages list",
  "currency": "Local currency code & name",
  "visaInformation": "Visa instructions for standard travelers.",
  "imageUrl": "Pick a highly beautiful tourism scenery photo URL from unsplash.com (e.g. https://images.unsplash.com/photo-...) that fits the location name.",
  "attractions": [
    {
      "name": "Attraction Name",
      "rating": 4.8,
      "reviewsCount": 12500,
      "distance": "Distance from center",
      "timings": "Open/closed timings",
      "entryFee": "Ticket price or Free",
      "description": "Short gorgeous highlight details."
    }
  ],
  "hotels": [
    {
      "name": "Luxury Hotel/Resort Name",
      "price": "$ value per night",
      "rating": 4.9,
      "reviewsCount": 2400,
      "amenities": ["Infinity view Pool", "Spa", "Free Wifi", "Private Transfer"],
      "locationDesc": "Visual overview of placement"
    }
  ],
  "foods": [
    {
      "name": "Must try dish name",
      "description": "Flavor profiles & significance",
      "priceRange": "Price tier description",
      "recommendedRestaurants": ["Authentic local diner names"]
    }
  ],
  "itinerary": [
    {
      "dayNumber": 1,
      "morning": { "activity": "Morning action description", "cost": "Estimated cost", "duration": "2 Hours" },
      "afternoon": { "activity": "Afternoon exploration description", "cost": "Estimated cost", "duration": "3 Hours" },
      "evening": { "activity": "Evening romantic/lux sunset highlight", "cost": "Estimated cost", "duration": "3 Hours" },
      "totalDistanceCovered": "Distance e.g. 5 km",
      "dailyAdvice": "Crucial pro tips for clothing or routes."
    }
  ]
}`;

    const response = await gemini.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            country: { type: Type.STRING },
            matchPercentage: { type: Type.NUMBER },
            reasonForRecommendation: { type: Type.STRING },
            estimatedBudget: { type: Type.STRING },
            bestSeason: { type: Type.STRING },
            overview: { type: Type.STRING },
            weatherForecast: { type: Type.STRING },
            safetyInfo: { type: Type.STRING },
            localLanguage: { type: Type.STRING },
            currency: { type: Type.STRING },
            visaInformation: { type: Type.STRING },
            imageUrl: { type: Type.STRING },
            attractions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  reviewsCount: { type: Type.NUMBER },
                  distance: { type: Type.STRING },
                  timings: { type: Type.STRING },
                  entryFee: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            hotels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  reviewsCount: { type: Type.NUMBER },
                  amenities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  locationDesc: { type: Type.STRING }
                }
              }
            },
            foods: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priceRange: { type: Type.STRING },
                  recommendedRestaurants: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  morning: {
                    type: Type.OBJECT,
                    properties: {
                      activity: { type: Type.STRING },
                      cost: { type: Type.STRING },
                      duration: { type: Type.STRING }
                    }
                  },
                  afternoon: {
                    type: Type.OBJECT,
                    properties: {
                      activity: { type: Type.STRING },
                      cost: { type: Type.STRING },
                      duration: { type: Type.STRING }
                    }
                  },
                  evening: {
                    type: Type.OBJECT,
                    properties: {
                      activity: { type: Type.STRING },
                      cost: { type: Type.STRING },
                      duration: { type: Type.STRING }
                    }
                  },
                  totalDistanceCovered: { type: Type.STRING },
                  dailyAdvice: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const bodyText = response.text;
    if (!bodyText) {
      throw new Error('Emply payload returned from Gemini');
    }

    const parsedData = JSON.parse(bodyText.trim());

    // Clean up or inject dummy images for hotels and attractions if Gemini provided empty ones
    if (parsedData.attractions) {
      parsedData.attractions = parsedData.attractions.map((a: any, index: number) => ({
        ...a,
        imageUrl: index === 0 
          ? 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&q=80&w=500' 
          : index === 1 
          ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=500' 
          : 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=500'
      }));
    }
    if (parsedData.hotels) {
      parsedData.hotels = parsedData.hotels.map((h: any, index: number) => ({
        ...h,
        imageUrl: index === 0 
          ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=500' 
          : 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=500'
      }));
    }
    if (parsedData.foods) {
      parsedData.foods = parsedData.foods.map((f: any, index: number) => ({
        ...f,
        imageUrl: index === 0 
          ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500' 
          : 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500'
      }));
    }

    // Default Unsplash placeholder if gemini breaks Unsplash pattern
    if (!parsedData.imageUrl || !parsedData.imageUrl.includes('unsplash.com')) {
      parsedData.imageUrl = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800';
    }

    res.json({ success: true, isUsingFallback: false, destination: parsedData });
  } catch (error) {
    console.error('Gemini content generation failed, resorting to matching engine.', error);
    const fallbackDestination = getFallbackDestination({ region, companion, vibes, budget, duration, transport, weather });
    res.json({ success: true, isUsingFallback: true, destination: fallbackDestination });
  }
});

// Save and Load Saved Itineraries
app.post('/api/trips/save', (req, res) => {
  const { userId, preferences, destination } = req.body;
  
  if (!userId || !destination) {
    return res.status(400).json({ error: 'Incomplete parameters to save.' });
  }

  const newSaved = {
    id: 'trip-' + Date.now(),
    userId,
    preferences,
    destination,
    createdAt: new Date().toISOString()
  };

  db.savedTrips.push(newSaved);
  
  // Track activity to feed Admin panel
  db.analytics.tripsCount = db.savedTrips.length;
  writeDB(db);

  res.json({ success: true, savedTrip: newSaved });
});

app.get('/api/trips/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const list = db.savedTrips.filter(t => t.userId === userId);
  res.json(list);
});

app.delete('/api/trips/:tripId', (req, res) => {
  const tripId = req.params.tripId;
  const initialLen = db.savedTrips.length;
  db.savedTrips = db.savedTrips.filter(t => t.id !== tripId);
  writeDB(db);
  res.json({ success: db.savedTrips.length < initialLen });
});

// AI Travel Assistant chatbot
app.post('/api/chat', async (req, res) => {
  const { messages, destinationName, companion, vibe } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: 'Please provide some messages context.' });
  }

  const latestMessage = messages[messages.length - 1].content;
  const gemini = getGeminiClient();

  if (!gemini) {
    // Elegant expert system response fallback if key is missing
    let responseText = 'Thank you for reaching out to your TravelAI Guide! ';
    const lower = latestMessage.toLowerCase();
    
    if (lower.includes('safe') || lower.includes('safety')) {
      responseText += `Regarding ${destinationName || 'your travel'}, it is generally rated as very safe for tourists and solo visitors. Ensure you use certified hotel transfer services, book excursions through registered regional guides, and keep local emergency hotline cards handy inside your bag.`;
    } else if (lower.includes('pack') || lower.includes('clothing') || lower.includes('wear')) {
      responseText += `For ${destinationName || 'your trip'}, we highly recommend packing: 1) Universal dual-voltage adapter plugs, 2) Layers of micro-breathable clothing, 3) Durable grip walking sneakers, and 4) A light rain shell. Let me know if you would like me to draft a complete list for your ${companion || 'companion'} entourage!`;
    } else if (lower.includes('restaurant') || lower.includes('food') || lower.includes('eat')) {
      responseText += `We highly suggest trying local artisanal bistros off the tourist avenues. If visiting ${destinationName || 'this destination'}, try their traditional signature dish cooked slow in earthen stone pots. Avoid raw central tap waters, and drink bottled premium mineral brands.`;
    } else {
      responseText += `That is a magnificent interest! Exploring the local gems of ${destinationName || 'your destination'} can be made much simpler. What specific details would you like to plan first, perhaps travel dates, packing guidelines, or direct train booking numbers?`;
    }
    return res.json({ response: responseText });
  }

  try {
    const chatContextPrompt = `You are "TravelAssistant", a legendary luxurious AI traveling concierge and local insider for TravelAI.
You are helping travelers explore their choices.
Current Travel Context:
- Recommended Destination: ${destinationName || 'A general global destination'}
- Companion group: ${companion || 'Solo travelers'}
- Main holiday theme: ${vibe || 'Leisure and cultural'}

Be conversational, highly helpful, witty, objective, and structure your responses with elegant readable markdown (bold headings, neat spacing). Suggest authentic local secrets, packing essentials, and delicious food suggestions.`;

    const chatInstance = gemini.chats.create({
      model: 'gemini-3.5-flash',
      config: {
        systemInstruction: chatContextPrompt
      }
    });

    // Feed conversational history
    for (let i = 0; i < messages.length - 1; i++) {
       // Gemini chat handles conversation internally, but we can send messages in sequence
       // To be robust and bypass complex states, we generate content using full conversational prompt context
    }

    const fullHistoryContext = messages.map((m: any) => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const promptMessage = `${fullHistoryContext}\nAssistant:`;

    const reply = await gemini.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        { text: chatContextPrompt },
        { text: promptMessage }
      ]
    });

    res.json({ response: reply.text || 'My apologies, I could not structure a reply at this second.' });
  } catch (error) {
    console.error('Lobby travel chat failed', error);
    res.json({ response: 'I am experiencing a momentary cloud link issue. Let me recommend standard luxury guidelines: always pack fresh light cotton, explore lakeside cafes early at 08:30 AM to beat peak lines, and always travel with high SPF sunscreen!' });
  }
});

// Admin Panel APIs
app.get('/api/admin/analytics', (req, res) => {
  // Compute analytics dynamically
  const totalUsers = db.users.length;
  const totalTripsGenerated = db.savedTrips.length + db.analytics.tripsCount;
  
  // Aggregate stats from DB entries
  const vibeCounts: { [key: string]: number } = { ...db.analytics.popularVibes };
  const budgetCounts: { [key: string]: number } = { ...db.analytics.budgetDistribution };

  db.savedTrips.forEach(t => {
    if (t.preferences && t.preferences.vibes) {
      t.preferences.vibes.forEach((v: string) => {
        vibeCounts[v] = (vibeCounts[v] || 0) + 1;
      });
    }
    if (t.preferences && t.preferences.budget) {
      const b = t.preferences.budget;
      budgetCounts[b] = (budgetCounts[b] || 0) + 1;
    }
  });

  // Convert to arrays
  const popularVibes = Object.entries(vibeCounts).map(([vibe, count]) => ({ vibe, count })).sort((a,b) => b.count - a.count).slice(0, 5);
  const budgetDistribution = Object.entries(budgetCounts).map(([tier, count]) => ({ tier, count }));

  // Formulate recent activities
  const recentActivity = db.savedTrips.slice(-5).reverse().map((t, idx) => ({
    id: `act-${idx}`,
    description: `Generated premium trip plan to ${t.destination.name}`,
    time: new Date(t.createdAt).toLocaleTimeString(),
    user: db.users.find(u => u.id === t.userId)?.fullName || 'Guest Traveler'
  }));

  res.json({
    totalUsers,
    totalTripsGenerated,
    popularVibes,
    budgetDistribution,
    activeSessions: 3,
    recentActivity: recentActivity.length ? recentActivity : [
      { id: 'act-d1', description: 'System database seeded successfully', time: '10:00:00 AM' },
      { id: 'act-d2', description: 'Admin console synced with main line routing', time: '10:05:00 AM' }
    ]
  });
});

app.get('/api/admin/users', (req, res) => {
  // Exclude passwords
  const list = db.users.map(u => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    mobileNumber: u.mobileNumber,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.json(list);
});

app.post('/api/admin/users/delete', (req, res) => {
  const { userId } = req.body;
  if (userId === 'admin-1') return res.status(400).json({ error: 'Cannot delete primary root administrator' });
  db.users = db.users.filter(u => u.id !== userId);
  writeDB(db);
  res.json({ success: true });
});

// Blog REST APIS
app.get('/api/blogs', (req, res) => {
  res.json(db.blogs);
});

app.post('/api/blogs', (req, res) => {
  const { title, excerpt, content, imageUrl, author, category } = req.body;
  const newPost = {
    id: 'blog-' + Date.now(),
    title,
    excerpt,
    content,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    author: author || 'TravelAI Editorial',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    category: category || 'General Travel',
    readTime: '4 min read'
  };
  db.blogs.unshift(newPost);
  writeDB(db);
  res.json({ success: true, blog: newPost });
});

// Contact Query REST API
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  const newMessage = {
    id: 'msg-' + Date.now(),
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString()
  };
  db.messages.push(newMessage);
  writeDB(db);
  res.json({ success: true, message: 'Message securely delivered. TravelAI will respond back inside 12 hours.' });
});


// Dev & Production serving logic
async function bootstrapServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TravelAI FULLSTACK ENGINE] running on http://localhost:${PORT}`);
  });
}

bootstrapServer();

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// User and Session Types
export interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Session {
  token: string;
  user: User;
}

// Preference Types for AI Planner
export type RegionPreference = 'India' | 'Abroad';

export type CompanionPreference =
  | 'Solo'
  | 'Couple'
  | 'Family'
  | 'Friends'
  | 'Honeymoon'
  | 'Business'
  | 'Senior Citizens'
  | 'Adventure Group';

export type VibePreference =
  | 'Spiritual'
  | 'Romantic'
  | 'Adventure'
  | 'Luxury'
  | 'Peaceful'
  | 'Culture'
  | 'Nature'
  | 'Wildlife'
  | 'Food'
  | 'Beach'
  | 'Mountains'
  | 'Party'
  | 'Wellness';

export type BudgetPreference = 'Budget' | 'Standard' | 'Premium' | 'Luxury';

export type DurationPreference = 'Weekend' | '3 Days' | '5 Days' | '7 Days' | '10+ Days';

export type TransportPreference = 'Flight' | 'Train' | 'Bus' | 'Road Trip';

export type WeatherPreference = 'Cold' | 'Moderate' | 'Warm';

export interface TripPreferences {
  region: RegionPreference;
  companion: CompanionPreference;
  vibes: VibePreference[];
  budget: BudgetPreference;
  duration: DurationPreference;
  transport: TransportPreference;
  weather: WeatherPreference;
}

// Recommendation Result Types
export interface Attraction {
  name: string;
  rating: number;
  reviewsCount: number;
  distance: string;
  timings: string;
  entryFee: string;
  description: string;
  imageUrl?: string;
}

export interface Hotel {
  name: string;
  price: string;
  rating: number;
  reviewsCount: number;
  amenities: string[];
  locationDesc: string;
  imageUrl?: string;
}

export interface FoodDish {
  name: string;
  description: string;
  priceRange: string;
  recommendedRestaurants: string[];
  imageUrl?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  morning: { activity: string; cost: string; duration: string };
  afternoon: { activity: string; cost: string; duration: string };
  evening: { activity: string; cost: string; duration: string };
  totalDistanceCovered: string;
  dailyAdvice: string;
}

export interface RecommendedDestination {
  name: string;
  country: string;
  matchPercentage: number;
  reasonForRecommendation: string;
  estimatedBudget: string;
  bestSeason: string;
  overview: string;
  weatherForecast: string;
  safetyInfo: string;
  localLanguage: string;
  currency: string;
  visaInformation: string;
  imageUrl: string;
  attractions: Attraction[];
  hotels: Hotel[];
  foods: FoodDish[];
  itinerary: ItineraryDay[];
}

export interface SavedTrip {
  id: string;
  userId: string;
  preferences: TripPreferences;
  destination: RecommendedDestination;
  createdAt: string;
}

// Chat API Types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Admin Panel Analytics Types
export interface AdminAnalytics {
  totalUsers: number;
  totalTripsGenerated: number;
  popularVibes: { vibe: string; count: number }[];
  budgetDistribution: { tier: string; count: number }[];
  activeSessions: number;
  recentActivity: {
    id: string;
    description: string;
    time: string;
    user?: string;
  }[];
}

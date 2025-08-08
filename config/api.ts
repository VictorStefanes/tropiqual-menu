// Future API Integration Configuration
// Uncomment and configure when ready to integrate with Google Places API

export const API_CONFIG = {
  // Google Places API configuration
  google: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '',
    placeId: '', // Tropiqual's Google Place ID (to be obtained)
    fields: [
      'rating',
      'user_ratings_total',
      'reviews',
      'opening_hours',
      'photos'
    ]
  },
  
  // Alternative APIs for consideration
  alternatives: {
    yelp: {
      apiKey: process.env.YELP_API_KEY || '',
      businessId: '' // Tropiqual's Yelp Business ID
    },
    foursquare: {
      apiKey: process.env.FOURSQUARE_API_KEY || '',
      venueId: '' // Tropiqual's Foursquare Venue ID
    }
  }
};

// Future function to fetch real data
export async function fetchRestaurantStats() {
  // Placeholder for future implementation
  // Will replace the static data in RestaurantStats.tsx
  
  try {
    // Google Places API call would go here
    // const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${API_CONFIG.google.placeId}&fields=${API_CONFIG.google.fields.join(',')}&key=${API_CONFIG.google.apiKey}`);
    // const data = await response.json();
    
    // Return formatted data
    // return {
    //   rating: data.result.rating,
    //   totalReviews: data.result.user_ratings_total,
    //   // ... other data
    // };
    
    return null; // For now, return null to use static data
  } catch (error) {
    console.error('Error fetching restaurant stats:', error);
    return null; // Fallback to static data
  }
}

// Static data for current use (realistic estimates based on 2020 establishment)
export const FALLBACK_STATS = [
  {
    value: "4.3",
    label: "Valoración",
    description: "Clientes satisfechos"
  },
  {
    value: "3K+",
    label: "Clientes",
    description: "Nos visitan cada año"
  },
  {
    value: "5",
    label: "Años",
    description: "De experiencia"
  },
  {
    value: "2",
    label: "Reconocimientos",
    description: "Locales recibidos"
  }
];

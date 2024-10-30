interface PropertyData {
  title: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  features: string[];
  houseRules: string[];
  services: string[];
  safetyFeatures: string[]; 
  propertyType: string; 
  nearbyAttractions: string[]; 
  minStay: number; 
  blockedDates: string[]; // format as 'YYYY-MM-DD'
  maxGuests: number; 
  bedrooms: number; 
  beds: number; 
  baths: number; 
  imageUrls: string[];
  createdAt: Date;
}
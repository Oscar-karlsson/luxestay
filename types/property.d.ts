interface PropertyData {
  title: string;
  description: string;
  price: number;
  latitude: number;  
  longitude: number; 
  address: string;
  city: string;
  country: string;
  postalCode: string;
  features: string[];
  houseRules: string[];
  services: string[];
  images: string[]; // URLs of the uploaded images
  createdAt: string;
}
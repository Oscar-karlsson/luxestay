export type Review = {
    name: string;
    review: string;
    date: string;
    ranking: number;
  };
  
  export type Property = {
    id: number;
    title: string;
    location: string;
    pricePerNight: number;
    rating: number;
    images: string[];
    isFavorite: boolean;
    details: {
      hostedBy: string;
      description: string;
      address: string;
      mapUrl: string;
      features: string[];
      houseRules: Record<string, string>;
      reviews: Review[];
    };
  };
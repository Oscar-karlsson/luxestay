import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import FavoriteStar from '@/components/FavoriteStar';

interface Property {
  id: number;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  isFavorite: boolean;
  images: string[];
  reviews?: { name: string; review: string; date: string; ranking: number }[];
}

interface FavoriteCardProps {
  property: Property;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ property }) => {
    return (
        <div className="flex flex-row lg:flex-col bg-white rounded-lg shadow-md w-full relative">
        
          {/* Image Section */}
          <div className="w-1/3 lg:w-full h-48 lg:h-auto relative">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover rounded-l-lg lg:rounded-t-lg lg:rounded-none"
            />
            {/* Favorite Star on top of the image, top-right corner for larger screens */}
            <div className="hidden lg:block absolute top-2 right-2">
              <FavoriteStar isFavorite={property.isFavorite} />
            </div>
          </div>
        
          {/* Content Section */}
          <div className="p-4 flex flex-col justify-between w-2/3 lg:w-full">
        
            {/* Top Section for smaller screens: Rating, Favorite Star, and Title */}
            <div className="lg:hidden flex justify-between items-center">
              {/* Rating on the left */}
              <span className="text-gray-600 flex items-center">
                <AiFillStar className="text-yellow-500" />
                <span className="ml-1">{property.rating.toFixed(1)} ({property.reviews?.length || 0})</span>
              </span>
        
              {/* Favorite Star on the right */}
              <FavoriteStar isFavorite={property.isFavorite} />
            </div>
        
            {/* Title stays under the rating on smaller screens */}
            <h2 className="text-lg font-semibold lg:hidden mt-2">{property.title}</h2>
        
            {/* Location for smaller screens */}
            <p className="text-sm text-gray-500 mt-2 lg:hidden">{property.location}</p>
        
            {/* Bottom Section for smaller screens: Price on the left */}
            <div className="flex justify-start items-center mt-2 lg:hidden">
              <span className="text-lg font-bold">
                €{property.pricePerNight.toLocaleString()} / night
              </span>
            </div>
        
            {/* For larger screens: Title with rating on the same row */}
            <div className="hidden lg:flex justify-between items-center">
              <h2 className="text-lg font-semibold">{property.title}</h2>
              <span className="text-gray-600 flex items-center">
                <AiFillStar className="text-yellow-500" />
                <span className="ml-1">{property.rating.toFixed(1)} ({property.reviews?.length || 0})</span>
              </span>
            </div>
            
            {/* Location for larger screens */}
            <p className="text-sm text-gray-500 mt-2 hidden lg:block">{property.location}</p>
    
            {/* Price for larger screens, below location */}
            <div className="hidden lg:block mt-2">
              <span className="text-lg font-bold">
                €{property.pricePerNight.toLocaleString()} / night
              </span>
            </div>
          </div>
        </div>
      );
    };

export default FavoriteCard;

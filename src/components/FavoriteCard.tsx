import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import FavoriteStar from '@/components/FavoriteStar';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/formatPrice';
import { useUser } from '@clerk/clerk-react';
import RatingDisplay from './RatingDisplay';

interface Property {
  id: string;
  title: string;
  city: string;
  country: string;
  price: string;
  rating: number;
  userID: string[];
  isFavorite: boolean;
  imageUrls: string[];
  reviews?: { name: string; review: string; date: string; ranking: number }[];
}

interface FavoriteCardProps {
  property: Property;
  averageRating: number;
  totalReviews: number;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ property, averageRating, totalReviews }) => {
  const { user } = useUser();
  const userId = user ? user.id : '';


  

  return (
    <div className="relative">
    {/* Favorite Star for larger screens */}
    <div className="hidden lg:block absolute top-2 right-2 z-10" onClick={(event) => event.stopPropagation()}>
      <FavoriteStar isFavorite={property.isFavorite} propertyId={property.id} userId={userId} />
    </div>

    <Link href={`/properties/${property.id}`} passHref>
      <div className="flex flex-row lg:flex-col bg-white rounded-lg shadow-md w-full relative cursor-pointer">
        {/* Image Section */}
        <div className="w-1/3 lg:w-full h-48 lg:h-64 relative">
          {property.imageUrls && property.imageUrls.length > 0 ? (
            <Image
              src={property.imageUrls[0]}
              alt={property.title}
              layout="fill"
              objectFit="cover"
              className="rounded-l-lg lg:rounded-t-lg lg:rounded-none"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-l-lg lg:rounded-t-lg lg:rounded-none">
              <span className="text-center">No Image Available</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col justify-between w-2/3 lg:w-full">
          {/* Top Section for smaller screens: Rating and Title */}
          <div className="lg:hidden flex justify-between items-center">
            {/* Rating on the left */}
            {totalReviews > 0 && (
    <span className="text-gray-600 flex items-center">
        <RatingDisplay averageRating={averageRating} totalReviews={totalReviews} />
    </span>
)}
          </div>

          {/* Title stays under the rating on smaller screens */}
          <h2 className="text-lg font-semibold lg:hidden mt-2">{property.title}</h2>

          {/* Location for smaller screens */}
          <p className="text-sm text-gray-500 mt-2 lg:hidden">
            {property.city}, {property.country}
          </p>

          {/* Bottom Section for smaller screens: Price on the left */}
          <div className="flex justify-start items-center mt-2 lg:hidden">
            <span className="text-lg font-bold">
              {formatPrice(Number(property.price))} / night
            </span>
          </div>

          {/* For larger screens: Title and rating stay on the same row */}
          <div className="hidden lg:flex justify-between items-center">
            <h2 className="text-lg font-semibold">{property.title}</h2>
            {totalReviews > 0 && (
    <span className="text-gray-600 flex items-center">
        <RatingDisplay averageRating={averageRating} totalReviews={totalReviews} />
    </span>
)}
          </div>

          {/* Location for larger screens */}
          <p className="text-sm text-gray-500 mt-2 hidden lg:block">
            {property.city}, {property.country}
          </p>

          {/* Price for larger screens, below location */}
          <div className="hidden lg:block mt-2">
            <span className="text-lg font-bold">
              {formatPrice(Number(property.price))} / night
            </span>
          </div>
        </div>
      </div>
    </Link>

    {/* Favorite Star for smaller screens */}
    <div className="lg:hidden absolute top-3 right-2 z-10" onClick={(event) => event.stopPropagation()}>
      <FavoriteStar isFavorite={property.isFavorite} propertyId={property.id} userId={userId} />
    </div>
  </div>
);
};

export default FavoriteCard;
'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { IoIosArrowForward,IoIosArrowBack } from "react-icons/io";
import FavoriteStar from './FavoriteStar';
import { formatPrice } from '@/utils/formatPrice';
import Image from 'next/image';
import RatingDisplay from './RatingDisplay';


interface PropertyCardProps {
  id: string;
  title: string;
  city: string;
  country: string;
  price: string;
  totalReviews: number;
  averageRating: number;
  isFavorite: boolean;
  userId: string;
  imageUrls: string[];
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  city,
  country,
  price,
  averageRating,
  totalReviews,
  isFavorite,
  userId,
  imageUrls,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [atStart, setAtStart] = useState(true);
const [atEnd, setAtEnd] = useState(false);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setAtStart(!emblaApi.canScrollPrev());
    setAtEnd(!emblaApi.canScrollNext());
  }, [emblaApi]);

  const scrollPrev = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  
  const scrollNext = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const MAX_VISIBLE_DOTS = 5;

  const getVisibleDots = () => {
    const totalDots = scrollSnaps.length;
  
    // If there are fewer dots than the max, display them all
    if (totalDots <= MAX_VISIBLE_DOTS) {
      return scrollSnaps.map((_, index) => index);
    }
  
    // Center the selected dot at position 3 until near the end
    const halfWindow = Math.floor(MAX_VISIBLE_DOTS / 2);
  
    // If we are near the start, start the window from the first dot
    if (selectedIndex <= halfWindow) {
      return Array.from({ length: MAX_VISIBLE_DOTS }, (_, i) => i);
    }
  
    // If we are near the end, keep the last MAX_VISIBLE_DOTS visible
    if (selectedIndex >= totalDots - halfWindow - 1) {
      return Array.from({ length: MAX_VISIBLE_DOTS }, (_, i) => totalDots - MAX_VISIBLE_DOTS + i);
    }
  
    // Keep the selected dot at the center of the visible window
    return Array.from({ length: MAX_VISIBLE_DOTS }, (_, i) => selectedIndex - halfWindow + i);
  };


  const formattedPrice = formatPrice(Number(price)); // Use the utility function

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden relative">
      
    {/* Favorite Star Icon - Outside Link */}
    <div className="absolute top-2 right-2 z-10" onClick={(event) => event.stopPropagation()}>
    <FavoriteStar userId={userId} propertyId={id.toString()} isFavorite={isFavorite} />
  </div>

    {/* Link wraps the rest of the card */}
    <Link href={`/properties/${id}`} passHref>
      <div className="cursor-pointer">
        {/* Embla Carousel for Images */}
        <div className="relative">
        {imageUrls && imageUrls.length > 0 ? (
    <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
            {imageUrls.map((image, index) => (
                <div key={index} className="embla__slide flex-shrink-0 w-full h-48 lg:h-64 relative">
                <Image
      src={image}
      alt={`${title} Image ${index + 1}`}
      fill
      style={{ objectFit: 'cover' }}
      className="rounded-lg"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={index === 0} // Add priority to the first image
    />
          </div>
        ))}
      </div>
      {!atStart && <button className="arrow arrow--prev" onClick={scrollPrev}><IoIosArrowBack /></button>}
      {!atEnd && <button className="arrow arrow--next" onClick={scrollNext}><IoIosArrowForward /></button>}
    </div>
  ) : (
    <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
      <span>No Image Available</span>
    </div>
  )}

          {/* Pagination Dots */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-4">
            {getVisibleDots().map((dotIndex) => (
              <button
                key={dotIndex}
                className={`w-2 h-2 rounded-full mx-1 ${dotIndex === selectedIndex ? 'bg-black' : 'bg-gray-300'}`}
                onClick={() => scrollTo(dotIndex)}
              />
            ))}
          </div>

        </div>

        {/* Info Section */}
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-primaryText text-h5-mobile sm:text-h5-desktop">{title}</h3>
            {totalReviews > 0 && (
  <div className="flex items-center">
    <RatingDisplay averageRating={averageRating} totalReviews={totalReviews} />
  </div>
)}
          </div>
          <p className="text-primaryText font-medium mt-2 text-b1-mobile sm:text-b1-desktop">
  {city}, {country}
</p>
          <p className="text-secondaryText font-regular mt-2 text-b4-mobile sm:text-b4-desktop">From {formattedPrice} / night</p>
        </div>
      </div>
    </Link>
  </div>
);
};

export default PropertyCard;

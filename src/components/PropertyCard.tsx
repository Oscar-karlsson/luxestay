'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { IoIosArrowForward,IoIosArrowBack } from "react-icons/io";


interface PropertyCardProps {
  id:number;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  isFavorite: boolean;
  images: string[]; // Array of images for the slider
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  location,
  pricePerNight,
  rating,
  isFavorite,
  images
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

  return (
    <Link href={`/properties/${id}`} passHref>
    <div className="bg-white shadow-lg rounded-lg overflow-hidden relative">
      {/* Embla Carousel for Images */}
      <div className="relative">
        {images && images.length > 0 ? (
          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex">
              {images.map((image, index) => (
                <div key={index} className="embla__slide flex-shrink-0 w-full">
                  <img src={image} alt={`${title} Image ${index + 1}`} className="w-full h-48 object-cover" />
                </div>
              ))}
            </div>
            {!atStart && <button className="arrow arrow--prev" onClick={scrollPrev}><IoIosArrowBack/></button>}
{!atEnd && <button className="arrow arrow--next" onClick={scrollNext}><IoIosArrowForward  /></button>}
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
            <span>No Image Available</span>
          </div>
        )}

        {/* Pagination Dots */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-4">
  {scrollSnaps.map((_, index) => (
    <button
      key={index}
      className={`w-2 h-2 rounded-full mx-1 ${
        index === selectedIndex ? 'bg-black' : 'bg-gray-300'
      }`}
      onClick={() => scrollTo(index)}
    />
  ))}
</div>

        {/* Favorite Star Icon */}
        <div className="absolute top-2 right-2">
          <span className="relative">
            {isFavorite ? (
              <AiFillStar className="text-3xl text-favoriteActive absolute" />  // Filled favorite star
            ) : (
              <AiFillStar className="text-3xl text-favoriteInactive absolute" />  // Inactive favorite star
            )}
            <AiOutlineStar className="text-3xl text-favoriteOutline relative" /> {/* Outlined star */}
          </span>
        </div>
      </div>

{/* Info Section */}
<div className="p-4">
  <div className="flex justify-between items-center">
    <h3 className="font-bold text-primaryText text-h5-mobile sm:text-h5-desktop">{title}</h3>
    <div className="flex items-center">
      <AiFillStar className="text-favoriteActive" /> {/* Single star */}
      <span className="ml-2 text-secondaryText text-b1-mobile sm:text-b1-desktop">{rating.toFixed(2)}</span> {/* Numeric rating */}
    </div>
  </div>
  <p className="text-primaryText font-medium mt-2 text-b1-mobile sm:text-b1-desktop">{location}</p>
  <p className="text-secondaryText font-regular mt-2 text-b4-mobile sm:text-b4-desktop">From €{pricePerNight.toLocaleString()} / night</p>
</div>
</div>
</Link>
);
};

export default PropertyCard;

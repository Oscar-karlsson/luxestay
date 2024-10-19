'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import propertyData from '../../../data/properties.json'; 
import { AiFillStar } from 'react-icons/ai';
import { IoIosArrowBack } from "react-icons/io";
import FavoriteStar from '@/components/FavoriteStar';
import BookingBarSmall from '@/components/BookingBarSmall';
import BookingBoxLarge from '@/components/BookingBoxLarge';
import CustomModal from '@/components/CustomModal';
import ShowMoreModal from '@/components/ShowMoreModal';
import ReviewCard from '@/components/ReviewCard';
import EmblaCarouselReact from 'embla-carousel-react';

type ShowMoreSection = 'description' | 'features' | 'houseRules';

const PropertyDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isShowMoreModalOpen, setIsShowMoreModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);
    const propertyId = parseInt(id as string);
    const property = propertyData.find((prop) => prop.id === propertyId);
    const [emblaRef, emblaApi] = EmblaCarouselReact({ loop: false, slidesToScroll: 1 });

    // Set initial "Show More" state for different sections
    const [showMore, setShowMore] = useState({
        description: false,
        features: false,
        houseRules: false
    });

    // Control how many items to show initially for each section
    const maxItemsToShow = {
        description: 150,  // Number of characters for description (optional, you can remove this if not needed)
        features: 3,       // Show 3 features initially
        houseRules: 2      // Show 2 house rules initially
    };

    // Function to set the content for the modal based on the section
    const handleShowMoreToggle = (section: ShowMoreSection | 'review', content: string = '') => {
        let modalContent;
    
        if (section === 'features') {
            modalContent = (
                <ul className="space-y-1 mt-2">
                    {property?.details?.features?.map((feature, index) => (
                        <li key={index} className="text-gray-600">{feature}</li>
                    ))}
                </ul>
            );
        } else if (section === 'houseRules') {
            modalContent = (
                <ul className="space-y-1 mt-2">
                    {Object.entries(property?.details?.houseRules || {}).map(([key, value], index) => (
                        <li key={index} className="text-gray-600">{`${key}: ${value}`}</li>
                    ))}
                </ul>
            );
        } else if (section === 'description') {
            modalContent = <p className="text-gray-700 mt-2">{property?.details?.description}</p>;
        } else if (section === 'review') {
            modalContent = <p className="text-gray-700 mt-2">{content}</p>;
        }
    
        setModalContent(modalContent);  // Set the content for the modal
        setIsShowMoreModalOpen(true);  // Open the modal
    };

    if (!property) return <div>Property not found</div>;

    // Check screen size on component mount
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };
    
        handleResize();  
        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); 

    
    const content = (
        <div className="md:max-w-5xl md:mx-auto pb-16">
            {/* Title for larger screens */}
            <div className="hidden md:block text-2xl font-bold mb-4 md:mt-4">
            {property?.title}
            </div>

            {/* Property Image Section */}
            <div className="relative mb-4">
                <button
                    className="absolute top-4 left-4 flex items-center space-x-2 text-white bg-black/50 p-2 rounded-full"
                    onClick={() => router.back()}>
                    <IoIosArrowBack className="text-2xl" />
                </button>
                <img
                   src={property?.images?.[0]}
                   alt={property?.title} 
                    className="w-full h-auto object-cover"
                />
                <div className="absolute top-4 right-4">
                    <FavoriteStar isFavorite={property.isFavorite} />
                </div>
            </div>

            {/* Grid Layout for Content and Booking Box on Large Screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Details Section */}
                <div className="space-y-4 p-4">
                    <h1 className="text-2xl font-bold md:hidden">{property.title}</h1>

                    <div className="flex items-center space-x-2">
                        <span>{property.location}</span>
                        <div className="flex items-center">
                            <AiFillStar className="text-yellow-500" />
                            <span className="ml-1 text-gray-600">{property.rating.toFixed(1)}</span>
                        </div>
                    </div>

                    <p className="text-gray-700 mt-2">{property?.details?.description}</p>
                    {/* Show More button for description */}
                    {property?.details?.description.length > maxItemsToShow.description && (
                <button
                onClick={() => handleShowMoreToggle('description', property?.details?.description || '')}
                className="text-blue-500 underline mt-2"
              >
                Show More
              </button>
                    )}

                    {/* Divider */}
                    <hr className="block md:hidden my-4 border-t border-divider" />
                    <p className="text-sm text-gray-500 flex items-center">
                        <img
                            src="/profile.png"
                            alt="Profile"
                            className="w-10 h-10 rounded-full mr-2"
                        />
                        Hosted by {property.details.hostedBy}
                    </p>

                    {/* Divider */}
                    <hr className="block md:hidden my-4 border-t border-divider" />

                    {/* Map Section */}
                    <div className="mt-6">
                        <h2 className="text-lg font-bold">Where you'll be</h2>
                        <img src={property.details.mapUrl} alt="Map" className="w-full h-48 object-cover mt-2" />
                    </div>

                    {/* Divider */}
                    <hr className="block md:hidden my-4 border-t border-divider" />

                    {/* What this place offers */}
                    <div className="mt-6">
                        <h2 className="text-lg font-bold">What this place offers</h2>
                        <ul className="space-y-1 mt-2">
                            {property.details.features
                                .slice(0, showMore.features ? property.details.features.length : maxItemsToShow.features)
                                .map((feature, index) => (
                                    <li key={index} className="text-gray-600">{feature}</li>
                                ))
                            }
                        </ul>
                        {property?.details?.features.length > maxItemsToShow.features && (
                            <button
                                onClick={() => handleShowMoreToggle('features')}
                                className="text-blue-500 underline mt-2"
                            >
                                {showMore.features ? "Show Less" : "Show More"}
                            </button>
                        )}
                    </div>

                    {/* Divider */}
                    <hr className="block md:hidden my-4 border-t border-divider" />

                    {/* House Rules */}
                    <div className="mt-6">
                        <h2 className="text-lg font-bold">House rules</h2>
                        <ul className="space-y-1 mt-2">
                            {Object.entries(property.details.houseRules)
                                .slice(0, showMore.houseRules ? Object.keys(property.details.houseRules).length : maxItemsToShow.houseRules)
                                .map(([key, value], index) => (
                                    <li key={index} className="text-gray-600">{`${key}: ${value}`}</li>
                                ))
                            }
                        </ul>
                        {Object.keys(property?.details?.houseRules || {}).length > maxItemsToShow.houseRules && (
                            <button
                                onClick={() => handleShowMoreToggle('houseRules')}
                                className="text-blue-500 underline mt-2"
                            >
                                {showMore.houseRules ? "Show Less" : "Show More"}
                            </button>
                        )}
                    </div>

                    {/* Divider */}
                    <hr className="block md:hidden my-4 border-t border-divider" />

{/* Reviews Section */}
<div className="mt-6">
  <h2 className="text-lg font-bold">Reviews</h2>
  <div className="embla review-slider" ref={emblaRef}>
    <div className="embla__container">
      {property.details.reviews.map((review, index) => (
        <div className="embla__slide" key={index}>
          <ReviewCard
            name={review.name}
            review={review.review}
            date={review.date}
            ranking={review.ranking}
            onShowMore={(fullReview) => {
                setModalContent(fullReview); // Set the content
                setIsShowMoreModalOpen(true); // Open the modal
              }}
          />
        </div>
      ))}
    </div>
  </div>
</div>
                </div>

                {/* Booking Box for Large Screens */}
                <div className="hidden md:block md:sticky md:top-20">
                    <BookingBoxLarge pricePerNight={property.pricePerNight} />
                </div>
            </div>

            {/* Booking Bar for Small Screens */}
            <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
                <BookingBarSmall pricePerNight={property.pricePerNight} />
            </div>
        </div>
    );


    return (
        <>
        {/* Custom modal for small screens */}
        {isSmallScreen && (
            <CustomModal isOpen={true} onClose={() => router.back()}>
                {content}

                {/* Show More Modal inside CustomModal */}
                {isShowMoreModalOpen && (
                    <ShowMoreModal
                        isOpen={isShowMoreModalOpen}
                        onClose={() => setIsShowMoreModalOpen(false)}
                    >
                        <div className="p-4 text-gray-700">
                            {modalContent} {/* Show full review content */}
                        </div>
                        <button
                            className="mt-4 text-blue-500 underline"
                            onClick={() => setIsShowMoreModalOpen(false)} // Close the modal
                        >
                            Close
                        </button>
                    </ShowMoreModal>
                )}
            </CustomModal>
        )}

        {!isSmallScreen && content}

        {/* Show More Modal for larger screens */}
        {!isSmallScreen && isShowMoreModalOpen && (
            <ShowMoreModal
                isOpen={isShowMoreModalOpen}
                onClose={() => setIsShowMoreModalOpen(false)}
            >
                <div className="p-4 text-gray-700">
                    {modalContent} {/* Show full review content */}
                </div>
                <button
                    className="mt-4 text-blue-500 underline"
                    onClick={() => setIsShowMoreModalOpen(false)} // Close the modal
                >
                    Close
                </button>
            </ShowMoreModal>
        )}
    </>
);
};

export default PropertyDetail;
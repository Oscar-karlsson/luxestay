'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/utils/firebase';
import { AiFillStar } from 'react-icons/ai';
import { IoIosArrowBack } from "react-icons/io";
import FavoriteStar from '@/components/FavoriteStar';
import BookingBarSmall from '@/components/BookingBarSmall';
import BookingBoxLarge from '@/components/BookingBoxLarge';
import CustomModal from '@/components/CustomModal';
import ShowMoreModal from '@/components/ShowMoreModal';
import ReviewCard from '@/components/ReviewCard';
import EmblaCarouselReact from 'embla-carousel-react';
import PropertyMap from '@/components/PropertyMap';
import Image from 'next/image';
import { useUser } from '@clerk/clerk-react';
import { getReviewsForProperty } from '@/services/reviewService';
import { FiX } from 'react-icons/fi';
import { timeAgo } from '@/utils/dateUtils';


type ShowMoreSection = 'description' | 'features' | 'houseRules' | 'services' | 'safetyFeatures';

const PropertyDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isShowMoreModalOpen, setIsShowMoreModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);
    const [property, setProperty] = useState<any>(null);
    const [selectedCheckIn, setSelectedCheckIn] = useState<string | null>(null);
    const [selectedCheckOut, setSelectedCheckOut] = useState<string | null>(null);
    const [selectedGuests, setSelectedGuests] = useState<number>(1);
    const [host, setHost] = useState<any>(null);
    const [reviews, setReviews] = useState([]);
    const [emblaRef, emblaApi] = EmblaCarouselReact({ loop: false, slidesToScroll: 1 });
    const { user } = useUser();
const userId = user ? user.id : '';
const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
const [reviewModalContent, setReviewModalContent] = useState<{
    name: string;
    comment: string;
    profileImageUrl: string;
    date: Date;
    ranking: number;
} | null>(null);

    // Set initial "Show More" state for different sections
    const [showMore, setShowMore] = useState({
        description: false,
        features: false,
        houseRules: false,
        services: false,
        safetyFeatures: false
    });

    // Control how many items to show initially for each section
    const maxItemsToShow = {
        description: 150,  // Number of characters for description before truncating
        features: 3,       // Show 3 features initially 
        houseRules: 2,     // Show 2 house rules initially
        services: 2,        // Show 3 services initially
        safetyFeatures: 2  // Show 2 safety features initially
    };


     // Define the function to navigate to the booking review page
     const handleRequestBooking = () => {
        const imageUrl = property.imageUrls?.[0] || '/default-image.jpg';
        router.push(`/book/${property.id}/review?checkIn=${selectedCheckIn}&checkOut=${selectedCheckOut}&guests=${selectedGuests}&price=${property.price}&title=${encodeURIComponent(property.title)}&location=${encodeURIComponent(property.city)}, ${encodeURIComponent(property.country)}&imageUrl=${encodeURIComponent(imageUrl)}`);
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
                    {property?.houseRules && property.houseRules.map((rule, index) => (
                        <li key={index} className="text-gray-600">{rule}</li>
                    ))}
                </ul>
            );
        } else if (section === 'services') {
            modalContent = (
                <ul className="space-y-1 mt-2">
                    {property?.services && property.services.map((service, index) => (
                        <li key={index} className="text-gray-600">{service}</li>
                    ))}
                </ul>
            );
        } else if (section === 'safetyFeatures') {
            modalContent = (
                <ul className="space-y-1 mt-2">
                    {property?.safetyFeatures && property.safetyFeatures.map((feature, index) => (
                        <li key={index} className="text-gray-600">{feature}</li>
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

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const docRef = doc(firestore, 'properties', id as string);
                const docSnap = await getDoc(docRef);
    
                if (docSnap.exists()) {
                    const propertyData = { id: docSnap.id, ...docSnap.data() };
                    
                    // Set property data
                    setProperty({
                        ...propertyData,
                        guests: propertyData.guests || 10,  // Default guests
                        bedrooms: propertyData.bedrooms || '0',
                        beds: propertyData.beds || '0',
                        baths: propertyData.baths || '0',
                    });
                    
                    // Fetch host data if userId exists
                    if (propertyData.userId) {
                        const response = await fetch(`/api/fetchHost?userId=${propertyData.userId}`);
                        const hostData = await response.json();
                        setHost(hostData);
                    }
                } else {
                    console.log('Property not found');
                    router.push('/404');
                }
            } catch (error) {
                console.error('Error fetching property or host data:', error);
            }
        };
    
        fetchProperty();
    }, [id, router]);



    useEffect(() => {
        const fetchReviews = async () => {
            try {
                if (!property?.id) return;
    
                const reviewsData = await getReviewsForProperty(property.id);
    
                // Filter out reviews that don't have a comment, only for displaying purposes
                const reviewsWithComments = reviewsData.filter((review) => review.comment && review.comment.trim() !== "");
    
                setReviews(reviewsWithComments);
    
                // Calculate average rating and total count using all reviews
                const totalRatings = reviewsData.length;
                const averageRating = totalRatings > 0
                    ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalRatings
                    : 0;
    
                setProperty((prev) => ({
                    ...prev,
                    averageRating: averageRating.toFixed(1),
                    totalRatings
                }));
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
    
        fetchReviews();
    }, [property?.id]);

    

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
    {property?.title || 'No Title Available'}
</div>

            {/* Property Image Section */}
            <div className="relative mb-4">
                <button
                    className="absolute top-4 left-4 flex items-center space-x-2 text-white bg-black/50 p-2 rounded-full"
                    onClick={() => router.back()}>
                    <IoIosArrowBack className="text-2xl" />
                </button>
                {property?.imageUrls && property.imageUrls.length > 0 ? (
    <Image
    src={property.imageUrls[0]}
    alt={property.title || 'Property Image'}
    width={1200}  // Set the width as before
    height={800}  // Set the height as before
    priority // Adds priority for better performance on images above the fold
    className="w-full h-auto object-cover max-h-96"
  />
) : (
    <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
        No Image Available
    </div>
)}
             <div className="absolute top-4 right-4">
  {property && <FavoriteStar isFavorite={property?.isFavorite || false} propertyId={property.id} userId={userId} />}
</div>
            </div>

            {/* Grid Layout for Content and Booking Box on Large Screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Details Section */}
                <div className="space-y-4 p-4">
                {property && <h1 className="text-2xl font-bold md:hidden">{property.title}</h1>}

                {property && (
  <div className="flex flex-col space-y-1">
  {/* Location */}
  <span className="text-gray-600 ">{`${property.city}, ${property.country}`}</span>

  {/* Row with Guests, Bedrooms, Beds, and Bathrooms */}
  <div className="text-sm text-gray-500">
      {`${property.guests || 10} guests • ${property.bedrooms} bedrooms • ${property.beds} beds • ${property.baths} bathrooms`}
  </div>

  {/* Rating Section with Total Ratings or No Reviews */}
  <div className="flex items-center space-x-1 text-gray-600 mt-1">
      {property.totalRatings > 0 ? (
          <>
              <AiFillStar className="text-yellow-500" />
              <span className="font-semibold">{property.averageRating}</span> 
              <span className="text-sm"> ({property.totalRatings})</span>
          </>
      ) : (
          <>
              <AiFillStar className="text-gray-400" />
              <span className="italic text-sm">No reviews yet</span>
          </>
      )}
  </div>
</div>
)}

                    <p className="text-gray-700 mt-2">
    {property?.description || 'No Description Available'}
</p>
                    {/* Show More button for description */}
                    {property?.details?.description.length > maxItemsToShow.description && (
                <button
                onClick={() => handleShowMoreToggle('description', property?.details?.description || '')}
                className="text-accent text-b1-mobile font-semi-bold underline mt-2"
              >
                Show More
              </button>
                    )}

                    {/* Divider */}
                    <hr className="block md:hidden my-4 border-t border-divider" />
                    {host && (
  <div className="text-sm text-gray-500 flex items-center">
    <div className="rounded-full overflow-hidden w-10 h-10 mr-2">
      <Image
        src={host.profileImageUrl || "/default-profile.png"}
        alt="Host Profile"
        width={40}
        height={40}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
    <span>{`Hosted by ${host.firstName || ''} ${host.lastName || ''}`}</span>
  </div>
)}

                    {/* Divider */}
                    <hr className="block md:hidden my-4 border-t border-divider" />

                    {/* Map Section */}
                    <div className="mt-6 relative z-0">
                        <h2 className="text-lg font-bold">Where you'll be</h2>
                        {property?.latitude && property?.longitude && (
                            <PropertyMap
                                latitude={property.latitude}
                                longitude={property.longitude}
                                title={property.title}
                            />
                        )}
                    </div>

                    {/* Divider */}
                    <hr className="block md:hidden my-4 border-t border-divider" />

                    {/* What this place offers */}
                    <div className="mt-6">
                        <h2 className="text-lg font-bold">What this place offers</h2>
                        <ul className="space-y-1 mt-2">
                        {property?.features &&
    property.features.slice(0, showMore.features ? property.features.length : maxItemsToShow.features)
    .map((feature, index) => (
        <li key={index} className="text-gray-600">{feature}</li>
    ))}
                        </ul>
                        {property?.details?.features.length > maxItemsToShow.features && (
                            <button
                                onClick={() => handleShowMoreToggle('features')}
                                 className="text-accent text-b1-mobile font-semi-bold underline mt-2"
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
        {property?.houseRules && property.houseRules
            .slice(0, showMore.houseRules ? property.houseRules.length : maxItemsToShow.houseRules)
            .map((rule, index) => (
                <li key={index} className="text-gray-600">{rule}</li>
            ))
        }
    </ul>
    {property?.houseRules?.length > maxItemsToShow.houseRules && (
        <button
            onClick={() => handleShowMoreToggle('houseRules')}
           className="text-accent text-b1-mobile font-semi-bold underline mt-2"
        >
            {showMore.houseRules ? "Show Less" : "Show More"}
        </button>
    )}
</div>

                    {/* Divider */}
                    <hr className="block md:hidden my-4 border-t border-divider" />

{/* Services */}
<div className="mt-6">
    <h2 className="text-lg font-bold">Services</h2>
    <ul className="space-y-1 mt-2">
        {property?.services &&
            property.services
                .slice(0, showMore.services ? property.services.length : maxItemsToShow.services)
                .map((service, index) => (
                    <li key={index} className="text-gray-600">{service}</li>
                ))
        }
    </ul>
    {property?.services?.length > maxItemsToShow.services && (
        <button
            onClick={() => handleShowMoreToggle('services')}
            className="text-accent text-b1-mobile font-semi-bold underline mt-2"
        >
            {showMore.services ? "Show Less" : "Show More"}
        </button>
    )}
</div>

  {/* Divider */}
  <hr className="block md:hidden my-4 border-t border-divider" />

  {/* Safety Features */}
<div className="mt-6">
    <h2 className="text-lg font-bold">Safety Features</h2>
    <ul className="space-y-1 mt-2">
        {property?.safetyFeatures &&
            property.safetyFeatures
                .slice(0, showMore.safetyFeatures ? property.safetyFeatures.length : maxItemsToShow.safetyFeatures)
                .map((feature, index) => (
                    <li key={index} className="text-gray-600">{feature}</li>
                ))
        }
    </ul>
    {property?.safetyFeatures?.length > maxItemsToShow.safetyFeatures && (
     <button
     onClick={() => handleShowMoreToggle('safetyFeatures')}
     className="text-accent text-b1-mobile font-semi-bold underline mt-2"
 >
     {showMore.safetyFeatures ? "Show Less" : "Show More"}
 </button>
    )}
</div>

                    {/* Divider */}
                    <hr className="block md:hidden my-4 border-t border-divider" />

{/* Reviews Section */}
<div className="mt-6">
  <h2 className="text-lg font-bold">Reviews</h2>

  {/* Restrict the slider to the content width */}
  <div className="overflow-hidden w-full max-w-5xl mx-auto"> {/* Ensures the slider is within the container */}
    <div className="embla review-slider" ref={emblaRef}>
      <div className="embla__container">
      {reviews.map((review, index) => (
          <div className="embla__slide" key={index}>
<ReviewCard
    name={review.name}
    review={review.comment}
    date={review.timestamp.toDate()}
    ranking={review.rating}
    profileImageUrl={review.profileImageUrl}
    onShowMore={() => {
        setReviewModalContent({
            name: review.name,
            comment: review.comment,
            profileImageUrl: review.profileImageUrl,
            date: review.timestamp.toDate(),
            ranking: review.rating,
        });
        setIsReviewModalOpen(true);
    }}
/>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
                </div>

                {/* Booking Box for Large Screens */}
               <div className="hidden md:block md:sticky md:top-4 md:h-[calc(100vh-30rem)]">
          {property &&  <BookingBoxLarge
      price={parseFloat(property.price)}
      onRequestBooking={handleRequestBooking}
      setCheckIn={setSelectedCheckIn}
      setCheckOut={setSelectedCheckOut}
      setGuests={setSelectedGuests}
    />}
        </div>
            </div>

            {/* Booking Bar for Small Screens */}
            <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
          {property && <BookingBarSmall
      price={parseFloat(property.price)}
      onRequestBooking={handleRequestBooking}
      setCheckIn={setSelectedCheckIn}
      setCheckOut={setSelectedCheckOut}
      setGuests={setSelectedGuests}
    />}
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
                     
                     <div className="p-4 text-primaryText break-words">
                            {modalContent} {/* Show full review content */}
                        </div>
                    </ShowMoreModal>
                )}
            </CustomModal>
        )}
    
        {!isSmallScreen && content}

        {isReviewModalOpen && reviewModalContent && (
            <ShowMoreModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
            >
                <div className="p-4 text-gray-700 break-words">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                            <Image 
                                src={reviewModalContent.profileImageUrl || '/profile.png'} 
                                alt={`${reviewModalContent.name}'s profile picture`} 
                                width={48} 
                                height={48} 
                                className="object-cover w-full h-full" 
                            />
                        </div>
                        <div>
                            <p className="font-semibold">{reviewModalContent.name}</p>
                            <p className="text-sm text-gray-500">{timeAgo(reviewModalContent.date)}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 mb-4">
                        {[...Array(5)].map((_, index) => (
                            <AiFillStar 
                                key={index} 
                                className={index < (reviewModalContent.ranking || 0) ? 'text-yellow-500' : 'text-gray-300'} 
                            />
                        ))}
                        <span className="text-sm text-gray-500">
                            {reviewModalContent.ranking !== undefined ? `(${reviewModalContent.ranking.toFixed(1)})` : '(No rating)'}
                        </span>
                    </div>
                    <div>{reviewModalContent.comment}</div>
                </div>
            </ShowMoreModal>
        )}
    
        {/* Show More Modal for larger screens */}
        {!isSmallScreen && isShowMoreModalOpen && (
            <ShowMoreModal
                isOpen={isShowMoreModalOpen}
                onClose={() => setIsShowMoreModalOpen(false)}
            >
                <button
                    className="absolute top-2 right-3 text-gray-600 text-2xl font-bold z-50"
                    onClick={() => setIsShowMoreModalOpen(false)}
                    aria-label="Close"
                >
                    <FiX className="text-2xl" />
                </button>
                <div className="p-4 text-gray-700 break-words">
                    {modalContent} {/* Show full review content */}
                </div>
            </ShowMoreModal>
        )}
    </>
);
};

export default PropertyDetail;
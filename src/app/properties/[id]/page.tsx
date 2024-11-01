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

type ShowMoreSection = 'description' | 'features' | 'houseRules' | 'services';

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

    // Set initial "Show More" state for different sections
    const [showMore, setShowMore] = useState({
        description: false,
        features: false,
        houseRules: false,
        services: false
    });

    // Control how many items to show initially for each section
    const maxItemsToShow = {
        description: 150,  // Number of characters for description before truncating
        features: 3,       // Show 3 features initially 
        houseRules: 2,     // Show 2 house rules initially
        services: 2        // Show 3 services initially
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
                    setProperty(propertyData);
    
                    // Fetch host data via API route
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
    
                // Filter out reviews that don't have a comment
                const reviewsWithComments = reviewsData.filter((review) => review.comment && review.comment.trim() !== "");
    
                setReviews(reviewsWithComments);
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
    <div className="flex items-center space-x-2">
        <span>{`${property.city}, ${property.country}`}</span>
        <div className="flex items-center">
            <AiFillStar className="text-yellow-500" />
            <span className="ml-1 text-gray-600">
                {typeof property.rating === 'number' ? property.rating.toFixed(1) : '0.00'}
            </span>
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
                className="text-blue-500 underline mt-2"
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
            className="text-blue-500 underline mt-2"
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
            className="text-blue-500 underline mt-2"
        >
            {showMore.services ? "Show Less" : "Show More"}
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
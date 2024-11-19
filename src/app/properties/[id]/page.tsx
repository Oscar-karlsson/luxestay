'use client';
import React, { useState, useEffect, useCallback  } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/utils/firebase';
import { AiFillStar } from 'react-icons/ai';
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
import { FiChevronDown } from 'react-icons/fi';
import Modal from 'react-modal';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";





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
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const openImageModal = () => setIsImageModalOpen(true);  
    const closeImageModal = () => setIsImageModalOpen(false);  
    const [emblaRef, emblaApi] = EmblaCarouselReact({ loop: false, slidesToScroll: 1 });
    const [imageCarouselRef, imageCarouselApi] = EmblaCarouselReact({ loop: false });
// State to track if carousel is at the start or end
const [atStart, setAtStart] = useState(true);
const [atEnd, setAtEnd] = useState(false);

// Update `atStart` and `atEnd` based on carousel scroll position
const onSelect = useCallback(() => {
    if (!imageCarouselApi) return;
    setAtStart(!imageCarouselApi.canScrollPrev());  // `atStart` is true when no previous slide
    setAtEnd(!imageCarouselApi.canScrollNext());    // `atEnd` is true when no next slide
}, [imageCarouselApi]);

// Attach `onSelect` to carousel's `select` event to handle start/end state on every slide change
useEffect(() => {
    if (!imageCarouselApi) return;
    imageCarouselApi.on('select', onSelect);
    onSelect();  // Initial check to set correct start/end state when component loads
}, [imageCarouselApi, onSelect]);


    const { user } = useUser();
    const reviewDisplayLimit = 1;
    const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
const userId = user ? user.id : '';
const [sortOption, setSortOption] = useState("mostRecent");
const [isSortModalOpen, setIsSortModalOpen] = useState(false);
const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
const [reviewModalContent, setReviewModalContent] = useState<{
    name: string;
    comment: string;
    profileImageUrl: string;
    date: Date;
    ranking: number;
} | null>(null);

   // Set Modal app element only on the client-side
   useEffect(() => {
    if (typeof window !== "undefined" && document.getElementById('__next')) {
      Modal.setAppElement('#__next');  // Ensure the root element exists before setting
    }
  }, []);

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


    // Sort reviews based on the selected option
    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortOption === "highestRating") return b.rating - a.rating;
        if (sortOption === "lowestRating") return a.rating - b.rating;
        if (sortOption === "mostRecent") return b.timestamp.toDate() - a.timestamp.toDate();
    });

     // Define the function to navigate to the booking review page
     const handleRequestBooking = () => {
        const imageUrl = property.imageUrls?.[0] || '/default-image.jpg';
        router.push(`/book/${property.id}/review?checkIn=${selectedCheckIn}&checkOut=${selectedCheckOut}&guests=${selectedGuests}&price=${property.price}&title=${encodeURIComponent(property.title)}&location=${encodeURIComponent(property.city)}, ${encodeURIComponent(property.country)}&imageUrl=${encodeURIComponent(imageUrl)}`);
    };

    


    // Function to scroll to the previous image in the carousel
    const scrollPrevImage = useCallback((event) => {
        event.stopPropagation();
        if (imageCarouselApi) {
            console.log("Image carousel API is initialized and ready.");
        } else {
            console.log("Image carousel API is not ready.");
        }
    }, [imageCarouselApi]);
      
      const scrollNextImage = useCallback((event) => {
        event.stopPropagation();
        if (imageCarouselApi) {
          imageCarouselApi.scrollNext();
        } else {
          console.log("Image carousel API is not initialized");
        }
      }, [imageCarouselApi]);

      useEffect(() => {
        if (isImageModalOpen && imageCarouselApi) {
            imageCarouselApi.reInit();
            imageCarouselApi.scrollTo(0);
        }
    }, [isImageModalOpen, imageCarouselApi]);

      useEffect(() => {
        if (imageCarouselApi) {
          console.log("Image carousel API is ready");
        } else {
          console.log("Image carousel API is not ready yet");
        }
      }, [imageCarouselApi]);

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



    const handlePrevClick = useCallback(() => {
        imageCarouselApi && imageCarouselApi.scrollPrev();
    }, [imageCarouselApi]);
    
    const handleNextClick = useCallback(() => {
        imageCarouselApi && imageCarouselApi.scrollNext();
    }, [imageCarouselApi]);
    

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

    useEffect(() => {
        console.log("isSortModalOpen has changed:", isSortModalOpen);
    }, [isSortModalOpen]);

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
    className="w-full h-auto object-cover max-h-96 cursor-pointer"  
    onClick={openImageModal}
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
  {reviews.length === 0 && (
  <p className="text-gray-500">No reviews available yet.</p>
)}

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
    isFullContent={false} // Ensures review is truncated with "Show More" button
    onShowMore={() => {
        setReviewModalContent({
            name: review.name,
            comment: review.comment,
            profileImageUrl: review.profileImageUrl,
            date: review.timestamp.toDate(),
            ranking: review.rating,
        });
        setIsReviewModalOpen(true); // Opens modal for full review
    }}
/>
          </div>
        ))}
      </div>
    </div>
  </div>

    {/* Show More button for reviews */}
    {reviews.length > reviewDisplayLimit && (
        <button
  onClick={() => setIsAllReviewsModalOpen(true)}  // Opens the new All Reviews modal
  className="text-primaryButton border border-primaryButton py-2 px-4 rounded-lg mt-2 mb-8 mx-auto block active:scale-95 transition-transform duration-75"
>
  Show More Reviews
</button>
  )}

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
<ReviewCard
    name={reviewModalContent.name}
    review={reviewModalContent.comment}
    date={reviewModalContent.date}
    ranking={reviewModalContent.ranking}
    profileImageUrl={reviewModalContent.profileImageUrl}
    onShowMore={() => {}} // No action needed in modal
    isFullContent={true}  // Full review content shown in modal
/>
    </ShowMoreModal>
)}


        {/* Show More Modal for All Reviews */}
        {isAllReviewsModalOpen && (
    <ShowMoreModal
        isOpen={isAllReviewsModalOpen}
        onClose={() => setIsAllReviewsModalOpen(false)}
    >
        <div className={`${isSmallScreen ? "fixed top-0 left-0 w-full h-full bg-white z-50" : ""} p-4 overflow-y-auto h-full`}>
            {isSmallScreen ? (
                <button
                    className="absolute top-2 left-3 text-gray-600 text-2xl font-bold z-50"
                    onClick={() => setIsAllReviewsModalOpen(false)}
                    aria-label="Close"
                >
                    <IoIosArrowBack />
                </button>
            ) : (
                <button
                    className="absolute top-2 right-3 text-gray-600 text-2xl font-bold z-50"
                    onClick={() => setIsAllReviewsModalOpen(false)}
                    aria-label="Close"
                >
                    <FiX />
                </button>
            )}
            
            <h2 className="text-lg font-bold text-center mb-4">All Reviews</h2>
            <div className="space-y-4">

            <div className="flex justify-end mb-4 w-full">
    {!isSmallScreen && (
        <div className="relative w-48">
            <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none border border-gray-300 rounded-2xl px-4 py-2 w-full pr-10 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="mostRecent">Most Recent</option>
                <option value="highestRating">Highest Rating</option>
                <option value="lowestRating">Lowest Rating</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none text-lg" />
        </div>
    )}

    {isSmallScreen && (
     <button
     onClick={() => {
        console.log("Sort button clicked");
        setIsSortModalOpen(true);
        console.log("isSortModalOpen:", isSortModalOpen);
    }}
            className="appearance-none border border-gray-300 rounded-2xl px-4 py-2 w-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
        >
            {sortOption === "mostRecent" && "Most Recent"}
            {sortOption === "highestRating" && "Highest Rating"}
            {sortOption === "lowestRating" && "Lowest Rating"}
            <FiChevronDown className="inline-block ml-2 text-gray-600 text-lg" />
        </button>
    )}
</div>
{sortedReviews.map((review, index) => (
    <ReviewCard
        key={index}
        name={review.name}
        review={review.comment}
        date={review.timestamp.toDate()}
        ranking={review.rating}
        profileImageUrl={review.profileImageUrl}
        isFullContent={true}
        onShowMore={() => {}}
    />
))}
            {isSortModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-64">
                        <h2 className="text-center font-bold text-lg mb-4">Sort by</h2>
                        <ul className="space-y-4">
                            <li
                                onClick={() => {
                                    setSortOption("mostRecent");
                                    setIsSortModalOpen(false);
                                }}
                                className="flex justify-between items-center cursor-pointer"
                            >
                                <span>Most Recent</span>
                                <div
    className={`w-4 h-4 rounded-full ${sortOption === "mostRecent" ? "bg-black" : "bg-gray-300 border border-gray-400"}`}
/>
                            </li>
                            <li
                                onClick={() => {
                                    setSortOption("highestRating");
                                    setIsSortModalOpen(false);
                                }}
                                className="flex justify-between items-center cursor-pointer"
                            >
                                <span>Highest Rated</span>
                                <div
    className={`w-4 h-4 rounded-full ${sortOption === "highestRating" ? "bg-black" : "bg-gray-300 border border-gray-400"}`}
/>
                            </li>
                            <li
                                onClick={() => {
                                    setSortOption("lowestRating");
                                    setIsSortModalOpen(false);
                                }}
                                className="flex justify-between items-center cursor-pointer"
                            >
                                <span>Lowest Rated</span>
                                <div
    className={`w-4 h-4 rounded-full ${sortOption === "lowestRating" ? "bg-black" : "bg-gray-300 border border-gray-400"}`}
/>
                            </li>
                        </ul>
                        <button
                            onClick={() => setIsSortModalOpen(false)}
                            className="w-full mt-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
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
    className="absolute top-2 left-3 md:right-3 text-gray-600 text-2xl font-bold z-50"
    onClick={() => setIsAllReviewsModalOpen(false)}
    aria-label="Close"
>
    {isSmallScreen ? <IoIosArrowBack className="text-2xl" /> : <FiX className="text-2xl" />}
</button>

{isSortModalOpen && (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-64">
            <h2 className="text-center font-bold text-lg mb-4">Sort by</h2>
            <ul className="space-y-4">
                <li
                    onClick={() => {
                        setSortOption("mostRecent");
                        setIsSortModalOpen(false);
                    }}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <span>Most Recent</span>
                    {sortOption === "mostRecent" && <div className="w-3 h-3 bg-black rounded-full" />}
                </li>
                <li
                    onClick={() => {
                        setSortOption("highestRating");
                        setIsSortModalOpen(false);
                    }}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <span>Highest Rated</span>
                    {sortOption === "highestRating" && <div className="w-3 h-3 bg-black rounded-full" />}
                </li>
                <li
                    onClick={() => {
                        setSortOption("lowestRating");
                        setIsSortModalOpen(false);
                    }}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <span>Lowest Rated</span>
                    {sortOption === "lowestRating" && <div className="w-3 h-3 bg-black rounded-full" />}
                </li>
            </ul>
            <button
                onClick={() => setIsSortModalOpen(false)}
                className="w-full mt-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg"
            >
                Close
            </button>
        </div>
    </div>
)}
                <div className="p-4 text-gray-700 break-words">
                    {modalContent} {/* Show full review content */}
                </div>
            </ShowMoreModal>
        )}

{isSortModalOpen && (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center">

        <div className="bg-white rounded-lg p-6 w-64">
            <h2 className="text-center font-bold text-lg mb-4">Sort by</h2>
            <hr className="mb-4" />
            <ul className="space-y-4">
                <li
                    onClick={() => {
                        setSortOption("mostRecent");
                        setIsSortModalOpen(false);
                    }}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <span>Most Recent</span>
                    {sortOption === "mostRecent" && <div className="w-3 h-3 bg-black rounded-full" />}
                </li>
                <li
                    onClick={() => {
                        setSortOption("highestRating");
                        setIsSortModalOpen(false);
                    }}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <span>Highest Rated</span>
                    {sortOption === "highestRating" && <div className="w-3 h-3 bg-black rounded-full" />}
                </li>
                <li
                    onClick={() => {
                        setSortOption("lowestRating");
                        setIsSortModalOpen(false);
                    }}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <span>Lowest Rated</span>
                    {sortOption === "lowestRating" && <div className="w-3 h-3 bg-black rounded-full" />}
                </li>
            </ul>
            <hr className="mt-4" />
            <button
                onClick={() => setIsSortModalOpen(false)}
                className="w-full mt-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg"
            >
                Close
            </button>
        </div>
    </div>
)}

{isImageModalOpen && (
    <Modal
  isOpen={isImageModalOpen}
  onRequestClose={closeImageModal}
  shouldCloseOnOverlayClick={true}
  contentLabel="Property Image Modal"
  overlayClassName="image-modal-overlay"
  className="image-modal-content"
>


  <div className="embla-image-carousel" ref={imageCarouselRef}>
    {/* Render arrows only on larger screens */}
    {!isSmallScreen && !atStart && ( // Only show if not at the start
    <button
        className="image-modal-arrow image-modal-arrow--prev"
        onClick={handlePrevClick}
    >
        <IoIosArrowBack />
    </button>
)}

<div className="embla-image-container">
{property.imageUrls.map((url, index) => (
    <div key={url} className="relative embla-image-slide">
        <button
            onClick={closeImageModal}
            className="image-modal-close-btn"
            aria-label="Close"
        >
            <FiX />
        </button>
        <Image
            src={url}
            alt={`Property Image ${index + 1}`}
            width={600}
            height={400}
            className="image-modal-image"
        />
    </div>
))}
</div>

{!isSmallScreen && !atEnd && ( // Only show if not at the end
    <button
        className="image-modal-arrow image-modal-arrow--next"
        onClick={handleNextClick}
    >
        <IoIosArrowForward />
    </button>
)}
  </div>
</Modal>
)}


    </>
);
};

export default PropertyDetail;
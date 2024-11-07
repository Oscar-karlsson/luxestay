import React, { useState, useEffect } from 'react';
import ReviewModal from './ReviewModal';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface TripCardProps {
  bookingId: string;
  bookingDate: string;
  title: string;
  location: string;
  imageUrl: string;
  isCanceled?: boolean;  // Handles canceled trips
  isCompleted?: boolean; // Handles completed trips
  onCancel?: () => void;
  userId: string;
  propertyId: string;
}

const TripCard: React.FC<TripCardProps> = ({
  bookingId,
  bookingDate,
  title,
  location,
  imageUrl,
  isCanceled = false,
  isCompleted = false,
  onCancel,
  userId,
  propertyId,
}) => {


 // State to manage review modal visibility
 const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

 // Handlers for opening and closing the review modal
 const handleOpenReviewModal = () => setIsReviewModalOpen(true);
 const handleCloseReviewModal = () => setIsReviewModalOpen(false);

 const handleSubmitReview = (rating: number, comment: string) => {
  console.log('Review Submitted:', { rating, comment, userId, propertyId });
  setHasReviewed(true); // Mark as reviewed after submission
  handleCloseReviewModal();
};
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const checkIfReviewed = async () => {
      try {
        const reviewsRef = collection(db, "reviews");
        const q = query(
          reviewsRef,
          where("userId", "==", userId),
          where("propertyId", "==", propertyId)
        );
        const querySnapshot = await getDocs(q);
        setHasReviewed(!querySnapshot.empty); // If there are results, the user has reviewed
      } catch (error) {
        console.error("Error checking review status:", error);
      }
    };
  
    checkIfReviewed();
  }, [userId, propertyId]); // Dependency array


  return (
    <div className="bg-card shadow-lg rounded-lg p-4 mb-4 max-w-md mx-auto lg:max-w-lg xl:max-w-xl">

      {/* Booking ID and Canceled label */}
      <div className="flex justify-between items-center">
        <p className="text-b1-mobile lg:text-b1-desktop font-medium text-primaryText">Booking ID: {bookingId}</p>
        {isCanceled && (
          <p className="text-b3-mobile lg:text-b3-desktop font-regular text-error">Canceled</p>
        )}
      </div>

      <p className="text-b3-mobile lg:text-b3-desktop font-regular text-secondaryText mb-4">Booking Date: {bookingDate}</p>
      <div className="flex items-start">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-16 h-16 object-cover rounded-lg mr-4" 
        />
        <div>
          <h3 className="text-h5-mobile lg:text-h5-desktop font-semibold text-primaryText">{title}</h3>
          <p className="text-b3-mobile lg:text-b3-desktop font-regular text-secondaryText">{location}</p>
        </div>
      </div>

{/* Button layout for completed and canceled trips */}
{(isCompleted || isCanceled) && (
        <div className="mt-4 flex justify-between space-x-4">
      {hasReviewed ? (
    <button
      className="bg-gray-200 text-gray-400 py-2 px-4 rounded-lg flex-1 font-semi-bold text-b1-mobile lg:text-b1-desktop cursor-not-allowed"
      disabled
    >
      Review Submitted
    </button>
  ) : (
    <button
      onClick={handleOpenReviewModal}
      className={`py-2 px-4 rounded-lg flex-1 font-semi-bold text-b1-mobile lg:text-b1-desktop ${
        isCanceled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-secondaryButton text-secondaryButtonText hover:bg-secondaryButtonHover'
      }`}
      disabled={isCanceled} // Disable if canceled
    >
      Write a Review
    </button>
  )}

          <button 
            className="bg-primaryButton text-primaryButtonText text-b1-mobile lg:text-b1-desktop font-semi-bold py-2 px-4 rounded-lg flex-1 hover:bg-primaryButtonHover"
          >
            Book Again
          </button>
        </div>
      )}


      {/* Button layout for upcoming trips */}
      {!isCompleted && !isCanceled && (
        <div className="mt-4 flex justify-between space-x-4">
   <button 
      className="bg-secondaryButton text-secondaryButtonText font-semibold py-2 px-4 rounded-lg flex-1 hover:bg-secondaryButtonHover"
      onClick={onCancel}  // Call onCancel function
    >
      Cancel
    </button>
          <button 
            className="bg-primaryButton text-primaryButtonText font-semibold py-2 px-4 rounded-lg flex-1 hover:bg-primaryButtonHover">
            View Details
          </button>
        </div>
      )}

 {/* Review Modal */}
 <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        onSubmit={handleSubmitReview}
        userId={userId}
        propertyId={propertyId}
      />
    </div>
  );
};

export default TripCard;

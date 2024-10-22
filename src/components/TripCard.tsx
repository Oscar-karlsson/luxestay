import React from 'react';

interface TripCardProps {
  bookingId: string;
  bookingDate: string;
  title: string;
  location: string;
  imageUrl: string;
  isCanceled?: boolean;  // Handles canceled trips
  isCompleted?: boolean; // Handles completed trips
}

const TripCard: React.FC<TripCardProps> = ({ bookingId, bookingDate, title, location, imageUrl, isCanceled = false, isCompleted = false }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 max-w-md mx-auto lg:max-w-lg xl:max-w-xl">

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
          <button 
            className={`py-2 px-4 rounded-lg flex-1 font-semi-bold text-b1-mobile lg:text-b1-desktop ${
              isCanceled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-secondaryButton text-secondaryButtonText'
            }`}
            disabled={isCanceled}  // Disable if canceled
          >
            Write a Review
          </button>
          <button 
            className="bg-primaryButton text-primaryButtonText text-b1-mobile lg:text-b1-desktop font-semi-bold py-2 px-4 rounded-lg flex-1"
          >
            Book Again
          </button>
        </div>
      )}


      {/* Button layout for upcoming trips */}
      {!isCompleted && !isCanceled && (
        <div className="mt-4 flex justify-between space-x-4">
          <button 
            className="bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg flex-1">
            Cancel
          </button>
          <button 
            className="bg-black text-white font-semibold py-2 px-4 rounded-lg flex-1">
            View Details
          </button>
        </div>
      )}


    </div>
  );
};

export default TripCard;

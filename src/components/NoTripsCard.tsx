import Link from 'next/link';

const NoTripsCard: React.FC = () => {
  return (
    <div className="bg-card shadow-lg rounded-lg p-4 mb-4 max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
      <h2 className="text-b1-mobile lg:text-b1-desktop  text-center font-semibold mb-2">No Trips Found</h2>
      <p className="text-b3-mobile lg:text-b3-desktop font-semi-regular text-secondaryText text-center mb-4">
        It looks like you haven't booked any trips yet.<br />
        Find the perfect luxury escape today!
      </p>
      <div className="flex justify-center w-full"> 
      <Link href="/" className="w-full">
          <button className="bg-primaryButton text-primaryButtonText py-2 px-4 rounded-md w-full hover:bg-primaryButtonHover">
            Explore Luxury Stays
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NoTripsCard;

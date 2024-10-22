import Link from 'next/link';

const NoTripsCard: React.FC = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
      <h2 className="text-lg text-center font-semibold mb-2">No Trips Found</h2>
      <p className="text-gray-500 text-center mb-4">
        It looks like you haven't booked any trips yet.<br />
        Find the perfect luxury escape today!
      </p>
      <div className="flex justify-center w-full"> 
      <Link href="/" className="w-full">
          <button className="bg-black text-white py-2 px-4 rounded-md w-full">
            Explore Luxury Stays
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NoTripsCard;

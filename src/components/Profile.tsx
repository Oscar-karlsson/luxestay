import { useUser, UserButton, UserProfile } from '@clerk/nextjs';
import { FaUser, FaCreditCard, FaFileContract, FaLock } from 'react-icons/fa'; // Importing icons
import { FiLogOut } from 'react-icons/fi'; // Importing logout icon
import { useState } from 'react';

const Profile = () => {
  const { user } = useUser(); // Get the user's info from Clerk
  const [showUserProfile, setShowUserProfile] = useState(false);

  return (
  
    <div className="p-4 max-w-md w-full mt-4 sm:bg-white sm:shadow-md sm:rounded-lg sm:p-8 sm:mt-8">

        {/* Profile Picture and Name */}
        <div className="flex items-center justify-center mb-8">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: 'w-20 h-20', // Set the size of the avatar
              },
            }}
            afterSignOutUrl="/sign-in" // Redirect after sign-out
          />
          <div className="ml-4">
            <h2 className="text-lg font-semibold">{user?.fullName || 'User'}</h2> {/* Display the user's full name */}
          </div>
        </div>

        {/* Account Settings */}
        <div className="mb-6">
          <h3 className="text-gray-700 text-base mb-2">Account settings</h3>
          <ul>
          <li className="flex items-center justify-between py-2 border-b">
  <span 
    className="flex items-center cursor-pointer" 
    onClick={() => setShowUserProfile(true)} // Toggle modal on click
  >
    <FaUser className="mr-2" /> 
    Personal information
  </span>
  <span>&gt;</span>
</li>
            <li className="flex items-center justify-between py-2 border-b">
              <span className="flex items-center">
                <FaCreditCard className="mr-2" /> 
                Payments
              </span>
              <span>&gt;</span>
            </li>
          </ul>
        </div>

        {/* Modal for User Profile */}
        {showUserProfile && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <UserProfile />
  </div>
)}


        {/* Legal Section */}
        <div className="mb-6">
          <h3 className="text-gray-700 text-base mb-2">Legal</h3>
          <ul>
            <li className="flex items-center justify-between py-2 border-b">
              <span className="flex items-center">
                <FaFileContract className="mr-2" />
                Terms and services
              </span>
              <span>&gt;</span>
            </li>
            <li className="flex items-center justify-between py-2 border-b">
              <span className="flex items-center">
                <FaLock className="mr-2" /> 
                Privacy policy
              </span>
              <span>&gt;</span>
            </li>
          </ul>
        </div>

        {/* Sign Out */}
        <div className="text-center">
          <button className="text-accent font-semibold flex items-center justify-center">
            <FiLogOut className="mr-2" /> 
            Sign Out
          </button>
        </div>
      </div>
   
  );
};

export default Profile;

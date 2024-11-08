import { useUser, UserButton, UserProfile } from '@clerk/nextjs';
import { FaUser, FaCreditCard, FaFileContract, FaLock, FaPlus, FaEdit  } from 'react-icons/fa'; // Importing icons
import { FiLogOut } from 'react-icons/fi'; // Importing logout icon
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';

const Profile = () => {
  const { user } = useUser(); // Get the user's info from Clerk
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { signOut } = useAuth();
const { closeUserProfile } = useClerk();
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
            <h1 className="text-lg font-semibold">{user?.fullName || 'User'}</h1> {/* Display the user's full name */}
          </div>
        </div>

        {/* Account Settings */}
        <div className="mb-6">
          <h2 className="text-primaryText text-h4-mobile lg:text-h5-desktop mb-2">Account settings</h2>
          <ul>
          <li className="flex items-center justify-between py-2 border-b">
  <button 
    className="flex items-center w-full text-left"
    onClick={() => setShowUserProfile(true)} // Toggle modal on click
  >
    <FaUser className="mr-2" /> 
    Personal information
    <span className="ml-auto">&gt;</span>
  </button>
</li>
<li className="flex items-center justify-between py-2 border-b">
  <button className="flex items-center w-full text-left">
    <FaCreditCard className="mr-2" /> 
    Payments
    <span className="ml-auto">&gt;</span>
  </button>
</li>

<li className="flex items-center justify-between py-2 border-b">
  <Link href="/add-property" className="flex items-center w-full text-left">
    <FaPlus className="mr-2" /> 
    Add Property
    <span className="ml-auto">&gt;</span>
  </Link>
</li>
<li className="flex items-center justify-between py-2 border-b">
  <Link href="/my-properties" className="flex items-center w-full text-left">
    <FaEdit className="mr-2" /> 
    My Properties
    <span className="ml-auto">&gt;</span>
  </Link>
</li>
          </ul>
        </div>

        {/* Modal for User Profile */}
        {showUserProfile && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
    <div className="relative ">
      {/* Close Button */}
      <button
        className="absolute top-2 right-3 text-primaryText text-2xl font-bold z-50"
        onClick={() => setShowUserProfile(false)}
      >
        &times;
      </button>
      
      {/* User Profile Component */}
      <UserProfile 
  appearance={{
    variables: {
      colorPrimary: "#desiredColorCode", // Set your preferred color here
      colorTextPrimary: "#desiredTextColorCode", // Change the text color if needed
    },
    elements: {
      formButtonPrimary: "bg-[yourTailwindColor] text-[yourTextColor] hover:bg-[hoverColor]",
    }
  }}
/>
    </div>
  </div>
)}


        {/* Legal Section */}
        <div className="mb-6">
         <h2 className="text-primaryText text-h4-mobile lg:text-h5-desktop mb-2">Legal</h2>
          <ul>
          <li className="flex items-center justify-between py-2 border-b">
  <button className="flex items-center w-full text-left">
    <FaFileContract className="mr-2" />
    Terms and services
    <span className="ml-auto">&gt;</span>
  </button>
</li>
<li className="flex items-center justify-between py-2 border-b">
  <button className="flex items-center w-full text-left">
    <FaLock className="mr-2" /> 
    Privacy policy
    <span className="ml-auto">&gt;</span>
  </button>
</li>
          </ul>
        </div>

        {/* Sign Out */}
        <div className="text-center">
        <button 
  onClick={() => signOut()} 
  className="text-accent font-semibold flex items-center justify-center"
>
  <FiLogOut className="mr-2" /> 
  Sign Out
</button>
        </div>
      </div>
   
  );
};

export default Profile;

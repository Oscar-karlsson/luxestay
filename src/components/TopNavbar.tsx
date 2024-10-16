import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import { IoFilterCircleOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const TopNavbar = () => {
    return (
        <nav className="bg-navbar shadow-bottom  justify-between items-center p-4 md:flex hidden px-8"> {/* Only show on medium screens and larger */}
  <div className="flex items-center">
        <Link href="/">
          <img 
            src="/LuxeStay.svg"  // Image with text for larger screens
            alt="LuxeStay"
            className="hidden lg:block h-10"  // Hidden on small screens, visible on larger screens
          />
          <img 
            src="/LuxeStay - No_Text.svg"  // Image without text for smaller screens
            alt="LuxeStay - No Text"
            className="block lg:hidden h-10"  // Visible on small screens, hidden on larger screens
          />
        </Link>
      </div>
          <div className="relative flex flex-grow mx-4">
  <input
    type="text"
    placeholder="Where to?"
    className="border border-gray-300 rounded-full py-2 px-4 flex-grow focus:outline-none pl-10 pr-10" // Added pr-10
  />
  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" /> {/* Search Icon */}
  <IoFilterCircleOutline  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer text-3xl" /> {/* Filter Icon */}
  </div>
      <div className="flex items-center space-x-4">
        <Link href="/favorites" className="text-primary-text-color font-semibold hover:text-link-hover transition duration-200 transform hover:scale-105">Favorites</Link>
        <Link href="/trips" className="text-primary-text-color font-semibold hover:text-link-hover transition duration-200 transform hover:scale-105">Trips</Link>
        <Link href="/profile" className="text-primary-text-color flex items-center space-x-2"> {/* Updated Profile Link */}
          <CgProfile className="text-3xl" /> {/* Profile Icon */}
         
        </Link>
      </div>
    </nav>
      );
    };

export default TopNavbar;
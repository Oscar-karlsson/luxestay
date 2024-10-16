'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { IoFilterCircleOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import SearchBar from './SearchBar';

const TopNavbar = () => {
    const pathname = usePathname(); // Get the current pathname


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
      
 {/* Search Bar */}
 <SearchBar placeholder="Where to?" />
      <div className="flex items-center space-x-4">
       
                <Link href="/favorites" className={` text-link font-semibold hover:text-link-hover transition duration-200 transform hover:scale-105 ${pathname === '/favorites' ? 'font-extrabold text-accent' : ''}`}>
                    Favorites
                </Link>
                <Link href="/trips" className={`text-link font-semibold hover:text-link-hover transition duration-200 transform hover:scale-105 ${pathname === '/trips' ? 'font-extrabold text-accent' : ''}`}>
                    Trips
                </Link>
                <Link href="/profile" className={`text-primary-text-color flex items-center space-x-2 ${pathname === '/profile' ? 'font-extrabold text-accent' : ''}`}>
                    <CgProfile className="text-3xl" />
                </Link>
      </div>
    </nav>
      );
    };

export default TopNavbar;
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CgProfile } from "react-icons/cg";
import { FaRegStar,FaRegCompass } from "react-icons/fa";
import { MdOutlineAirplaneTicket  } from "react-icons/md";


const BottomNavbar = () => {
    const pathname = usePathname(); // Get the current pathname
  
  
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-navbar shadow-top rounded-t-lg md:hidden">
          <div className="flex justify-around p-4">
            <Link href="/" className={`flex flex-col items-center ${pathname === '/' ? 'text-accent' : 'hover:text-iconHover'}`}>
              <FaRegCompass className={`text-2xl ${pathname === '/' ? 'text-accent' : 'text-icon'}`} />
              <span className={`text-sm font-semibold ${pathname === '/' ? 'font-extrabold text-accent' : 'text-icon'}`}>Explore</span>
            </Link>
            <Link href="/favorites" className={`flex flex-col items-center ${pathname === '/favorites' ? 'text-accent' : 'hover:text-iconHover'}`}>
              <FaRegStar className={`text-2xl ${pathname === '/favorites' ? 'text-accent' : 'text-icon'}`} />
              <span className={`text-sm font-semibold ${pathname === '/favorites' ? 'font-extrabold text-accent' : 'text-icon'}`}>Favorites</span>
            </Link>
            <Link href="/trips" className={`flex flex-col items-center ${pathname === '/trips' ? 'text-accent' : 'hover:text-iconHover'}`}>
              <MdOutlineAirplaneTicket className={`text-2xl ${pathname === '/trips' ? 'text-accent' : 'text-icon'}`} />
              <span className={`text-sm font-semibold ${pathname === '/trips' ? 'font-extrabold text-accent' : 'text-icon'}`}>Trips</span>
            </Link>
            <Link href="/profile" className={`flex flex-col items-center ${pathname === '/profile' ? 'text-accent' : 'hover:text-iconHover'}`}>
              <CgProfile className={`text-2xl ${pathname === '/profile' ? 'text-accent' : 'text-icon'}`} />
              <span className={`text-sm font-semibold ${pathname === '/profile' ? 'font-extrabold text-accent' : 'text-icon'}`}>Profile</span>
            </Link>
          </div>
        </nav>
      );
    };

export default BottomNavbar;
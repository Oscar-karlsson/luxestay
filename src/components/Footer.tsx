
import { FaXTwitter, FaFacebook, FaSquareInstagram, FaRegCopyright    } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-navbar shadow-top 0 py-8 mt-16 hidden md:block">
     <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        {/* Left Section */}
        <div>
          <h2 className="text-lg font-bold mb-2">Get in Touch</h2>
          <p className="text-gray-600 max-w-md">
            Leave feedback or ask general questions through a contact page.
            These pieces of information are valuable to businesses because they
            learn more about consumer expectations and preferences.
          </p>
        </div>

        {/* Right Section (Icons) */}
        <div className="flex space-x-6 text-4xl">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaXTwitter className="text-black" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-black" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaSquareInstagram className="text-black" />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-600 text-sm mt-8">
  <FaRegCopyright  className="inline-block mr-1" /> 2024 LuxeStay, Inc • Copyright Reserved
</div>
    </footer>
  );
};

export default Footer;

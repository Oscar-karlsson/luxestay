'use client';
import { useParams, useRouter } from 'next/navigation';
import propertyData from '../../../data/properties.json'; 
import { AiFillStar } from 'react-icons/ai';
import { IoIosArrowBack } from "react-icons/io";
import FavoriteStar from '@/components/FavoriteStar';

const PropertyDetail = () => {
    const { id } = useParams();  // Get the dynamic id from the URL
    const router = useRouter();  // Use Next.js router

    // Convert id to number (since id in JSON is a number)
    const propertyId = parseInt(id as string);

    // Find the property based on id
    const property = propertyData.find((prop) => prop.id === propertyId);

    // If no property is found with that id, return a fallback message
    if (!property) {
      return <div>Property not found</div>;
    }

    return (
        <div className="md:max-w-3xl md:mx-auto">
            {/* Title for larger screens */}
            <div className="hidden md:block text-2xl font-bold mb-4 md:mt-4">
                {property.title}
            </div>

            {/* Property Image Section */}
            <div className="relative mb-4">
                {/* Add the back button within this div to position it on the image */}
                <button 
                    className="absolute top-4 left-4 flex items-center space-x-2 text-white bg-black/50 p-2 rounded-full" 
                    onClick={() => router.back()}>
                    <IoIosArrowBack className="text-2xl" />
                </button>
                <img 
                    src={property.images[0]}  // Use the first image from the property
                    alt={property.title} 
                    className="w-full h-72 object-cover"
                />
                {/* Favorite Star Icon on the image */}
                <div className="absolute top-4 right-4">
                    <FavoriteStar isFavorite={property.isFavorite} />
                </div>
            </div>

            {/* Property Details Section */}
            <div className="p-4 md:p-0 space-y-4">
                {/* Title for small screens (hidden on large screens) */}
                <h1 className="text-2xl font-bold md:hidden">{property.title}</h1>

                <div className="flex items-center space-x-2">
                    <span>{property.location}</span>
                    <div className="flex items-center">
                        <AiFillStar className="text-yellow-500" />
                        <span className="ml-1 text-gray-600">{property.rating.toFixed(1)}</span>
                    </div>
                </div>
                <p className="text-gray-700 mt-2">{property.details.description}</p>
                <p className="text-sm text-gray-500">Hosted by {property.details.hostedBy}</p>
                <button className="bg-accent-color text-white py-2 px-4 rounded mt-4">Reserve</button>
            </div>

            {/* Map Section */}
            <div className="p-4 md:p-0 mt-6">
                <h2 className="text-lg font-bold">Where you'll be</h2>
                <img src={property.details.mapUrl} alt="Map" className="w-full h-48 object-cover mt-2" />
            </div>

            {/* What this place offers */}
            <div className="p-4 md:p-0 mt-6">
                <h2 className="text-lg font-bold">What this place offers</h2>
                <ul className="space-y-1 mt-2">
                    {property.details.features.map((feature, index) => (
                        <li key={index} className="text-gray-600">{feature}</li>
                    ))}
                </ul>
            </div>

            {/* House Rules, Safety, Property Features */}
            <div className="p-4 md:p-0 mt-6">
                <h2 className="text-lg font-bold">House rules</h2>
                <p className="text-gray-600 mt-1">Check-in: {property.details.houseRules.checkIn}</p>
                <p className="text-gray-600">Check-out: {property.details.houseRules.checkOut}</p>
                <p className="text-gray-600">Security: {property.details.houseRules.security}</p>
            </div>

            <div className="p-4 md:p-0 mt-6">
                <h2 className="text-lg font-bold">Safety features</h2>
                <ul className="space-y-1 mt-2">
                    {property.details.safetyFeatures.map((safetyFeature, index) => (
                        <li key={index} className="text-gray-600">{safetyFeature}</li>
                    ))}
                </ul>
            </div>

            {/* Reviews */}
            <div className="p-4 md:p-0 mt-6">
                <h2 className="text-lg font-bold">Reviews</h2>
                <ul className="space-y-4 mt-2">
                    {property.details.reviews.map((review, index) => (
                        <li key={index} className="bg-gray-100 p-4 rounded">
                            <p className="font-bold">{review.name}</p>
                            <p className="text-gray-600 mt-1">{review.review}</p>
                        </li>
                    ))}
                </ul>
                <button className="mt-4 py-2 px-4 bg-gray-200 text-gray-700 rounded">Show all reviews</button>
            </div>
        </div>
    );
};

export default PropertyDetail;

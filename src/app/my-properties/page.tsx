'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/utils/firebase';
import { useAuth } from '@clerk/nextjs';
import Modal from 'react-modal'; 
import useEmblaCarousel from 'embla-carousel-react';
import { featuresOptions, houseRulesOptions, servicesOptions } from '@/data/propertyOptions';


const MyPropertiesPage = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const { userId } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('body'); // Set the app element to body
    }
  
    const fetchProperties = async () => {
      if (userId) {
        const q = query(collection(firestore, 'properties'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const userProperties = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(userProperties);
      }
    };
  
    fetchProperties();
  }, [userId]);

  const handleEditClick = (property: any) => {
    setCurrentProperty(property);
    setIsModalOpen(true);
  };

  const handleUpdateProperty = async () => {
    try {
      const propertyRef = doc(firestore, 'properties', currentProperty.id);
      await updateDoc(propertyRef, currentProperty);
  
      // Update the properties state with the updated property
      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property.id === currentProperty.id ? currentProperty : property
        )
      );
  
      setIsModalOpen(false); // Close modal after update
      setCurrentProperty(null); // Reset current property
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentProperty({ ...currentProperty, [e.target.name]: e.target.value });
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };


  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const { value, checked } = e.target;
    setCurrentProperty((prevProperty: any) => {
      const updatedField = checked
        ? [...prevProperty[field], value]
        : prevProperty[field].filter((item: string) => item !== value);
  
      return {
        ...prevProperty,
        [field]: updatedField,
      };
    });
  };

  if (!userId) return <p>Please log in to view your properties.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">My Properties</h1>
      {properties.length > 0 ? (
        <ul className="space-y-4">
          {properties.map((property) => (
            <li key={property.id} className="border rounded-lg shadow-lg flex p-4 space-x-4 items-start bg-white">
              {/* Property Image */}
              <div className="w-48 h-32">
                <img
                  src={property.imageUrls?.[0] || '/default-image.jpg'}
                  alt={property.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Property Info */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{property.title}</h2>
                <p className="text-gray-600 mt-1">Price: €{property.price}</p>
                <p className="text-gray-500 mt-2">{property.description.slice(0, 100)}...</p>

                {/* Edit Button */}
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600"
                  onClick={() => handleEditClick(property)}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No properties found.</p>
      )}

      {/* Edit Modal using react-modal */}
      <Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
  contentLabel="Edit Property"
  className="bg-white p-6 rounded-lg max-w-3xl w-full mx-auto shadow-lg"
  overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
>
  {currentProperty && (
    <div className="flex">
      {/* Left Side: Large Image and Thumbnails */}
      <div className="w-1/3 mr-6">
        {/* Large Image */}
        <img
          src={currentProperty.imageUrls?.[selectedImageIndex] || '/default-image.jpg'}
          alt={currentProperty.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        {/* Embla Carousel for Thumbnails */}
        <div className="embla w-full h-24 overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex space-x-2">
            {currentProperty.imageUrls?.map((url: string, idx: number) => (
              <div key={idx} className="embla__slide flex-none w-24 h-24">
                <img
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`w-full h-full object-cover rounded-lg cursor-pointer ${selectedImageIndex === idx ? 'border-2 border-blue-500' : ''}`}
                  onClick={() => handleThumbnailClick(idx)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Edit Form */}
      <div className="w-2/3 overflow-y-auto max-h-[65vh] pr-4">
        <h2 className="text-xl font-bold mb-4">Edit Property</h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={currentProperty.title}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={currentProperty.price}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={currentProperty.description}
            onChange={handleChange}
            className="border p-2 w-full h-24"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={currentProperty.address}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

          {/* Check-In and Check-Out Times */}
          <div className="mb-4">
          <label className="block mb-2">Check-In Time</label>
          <input
            type="time"
            name="checkInTime"
            value={currentProperty.checkInTime}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Check-Out Time</label>
          <input
            type="time"
            name="checkOutTime"
            value={currentProperty.checkOutTime}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* City and Country */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">City</label>
            <input
              type="text"
              name="city"
              value={currentProperty.city}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={currentProperty.country}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
        </div>

        {/* Latitude and Longitude side by side */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={currentProperty.latitude}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={currentProperty.longitude}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
        </div>

       {/* Features Checkboxes */}
       <div className="mb-4">
          <label className="block mb-2">Features</label>
          <div className="grid grid-cols-2 gap-2">
            {featuresOptions.map((feature: string) => (
              <label key={feature} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="features"
                  value={feature}
                  checked={currentProperty.features.includes(feature)}
                  onChange={(e) => handleCheckboxChange(e, 'features')}
                  className="mr-2"
                />
                {feature}
              </label>
            ))}
          </div>
        </div>

        {/* House Rules Checkboxes */}
        <div className="mb-4">
          <label className="block mb-2">House Rules</label>
          <div className="grid grid-cols-2 gap-2">
            {houseRulesOptions.map((rule: string) => (
              <label key={rule} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="houseRules"
                  value={rule}
                  checked={currentProperty.houseRules.includes(rule)}
                  onChange={(e) => handleCheckboxChange(e, 'houseRules')}
                  className="mr-2"
                />
                {rule}
              </label>
            ))}
          </div>
        </div>

        {/* Services Checkboxes */}
        <div className="mb-4">
          <label className="block mb-2">Services</label>
          <div className="grid grid-cols-2 gap-2">
            {servicesOptions.map((service: string) => (
              <label key={service} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="services"
                  value={service}
                  checked={currentProperty.services.includes(service)}
                  onChange={(e) => handleCheckboxChange(e, 'services')}
                  className="mr-2"
                />
                {service}
              </label>
            ))}
          </div>
        </div>

        {/* Update and Cancel Buttons */}
        <div className="sticky bottom-0 left-0 right-0 bg-white p-4 flex justify-center border-t border-gray-200">
  <button
    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
    onClick={handleUpdateProperty}
  >
    Save Changes
  </button>
  <button
    className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 ml-4"
    onClick={() => setIsModalOpen(false)}
  >
    Cancel
  </button>
</div>
      </div>
    </div>
  )}
</Modal>
    </div>
  );
};

export default MyPropertiesPage;
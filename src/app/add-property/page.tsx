'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/utils/firebase';
import { useAuth } from '@clerk/nextjs';
import { featuresOptions, houseRulesOptions, servicesOptions } from '@/data/propertyOptions';
import { collection, addDoc, updateDoc } from 'firebase/firestore'; 
import { firestore } from '@/utils/firebase'; // Import firestore

const AddPropertyPage = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 100,
    latitude: '',
    longitude: '',
    checkInTime: '',
    checkOutTime: '',
    address: '',
    city: '',
    country: '',
    features: [] as string[],
    houseRules: [] as string[],
    services: [] as string[],
    images: [] as File[],
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]); // Store image previews
  const [dragging, setDragging] = useState(false); // State for drag-and-drop
  const [loading, setLoading] = useState(false); // Add loading state



const INPUT_MIN = 10;
const INPUT_MAX = 100000;
const INPUT_STEP = 1;

const SLIDER_MIN = 10;
const SLIDER_MAX = 100000;
const SLIDER_STEP = 10;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (loading) return; // Prevent double submission
  
    setLoading(true); // Set loading to true when form submission starts
  
    try {
      const imageUrls: string[] = [];
  
      // Create the Firestore document first to get its ID
      const { images, ...restFormData } = formData; // Exclude the images field
      const docRef = await addDoc(collection(firestore, 'properties'), { ...restFormData, userId, imageUrls: [] });
      const propertyId = docRef.id; // Get the Firestore document ID
  
      // Upload images to the property-specific folder
      for (const image of formData.images) {
        const storageRef = ref(storage, `properties/${propertyId}/${Date.now()}-${image.name}`);
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        imageUrls.push(downloadURL);
      }
  
      // Update the Firestore document with image URLs
      await updateDoc(docRef, { imageUrls });
  
      router.push('/profile'); // Redirect after success
    } catch (error) {
      console.error('Error adding property:', error);
    } finally {
      setLoading(false); // Set loading to false after submission is done
    }
  };

  // Handle input changes for text and number fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fix for TypeScript key error
  const handleInputChangeFixed = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof typeof formData]: value,
    }));
  };

  // Handle file change for images
  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files);
    setFormData({ ...formData, images: [...formData.images, ...newImages] });

    const newPreviews = newImages.map((image) => URL.createObjectURL(image));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  // Handle checkbox changes for features, house rules, and services
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, category: keyof typeof formData) => {
    const { name, checked } = e.target;
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        [category]: [...(prev[category] as string[]), name],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [category]: (prev[category] as string[]).filter((item) => item !== name),
      }));
    }
  };

  // Handle drag-and-drop image upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Property</h1>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <div className="mb-4">
          <label className="block mb-2">Property Title</label>
          <input
            type="text"
            name="title"
            className="border p-2 w-full"
            value={formData.title}
            onChange={handleInputChangeFixed}
            required
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            className="border p-2 w-full"
            value={formData.description}
            onChange={handleInputChangeFixed}
            required
          ></textarea>
        </div>

        {/* Price Input */}
        <div className="mb-4">
  <label className="block mb-2">Price per Night</label>
  <div className="flex items-center space-x-4">
    {/* Minus button */}
    <button
      type="button"
      className="px-3 py-1 bg-gray-200 rounded"
      onClick={() => setFormData({ ...formData, price: Math.max(SLIDER_MIN, formData.price - SLIDER_STEP) })}
    >
      -
    </button>

    {/* Slider */}
    <input
      type="range"
      name="price"
      min={SLIDER_MIN}
      max={SLIDER_MAX}
      step={SLIDER_STEP}
      value={formData.price}
      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
      className="w-full"
    />

    {/* Plus button */}
    <button
      type="button"
      className="px-3 py-1 bg-gray-200 rounded"
      onClick={() => setFormData({ ...formData, price: Math.min(SLIDER_MAX, formData.price + SLIDER_STEP) })}
    >
      +
    </button>
  </div>

          {/* Display the price */}
          <div className="flex items-center justify-end mt-2 relative group">
    <span className="mr-2">Price: €</span>
    <div className="relative w-24">
      {/* Minus button */}
      <button
        type="button"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 px-2 py-1 text-gray-500 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setFormData((prev) => ({ ...prev, price: Math.max(prev.price - INPUT_STEP, INPUT_MIN) }))}
      >
        -
      </button>

      {/* Price input */}
      <input
        type="number"
        name="price"
        min={INPUT_MIN}
        max={INPUT_MAX}
        step={INPUT_STEP}
        className="border w-full p-1 text-center appearance-none custom-number-input"
        value={formData.price === 0 ? '' : formData.price} // Allow clearing the input
        onChange={(e) => {
          const value = e.target.value === '' ? 0 : Number(e.target.value);
          setFormData((prev) => ({ ...prev, price: value }));
        }}
        onBlur={() => {
          if (formData.price < INPUT_MIN) {
            setFormData((prev) => ({ ...prev, price: INPUT_MIN })); // Set minimum value on blur
          }
        }}
        required
      />

      {/* Plus button */}
      <button
        type="button"
        className="absolute right-0 top-1/2 transform -translate-y-1/2 px-2 py-1 text-gray-500 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setFormData((prev) => ({ ...prev, price: Math.min(prev.price + INPUT_STEP, INPUT_MAX) }))}
      >
        +
      </button>
    </div>
  </div>
        </div>





   {/* Address, City, State, Country */}
   <p className="text-lg font-semibold text-center mb-4">Enter Property Address</p>
        <div className="mb-4">
          <label className="block mb-2">Address</label>
          <input
            type="text"
            name="address"
            className="border p-2 w-full"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">City</label>
          <input
            type="text"
            name="city"
            className="border p-2 w-full"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
   
        <div className="mb-4">
          <label className="block mb-2">Country</label>
          <input
            type="text"
            name="country"
            className="border p-2 w-full"
            value={formData.country}
            onChange={handleInputChange}
            required
          />
        </div>



        {/* Coordinates Input */}
        <p className="text-lg font-semibold text-center mb-4">Enter Property Coordinates</p>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-2">Latitude</label>
            <input
              type="text"
              name="latitude"
              className="border p-2 w-full"
              value={formData.latitude}
              onChange={handleInputChangeFixed}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2">Longitude</label>
            <input
              type="text"
              name="longitude"
              className="border p-2 w-full"
              value={formData.longitude}
              onChange={handleInputChangeFixed}
              required
            />
          </div>
        </div>

        {/* Check-in and Check-out Times */}
        <div className="mb-4">
          <label className="block mb-2">Check-In Time</label>
          <input
            type="time"
            name="checkInTime"
            className="border p-2 w-full"
            value={formData.checkInTime}
            onChange={handleInputChangeFixed}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Check-Out Time</label>
          <input
            type="time"
            name="checkOutTime"
            className="border p-2 w-full"
            value={formData.checkOutTime}
            onChange={handleInputChangeFixed}
            required
          />
        </div>

        {/* Features Checkboxes */}
        <p className="text-lg font-semibold text-center mb-4">Select Property Features</p>
        <div className="mb-4">
          <label className="block mb-2">Features</label>
          <div>
            {featuresOptions.map((feature) => (
              <label key={feature} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  name={feature}
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
          <div>
            {houseRulesOptions.map((rule) => (
              <label key={rule} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  name={rule}
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
          <div>
            {servicesOptions.map((service) => (
              <label key={service} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  name={service}
                  onChange={(e) => handleCheckboxChange(e, 'services')}
                  className="mr-2"
                />
                {service}
              </label>
            ))}
          </div>
        </div>

        {/* File Upload Section */}
        <p className="text-lg font-semibold text-center mb-4">Upload Property Images</p>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-dashed border-2 p-4 text-center ${
            dragging ? 'border-blue-500' : 'border-gray-500'
          } mb-4`}
        >
          <p>Drag and drop images here or</p>
          <label className="cursor-pointer text-blue-500">
            <input
              type="file"
              name="images"
              className="hidden"
              multiple
              onChange={(e) => handleFileChange(e.target.files)}
              required
            />
            <span className="underline">click to upload</span>
          </label>
        </div>

        {/* Image Previews */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {previewImages.map((src, index) => (
              <div key={index} className="relative">
                <img src={src} alt={`Preview ${index}`} className="h-32 w-full object-cover rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
  type="submit"
  className={`bg-blue-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
  disabled={loading} // Disable button while loading
>
  {loading ? 'Submitting...' : 'Submit'}
</button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyPage;
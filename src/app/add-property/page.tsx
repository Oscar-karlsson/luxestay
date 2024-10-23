'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/utils/firebase';
import { featuresOptions, houseRulesOptions, servicesOptions } from '@/data/propertyOptions';

const AddPropertyPage = () => {
  const router = useRouter();
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
    state: '',
    country: '',
    postalCode: '',
    features: [] as string[],
    houseRules: [] as string[],
    services: [] as string[],
    images: [] as File[],
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]); // Store image previews
  const [dragging, setDragging] = useState(false); // State for drag-and-drop

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure you're using the imported `storage` from Firebase setup
      const imageUrls: string[] = [];
    
      // Upload each image to Firebase Storage
      for (const image of formData.images) {
        const storageRef = ref(storage, `properties/${Date.now()}-${image.name}`);
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        imageUrls.push(downloadURL); // Push the URL to the array
      }
  
      // Prepare form data including image URLs
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', String(formData.price));
      formDataToSend.append('latitude', formData.latitude);
      formDataToSend.append('longitude', formData.longitude);
      formDataToSend.append('checkInTime', formData.checkInTime);
      formDataToSend.append('checkOutTime', formData.checkOutTime);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('postalCode', formData.postalCode);
  
      // Append arrays
      formData.features.forEach((feature) => formDataToSend.append('features[]', feature));
      formData.houseRules.forEach((rule) => formDataToSend.append('houseRules[]', rule));
      formData.services.forEach((service) => formDataToSend.append('services[]', service));
  
      // Append image URLs
      imageUrls.forEach((url) => formDataToSend.append('imageUrls[]', url));
  
      // Send the form data to the backend
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (response.ok) {
        router.push('/profile'); // Redirect after success
      }
    } catch (error) {
      console.error('Error adding property:', error);
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
              onClick={() => setFormData({ ...formData, price: Math.max(0, formData.price - 10) })}
            >
              -
            </button>

            {/* Slider */}
            <input
              type="range"
              name="price"
              min="0"
              max="100000"
              step="10"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full"
            />

            {/* Plus button */}
            <button
              type="button"
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={() => setFormData({ ...formData, price: Math.min(1000, formData.price + 10) })}
            >
              +
            </button>
          </div>

          {/* Display the price */}
          <div className="text-right mt-2">Price: €{formData.price}</div>
        </div>





   {/* Address, City, State, Country, Postal Code */}
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
        <div className="mb-4">
          <label className="block mb-2">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            className="border p-2 w-full"
            value={formData.postalCode}
            onChange={handleInputChange}
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
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyPage;
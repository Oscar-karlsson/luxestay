'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/utils/firebase';
import { useAuth } from '@clerk/nextjs';
import Modal from 'react-modal'; // Import react-modal

const MyPropertiesPage = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const { userId } = useAuth();

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
      setIsModalOpen(false); // Close modal after update
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentProperty({ ...currentProperty, [e.target.name]: e.target.value });
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
        className="bg-white p-6 rounded-lg max-w-lg w-full mx-auto shadow-lg"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
      >
        {currentProperty && (
          <>
            <h2 className="text-xl font-bold mb-4">Edit Property</h2>

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

            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                value={currentProperty.description}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>

            {/* Update Button */}
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600"
              onClick={handleUpdateProperty}
            >
              Save Changes
            </button>

            {/* Close Modal */}
            <button
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded mt-4 hover:bg-gray-400 ml-2"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MyPropertiesPage;
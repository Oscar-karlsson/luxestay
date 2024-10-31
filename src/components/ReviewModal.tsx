import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';



interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');


  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('body');  // Set app element to body
    }
  }, []);

  const handleSubmit = () => {
    onSubmit(rating, comment);
    setRating(0); // Reset rating after submission
    setComment(''); // Reset comment after submission
    onClose(); // Close the modal
  };

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    contentLabel="Write a Review"
    className="review-modal-content"       // Custom class for the modal content
    overlayClassName="review-modal-overlay" // Custom class for the modal overlay
>
      <h2 className="text-2xl font-semibold text-center mb-4">Write a Review</h2>
      
      {/* Star Rating */}
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={`cursor-pointer text-3xl ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Textarea for Review Comment */}
      <textarea
        className="w-full h-24 border p-2 rounded mb-4"
        placeholder="Tell us about your experience"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Submit Review
        </button>
      </div>
    </Modal>
  );
};

export default ReviewModal;

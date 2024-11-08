import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createBooking } from '@/services/bookingService';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface CardFormProps {
    clientSecret: string;
    handlePaymentSuccess: (bookingId: string) => void;
    propertyId: string;
    startDate: Date;
    endDate: Date;
    propertyTitle: string;
    imageUrl: string;
    location: string;
    pricePerNight: number;
    cleaningFee: number;
    serviceFee: number;
  }

  const CardForm: React.FC<CardFormProps> = ({
    clientSecret,
    propertyId,
    startDate,
    endDate,
    propertyTitle,
    imageUrl,
    location,
    pricePerNight,
    cleaningFee,
    serviceFee,
    handlePaymentSuccess,
  }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret || loading) return; // Prevent multiple submissions
    setLoading(true); // Set loading to true when payment starts

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: elements.getElement(CardElement)!,
        },
    });

    if (error) {
        console.log("Payment error:", error.message);
        setLoading(false); // Reset loading if there's an error
    } else if (paymentIntent?.status === 'succeeded') {
        if (isSignedIn && user?.id) {
            if (!propertyId) {
                console.error("Error: propertyId is not defined.");
                setLoading(false);
                return;
            }

            try {
                const bookingId = await createBooking({
                    userId: user.id,
                    propertyId,
                    startDate,
                    endDate,
                    location,
                    pricePerNight,
                    imageUrl,
                    cleaningFee,
                    serviceFee,
                    propertyTitle,
                });

                if (bookingId) {
                    handlePaymentSuccess(bookingId);
                    console.log("Booking created and payment confirmed.");
                } else {
                    console.error("Failed to create booking. Please try again.");
                }
            } catch (error) {
                console.error('Error creating booking:', error);
            } finally {
                setLoading(false); // Reset loading in all cases
            }
        } else {
            console.error('User is not authenticated.');
            setLoading(false);
        }
    }
};

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
    <div className="flex justify-between items-center mb-4">
      <p className="font-semibold">Payment method</p>
      <button
        onClick={() => alert("Change card functionality here")} 
        className="text-orange-500 font-semibold">
        CHANGE
      </button>
    </div>
    <div className="border p-4 rounded-md shadow-sm mb-4">
      <CardElement options={{ hidePostalCode: true }} />
    </div>
    <button 
    onClick={handlePayment} 
    className={`bg-black text-white py-3 px-4 w-full rounded-lg font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={loading}
>
    {loading ? 'Processing...' : 'Reserve'}
</button>
  </div>
);
};

export default CardForm;
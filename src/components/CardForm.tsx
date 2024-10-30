import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface CardFormProps {
  clientSecret: string | null;
  handlePaymentSuccess: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ clientSecret, handlePaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (error) {
      alert(error.message);
    } else if (paymentIntent?.status === 'succeeded') {
      handlePaymentSuccess();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
    <div className="flex justify-between items-center mb-4">
      <p className="font-semibold">Payment method</p>
      <button
        onClick={() => alert("Change card functionality here")} // Implement your logic for changing the card
        className="text-orange-500 font-semibold">
        CHANGE
      </button>
    </div>
    <div className="border p-4 rounded-md shadow-sm mb-4">
      <CardElement options={{ hidePostalCode: true }} />
    </div>
    <button onClick={handlePayment} className="bg-black text-white py-3 px-4 w-full rounded-lg font-semibold">
      Reserve
    </button>
  </div>
);
};

export default CardForm;
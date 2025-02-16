import React, { useState, useCallback } from 'react';
import axios from 'axios';

const RazorpayPayment = ({ user, amount, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Create order on backend
      const orderResponse = await axios.post('/api/payment/create-order', {
        name: user.name,
        email: user.email,
        phone: user.phone,
        amount: amount,
        user: user
      });

      const loadedRazorpay = await initializeRazorpay();
      if (!loadedRazorpay) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Fetch Razorpay credentials
      const credentialsResponse = await axios.get('/api/payment/credentials');
      const { key } = credentialsResponse.data;

      const options = {
        key: key,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Product Purchase',
        order_id: orderResponse.data.razorpayOrderId,
        handler: async (response) => {
          try {
            await axios.post('/api/payment/handle-payment-callback', response);
            onSuccess && onSuccess(response);
          } catch (error) {
            onError && onError('Payment verification failed');
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone
        },
        notes: {
          address: 'Your Company Address'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      onError && onError('Payment initialization failed');
      setError('Payment initialization failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user, amount, onSuccess, onError]);

  return (
    <div>
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default RazorpayPayment;
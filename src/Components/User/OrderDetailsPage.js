import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function OrderDetailsPage() {
  const { orderNumber } = useParams(); 
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/payment/order-details/${orderNumber}`);
        setOrderDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details', error);
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrderDetails();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return <div className="text-center py-12">No order details available.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Order Details #{orderNumber}</h1>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Items Purchased:</h2>
        <ul>
          {orderDetails.items.map((item, index) => (
            <li key={index} className="mt-2">
              <p>{item.name} - ${item.price.toFixed(2)} x {item.quantity}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Payment Status:</h2>
        <p>{orderDetails.paymentStatus}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Shipping Address:</h2>
        <p>{orderDetails.shippingAddress}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Total Amount:</h2>
        <p>${orderDetails.totalAmount.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default OrderDetailsPage;

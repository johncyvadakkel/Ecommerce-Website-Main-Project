import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { Package, Truck, CheckCircle, AlertCircle, CreditCard, Box } from "lucide-react";

const TrackOrder = () => {
  const { orderNumber } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderNumber) {
        setError("Order number is required");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8080/api/payment/track-order/${orderNumber}`);
        setOrderDetails(response.data);
      } catch (err) {
        setError("Error fetching order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderNumber]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CREATED':
        return <CheckCircle className="w-6 h-6" />;
      case 'PAYMENT_PENDING':
        return <CreditCard className="w-6 h-6" />;
      case 'PAYMENT_COMPLETED':
        return <CheckCircle className="w-6 h-6" />;
      case 'PROCESSING':
        return <Box className="w-6 h-6" />;
      case 'SHIPPED':
        return <Truck className="w-6 h-6" />;
      case 'DELIVERED':
        return <Package className="w-6 h-6" />;
      default:
        return <AlertCircle className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status, isCompleted) => {
    if (!isCompleted) return 'text-gray-400';
    
    switch (status) {
      case 'DELIVERED':
        return 'text-green-500';
      case 'SHIPPED':
        return 'text-blue-500';
      case 'CANCELLED':
        return 'text-red-500';
      case 'PROCESSING':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case 'CREATED':
        return 'Order Placed';
      case 'PAYMENT_PENDING':
        return 'Payment Pending';
      case 'PAYMENT_COMPLETED':
        return 'Payment Completed';
      case 'PROCESSING':
        return 'Processing';
      case 'SHIPPED':
        return 'Shipped';
      case 'DELIVERED':
        return 'Delivered';
      default:
        return status;
    }
  };

  const getOrderTimeline = (currentStatus) => {
    const allStatuses = ['CREATED', 'PAYMENT_COMPLETED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIndex = allStatuses.indexOf(currentStatus);
    
    return allStatuses.map((step, index) => ({
      status: step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-md w-full max-w-2xl mx-4">
          <div className="p-6">
            <div className="flex items-center justify-center text-red-500">
              <AlertCircle className="w-6 h-6 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const timeline = getOrderTimeline(orderDetails?.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Order #{orderDetails?.orderNumber}</h2>
                <div className="text-sm text-gray-500">
                  Placed on {new Date(orderDetails?.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹{orderDetails?.amount}</div>
                <div className={`text-sm ${getStatusColor(orderDetails?.orderStatus, true)}`}>
                  {getStatusName(orderDetails?.orderStatus)}
                </div>
              </div>
            </div>

            <div className="space-y-8 mt-8">
              {timeline.map((step, index) => (
                <div key={index} className="relative">
                  {index < timeline.length - 1 && (
                    <div className={`absolute left-[1.125rem] top-8 w-0.5 h-12 
                      ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} 
                    />
                  )}
                  <div className="flex items-start">
                    <div className={`rounded-full p-1 mr-4 ${getStatusColor(step.status, step.completed)}`}>
                      {step.completed ? <CheckCircle className="w-6 h-6" /> : getStatusIcon(step.status)}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {getStatusName(step.status)}
                        {step.completed && !step.current && (
                          <span className="ml-2 text-green-500 text-sm">✓</span>
                        )}
                      </div>
                      {step.current && (
                        <>
                          {orderDetails?.currentLocation && (
                            <div className="text-sm text-gray-500 mt-1">
                              Current Location: {orderDetails.currentLocation}
                            </div>
                          )}
                          {orderDetails?.estimatedDelivery && (
                            <div className="text-sm text-gray-500">
                              Expected by: {new Date(orderDetails.estimatedDelivery).toLocaleDateString()}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
                  Need help?
                </button>
                {orderDetails?.orderStatus !== 'DELIVERED' && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                    Track Package
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
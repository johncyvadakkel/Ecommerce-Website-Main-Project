import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { Package, Truck, Clock, AlertCircle, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/payment/orders/user/${user.id}`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CREATED':
        return <Clock className="w-5 h-5 text-gray-500" />;
      case 'PAYMENT_PENDING':
        return <CreditCard className="w-5 h-5 text-yellow-500" />;
      case 'PAYMENT_COMPLETED':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'PROCESSING':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'SHIPPED':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'DELIVERED':
        return <Package className="w-5 h-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CREATED':
        return 'bg-gray-100 text-gray-800';
      case 'PAYMENT_PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAYMENT_COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-600 mt-2">Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.orderNumber} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.orderStatus)}
                    <h2 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderNumber}
                    </h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                    {formatStatus(order.orderStatus)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="mt-1 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="mt-1 font-medium">${order.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                    <p className="mt-1 font-medium">
                      {order.orderStatus === 'DELIVERED' ? 'Delivered' : 
                       order.orderStatus === 'CANCELLED' ? 'Cancelled' :
                       '3-5 business days'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p className="mt-1 font-medium">
                      {order.orderStatus === 'PAYMENT_COMPLETED' ? 'Paid' :
                       order.orderStatus === 'PAYMENT_PENDING' ? 'Pending' :
                       order.orderStatus === 'CANCELLED' ? 'Cancelled' : 'Processing'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300">
                    <Link to={`/track-order/${order.orderNumber}`}>Track Order</Link>
                  </button>
                  
                  )}
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
  <Link to={`/order-details/${order.orderNumber}`}>View Details</Link>
</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderDetails;




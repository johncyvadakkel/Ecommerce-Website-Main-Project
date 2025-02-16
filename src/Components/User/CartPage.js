import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from '../AuthContext';



function Notification({ type, message, onClose }) {
  return (
    <div className={`p-4 rounded-lg mb-4 ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button onClick={onClose} className="text-black ml-4">&times;</button>
      </div>
    </div>
  );
}

function CartPage() {

  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, loading, error } = useCart();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleUpdateQuantity = async (itemId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to update quantity'
      });
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      setNotification({
        type: 'success',
        message: 'Item removed from cart'
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to remove item'
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/user-dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        {notification && (
          <Notification 
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="flex flex-col items-center gap-4">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
              <p className="text-gray-500">Looks like you haven't added any items to your cart yet.</p>
              <button
                onClick={() => navigate('/user-dashboard')}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex items-center gap-6">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.product.imageUrl || '/api/placeholder/96/96'}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ${item.product.price} each
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="w-24 text-right">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${calculateTotal()}
                </span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                // onClick={handlePayment}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage

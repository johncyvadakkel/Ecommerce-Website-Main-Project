import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Star, 
  Package2, 
  ShoppingCart, 
  Heart, 
  ArrowLeft, 
  Shield, 
  Truck, 
  Clock
} from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from '../AuthContext'; 
import { Alert } from './Alert';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();  
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [notification, setNotification] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/admin/products/${id}`);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart() {
    if (!user) {
      setNotification({
        type: 'error',
        message: 'Please login to add items to cart'
      });
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      
      setNotification({
        type: 'success',
        message: 'Product added to cart successfully!'
      });
    } catch (err) {
      console.error('Error in handleAddToCart:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to add to cart'
      });
    } finally {
      setAddingToCart(false);
    }
}

  function handleBuyNow() {
    if (!user) {
      setNotification({
        type: 'error',
        message: 'Please login to proceed'
      });
      navigate('/login');
      return;
    }
    
    handleAddToCart();
    navigate('/checkout');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <Alert variant="error">
          {error || 'Product not found'}
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </button>

        {/* Notification */}
        {notification && (
          <div className="mb-4">
            <Alert 
              variant={notification.type} 
              onClose={() => setNotification(null)}
            >
              {notification.message}
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl shadow-sm p-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.imageUrl || '/api/placeholder/600/400'}
                alt={product.name}
                className="w-full rounded-lg"
              />
              {product.isOrganic && (
                <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  Organic Certified
                </span>
              )}
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600">{product.rating || '4.5'}</span>
                </div>
                <span className="text-gray-600">
                  {product.reviews || '128'} reviews
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-green-600">
                {product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>

            <div className="prose prose-sm text-gray-600">
              <p>{product.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <Package2 className="w-5 h-5 text-gray-400" />
              <span className={`${product.stockQuantity < 50 ? 'text-red-500' : 'text-gray-600'}`}>
                {product.stockQuantity} in stock
              </span>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">24/7 Support</span>
              </div>
              {product.isOrganic && (
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Organic Certified</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border rounded-lg hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-3 py-1 border rounded-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-green-600 text-green-600 py-3 rounded-lg hover:bg-green-50 disabled:opacity-50"
                >
                  {addingToCart ? (
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
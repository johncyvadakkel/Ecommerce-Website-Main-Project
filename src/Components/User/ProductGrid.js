import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Heart } from 'lucide-react';
import { useAuth } from '../AuthContext';

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUserId } = useAuth(); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-8 bg-red-50 rounded-lg">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          userId={currentUserId} 
          onClick={() => navigate(`/product/${product.id}`)} 
        />
      ))}
    </div>
  );
};

const ProductCard = ({ product, onClick, userId }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  const addToWishlist = async (e) => {
    e.stopPropagation(); // Prevent card click
    
    if (!userId) {
      alert('Please log in to add to wishlist');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8080/api/wishlist/toggle', null, {
        params: {
          userId: userId,
          productId: product.id
        }
      });
      
      setIsInWishlist(response.data);
      alert(response.data ? 'Product added to wishlist!' : 'Product removed from wishlist');
    } catch (error) {
      console.error('Failed to toggle wishlist', error);
      alert('Failed to update wishlist');
    }
  };
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="relative">
        <img 
          src={product.imageUrl || '/api/placeholder/400/300'} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.isOrganic && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Organic
          </span>
        )}
        <button 
          className={`absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 
            ${isInWishlist ? 'text-red-500' : 'text-gray-600'}`}
          onClick={addToWishlist}
        >
          <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">
              {product.rating || '4.5'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            ({product.reviews || '128'} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">
              Rs.{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
               Rs.{product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {product.stockQuantity} left
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductGrid

import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../AuthContext';

function WishlistPage() {
 
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { currentUserId } = useAuth();

    useEffect(() => {
        if (currentUserId) {
            fetchWishlist();
        }
    }, [currentUserId]);

    const fetchWishlist = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/wishlist?userId=${currentUserId}`);
            setWishlistItems(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch wishlist');
            setLoading(false);
        }
    };


    const removeFromWishlist = async (productId) => {
        try {
            await axios.post('http://localhost:8080/api/wishlist/toggle', null, {
                params: {
                    userId: currentUserId, 
                    productId: productId
                }
            });
            
            setWishlistItems(wishlistItems.filter(item => item.id !== productId));
        } catch (err) {
            console.error('Failed to remove from wishlist', err);
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
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
            
            {wishlistItems.length === 0 ? (
                <div className="text-center text-gray-500">
                    Your wishlist is empty
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((product) => (
                        <div 
                            key={product.id} 
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                            <div className="relative">
                                <img 
                                    src={product.imageUrl || '/api/placeholder/400/300'} 
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                />
                                <button 
                                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50"
                                    onClick={() => removeFromWishlist(product.id)}
                                >
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </button>
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-green-600">
                                        Rs.{product.price}
                                    </span>
                                    <button 
                                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        View Details
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

export default WishlistPage

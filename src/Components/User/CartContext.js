import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children, userId }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchCartItems = async () => {
      if (!userId) return; 
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/cart/items`, {
          params: { userId }
        });
        setCartItems(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch cart items');
      } finally {
        setLoading(false);
      }
    };
  
    const addToCart = async (productId, quantity) => {
      if (!userId) {
        throw new Error('Please log in to add items to cart');
      }
      try {
        setLoading(true);
        const response = await axios.post(`http://localhost:8080/api/cart/add`, null, {
          params: {
            userId,
            productId,
            quantity
          }
        });
        await fetchCartItems(); 
        return response.data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to add item to cart';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const removeFromCart = async (itemId) => {
      if (!userId) return;
      try {
        setLoading(true);
        await axios.delete(`http://localhost:8080/api/cart/remove/${itemId}`, {
          params: { userId }
        });
        await fetchCartItems();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to remove item from cart');
      } finally {
        setLoading(false);
      }
    };

    const updateQuantity = async (itemId, quantity) => {
      if (!userId) return;
      try {
        setLoading(true);
        await axios.put(`http://localhost:8080/api/cart/update/${itemId}`, null, {
          params: {
            userId,
            quantity
          }
        });
        await fetchCartItems();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update quantity');
      } finally {
        setLoading(false);
      }
    };

    return (
      <CartContext.Provider
        value={{
          cartItems,
          loading,
          error,
          addToCart,
          removeFromCart,
          updateQuantity,
          fetchCartItems
        }}
      >
        {children}
      </CartContext.Provider>
    );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
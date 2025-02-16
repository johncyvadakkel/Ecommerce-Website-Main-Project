import React from 'react'
import { useState } from 'react';
// import { Menu, ShoppingCart, Search, User, Heart } from 'lucide-react';

function Homepage() {
    const [categories] = useState([
        { id: 1, name: 'Electronics', image: '/api/placeholder/300/200' },
        { id: 2, name: 'Fashion', image: '/api/placeholder/300/200' },
        { id: 3, name: 'Home & Living', image: '/api/placeholder/300/200' },
        { id: 4, name: 'Books', image: '/api/placeholder/300/200' }
      ]);
    
      const [featuredProducts] = useState([
        { id: 1, name: 'Wireless Headphones', price: 99.99, image: '/api/placeholder/200/200' },
        { id: 2, name: 'Smart Watch', price: 199.99, image: '/api/placeholder/200/200' },
        { id: 3, name: 'Laptop Stand', price: 49.99, image: '/api/placeholder/200/200' },
        { id: 4, name: 'Coffee Maker', price: 79.99, image: '/api/placeholder/200/200' }
      ]);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button className="text-2xl mr-4">☰</button>
              <span className="text-xl font-bold">ShopHub</span>
            </div>
            
            <div className="flex items-center flex-1 max-w-xl px-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-2">🔍</span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button>👤</button>
              <button>❤️</button>
              <button>🛒</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gray-900 h-96">
        <img
          src="/api/placeholder/1920/600"
          alt="Hero"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Summer Sale
            </h1>
            <p className="text-xl text-white mb-8">
              Up to 50% off on selected items
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-blue-600 font-bold">${product.price}</p>
                <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">
              Get the latest updates on new products and upcoming sales
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-400">
                We are dedicated to providing the best shopping experience for our customers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Contact Us</li>
                <li>Shipping Policy</li>
                <li>Returns & Exchanges</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Home</li>
                <li>Shop</li>
                <li>Categories</li>
                <li>Account</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Facebook</li>
                <li>Twitter</li>
                <li>Instagram</li>
                <li>Pinterest</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage

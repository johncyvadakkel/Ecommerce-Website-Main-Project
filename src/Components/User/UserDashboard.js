import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from '../AuthContext'; 
import { Search, ShoppingCart, Filter, Menu, Home, Package, User, Heart, ChevronDown } from 'lucide-react';
import logo from '../../assets/logo.png';
import axios from 'axios';

const NavLink = ({ icon, label, active, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer 
        ${active 
          ? 'bg-green-100 text-green-600' 
          : 'hover:bg-gray-100 text-gray-700'
        }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};


function UserDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState('All Prices');
  const [sortOption, setSortOption] = useState('Popularity');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { currentUserId, logout } = useAuth(); 

  const toggleAccountDropdown = () => {
    setShowAccountDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowAccountDropdown(false);
  };

  const ProductCard = ({ product, onClick }) => {
    const [isInWishlist, setIsInWishlist] = useState(false);

    const addToWishlist = async (e) => {
      e.stopPropagation(); 
      
      if (!currentUserId) {
        alert('Please log in to add to wishlist');
        return;
      }
    
      try {
        const response = await axios.post('http://localhost:8080/api/wishlist/toggle', null, {
          params: {
            userId: currentUserId,
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
  };

  const applyFilters = useCallback((products) => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = 
        selectedCategory === 'All Categories' || 
        product.category === selectedCategory;

      const matchesPriceRange = 
        priceRange === 'All Prices' ||
        (priceRange === 'Under ₹100' && product.price < 100) ||
        (priceRange === '₹100 - ₹500' && product.price >= 100 && product.price <= 500) ||
        (priceRange === '₹500 - ₹1000' && product.price > 500 && product.price <= 1000) ||
        (priceRange === 'Above ₹1000' && product.price > 1000);

      return matchesSearch && matchesCategory && matchesPriceRange;
    }).sort((a, b) => {
      switch(sortOption) {
        case 'Price: Low to High':
          return a.price - b.price;
        case 'Price: High to Low':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [searchQuery, selectedCategory, priceRange, sortOption]);

  const fetchAndFilterProducts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/products');
      const products = response.data;
      setOriginalProducts(products);
      setFilteredProducts(applyFilters(products));
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  }, [applyFilters]);

  useEffect(() => {
    if (originalProducts.length > 0) {
      setFilteredProducts(applyFilters(originalProducts));
    }
  }, [originalProducts, applyFilters]);

  useEffect(() => {
    fetchAndFilterProducts();
  }, [fetchAndFilterProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src={logo}
              alt="PDS Organics" 
              className="h-8 w-8 md:h-10 md:w-10 rounded-full"
            />
            <span className="text-lg md:text-xl font-bold">Green Growth</span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for organic spices..."
                className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button 
              className="hover:text-green-100 relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="md:hidden bg-gradient-to-r from-green-50 to-emerald-50 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for organic spices..."
            className="w-full px-4 py-2 rounded-lg text-gray-800 border focus:outline-none focus:ring-2 focus:ring-green-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b">
          <div className="px-4 py-2 space-y-2">
            <NavLink icon={<Home size={20} />} label="Home" active />
            <NavLink icon={<Package size={20} />} label="Orders" />
            <div className="relative">
              <NavLink
                icon={<User size={20} />}
                label="Account"
                onClick={toggleAccountDropdown}
              />
              {showAccountDropdown && (
                <div className="absolute left-0 top-full mt-2 w-40 bg-white shadow-lg rounded-md z-10">
                  <div
                    onClick={() => navigate('/account/wishlist')}
                    className="px-4 py-2 hover:bg-gray-100 text-gray-800 cursor-pointer"
                  >
                    Wishlist
                  </div>
                  <div
                    onClick={() => navigate('/account/addresses')}
                    className="px-4 py-2 hover:bg-gray-100 text-gray-800 cursor-pointer"
                  >
                    Addresses
                  </div>
                  <div
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
            <NavLink 
              icon={<ShoppingCart size={20} />} 
              label="Cart" 
              onClick={() => navigate('/cart')}
            />
          </div>
        </div>
      )}

      {/* Secondary Navigation - Hidden on mobile */}
      <div className="hidden md:block bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Navigation Links */}
            <div className="flex space-x-8">
              <NavLink icon={<Home size={20} />} label="Home" active />
              <NavLink icon={<Package size={20} />} label="Orders" onClick={() => navigate('/account/orders')} />
              <div className="relative">
                <NavLink
                  icon={<User size={20} />}
                  label="Account"
                  onClick={toggleAccountDropdown}
                />
                <ChevronDown
                  size={16}
                  className="text-gray-500 cursor-pointer absolute top-2 right-0 transform translate-x-2"
                  onClick={toggleAccountDropdown}
                />
                {showAccountDropdown && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-md rounded-lg z-10">
                    <div
                      onClick={() => navigate('/account/wishlist')}
                      className="px-4 py-2 hover:bg-gray-100 text-gray-800 cursor-pointer"
                    >
                      Wishlist
                    </div>
                    <div
                      onClick={() => navigate('/account/addresses')}
                      className="px-4 py-2 hover:bg-gray-100 text-gray-800 cursor-pointer"
                    >
                      Addresses
                    </div>
                    <div
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
              <NavLink 
                icon={<ShoppingCart size={20} />} 
                label="Cart" 
                onClick={() => navigate('/cart')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option>All Categories</option>
                  <option>WHOLE_SPICES</option>
                  <option>GROUND_SPICES</option>
                  <option>EXOTIC_SPICES</option>
                  <option>ORGANIC_SPICES</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option>All Prices</option>
                  <option>Under ₹100</option>
                  <option>₹100 - ₹500</option>
                  <option>₹500 - ₹1000</option>
                  <option>Above ₹1000</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Featured Products
          </h1>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-green-600 hover:text-green-500"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        {/* Custom Product Grid with Filtered Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => navigate(`/product/${product.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package2, Leaf, CircleDollarSign, Star, TrendingUp, Box, Trash2, X, AlertCircle } from 'lucide-react';


function ProductDetails() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/products', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/admin/${productToDelete.id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setProducts(products.filter(p => p.id !== productToDelete.id));
      showNotification(`${productToDelete.name} has been deleted successfully`);
    } catch (error) {
      console.error('Delete error:', error);
      showNotification(error.response?.data?.message || 'Failed to delete product. Please try again.', 'error');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-500 px-6 py-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg p-4 shadow-lg flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {notification.type === 'error' ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <Star className="w-5 h-5" />
          )}
          {notification.message}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold">Delete Product</h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 flex items-center gap-2"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Inventory</h1>
            <p className="text-gray-500 mt-2">Manage your product catalog</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg">
              <Box className="w-4 h-4 mr-2" />
              Total Products: {products.length}
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg">
              <TrendingUp className="w-4 h-4 mr-2" />
              Total Sales: {products.reduce((acc, product) => acc + product.sales, 0)}
            </span>
          </div>
        </div>

        {/* Products grouped by category */}
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <div key={category} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">{category}</h2>
              <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                {categoryProducts.length} products
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
                  <div className="relative">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        {product.isOrganic && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-500 text-white">
                            <Leaf className="w-4 h-4 mr-1" />
                            Organic
                          </span>
                        )}
                        {product.originalPrice > product.price && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-500 text-white">
                            Sale
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(product);
                        }}
                        className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-full text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span>{product.sales} sold</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package2 className="w-4 h-4 text-gray-400" />
                      <span className={`${product.stockQuantity < 50 ? 'text-red-500' : 'text-gray-600'}`}>
                        {product.stockQuantity} in stock
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        Rs.{product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          Rs.{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${product.stockQuantity < 50 ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                      {product.stockQuantity < 50 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}

export default ProductDetails

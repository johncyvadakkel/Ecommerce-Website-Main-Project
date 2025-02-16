import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
 
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOrganic, setIsOrganic] = useState(false);

  const categories = [
    { id: 1, name: 'Whole Spices', value: 'WHOLE_SPICES' },
    { id: 2, name: 'Ground Spices', value: 'GROUND_SPICES' },
    { id: 3, name: 'Exotic Spices', value: 'EXOTIC_SPICES' },
    { id: 4, name: 'Blended Spices', value: 'BLENDED_SPICES' },
    { id: 5, name: 'Organic Spices', value: 'ORGANIC_SPICES' },
    { id: 6, name: 'Seeds', value: 'SEEDS' },
    { id: 7, name: 'Herbs', value: 'HERBS' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '',
    imageUrl: '',
    isOrganic: false,
    organicCertification: '',
    harvestDate: '',
    origin: ''
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Convert data types before sending
    const productData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : null,
        isOrganic: Boolean(isOrganic),
        harvestDate: formData.harvestDate ? formData.harvestDate : null
    };

    try {
        console.log('Sending product data:', productData); // Debug log
        const response = await fetch('http://localhost:8080/api/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to add product');
        }

        const savedProduct = await response.json();
        console.log('Saved product:', savedProduct); // Debug log
        setSuccess(true);
        setFormData({
            name: '',
            description: '',
            price: '',
            stockQuantity: '',
            category: '',
            imageUrl: '',
            isOrganic: false,
            organicCertification: '',
            harvestDate: '',
            origin: ''
        });
    } catch (err) {
        console.error('Error:', err); // Debug log
        setError(err.message);
    } finally {
        setLoading(false);
    }
}

  function handleCancel() {
    navigate(-1);
  }
  
    return (
      <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Product added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Product Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium">
              Price*
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="stockQuantity" className="block text-sm font-medium">
              Stock Quantity*
            </label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium">
            Category*
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md bg-white"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.value}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="imageUrl" className="block text-sm font-medium">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isOrganic"
            checked={isOrganic}
            onChange={(e) => {
              setIsOrganic(e.target.checked);
              setFormData(prev => ({ ...prev, isOrganic: e.target.checked }));
            }}
            className="h-4 w-4"
          />
          <label htmlFor="isOrganic" className="text-sm font-medium">
            Is Organic?
          </label>
        </div>

        {isOrganic && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="organicCertification" className="block text-sm font-medium">
                Organic Certification
              </label>
              <input
                type="text"
                id="organicCertification"
                name="organicCertification"
                value={formData.organicCertification}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="harvestDate" className="block text-sm font-medium">
                Harvest Date
              </label>
              <input
                type="date"
                id="harvestDate"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="origin" className="block text-sm font-medium">
                Origin
              </label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    );
}

export default AddProduct

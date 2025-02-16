import React from 'react'
import { useState } from 'react'
import AddProduct from './AddProduct';  
import ProductDetails from './ProductDetails';

function ProductTab() {

  const [selectedFunction, setSelectedFunction] = useState('view');

  const handleSelectChange = (e) => {
    setSelectedFunction(e.target.value);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <select 
          value={selectedFunction} 
          onChange={handleSelectChange}
          className="w-48 p-2 border rounded-md shadow-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="view">View Products</option>
          <option value="add">Add Product</option>
        </select>
      </div>
      
      {selectedFunction === 'add' ? <AddProduct /> : <ProductDetails />}
    </div>
  );
}

export default ProductTab

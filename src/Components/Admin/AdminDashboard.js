import React from 'react'
import { useState } from 'react'
import ProductTab from './ProductTab';
import UserDetail from './UserDetail';
import Orders from './Orders';
import Report from './Report';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('products');
  
    const navItems = [
      { id: 'products', label: 'Products', icon: '📦' },
      { id: 'users', label: 'Users', icon: '👥' },
      { id: 'orders', label: 'Orders', icon: '🛍️' },
      { id: 'reports', label: 'Reports', icon: '📊' }
    ];
  
    const renderContent = () => {
      switch(activeTab) {
        case 'products': return <ProductTab/>;
        case 'users': return <UserDetail />;
        case 'orders': return <Orders />;
        case 'reports': return <Report />;
        default: return null;
      }
    };
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
              <div className="ml-10 flex space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === item.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {renderContent()}
      </main>
    </div>
  )
}

export default AdminDashboard

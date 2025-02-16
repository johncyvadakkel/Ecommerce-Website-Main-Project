import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddressManagement({ userId }) {
    const [addresses, setAddresses] = useState([]);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const [formData, setFormData] = useState({
        streetAddress: '',
        city: '',
        district: '',
        state: '',
        postalCode: '',
        addressType: 'SHIPPING',
        isDefault: false,
        landmarkDetails: '',
        phoneNumber: ''
    });

    useEffect(() => {
        if (userId) {
            fetchAddresses();
        } else {
            console.warn('User ID is undefined.');
        }
    }, [userId]);
    

    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/auth/user/${userId}`);
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.streetAddress) errors.streetAddress = 'Street address is required';
        if (!formData.city) errors.city = 'City is required';
        if (!formData.state) errors.state = 'State is required';
        if (!formData.district) errors.district = ' District is required';
        if (!formData.postalCode) errors.postalCode = 'Postal code is required';
        if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            streetAddress: '',
            city: '',
            district: '',
            state: '',
            postalCode: '',
            addressType: 'SHIPPING',
            isDefault: false,
            landmarkDetails: '',
            phoneNumber: ''
        });
        setFormErrors({});
        setSelectedAddress(null);
        setIsAddMode(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
    
        if (!userId) {
            console.error('No user ID available');
            alert('Please log in to add an address');
            return;
        }
    
        try {
            if (selectedAddress) {
                await axios.put(
                    `http://localhost:8080/api/auth/${selectedAddress.id}`, 
                    formData
                );
            } else {
                await axios.post(
                    `http://localhost:8080/api/auth/user/${userId}`, 
                    formData
                );
            }
            
            fetchAddresses();
            resetForm();
        } catch (error) {
            console.error('Error saving address:', error);
            alert('Failed to save address. Please check your connection and try again.');
        }
    };

    const handleEdit = (address) => {
        setFormData({
            streetAddress: address.streetAddress,
            city: address.city,
            district: address.district,
            state: address.state,
            postalCode: address.postalCode,
            addressType: address.addressType,
            isDefault: address.isDefault,
            landmarkDetails: address.landmarkDetails || '',
            phoneNumber: address.phoneNumber
        });
        setSelectedAddress(address);
        setIsAddMode(true);
    };

    const handleDelete = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await axios.delete(`http://localhost:8080/api/auth/${addressId}`);
                fetchAddresses();
            } catch (error) {
                console.error('Error deleting address:', error);
            }
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            const addressToUpdate = addresses.find(addr => addr.id === addressId);
            await axios.put(`http://localhost:8080/api/auth/${addressId}`, {
                ...addressToUpdate,
                isDefault: true
            });
            fetchAddresses();
        } catch (error) {
            console.error('Error setting default address:', error);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
                <button
                    onClick={() => setIsAddMode(!isAddMode)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    {isAddMode ? 'Cancel' : '+ Add New Address'}
                </button>
            </div>

            {isAddMode && (
                <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={handleInputChange}
                                placeholder="Street Address"
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.streetAddress ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {formErrors.streetAddress && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.streetAddress}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City"
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.city ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {formErrors.city && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleInputChange}
                                placeholder="District"
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.district ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {formErrors.district && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.district}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="State"
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.state ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {formErrors.state && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                placeholder="Postal Code"
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {formErrors.postalCode && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.postalCode}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Phone Number"
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {formErrors.phoneNumber && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="landmarkDetails"
                                value={formData.landmarkDetails}
                                onChange={handleInputChange}
                                placeholder="Landmark Details (Optional)"
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <select
                                name="addressType"
                                value={formData.addressType}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="SHIPPING">Shipping</option>
                                <option value="BILLING">Billing</option>
                                <option value="BOTH">Both</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleInputChange}
                            id="isDefault"
                            className="h-4 w-4"
                        />
                        <label htmlFor="isDefault">Set as default address</label>
                    </div>

                    <button
                        type="submit"
                        className="w-full p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        {selectedAddress ? 'Update Address' : 'Add Address'}
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                    <div 
                        key={address.id}
                        className={`p-4 rounded-lg border ${
                            address.isDefault ? 'border-emerald-500' : 'border-gray-200'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="font-medium">{address.addressType} Address</span>
                                {address.isDefault && (
                                    <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                                        Default
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(address)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(address.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p>{address.streetAddress}</p>
                            <p>{address.city}, {address.state}</p>
                            <p>{address.country} - {address.postalCode}</p>
                            <p className="mt-1">📱 {address.phoneNumber}</p>
                            {address.landmarkDetails && (
                                <p className="mt-1 text-gray-500">
                                    🏷️ {address.landmarkDetails}
                                </p>
                            )}
                        </div>
                        {!address.isDefault && (
                            <button
                                onClick={() => handleSetDefault(address.id)}
                                className="mt-2 text-sm text-emerald-600 hover:text-emerald-800"
                            >
                                Set as Default
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AddressManagement;



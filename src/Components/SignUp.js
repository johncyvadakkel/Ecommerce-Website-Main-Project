import React from 'react'
import {useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function SignUp() {


const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    location: "",
});

const [error, setError] = useState('');
const [success, setSuccess] = useState('');

const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    
    try {
        const response = await axios.post(
            "http://localhost:8080/api/auth/register",
            formData
        );
        setSuccess(response.data.message || "Registration successful!");
        // Clear form
        setFormData({
            username: "",
            email: "",
            password: "",
            phone: "",
            location: "",
        });
    } catch (error) {
        if (error.response) {
            setError(error.response.data.message || "An error occurred.");
        } else if (error.request) {
            setError("No response received from the server. Please try again later.");
            console.error("Request error:", error.request);
        } else {
            setError(error.message || "An unexpected error occurred.");
            console.error("Error:", error);
        }
    }
}

return (
    

    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
            <div className="max-w-screen-xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome to Organic Market</h1>
                    <p className="text-gray-600 mt-2">Your journey to natural and healthy living starts here</p>
                </div>

                {/* Main Content */}
                <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md border border-green-100 overflow-hidden">
                    {/* Registration Form Section */}
                    <div className="p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Account</h2>

                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-6">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-6">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        name="username"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                                        placeholder="+1 (555) 000-0000"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                                    placeholder="Your city and state"
                                    required
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow"
                                >
                                    Create Account
                                </button>
                            </div>

                            <div className="text-center text-sm mt-4 text-gray-600">
                                Already have an account?{" "}
                                <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="text-center mt-8 text-sm text-gray-600">
                    <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>


);

 }

export default SignUp

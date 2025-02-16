import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        
        setIsLoading(true);
        const token = searchParams.get("token");
        try {

            const response = await axios.post(
                "http://localhost:8080/api/auth/reset-password",
                { token, newPassword: password }
            );
            
            setMessage(response.data);
            // Redirect to login after successful reset
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setMessage(error.response?.data || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative h-screen bg-sage-50 overflow-hidden">
            {/* Organic blob shapes with earthy colors */}
            <div className="absolute top-20 left-2 w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-20 right-32 w-96 h-96 bg-amber-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-32 w-96 h-96 bg-lime-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
            <div className="absolute -bottom-8 right-52 w-96 h-96 bg-teal-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />

            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img src={logo} alt="Your Company Name" className="mx-auto h-24 w-auto" />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-emerald-900">
                        Reset Your Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-emerald-600">
                        Please enter your new password
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-lg shadow-emerald-100 sm:rounded-xl sm:px-10 border border-emerald-50">
                        {message && (
                            <div className={`mb-4 p-3 text-sm rounded-lg ${
                                message.includes("error") || message.includes("not match") ? 
                                "text-red-600 bg-red-50" : 
                                "text-emerald-600 bg-emerald-50"
                            }`}>
                                {message}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-emerald-700">
                                    New Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full appearance-none rounded-lg border border-emerald-200 px-3 py-2 placeholder-emerald-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                                        placeholder="Enter your new password"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-emerald-700">
                                    Confirm Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full appearance-none rounded-lg border border-emerald-200 px-3 py-2 placeholder-emerald-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                                        placeholder="Confirm your new password"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`flex w-full justify-center rounded-lg border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200 ${
                                        isLoading ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-emerald-200"></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="text-center">
                                <p className="text-sm text-emerald-600">
                                    Back to{" "}
                                    <a href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                                        Sign In
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
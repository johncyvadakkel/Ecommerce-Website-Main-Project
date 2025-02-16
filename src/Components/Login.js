import React from 'react'
import { useState, useEffect } from "react";
import axios from "axios";
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

function Login() {

const navigate = useNavigate();
const { login } = useAuth();

const storedEmail = localStorage.getItem('lastEmail') || '';

const [formData, setFormData] = useState({ 
  email: storedEmail, 
  password: "" 
});
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");

function handleChange(e) {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  setError("");
  
  
  if (e.target.name === 'email') {
    localStorage.setItem('lastEmail', e.target.value);
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/login",
      formData
    );

    console.log('Login response:', response.data); 

    if (response.data && response.data.role) {
      
      const userId = response.data.id;
      
      if (!userId) {
        throw new Error('No user ID received from server');
      }

      
      const userData = {
        ...response.data,
        id: userId
      };

      console.log('Processed userData:', userData); 

      localStorage.setItem('userId', userId);
      
      localStorage.setItem('userRole', response.data.role);
      
      localStorage.setItem('userData', JSON.stringify(userData));

      localStorage.removeItem('failedLoginAttempts');

      await login(userData);

      if (response.data.role === "Admin") {
        alert(response.data.message);
        navigate("/admin-dashboard");
      } else if (response.data.role === "User") {
        alert(response.data.message);
        navigate("/user-dashboard");
      }
    } else {
      setError("Invalid login credentials");
      const failedAttempts = parseInt(localStorage.getItem('failedLoginAttempts') || '0');
      localStorage.setItem('failedLoginAttempts', (failedAttempts + 1).toString());
    }
  } catch (error) {
    console.error("Login error:", error);
    
    const failedAttempts = parseInt(localStorage.getItem('failedLoginAttempts') || '0');
    localStorage.setItem('failedLoginAttempts', (failedAttempts + 1).toString());
    
    if (failedAttempts + 1 >= 3) {
      setError("Multiple failed login attempts detected. Please try again later.");
    } else {
      setError(
        error.response?.data?.message || 
        "An error occurred during login. Please try again."
      );
    }
  } finally {
    setIsLoading(false);
  }
}

useEffect(() => {
  return () => {

    localStorage.removeItem('failedLoginAttempts');
  };
}, []);

return (
  <div className="relative h-screen bg-sage-50 overflow-hidden">

    <div className="absolute top-20 left-2 w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
    <div className="absolute top-20 right-32 w-96 h-96 bg-amber-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
    <div className="absolute -bottom-8 left-32 w-96 h-96 bg-lime-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
    <div className="absolute -bottom-8 right-52 w-96 h-96 bg-teal-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />

    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img src={logo} alt="Your Company Name" className="mx-auto h-24 w-auto" />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-emerald-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-emerald-600">
          Sign in to your organic marketplace account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-lg shadow-emerald-100 sm:rounded-xl sm:px-10 border border-emerald-50">
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-emerald-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={handleChange}
                  className="block w-full appearance-none rounded-lg border border-emerald-200 px-3 py-2 placeholder-emerald-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-emerald-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={handleChange}
                  className="block w-full appearance-none rounded-lg border border-emerald-200 px-3 py-2 placeholder-emerald-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Forgot your password?
                </a>
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
                {isLoading ? 'Signing in...' : 'Sign in'}
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
                Don't have an account?{" "}
                <a href="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Sign Up
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

export default Login


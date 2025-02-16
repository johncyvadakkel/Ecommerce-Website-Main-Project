import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem("userId") || null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('Restored user data:', parsedUser); 
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('userData');
    }
  };

  const login = (userData) => {
    try {
      const userId = userData?.Id || userData?.id || userData?.userId || userData?.user_id;
      if (!userId) {
        console.warn('User data does not contain an ID:', userData); 
        return null;
      }

      const validatedUserData = {
        ...userData,
        id: userId,
        role: userData?.role || 'guest'
      };

      localStorage.setItem('userData', JSON.stringify(validatedUserData));

      setUser(validatedUserData);
      return validatedUserData;
      setCurrentUserId(userId);
    localStorage.setItem("userId", userId);
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
    
  };

  const logout = () => {
    try {
      localStorage.removeItem("userData");
      localStorage.removeItem("userId"); // Remove stored userId
      setUser(null);
      setCurrentUserId(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        userRole: user?.role,
        currentUserId: user?.id
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

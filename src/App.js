import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import AdminDashboard from "./Components/Admin/AdminDashboard";
import ForgetPassword from './Components/ForgetPassword';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Home from './Components/Home';
import UserDashboard from './Components/User/UserDashboard';
import ResetPassword from './Components/ResetPassword';
import ProductDetailPage from './Components/User/ProductDetailPage';
import CartPage from './Components/User/CartPage';
import { CartProvider } from './Components/User/CartContext';
import { useAuth } from './Components/AuthContext';
import AccountAddressesPage from './Components/User/AccountAddressesPage';
import CheckoutPage from './Components/User/CheckoutPage';
import AddressManagement from './Components/User/AddressManagement';
import WishlistPage from './Components/User/WishlistPage';
import OrderDetails from './Components/User/OrderDetails';
import OrderConfirmationPage from './Components/User/OrderConfirmationPage';
import TrackOrder from './Components/User/TrackOrder';
import OrderDetailsPage from './Components/User/OrderDetailsPage';
import Report from './Components/Admin/Report';

function App() {
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user && user.role === 'admin';

  return (
    <Router>
      <CartProvider userId={user ? user.id : null}>
        <Routes>
          {/* Public Routes - accessible to all */}
          <Route path="/login" element={user ? <Navigate to="/user-dashboard" /> : <Login />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/register" element={user ? <Navigate to="/user-dashboard" /> : <SignUp/>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          
          {/* Redirect Home to Dashboard if logged in */}
          <Route path="/" element={user ? <Navigate to="/user-dashboard" /> : <Home />} />
          
          {/* Protected Routes - require authentication */}
          <Route path="/user-dashboard" element={user ? <UserDashboard /> : <Navigate to="/login" />} />
          <Route path="/account/addresses" element={user ? <AccountAddressesPage /> : <Navigate to="/login" />} />
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={user ? <CheckoutPage /> : <Navigate to="/login" />} />
          <Route path="/account/orders" element={user ? <OrderDetails /> : <Navigate to="/login" />} />
          <Route path="/account/wishlist" element={user ? <WishlistPage /> : <Navigate to="/login" />} />
          <Route path="/order-confirmation" element={user ? <OrderConfirmationPage /> : <Navigate to="/login" />} />
          <Route path="/track-order/:orderNumber" element={user ? <TrackOrder /> : <Navigate to="/login" />} />
          <Route path="/order-details/:orderNumber" element={user ? <OrderDetailsPage /> : <Navigate to="/login" />} />
          
          {/* Admin Routes - require admin role */}
          <Route path="/admin-dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to={user ? "/user-dashboard" : "/login"} />} />
          <Route path="/report" element={isAdmin ? <Report /> : <Navigate to={user ? "/user-dashboard" : "/login"} />} />
          
          {/* Handle other routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
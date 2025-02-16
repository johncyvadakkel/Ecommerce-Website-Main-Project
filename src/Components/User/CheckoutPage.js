import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "./CartContext";
import { useAuth } from "../AuthContext";

function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, loading } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    streetAddress: "",
    city: "",
    district: "",
    state: "",
    postalCode: "",
    phoneNumber: "",
  });
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchAddresses(user.id);
    }
  }, [user]);


  const fetchAddresses = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/default/${user.id}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (data && data.id) {
        setAddresses([data]);
      } else {
        throw new Error('No default address found');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]); 
    }
  };
  

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2);
  };



 
  const handlePayment = async () => {
    setPaymentLoading(true);
    setError(null);

    try {
      if (isAddingNewAddress) {
        const { streetAddress, city, state, district, postalCode, phoneNumber } =
          newAddress;
        if (
          !streetAddress ||
          !city ||
          !district ||
          !state ||
          !postalCode ||
          !phoneNumber
        ) {
          throw new Error("Please fill in all address details");
        }
      } else if (!selectedAddressId) {
        throw new Error("Please select an address");
      }

      const address =
        isAddingNewAddress && newAddress
          ? newAddress
          : addresses.find((a) => a.id === selectedAddressId);

      const orderResponse = await axios.post(
        "http://localhost:8080/api/payment/create-order",
        {
          userId: user.id,
          amount: parseFloat(calculateTotal()),
          user: { id: user.id }, 
          name: user.name,
          phone: user.phone,
          address,
        }
      );

      const { razorpayOrderId, key } = orderResponse.data;

      const scriptLoaded = await initializeRazorpay();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      const options = {
        key: key,
        amount: parseFloat(calculateTotal()) * 100,
        currency: "INR",
        name: "Green Growth",
        description: "Product Purchase",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await axios.post(
              "http://localhost:8080/api/payment/handle-payment-callback",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }
            );
            alert("Payment Successful!");
            navigate("/order-confirmation")

          } catch (error) {
            setError("Payment verification failed");
            console.error(error);
          }
        

        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setError(error.message || "Payment failed");
    } finally {
      setPaymentLoading(false);
    }
  };


  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Address</h2>

          {addresses.map((address) => (
            <div key={address.id} className="mb-4">
              <label>
                <input
                  type="radio"
                  name="address"
                  value={address.id}
                  checked={selectedAddressId === address.id}
                  onChange={() => {
                    setSelectedAddressId(address.id);
                    setIsAddingNewAddress(false);
                  }}
                />
                {`${address.streetAddress}, ${address.city}, ${address.state}, ${address.country}, ${address.postalCode}`}
              </label>
            </div>
          ))}

          <button
            className="text-blue-500 underline"
            onClick={() => setIsAddingNewAddress(true)}
          >
            Add New Address
          </button>

          {isAddingNewAddress && (
            <div className="grid grid-cols-1 gap-4 mt-4">
              <input
                type="text"
                name="streetAddress"
                placeholder="Street Address"
                value={newAddress.streetAddress}
                onChange={handleNewAddressChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={newAddress.city}
                onChange={handleNewAddressChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="district"
                placeholder="District"
                value={newAddress.district}
                onChange={handleNewAddressChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={newAddress.state}
                onChange={handleNewAddressChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={newAddress.postalCode}
                onChange={handleNewAddressChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={newAddress.phoneNumber}
                onChange={handleNewAddressChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={paymentLoading}
            className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {paymentLoading ? "Processing..." : `Pay $${calculateTotal()}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

import React from "react";
import { useNavigate } from "react-router-dom";

function OrderConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Thank you for your purchase!
          </h1>
          <p className="text-gray-700 mb-6">
            Your order has been placed successfully.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg text-left mb-6">
            <h2 className="text-xl font-semibold mb-2">Order Details</h2>
            <ul className="space-y-2">
              <li>
                <strong>Order Number:</strong> #ORD{Math.floor(Math.random() * 1000000)}
              </li>
              <li>
                <strong>Estimated Delivery:</strong> Within 5-7 business days
              </li>
            </ul>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;

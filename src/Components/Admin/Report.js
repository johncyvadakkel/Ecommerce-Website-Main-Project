import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function Report() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Order Report</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mb-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orders} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="orderNumber" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">Order Number</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-100">
                      <td className="border p-2">{order.orderId}</td>
                      <td className="border p-2">{order.orderNumber}</td>
                      <td className="border p-2">{order.name}</td>
                      <td className="border p-2">{order.phone}</td>
                      <td className="border p-2">₹{order.amount}</td>
                      <td className="border p-2">{order.orderStatus}</td>
                      <td className="border p-2">{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center border p-2">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Report;
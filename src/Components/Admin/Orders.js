import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/payment/getorder');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/api/payment/update/${orderId}`, newStatus, {
                headers: { 'Content-Type': 'application/json' },
            });
            setOrders(orders.map(order =>
                order.orderId === orderId ? { ...order, orderStatus: newStatus } : order
            ));
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Order Management</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order.orderId}>
                                <td className="px-6 py-4 whitespace-nowrap">{order.orderId}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{order.user?.username || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${order.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={order.orderStatus}
                                        onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                                        className="block w-full p-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="CREATED">Created</option>
                                        <option value="PAYMENT_PENDING">Payment Pending</option>
                                        <option value="PAYMENT_COMPLETED">Payment Completed</option>
                                        <option value="PROCESSING">Processing</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Orders;

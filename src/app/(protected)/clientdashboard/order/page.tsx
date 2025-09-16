"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchOrders } from "../../actions/order";
import API from "@/lib/api";

type Order = {
  id: string;
  created_at: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  delivery_status?: string;
};

const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "delivered":
      case "received":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleMarkReceived = async (orderId: string) => {
    try {
      await API.post(`/order/updateStatus/${orderId}/received/`); // Make sure this endpoint exists
      toast.success("Order marked as received!");

      // Update delivery_status locally
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, delivery_status: "Received" } : o
        )
      );
    } catch (err) {
      toast.error("Failed to update order status");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-gray-600 mt-4 font-medium">Loading Your Orders...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="mx-auto px-12 py-8 text-center">
        <h2 className="text-xl font-bold mb-4">No Orders Found</h2>
        <p>You haven't placed any orders yet.</p>
        <Link
          href="/"
          className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto px-12 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2 text-center">Payment Status</th>
              <th className="px-4 py-2 text-center">Order Status</th>
              <th className="px-4 py-2 text-center">Delivery Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{order.id}</td>
                <td className="px-4 py-3">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">Rs. {order.total_amount}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusBadgeClass(
                      order.payment_status
                    )}`}
                  >
                    {order.payment_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                      order.order_status
                    )}`}
                  >
                    {order.order_status.charAt(0).toUpperCase() +
                      order.order_status.slice(1)}
                  </span>
                </td>

                {/* Delivery Status column with Mark Received button */}
                <td className="px-4 py-3 text-center">
                  {order.delivery_status === "Delivered" ? (
                    <button
                      onClick={() => handleMarkReceived(order.id)}
                      className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      Mark Received
                    </button>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                        order.delivery_status || "Pending"
                      )}`}
                    >
                      {order.delivery_status || "Pending"}
                    </span>
                  )}
                </td>

                {/* Actions column */}
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/clientdashboard/order/${order.id}`}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;

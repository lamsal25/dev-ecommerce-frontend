"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import API from "@/lib/api";
import LoadingSpinner from "@/components/loadingSpinner";
import { fetchOrderDetails } from "@/app/(protected)/actions/order";

// Types
type CartItem = {
  productID?: number | string; // Added product ID for refund functionality
  productImage?: string;
  productName: string;
  price: number;
  quantity: number;
};

type BillingDetails = {
  name: string;
  email: string;
  mobile: string;
  address?: string;
  city?: string;
  townCity?: string;
};

type Order = {
  id: number | string;
  created_at: string;
  order_status: string;
  payment_status: string;
  total_amount: number;
  billing_details: BillingDetails;
  transaction_id?: string;
  pidx?: string;
  cart_items: CartItem[];
};

type RefundFormData = {
  productId: string | number;
  reason: string;
};

const OrderDetail = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CartItem | null>(null);
  const [refundForm, setRefundForm] = useState<RefundFormData>({
    productId: "",
    reason: ""
  });
  const [submittingRefund, setSubmittingRefund] = useState(false);

  const params = useParams();
  const rawOrderID = params?.id;
  const orderID = Array.isArray(rawOrderID) ? rawOrderID[0] : rawOrderID;

  const getOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchOrderDetails(orderID);
      setOrder(response.data);
    } catch (error) {
      toast.error("Failed to fetch order details");
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const response = await API.get(`order/downloadReceipt/${orderID}/`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Order_${orderID}_Receipt.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Receipt downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download receipt");
      console.error("Failed to download receipt:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleRefundClick = (item: CartItem) => {
    setSelectedProduct(item);
    setRefundForm({
      productId: item.productID || "",
      reason: ""
    });
    setShowRefundModal(true);
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!refundForm.reason.trim()) {
      toast.error("Please provide a reason for refund");
      return;
    }

    try {
      setSubmittingRefund(true);
      
      // API call to submit refund request
      const response = await API.post(`refunds/order/refund-request/`, {
        orderId: Number(orderID),
        productId: refundForm.productId,
        reason: refundForm.reason.trim(),
      });
      console.log(response)

      if (response.status === 200 || response.status === 201) {
        toast.success("Refund request submitted successfully! Vendor will be notified.");
        setShowRefundModal(false);
        setRefundForm({ productId: "", reason: "" });
        setSelectedProduct(null);
      }
    } catch (error) {
      toast.error("Failed to submit refund request");
      console.error("Error submitting refund:", error);
    } finally {
      setSubmittingRefund(false);
    }
  };

  const closeRefundModal = () => {
    setShowRefundModal(false);
    setRefundForm({ productId: "", reason: "" });
    setSelectedProduct(null);
  };

  // Global Loading
  if (loading) {
    return (
      <div className="container mx-auto p-6 ">
        <p className="text-gray-600 mt-4 font-medium">
          Loading order details...
        </p>
        <LoadingSpinner/>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-2 text-red-600">
            Order not found
          </h2>
          <p className="text-gray-600">
            The requested order could not be located.
          </p>
        </div>
      </div>
    );
  }

  const orderStatusColor =
    order.order_status === "completed"
      ? "text-green-600"
      : order.order_status === "pending"
      ? "text-yellow-600"
      : "text-red-600";

  const orderStatusBg =
    order.order_status === "completed"
      ? "bg-green-50"
      : order.order_status === "pending"
      ? "bg-yellow-50"
      : "bg-red-50";

  const paymentStatusColor =
    order.payment_status === "Paid" ? "text-green-600" : "text-yellow-600";

  const paymentStatusBg =
    order.payment_status === "Paid" ? "bg-green-50" : "bg-yellow-50";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Order #{order.id}
            </h1>
            <p className="text-gray-600 mb-3">
              Placed on: {new Date(order.created_at).toLocaleString()}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <p className="flex items-center">
                Status:
                <span
                  className={`${orderStatusColor} ${orderStatusBg} ml-2 px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {order.order_status.charAt(0).toUpperCase() +
                    order.order_status.slice(1)}
                </span>
              </p>
              <p className="flex items-center">
                Payment:
                <span
                  className={`${paymentStatusColor} ${paymentStatusBg} ml-2 px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {order.payment_status}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 md:mt-0">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className={`px-5 py-2.5 rounded-lg flex items-center justify-center transition duration-150 ease-in-out shadow-sm text-white ${
                downloading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {downloading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              )}
              {downloading ? "Downloading..." : "Download Receipt"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-bold mb-3 text-blue-800 border-b border-blue-200 pb-2">
              Billing Information
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {order.billing_details.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {order.billing_details.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {order.billing_details.mobile}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {order.billing_details.address || "N/A"}
              </p>
              <p>
                <span className="font-medium">City:</span>{" "}
                {order.billing_details.city ||
                  order.billing_details.townCity ||
                  "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-purple-50 p-5 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-bold mb-3 text-purple-800 border-b border-purple-200 pb-2">
              Payment Information
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Payment Method:</span>{" "}
                {order.transaction_id ? "Online Payment" : "Cash on delivery"}
              </p>
              {order.transaction_id && (
                <p>
                  <span className="font-medium">Transaction ID:</span>{" "}
                  {order.transaction_id}
                </p>
              )}
              {order.pidx && (
                <p>
                  <span className="font-medium">Payment Reference:</span>{" "}
                  {order.pidx}
                </p>
              )}
            </div>
          </div>

          <div className="bg-green-50 p-5 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-bold mb-3 text-green-800 border-b border-green-200 pb-2">
              Order Summary
            </h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>${order.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Shipping:</span>
                <span>Free</span>
              </div>
              <div className="h-px bg-green-200 my-2"></div>
              <div className="flex justify-between text-lg font-bold text-green-700">
                <span>Total:</span>
                <span>${order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <h2 className="text-xl font-bold p-4 bg-gray-50 border-b border-gray-200">
            Order Items
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700">Product</th>
                  <th className="px-4 py-3 text-right text-gray-700">Price</th>
                  <th className="px-4 py-3 text-center text-gray-700">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-gray-700">
                    Subtotal
                  </th>
                  <th className="px-4 py-3 text-center text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.cart_items.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-t hover:bg-gray-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 mr-4 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </div>
                        <span className="font-medium text-gray-800">
                          {item.productName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">${item.price}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleRefundClick(item)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center justify-center mx-auto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                          />
                        </svg>
                        Refund
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-right font-bold">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-blue-700">
                    ${order.total_amount}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Request Refund
                </h3>
                <button
                  onClick={closeRefundModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {selectedProduct && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">Product:</h4>
                  <p className="text-gray-700">{selectedProduct.productName}</p>
                  <p className="text-gray-600 text-sm">
                    Price: ${selectedProduct.price} × {selectedProduct.quantity}
                  </p>
                </div>
              )}

              <form onSubmit={handleRefundSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="refundReason"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Reason for Refund *
                  </label>
                  <textarea
                    id="refundReason"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Please explain why you want to return this item..."
                    value={refundForm.reason}
                    onChange={(e) =>
                      setRefundForm({ ...refundForm, reason: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Provide a detailed reason for the refund request
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={closeRefundModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingRefund || !refundForm.reason.trim()}
                    className={`px-4 py-2 text-white rounded-md transition duration-150 ease-in-out flex items-center ${
                      submittingRefund || !refundForm.reason.trim()
                        ? "bg-orange-400 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    {submittingRefund ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Refund Request"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
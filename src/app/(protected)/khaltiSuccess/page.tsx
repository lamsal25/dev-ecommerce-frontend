// pages/success.js
"use client";
import Link from "next/link";
import Head from "next/head";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
export default function Success() {
  useEffect(() => {
    clearCart();
  }, []);
  const clearCart = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/`,
        {
          clear: true,
        },
        {
          withCredentials: true,
        }
      );
      const message = response.data.message;
      if (message === "cart updated") {
        console.log("Cart Cleared");
      }
      // if (message === "cart updated") {
      //   console.log("Success");
      //   toast.success("Cart Cleared Successfully", {
      //     position: "top-center",
      //     autoClose: 2000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     theme: "light",
      //   });
      // } else {
      //   console.log("Failure");
      //   toast.error("Failed to clear cart", {
      //     position: "top-center",
      //     autoClose: 2000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     theme: "light",
      //   });
      // }
      // Optional: trigger a toast or update cart UI
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  return (
    <>
      <Head>
        <title>Success</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-green-500 w-16 h-16" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We’ll send you a confirmation email
            shortly.
          </p>
          <Link
            href="/"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </>
  );
}

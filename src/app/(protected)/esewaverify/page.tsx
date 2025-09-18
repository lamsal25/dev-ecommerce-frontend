"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { verify } from "crypto";
import API from "@/lib/api";
const PaymentVerify = () => {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState(null);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const encodedData = queryParams.get("data");

    if (encodedData) {
      try {
        // Step 1: Decode base64
        const decoded = atob(encodedData);

        // Step 2: Parse JSON
        const parsed = JSON.parse(decoded);

        console.log("Parsed eSewa Payment Data:", parsed);
        setPaymentData(parsed);

        const verifyPayment = async () => {
          try {
            const res = await API.post("/payment/verifyEsewa/", parsed, {
              withCredentials: true, // needed if your backend uses session auth
            });

            if (res.data.success) {
              toast.success("Payment verified and order placed successfully!");
              router.push("/esewaSuccess"); // or any page you want
            } else {
              toast.error(res.data.message || "Payment verification failed");
            }
          } catch (err) {
            console.error("Backend verification error:", err);
            toast.error("Something went wrong during verification.");
          } finally {
            setVerifying(false);
          }
        };

        verifyPayment();
      } catch (err) {
        console.error("Error decoding eSewa response:", err);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-opacity-50 mx-auto mb-4"></div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Processing Your Order
        </h1>
        <p className="mt-2 text-gray-600">
          Please wait while we verify your payment with Esewa and process the
          order.
        </p>
        <p className="text-sm text-gray-400 mt-4">
          You’ll be redirected shortly...
        </p>
      </div>
    </div>
  );
};

export default PaymentVerify;

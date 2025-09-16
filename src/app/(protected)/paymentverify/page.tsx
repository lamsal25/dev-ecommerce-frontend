"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import API from "@/lib/api";

function PaymentVerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pidx = searchParams.get("pidx");
  const transaction_id = searchParams.get("transaction_id");
  const purchase_order_id = searchParams.get("purchase_order_id");
  const total_amount = searchParams.get("total_amount");

  console.log("pidx:", pidx);
  console.log("transaction_id:", transaction_id);
  console.log("purchase_order_id:", purchase_order_id);
  console.log("total amount:", total_amount);

  const data = {
    pidx: pidx,
    transaction_id: transaction_id,
    total_amount: total_amount,
  };

  useEffect(() => {
    const verifyPayment = async () => {
      if (!pidx) return;

      try {
        const response = await API.get("payment/verifyKhalti/", {
          params: { pidx, transaction_id, purchase_order_id, total_amount },
        });

        console.log("Payment Verified Response:", response.data);

        if (response.data.success) {
          router.push("khaltiSuccess");
        } else {
          router.push("failure");
        }
      } catch (error) {
        console.error("Verification Error:", error);
        router.push("/failure");
      }
    };

    verifyPayment();
  }, [pidx, transaction_id, purchase_order_id, total_amount, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-opacity-50 mx-auto mb-4"></div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Processing Order...
        </h1>
        <p className="mt-2 text-gray-600">
          Please wait while we verify your payment with Khalti and process your
          order.
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
      </div>
    </div>
  );
}

export default function PaymentVerify() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-opacity-50 mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold text-gray-800">Loading...</h1>
        </div>
      </div>
    }>
      <PaymentVerifyContent />
    </Suspense>
  );
}
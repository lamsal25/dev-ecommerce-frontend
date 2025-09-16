// pages/checkout.js
"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Esewa from "../../../assets/esewa.png";
import Khalti from "../../../assets/khalti.png";
import Image from "next/image";
import axios from "axios";
import { checkoutSchema } from "@/formSchema/checkout";
import { CheckCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import LoadingSpinner from "@/components/loadingSpinner";
export default function Checkout() {
  const router = useRouter();
  type checkoutValues = z.infer<typeof checkoutSchema>;
  const defaultValues: checkoutValues = {
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
  };

  const form = useForm<checkoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
  });

  type CartItem = {
    product: {
      id: number;
      name: string;
      image: string;
      originalPrice: number;
      // add other product fields if needed
    };
    quantity: number;
    price: number;
    // add other cart item fields if needed
  };


// Reward Point
  const [rewardInput,setRewardInput] = useState("")
  const [rewardApplied, setRewardApplied] = useState<{
  usedPoints: number;
  discount: number;
} | null>(null);


const getRewardPoints = async () => {
  try {
    const response = await API.get("rewards/getRewardPoints/", { withCredentials: true });
    if (response.status === 200) {
      setRewardPoints(response.data.availablePoints); // matches your serializer
    }
  } catch (err) {
    console.error("Error fetching reward points:", err);
  }
};
const applyReward = async () => {
  try {
    const response = await API.post(
      "rewards/applyRewardPoints/",
      { order_total: totalAfterDiscount, appliedReward : rewardInput },
      { withCredentials: true }
    );

    if (response.status === 200) {
      setRewardApplied({
        usedPoints: response.data.used_points,
        discount: response.data.discount,
      });
      toast.success("Reward points applied successfully!");
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      toast.error("No reward points found.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }
};

  const removeReward = () => setRewardApplied(null);
  const [rewardPoints, setRewardPoints] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState<{
    discount_type: string;
    discount_value: number;
    message: string;
  } | null>(null);
  const [appliedCoupons, setAppliedCoupons] = useState<
    { code: string; discount_type: string; discount_value: number }[]
  >([]);

  const [isPending, setIsPending] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const isOnlinePayment = paymentMethod === "bank";
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderSuccessPopUp, setOderSuccessPopUp] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "khalti" | "esewa" | null
  >(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const applyCoupon = async () => {
    if (couponCode.length != 6) {
      toast.error("Enter 6 digit code");
      return;
    }

    // Check if the same coupon is already added
    const isAlreadyApplied = appliedCoupons.some((c) => c.code === couponCode);
    if (isAlreadyApplied) {
      toast.info("This coupon is already applied.");
      return;
    }
    try {
      const response = await API.post(
        "coupons/verifyCoupon/",
        { code: couponCode },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const newCoupon = {
          code: couponCode,
          discount_type: response.data.discount_type,
          discount_value: response.data.discount_value,
        };
        // console.log("Coupon received:", response.data);
        setAppliedCoupons((prev) => [...prev, newCoupon]);
        setCouponData(response.data);
        toast.success("Coupon applied successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const { message } = error.response.data;

        if (message === "used_coupon") {
          toast.error("You have already used this coupon.", {
            position: "top-right",
            autoClose: 3000,
            theme: "light",
          });
        } else {
          toast.error("Exceeded Limit or Expired", {
            position: "top-right",
            autoClose: 3000,
            theme: "light",
          });
        }
      } else if (error.response && error.response.status === 404) {
        toast.error("Invalid coupon code.", {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        });
      } else {
        toast.error("Something went wrong", {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        });
      }
    }
  };

  const checkUserLogin = async () => {
    try {
      const response = await API.get("api/getuser/", {
        withCredentials: true,
      });
      console.log(response);
      if (response.status === 200) {
        setIsLoggedIn(true);
        getCart();
        getRewardPoints();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Login check failed:", error);
      setIsLoggedIn(false);
    } finally {
      setIsChecking(false);
    }
  };

  const getCart = async () => {
    try {
      const response = await axios.get("http://localhost:8000/cart/", {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("Cart received:", response.data.data);
        setCartItems(response.data.data); // If your API returns cart items
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };
  // 🛒 Fetch cart from backend
  useEffect(() => {
    checkUserLogin();
  }, []);

  //Total Price calculation
  const cartWithTotals = cartItems.map((item) => ({
    ...item,
    total_price: item.quantity * item.price,
  }));

  const totalCartPrice = cartWithTotals.reduce(
    (sum, item) => sum + item.total_price,
    0
  );
  let shipping;
  // Calculate shipping
  if (cartItems.length === 0) {
    shipping = 0;
  } else {
    shipping = 60;
  }

  //Calculate total
  const subtotal = totalCartPrice;
  const taxAmount = 0;
  const amount = totalCartPrice + shipping;
  let totalCouponDiscount = 0;

  appliedCoupons.forEach((coupon) => {
    if (coupon.discount_type === "fixed") {
      totalCouponDiscount += coupon.discount_value;
    } else if (coupon.discount_type === "percentage") {
      totalCouponDiscount += (subtotal * coupon.discount_value) / 100;
    }
  });

  const rewardDiscount = rewardApplied ? rewardApplied.discount : 0;

  const totalAfterDiscount = Math.max(
    Number((amount - totalCouponDiscount - rewardDiscount).toFixed(2)),
    0
  );
  // Since the submit button is outside the form, we need to manually trigger the form and check if valid or not
  const handlePlaceOrder = async (method?: "khalti" | "esewa") => {
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }
    const billingData = form.getValues();
    if (paymentMethod === "cash") {
      placeOrder(billingData); // For cash on delivery
    } else if (paymentMethod === "bank" && method) {
      setSelectedPaymentMethod(method);
      setShowPaymentModal(true);
    }
  };

  // For direct cash on delivery
  const placeOrder = async (billingData: checkoutValues) => {
    if (cartItems.length === 0) {
      toast.error(
        "Your cart is empty. Please add items before placing an order."
      );
      return;
    }
    console.log("button clicked");
    setOrderLoading(true); // Show loader
    const data = {
      billing_details: billingData,
      cart_items: cartItems.map((item) => ({
        productID: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
        price: Number(item.product.originalPrice),has_sizes: item.has_sizes,          
        selected_size: item.selected_size || null, 
      })),
      tax_amount: taxAmount,
      amount: amount,
      total_amount: totalAfterDiscount,
      coupon_codes: appliedCoupons.map((c) => c.code),
      rewardPoints: rewardInput
    };
    try {
      const response = await API.post("order/createOrder/", data, {
        withCredentials: true,
      });

      if (response.status === 201) {
        // toast.success("Order placed successfully!");
        // form.reset();
        setOderSuccessPopUp(true);
      } else {
        toast.error("Failed to place the order. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setOrderLoading(false); // Hide loader
    }
  };

  // For wallet pay
  const handlePayment = async (paymentMethod: string) => {
    if (cartItems.length === 0) {
      toast.error(
        "Your cart is empty. Please add items before placing an order."
      );
      return;
    }
    console.log(paymentMethod);
    const billingData = form.getValues();
    const payload = {
      billingDetails: billingData,
      cart: cartItems.map((item) => ({
        productID: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
        price: item.product.originalPrice,
        has_sizes: item.has_sizes,          
        selected_size: item.selected_size || null, 
      })),
      totalAmount: totalAfterDiscount,
      coupon_codes: appliedCoupons.map((c) => c.code),
      rewardPoints: rewardInput 
    };
    if (paymentMethod == "khalti") {
      console.log("Sending to payment API:", payload);
      try {
        const response = await API.post(
          "payment/initKhalti/",
          payload
          // { withCredentials: true }
        );

        if (response.status === 200) {
          console.log(response.data.data.payment_url);
          window.location.href = response.data.data.payment_url;
          // redirect or do something
        }
      } catch (error) {
        console.error("Payment error:", error);
        toast.error("Something went wrong. Please try again.");
      }
    }

    if (paymentMethod == "esewa") {
      console.log("Sending to payment API Esewa:", payload);
      try {
        const response = await API.post(
          "payment/initEsewa/",
          payload
          // { withCredentials: true }
        );
        if (response.status === 200) {
          const { data } = response.data;
          const form = document.createElement("form");
          form.method = "POST";
          form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
          // Add all fields returned by backend as hidden inputs
          Object.entries(data).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value;
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit(); //
          console.log(response.data);
          // window.location.href = (response.data.data.payment_url);
          // redirect or do something
        }
      } catch (error) {
        console.error("Payment error:", error);
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-16 bg-white">
      {!isLoggedIn && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-white bg-opacity-70">
          {/* <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div> */}
          <LoadingSpinner />
        </div>
      )}
      <Head>
        <title>Checkout</title>
      </Head>

      <div
        className={`${!isLoggedIn ? "blur-sm pointer-events-none select-none" : ""
          }`}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Billing Details Section */}
          <div className="lg:w-1/2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(placeOrder)}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold mb-6">Billing Details</h2>

                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">First Name</FormLabel>
                      <FormControl>
                        <Input
                          className="text-base"
                          placeholder="Enter your first name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          className="text-base"
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          className="text-base"
                          type="tel"
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Street Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Street Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-base"
                          placeholder="Enter your address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Town / City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Town/City</FormLabel>
                      <FormControl>
                        <Input
                          className="text-base py-3"
                          placeholder="Enter your town or city"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          {/* Order Summary Section */}
          <div className="lg:w-1/2">
            <div className="bg-white p-6 border border-gray-200 rounded">
              <h3 className="text-lg font-medium mb-4">Product</h3>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <span>{item.product.name}</span>
                    <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Coupons:</span>
                <div className="text-right">
                  <span>- Rs. {totalCouponDiscount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <span>Reward Points:</span>
                <div className="text-right">
                  <span>- Rs. {rewardDiscount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <div className="text-right">
                  <span>Rs. {shipping}</span>
                  <div className="text-xs text-gray-500">(Standard Fee)</div>
                </div>
              </div>
              <div className="flex justify-between font-bold mb-6">
                <span>Total:</span>
                <span>Rs. {totalAfterDiscount}</span>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <input
                    type="radio"
                    id="cash"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="mr-2"
                  />
                  <label htmlFor="cash">Cash on delivery</label>
                </div>
                <div className="flex items-center mb-3">
                  <input
                    type="radio"
                    id="bank"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                    className="mr-2"
                  />
                  <label htmlFor="bank">Wallets</label>
                </div>

                {isOnlinePayment && (
                  <div className="flex gap-2 mt-3 items-center">
                    <div className="payment-icon">
                      <Image
                        className="h-12 w-12 cursor-pointer"
                        src={Khalti}
                        alt="Khalti"
                        onClick={() => {
                          handlePlaceOrder("khalti");
                        }}
                      />
                    </div>
                    <div className="payment-icon">
                      <Image
                        className="h-9 w-9 cursor-pointer"
                        src={Esewa}
                        alt="Esewa"
                        onClick={() => {
                          handlePlaceOrder("esewa");
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow border border-gray-300 rounded p-3"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded whitespace-nowrap"
                  >
                    Apply Coupon
                  </button>
                </div>
                {appliedCoupons.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-semibold">Applied Coupons:</h4>
                    {appliedCoupons.map((coupon, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm bg-green-50 border border-green-300 px-3 py-2 rounded"
                      >
                        <div>
                          <span className="font-medium">{coupon.code}</span> –{" "}
                          {coupon.discount_type === "fixed"
                            ? `Rs. ${coupon.discount_value}`
                            : `${coupon.discount_value}%`}
                        </div>
                        <button
                          onClick={() =>
                            setAppliedCoupons((prev) =>
                              prev.filter((c) => c.code !== coupon.code)
                            )
                          }
                          className="text-red-500 hover:underline text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Reward Points */}
<div className="mt-6 flex gap-2">
  <input
    type="text"
    max={rewardPoints}
    placeholder={`Available Points: ${rewardPoints}`}
    value={rewardInput}
    onChange={(e) => setRewardInput(Number(e.target.value))}
    className="flex-grow border border-gray-300 rounded p-3 bg-gray-100"
  />
  <button
    onClick={applyReward}
    disabled={!!rewardApplied}
    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded whitespace-nowrap disabled:opacity-50"
  >
    Apply Reward
  </button>
</div>

{rewardApplied && (
  <div className="mt-4 flex justify-between items-center text-sm bg-purple-50 border border-purple-300 px-3 py-2 rounded">
    <div>
      Used <span className="font-medium">{rewardApplied.usedPoints}</span> points 
      → Discount Rs. {rewardApplied.discount}
    </div>
    <button
      onClick={removeReward}
      className="text-red-500 hover:underline text-xs"
    >
      Remove
    </button>
  </div>
)}

              </div>
              {paymentMethod === "cash" && (
                <Button
                  onClick={handlePlaceOrder}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-base h-11 rounded text-center"
                >
                  Place Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && selectedPaymentMethod && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
          <div className="bg-white/80 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/30">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Confirm Payment
            </h2>
            <p className="text-center mb-6 text-gray-700">
              Are you sure you want to proceed with{" "}
              <strong>{selectedPaymentMethod}</strong> payment?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-white text-gray-800 rounded-full border hover:bg-gray-100 transition"
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPaymentMethod(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition"
                onClick={() => {
                  if (selectedPaymentMethod) {
                    handlePayment(selectedPaymentMethod);
                  }
                  setShowPaymentModal(false);
                  setSelectedPaymentMethod(null);
                }}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
      {orderSuccessPopUp && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
          <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full border border-white/30">
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-500 w-16 h-16" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-700 mb-6">
              Thank you for your order. We’ll send you a confirmation email
              shortly.
            </p>
            <button
              onClick={() => {
                setOderSuccessPopUp(false);
                router.push("/"); // or navigate somewhere if needed
              }}
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
      {orderLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="border-4 border-t-4 border-orange-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
      {!isLoggedIn && !isChecking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white w-[90%] max-w-md p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-semibold mb-4">Not Logged In</h2>
            <p className="mb-6 text-gray-600">
              You are not logged in. Please login to access your cart.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

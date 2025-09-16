"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from 'axios';
import { Delete } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import API from "@/lib/api";
import LoadingSpinner from "@/components/loadingSpinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const dynamic = "force-dynamic";

export default function CartPage() {
  const route = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkUserLogin = async () => {
    try {
      const response = await API.get("api/getuser/", { withCredentials: true });
      if (response.status === 200) {
        setIsLoggedIn(true);
        await getCart();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setIsChecking(false);
    }
  };

  const getCart = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setCartItems(response.data.data);
        console.log(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    checkUserLogin();
  }, []);

  const handleDelete = async (productID: number) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${productID}`,
        { withCredentials: true }
      );
      if (response.status === 204) {
        getCart();
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };


  const increaseQuantity = async (
    id: number,
    quantity: number,
    type: string,
    size?: string
  ) => {
    if (type === "marketplace") return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/`,
        { productID: id, quantity: quantity + 1, overide_quantity: true, size: size },
        { withCredentials: true }
      );

      getCart(); // Only called if success (status 200/201)

    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;

      const status = err.response?.status;
      const backendError = err.response?.data?.error;

      if (status === 400) {
        toast.error(backendError || "Bad Request", {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
        });
        // alert(backendError || "Bad Request");
      } else {
        toast.error(backendError || "Something went wrong", {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
        });
        // alert(backendError || "Something went wrong");
      }
    }
  };


  const decreaseQuantity = async (
    id: number,
    quantity: number,
    type: string,
    size?: string
  ) => {
    if (type === "marketplace") return; // Prevent decreasing marketplace quantity
    const newQty = Math.max(1, quantity - 1);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/`,
        { productID: id, quantity: newQty, overide_quantity: true, size: size },
        { withCredentials: true }
      );
      getCart();
    } catch (err) {
      console.error(err);
    }
  };

  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const handleCheckout = () => {
    route.push("/checkout");
  };

  return (
    <div className="my-6 relative">
      {!isLoggedIn && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-white bg-opacity-70">
          <LoadingSpinner />
        </div>
      )}

      <div
        className={`${!isLoggedIn ? "blur-sm pointer-events-none select-none" : ""
          }`}
      >
        <div className="container mx-auto px-12 py-8">
          <Head>
            <title>Shopping Cart</title>
          </Head>

          <div className="text-sm mb-8">
            <Link href="/" className="text-gray-600 hover:underline">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span className="font-medium">Cart</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow">
              <div className="bg-white rounded shadow">
                <div className="grid grid-cols-4 p-4 border-b border-gray-200 bg-gray-50">
                  <div className="col-span-2">Product</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Quantity</div>
                </div>

                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="grid grid-cols-4 p-4 items-center border-b border-gray-200"
                    >
                      <div className="col-span-2 flex items-center gap-4">
                        <button
                          className="mx-3"
                          onClick={() => handleDelete(item.product.id)}
                        >
                          <Delete />
                        </button>
                        <div className="w-12 h-12 relative">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                        <span>{item.product.name}</span>
                      </div>
                      <div className="text-center">Rs. {item.price}</div>

                      <div className="flex justify-center">
                        <div className="border border-gray-300 rounded flex items-center">
                          {item.product.product_type !== "marketplace" ? (
                            <>
                              <input
                                type="text"
                                value={item.quantity}
                                readOnly
                                className="w-10 text-center p-1"
                              />
                              <div className="flex flex-col">
                                <button
                                  onClick={() =>
                                    increaseQuantity(
                                      item.product.id,
                                      item.quantity,
                                      item.product.product_type,
                                      item.selected_size
                                    )
                                  }
                                  className="px-2 text-gray-500 hover:bg-gray-100 border-l border-b border-gray-300"
                                >
                                  ▲
                                </button>
                                <button
                                  onClick={() =>
                                    decreaseQuantity(
                                      item.product.id,
                                      item.quantity,
                                      item.product.product_type,
                                      item.selected_size
                                    )
                                  }
                                  className="px-2 text-gray-500 hover:bg-gray-100 border-l border-gray-300"
                                >
                                  ▼
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center px-3 text-gray-500">
                              Qty: {item.quantity}{" "}
                              <span className="ml-1 text-xs">(fixed)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-5">Your Cart Is Empty</p>
                )}
              </div>

              <div className="mt-6 ">
                <Link href={'/wishlist'}>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 hover:cursor-pointer rounded">
                    Return to wishlist
                  </button>
                </Link>
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-6">Cart Total</h2>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span>Subtotal:</span>
                  <span className="font-medium">Rs. {totalCartPrice}</span>
                </div>
                <div className="flex justify-between py-3 font-bold">
                  <span>Total:</span>
                  Rs. {totalCartPrice}
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 hover:cursor-pointer rounded font-medium"
                >
                  Process to checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isLoggedIn && !isChecking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white w-[90%] max-w-md p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-semibold mb-4">Not Logged In</h2>
            <p className="mb-6 text-gray-600">
              You are not logged in. Please login to access your cart.
            </p>
            <button
              onClick={() => route.push("/login")}
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

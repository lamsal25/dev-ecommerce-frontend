"use server";
import { revalidatePath } from "next/cache";
import API from "@/lib/api";

export interface ActionResponse<T> {
  data: T | null;
  msg?: string;
  error: string | null;
  status?: number;
}

// CREATE (Add) Wishlist Item
export async function CreateWishlistItem(productId: number): Promise<ActionResponse<any>> {
  try {
    const response = await API.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist/add/`,
      { product_id: productId },
      {
        headers: {
          "Content-Type": "application/json",
          // Add auth headers here if needed, e.g. Authorization
        },
      }
    );

    revalidatePath("/wishlist");

    return {
      data: response.data,
      msg: "Added to wishlist successfully",
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return {
        data: null,
        error: "Product not found",
        status: 404,
      };
    }
    return {
      data: null,
      error: error.response?.data?.error || "An error occurred while adding to wishlist",
      status: error.response?.status || 500,
    };
  }
}

// GET User Wishlist
export async function GetUserWishlist(): Promise<ActionResponse<any>> {
  try {
    const res = await API.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist/get`, {
      headers: {
        "Content-Type": "application/json",
        // Include auth headers if required by backend
      },
      // axios does not have 'cache' option, so remove it here
    });

    return {
      data: res.data,
      msg: "Wishlist fetched successfully",
      error: null,
      status: res.status,
    };
  } catch (error: any) {
    //Check for authentication/authorization errors for before login display.
    const status = error?.response?.status;
    const isAuthError = status === 401 || status === 403;
    return {
      data: null,
      error: isAuthError ? "Please login to view your wishlist" : error?.message || "An unexpected error occurred",
      status: 500,
    };
  }
}



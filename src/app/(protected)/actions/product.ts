"use server";
import API from "@/lib/api";
import { ActionResponse } from ".";
import { revalidatePath } from "next/cache";

// create products //
export async function createProduct(values: any): Promise<ActionResponse<any>> {
  try {
    const response = await API.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/createProduct/`,
      values,
      {}
    );
    revalidatePath("/vendorDashboard/products");

    return {
      data: response.data,
      msg: "Created Succesfully",
      error: null,
      status: 200,
    };
  } catch (error: any) {
    if (error.response.status == 400) {
      return { data: null, error: "An error occured", status: 400 };
    }
    return { data: null, error: "An error occured" };
  }
}

export async function getProductById(
  productId: number
): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(`/products/getProduct/${productId}`);
    return {
      data: response.data.data,
      msg: "Product fetched successfully",
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data?.error || "Failed to fetch product",
      status: error.response?.status || 500,
      msg: "",
    };
  }
}

// Get products //
export async function getActiveProducts(): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/getAllProducts/`,
      {}
    );

    return {
      data: response.data.data,
      msg: "Fetched Succesfully",
      error: null,
      status: 200,
    };
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      return { data: null, error: "An error occurred", status: 400 };
    }

    console.error("Unexpected error:", error); // Helps diagnose unhandled errors

    return {
      data: null,
      error: "An error occurred",
      status: error?.response?.status || 500,
    };
  }
}

// Get products by location //
export async function getProductsByLocation(location: string): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(`/products/location/${location}`);

    // Optional: Revalidate path if needed
    // revalidatePath(`/products/location/${location}`);

    return {
      data: response.data,
      msg: "Fetched successfully",
      error: null,
      status: 200,
    };
  } catch (error: any) {
    const status = error?.response?.status || 500;

    return {
      data: null,
      error: "An error occurred while fetching products by location.",
      status,
    };
  }
}

// Get products by category //
export async function getProductsByCategory(categoryId: number): Promise<any> {
  try {
    const response = await API.get(
      `/products/getProductByCategory/${categoryId}`
    );
    console.log("Response data:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch products by category", error);
    return null;
  }
}


//get search products //
export async function getSearchProducts(
  query: string
): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(`/products/searchProduct/?query=${query}`);
    return {
      data: response.data.results,
      msg: "Search results fetched successfully",
      error: null,
      status: 200,
    };
  } catch (error: any) {
    if (error.response.status === 400) {
      return { data: null, error: "An error occurred", status: 400 };
    }
    return { data: null, error: "An error occurred" };
  }
}

// get products by vendor //
export async function getProductsByVendor(): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(`/products/getProductsByVendor/`, {});
    return {
      data: response.data.data,
      msg: "Fetched Successfully",
      error: null,
      status: 200,
    };
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      return { data: null, error: "An error occurred", status: 400 };
    }
    console.error("Unexpected error:", error);
    return {
      data: null,
      error: "An error occurred",
      status: error?.response?.status || 500,
    };
  }
}
export async function getProductsByVendorId(vendorId: any): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(`/products/getProductsByVendorId/${vendorId}/`, {});
    return {
      data: response.data.data,
      msg: response.data.message || "Products fetched successfully",
      error: null,
      status: 200,
    };
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return {
        data: null,
        error: error.response.data.message || "Vendor not found or no products available",
        status: 404
      };
    }
    if (error.response && error.response.status === 400) {
      return {
        data: null,
        error: "Bad request",
        status: 400
      };
    }
    console.error("Unexpected error:", error);
    return {
      data: null,
      error: "An error occurred while fetching products",
      status: error?.response?.status || 500,
    };
  }
}

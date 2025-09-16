"use server"
import API from "@/lib/api";
// import getToken from "@/helpers/getToken";
import { ActionResponse } from ".";
import axios from "axios";
import { revalidatePath } from "next/cache";

export async function CreateVendor(values: any): Promise<ActionResponse<any>> {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendors/createVendor/`, values, {
      // Any additional headers or configurations can go here
    });

    revalidatePath('/vendorDashboard/vendors');

    return {
      data: response.data,
      msg: "Created Successfully",
      error: null,
      status: 200
    };
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      return {
        data: null,
        error: "An error occurred",
        status: 400
      };
    }
    return {
      data: null,
      error: "An error occurred"
    };
  }
}

// GET SINGLE VENDOR
export async function GetVendor(id: string): Promise<ActionResponse<any>> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendors/getVendor/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // To always fetch fresh data
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        data: null,
        error: data?.message || "Failed to fetch vendor.",
        status: res.status,
      };
    }

    return {
      data: data.data, // Adjust based on your backend response structure
      msg: data.message || "Fetched successfully",
      error: null,
      status: res.status,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error?.message || "An unexpected error occurred.",
      status: 500,
    };
  }
}


// get vendor list
export async function getVendorProfile(): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(
      `vendors/getVendorProfile/`,
    ); // Adjust path if needed
    return { data: response.data.data, msg: "Vendors Fetched Successfully", error: null, status: 200 };
  } catch (error: any) {
    console.error(error.response?.data); // Log detailed error
    if (error.response?.status === 400) {
      return { data: null, error: "Invalid input", status: 400 };
    }
    return { data: null, error: "An error occurred" };
  }
}


export async function updateVendorProfile(data: any): Promise<ActionResponse<any>> {
  try {
    const response = await API.put(
      `vendors/updateVendorProfile/`, data
    ); // Adjust path if needed
    revalidatePath('/vendorDashboard/vendorDashboardProfile');
    return { data: response.data, msg: "Vendor Updated Successfully", error: null, status: 200 };
  } catch (error: any) {
    console.error(error.response?.data); // Log detailed error
    if (error.response?.status === 400) {
      return { data: null, error: "Invalid input", status: 400 };
    }
    return { data: null, error: "An error occurred" };
  }
}



//get orders for each vendor //
export async function getUserOrders(page: number = 1, pageSize: number = 10) {
  try {
    const response = await API.get(`/vendors/orders/`, {
      params: { page, page_size: pageSize },
    })
    return { data: response.data, error: null }
  } catch (error: any) {
    return { data: null, error: error?.response?.data?.error || "Error fetching orders" }
  }
}



//get ads by vendor
export async function getAdsByVendor(
  page: number = 1,
  pageSize: number = 10
): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(`advertisements/getAdsByVendor/`, {
      params: { page, page_size: pageSize },
    });

    return {
      data: response.data,
      msg: "Advertisements fetched successfully",
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error?.response?.data?.error || "An error occurred",
      status: error?.response?.status,
    };
  }
}


// get vendor sales summary
export async function getVendorTotalSales() {
  try {
    const response = await API.get(`/vendors/salesSummary/`)
    return { data: response.data, error: null }
  } catch (error: any) {
    return { data: null, error: error?.response?.data?.error || "Error fetching total sales" }
  }
}

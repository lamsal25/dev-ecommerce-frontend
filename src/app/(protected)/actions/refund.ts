"use server"
import API from "@/lib/api";
import { ActionResponse } from ".";
import { revalidatePath } from "next/cache";



interface UpdateRefundStatusPayload {
  status: "pending" | "approved" | "rejected" | "processed";
  admin_notes?: string;
}

// Get products //
export async function getRefundRequestByVendor(): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/refunds/vendor/refund-requests/`,
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

export async function getApprovedRefundRequestByVendor(): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/refunds/vendor/approved-refund-requests/`,
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


// Update refund status by ID
export async function updateRefundStatus(
  refundId: number,
  payload: UpdateRefundStatusPayload
): Promise<ActionResponse<any>> {
  try {
    const response = await API.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/refunds/update-status/${refundId}/`,
      payload
    );
    revalidatePath("/vendorDashboard/refundrequest")
    return {
      data: response.data.data,
      msg: response.data.message || "Refund status updated successfully",
      error: null,
      status: 200,
    };
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      return {
        data: null,
        error: error.response.data.error || "Invalid request",
        status: 400,
      };
    } else if (error.response && error.response.status === 403) {
      return {
        data: null,
        error: "Permission denied",
        status: 403,
      };
    } else if (error.response && error.response.status === 404) {
      return {
        data: null,
        error: "Refund request not found",
        status: 404,
      };
    }

    console.error("Unexpected error:", error);

    return {
      data: null,
      error: "An unexpected error occurred",
      status: error?.response?.status || 500,
    };
  }
}

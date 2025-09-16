// app/lib/actions/review.ts
"use server";
import API from "@/lib/api";
import { revalidatePath } from "next/cache";
import { ActionResponse } from ".";

export async function createProductReview(
  productId: number,
  reviewData: { rating: number; comment: string }
): Promise<ActionResponse<any>> {
  try {
    const response = await API.post(
      `reviews/create/`,
      {
        product: productId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      },
      {
        withCredentials: true,
      }
    );

    revalidatePath(`/products/${productId}`);

    return {
      data: response.data,
      msg: "Review submitted successfully",
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    // More specific error handling
    if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.error || "Please login to review the product";
      return {
        data: null,
        error: errorMsg,
        status: 400,
      };
    }

    return {
      data: null,
      error: error.response?.data?.error || "An error occurred while submitting the review",
      status: error.response?.status || 500,
    };
  }
}

export async function getProductReviews(
  productId: number
): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(`reviews/getReviews/`, {
      params: { product_id: productId },
      withCredentials: true,
    });

    return {
      data: response.data.data || response.data,
      msg: "",
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      data: null,
      msg: "",
      error: error.response?.data?.error || "Failed to fetch product reviews.",
      status: error.response?.status || 500,
    };
  }
}

export async function getBatchProductReviewStats(
  productIds: number[]
): Promise<
  ActionResponse<Record<string, { avg_rating: number; total_reviews: number }>>
> {
  try {
    const queryParams = productIds.map((id) => `product_ids=${id}`).join("&");

    const response = await API.get(
      `reviews/batch-product-review-stats/?${queryParams}`,
      {
        withCredentials: true,
      }
    );

    return {
      data: response.data,
      msg: "",
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      data: null,
      msg: "",
      error: error.response?.data?.error || "Failed to fetch batch product review stats.",
      status: error.response?.status || 500,
    };
  }
}

export async function deleteProductReview(
  reviewId: number
): Promise<ActionResponse<any>> {
  try {
    const response = await API.delete(
      `reviews/deleteReview/${reviewId}/`,
      { withCredentials: true }
    );

    return {
      data: response.data,
      msg: response.data?.message || "Review deleted successfully",
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data?.error || "Failed to delete review.",
      status: error.response?.status || 500,
    };
  }
}

// ---------------------- Vendor Reply Actions ----------------------

export async function createVendorReply(
  reviewId: number,
  reply: string
): Promise<ActionResponse<any>> {
  try {
    const response = await API.post(
      `reviews/product-reviews/${reviewId}/replies/create/`,
      { reply },
      { withCredentials: true }
    );

    return {
      data: response.data,
      msg: "Reply posted successfully",
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      data: null,
      msg: "",
      error: error.response?.data?.error || "Failed to post reply.",
      status: error.response?.status || 500,
    };
  }
}

export async function updateVendorReply(
  replyId: number,
  reply: string
): Promise<ActionResponse<any>> {
  try {
    const response = await API.put(
      `reviews/replies/${replyId}/update/`,
      { reply },
      { withCredentials: true }
    );

    return {
      data: response.data,
      msg: "Reply updated successfully",
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      data: null,
      msg: "",
      error: error.response?.data?.error || "Failed to update reply.",
      status: error.response?.status || 500,
    };
  }
}

export async function deleteVendorReply(
  replyId: number
): Promise<ActionResponse<any>> {
  try {
    const response = await API.delete(
      `reviews/replies/${replyId}/delete/`,
      { withCredentials: true }
    );

    return {
      data: response.data,
      msg: response.data?.message || "Reply deleted successfully",
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      data: null,
      msg: "",
      error: error.response?.data?.error || "Failed to delete reply.",
      status: error.response?.status || 500,
    };
  }
}

// ---------------------- Vendor Reviews ----------------------

type CreateVendorReviewPayload = {
  rating: number;
  comment: string;
};

export async function createVendorReview(
  vendorId: number,
  reviewData: CreateVendorReviewPayload
): Promise<ActionResponse<any>> {
  try {
    const response = await API.post(
      `reviews/vendor-reviews/create/`,
      {
        vendor: vendorId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      },
      {
        withCredentials: true,
      }
    );

    revalidatePath(`/vendors/${vendorId}`);

    return {
      data: response.data,
      msg: "Vendor review submitted successfully",
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.error || "Please login to review the vendor";
      return {
        data: null,
        error: errorMsg,
        status: 400,
      };
    }

    return {
      data: null,
      error: error.response?.data?.error || "An error occurred while submitting the vendor review",
      status: error.response?.status || 500,
    };
  }
}

export async function getVendorReviews(
  vendorId: number
): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(
      `reviews/vendor-reviews/`,
      {
        params: { vendor_id: vendorId },
        withCredentials: true,
      }
    );

    return {
      data: response.data.data || response.data,
      msg: "",
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      data: null,
      msg: "",
      error: error.response?.data?.error || "Failed to fetch vendor reviews.",
      status: error.response?.status || 500,
    };
  }
}

export async function deleteVendorReview(
  reviewId: number
): Promise<ActionResponse<any>> {
  try {
    const response = await API.delete(
      `reviews/vendor-reviews/delete/${reviewId}/`,
      { withCredentials: true }
    );

    return {
      data: response.data,
      msg: response.data?.message || "Vendor review deleted successfully",
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data?.error || "Failed to delete vendor review.",
      status: error.response?.status || 500,
    };
  }
}
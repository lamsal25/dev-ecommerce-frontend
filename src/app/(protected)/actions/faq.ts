"use server";

import API from "@/lib/api";
import { ActionResponse } from ".";
import { revalidatePath } from "next/cache";

// Update FAQ
export async function updateFAQ(id: number, values: any): Promise<ActionResponse<any>> {
  try {
    const response = await API.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/faqs/update/${id}/`,
      values
    );

    revalidatePath("/dashboard/faqs");

    return {
      data: response.data,
      msg: "FAQ updated successfully",
      error: null,
      status: 200,
    };
  } catch (error: any) {
    if (error.response?.status === 400) {
      return { data: null, error: "Validation error", status: 400 };
    }
    return { data: null, error: "Failed to update FAQ", status: 500 };
  }
}

// Delete FAQ
export async function deleteFAQ(id: number): Promise<ActionResponse<any>> {
  try {
    const response = await API.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/faqs/delete/${id}/`
    );

    revalidatePath("/dashboard/faqs");

    return {
      data: response.data,
      msg: "FAQ deleted successfully",
      error: null,
      status: 200,
    };
  } catch (error: any) {
    return {
      data: null,
      error: "Failed to delete FAQ",
      status: error?.response?.status || 500,
    };
  }
}

// Get all FAQs
export async function getAllFAQs(): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(`/faqs/all/`);
    return {
      data: response.data,
      msg: "FAQs fetched successfully",
      error: null,
      status: 200,
    };
  } catch (error: any) {
    return {
      data: null,
      error: "Failed to fetch FAQs",
      status: error?.response?.status || 500,
    };
  }
}

// Get single FAQ by ID
export async function getFAQById(id: number): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(`/faqs/detail/${id}/`);
    return {
      data: response.data,
      msg: "FAQ fetched successfully",
      error: null,
      status: 200,
    };
  } catch (error: any) {
    return {
      data: null,
      error: "Failed to fetch FAQ",
      status: error?.response?.status || 500,
    };
  }
}

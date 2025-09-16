'use server'

// fetch the pending ads
import API from '@/lib/api';
import { ActionResponse } from '.';
import { revalidatePath } from "next/cache";

export async function getPendingAds(): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(`advertisements/getAllPendingAds/`);
    revalidatePath('/superadmindashboard/pendingAds');
    return { data: response.data, msg: "Fetched Successfully", error: null, status: 200 };
  } catch (error: any) {
    console.error(error);
    if (error.response?.status === 400) {
      return { data: null, error: "An error occurred", status: 400 };
    }
    return { data: null, error: "An error occurred" };
  }
}
"use server";
import API from "@/lib/api";
import { ActionResponse } from ".";
import axios from "axios";
import { revalidatePath } from "next/cache";
import getAccessToken from "@/helpers/getaccesstoken";
import getCsrfToken from "@/helpers/getcsrftoken";
import { redirect } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export async function getUser(): Promise<ActionResponse<any>> {
  try {
    // Manually fetch tokens for each request
    const access_token = await getAccessToken();
    const csrftoken = await getCsrfToken();

    const response = await axios.get(`${backendUrl}/api/getuser`, {
      withCredentials: true,
      headers: {
        ...(access_token && { Authorization: `Bearer ${access_token}` }),
        ...(csrftoken && { "X-CSRFToken": csrftoken }),
      },
    });

    return { 
      data: response.data, 
      msg: "User Fetched Successfully", 
      error: null, 
      status: 200 
    };
  } catch (error: any) {
    
    if (error.response?.status === 401) {
      return { 
        data: null, 
        error: "Unauthorized User", 
        status: 401 
      };
    }
    
    return { 
      data: null, 
      error: error.response?.data?.message || "An error occurred",
      status: error.response?.status || 500
    };
  }
}


export async function updateUser(data:any,id:any): Promise<ActionResponse<any>> {
  try {
    const response = await API.put(
      `/users/updateuser/${id}/`,data
    ); // Adjust path if needed
    revalidatePath("/clientdashboard/clientprofile")
    return { data: response.data, msg: "User Updated Successfully", error: null, status: 200 };
  } catch (error: any) {
    console.error(error.response?.data); // Log detailed error
    if (error.response?.status === 400) {
      return { data: null, error: "Invalid input", status: 400 };
    }
    return { data: null, error: "An error occurred" };
  }
}

export async function signOut() {
  try {
    const csrftoken = await getCsrfToken();
    const access_token = await getAccessToken();
    await axios.post(
      `${backendUrl}/api/logout/`, 
      {},
      {
        withCredentials: true,
        headers: {
          ...(access_token && { Authorization: `Bearer ${access_token}` }),
        ...(csrftoken && { "X-CSRFToken": csrftoken }),
        },
      }
    );

    // Optionally clear client-side tokens if stored
    // (e.g., in cookies or localStorage for client components)
    
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Logout failed");
  } finally {
    // Always redirect after logout attempt
    redirect("/login");
}
}
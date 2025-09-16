"use server";
import API from "@/lib/api";

export async function getUserData() {

    try {
        const response = await API.get("api/getuser/", {});

        return response.data;
    } catch (error: any) {
        console.error("Error fetching user data:", error);
        console.error("Error response:", error.response?.data || error.message);
    }
}
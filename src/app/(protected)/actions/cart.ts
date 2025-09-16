"use server";

import { cookies } from "next/headers";
import API from "@/lib/api";

export async function getUserData() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    try {
        if (!token) {
        throw new Error("Access token is missing.");
        }
        const response = await API.get("api/getuser/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    } catch (error: any) {
        console.error("Error fetching user data:", error);
        console.error("Error response:", error.response?.data || error.message);
        throw error;
    }
}
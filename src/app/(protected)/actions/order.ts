"use server"
import API from "@/lib/api";
import { ActionResponse } from ".";


//get search products //
export async function fetchOrders(): Promise<ActionResponse<any>> {
  try {
    const response = await API.get("order/getOrders/");
    return { data: response.data, msg: "Orders fetched successfully", error: null, status: 200 };
  } catch (error: any) {
    if (error.response.status === 400) {
      return { data: null, error: "An error occurred", status: 400 };
    }
    return { data: null, error: "An error occurred" };
  }
}

//get search products //
export async function fetchOrderDetails(orderID: string  | number | undefined): Promise<ActionResponse<any>> {
  try {
    const response = await API.get(`order/getOrder/${orderID}/`);
    return { data: response.data, msg: "Order details fetched successfully", error: null, status: 200 };
  } catch (error: any) {
    if (error.response.status === 400) {
      return { data: null, error: "An error occurred", status: 400 };
    }
    return { data: null, error: "An error occurred" };
  }
}



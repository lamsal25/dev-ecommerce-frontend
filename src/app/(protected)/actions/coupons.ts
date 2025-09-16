"use server"
import API from "@/lib/api";
import { ActionResponse } from ".";
import axios from "axios";
import { revalidatePath } from "next/cache";


// get all the categories //
  export async function getCoupons(): Promise<ActionResponse<any>> {
    try {
    
      const response = await API.get(`/coupons/getCoupons/`);
      return { data: response.data, msg:"Coupons fetched successfully", error: null,status:200 };
    } catch (error: any) {
      console.log(error);
      if(error.response?.status==400){
        return { data: null, error:"Couldn't fetch coupons.",status:400};
      }
      return { data: null, error:"An error occured"};
    }
  }
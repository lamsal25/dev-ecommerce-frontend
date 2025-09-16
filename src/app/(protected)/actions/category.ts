"use server"
import API from "@/lib/api";
import { ActionResponse } from ".";
import axios from "axios";
import { revalidatePath } from "next/cache";


// get all the categories //
  export async function getActiveCategories(): Promise<ActionResponse<any>> {
    try {
    
      const response = await API.get(`/products/getCategories/`);
      return { data: response.data.data,msg:"Created Succesfully", error: null,status:200 };
    } catch (error: any) {
      console.log(error);
      if(error.response?.status==400){
        return { data: null, error:"An error occured",status:400};
      }
      return { data: null, error:"An error occured"};
    }
  }

//create categories //
export async function createCategory(values:any): Promise<ActionResponse<any>> {
  try {
    
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/createCategory/`,values,{
 
  });
    revalidatePath('/vendorDashboard/categories');
   
    return { data: response.data,msg:"Created Succesfully", error: null,status:200 };
  } catch (error: any) {
    if(error.response.status==400){
      return { data: null, error:"An error occured",status:400};
    }
    return { data: null, error:"An error occured"};
  }
}

// update categories //`
export async function updateCategory(values:any,id:number): Promise<ActionResponse<any>> {
  try {
    
    const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/updateCategory/${id}/`,values,{

  });
    revalidatePath('/vendorDashboard/categories');
   
    return { data: response.data,msg:"Created Succesfully", error: null,status:200 };
  } catch (error: any) {
    if(error.response.status==400){
      return { data: null, error:"An error occured",status:400};
    }
    return { data: null, error:"An error occured"};
  }
}



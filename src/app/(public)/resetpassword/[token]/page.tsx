"use client";
import { useTransition } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const dynamic = 'force-dynamic';

export default function ResetPasswordForm() {
  const { register, handleSubmit } = useForm();
  const [isPending,startTransition]= useTransition()
  const params= useParams()
  const {token}= params

  const onSubmit = (data: any) => {
    startTransition(async()=>{
      try{

        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reset-password/${token}/`,
          data,
          {
            withCredentials: true,
          }
          
        );
        if(response.data.success===true || response.data.success=="true"){
          toast.success('Password Rest Succesfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                }
              }catch(error){
                toast.error('Error in resetting password', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              }
              })
            };
            
            return (
              <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer/>
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Reset Your Password</h2>
        <p className="text-gray-600 text-center mt-2">Enter your new password below.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          
          {/* New Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">New Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-4 py-2 bg-white border rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter new password"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            {isPending?"Reseting Password..":"Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

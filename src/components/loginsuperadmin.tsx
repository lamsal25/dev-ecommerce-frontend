"use client";

import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/formSchema/login";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { ColorRing } from "react-loader-spinner";
import { FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { setAccessTokenCookie } from "@/helpers/setaccesstoken";
import { setRefreshTokenCookie } from "@/helpers/setrefreshtoken";

export default function LoginSuperAdmin() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: any) => {
    // Enhanced security: Check for too many failed attempts


    startTransition(async () => {
      try {
        const response = await API.post(`/api/loginsuperadmin/`, data);
        console.log(response);
        
        // Verify the user has super admin role
        if (response.data.user.role !== "superadmin") {
          throw new Error("Unauthorized: Super admin access required");
        }

        setAccessTokenCookie(response.data.access);
        setRefreshTokenCookie(response.data.refresh);
        
        toast.success("Super Admin login successful!", { 
          position: "top-right", 
          autoClose: 3000 
        });
        
      
        
        // Always redirect to super admin dashboard
        router.push("/superadmindashboard");
        
      } catch (err: any) {
        console.log(err.response?.data?.details?.[0]);
  
        
        const errorMessage = err.message === "Unauthorized: Super admin access required" 
          ? "Access denied: Super admin privileges required"
          : (err.response?.data?.details?.[0] || "Authentication failed");
          
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-white shadow-xl mt-10 mb-10 rounded-2xl p-8 max-w-lg mx-auto border border-gray-200 space-y-4">
      <ToastContainer />
      
      {isPending && (
        <div className="flex justify-center">
          <ColorRing visible={true} height="60" width="60" ariaLabel="loading" />
        </div>
      )}

      {/* Security Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
        <div className="flex items-center text-red-700">
          <FaShieldAlt className="mr-2" />
          <span className="text-sm">
            Restricted Access - Super Administrator Only
          </span>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-primary text-center mb-6">
        Super Admin <span className="text-secondary">Portal</span>
      </h2>



      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Administrator Email"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Administrator Password"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/10 pr-12"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 bg-primary text-white hover:bg-primary/90`}
        >
          {isSubmitting ? "Authenticating..." : "Access Admin Portal"}
        </button>
      </form>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600 text-xs text-center">
          🔒 All login attempts are monitored and logged for security purposes.
          <br />
          Unauthorized access attempts will be reported.
        </p>
      </div>

      {/* No social login for super admin */}
      <div className="text-center mt-4">
        <p className="text-gray-500 text-sm">
          Social login disabled for administrator accounts
        </p>
      </div>
    </div>
  );
}
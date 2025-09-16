"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/formSchema/login";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { ColorRing } from "react-loader-spinner";
import { FcGoogle } from "react-icons/fc";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";
import { ForgotPassword } from "./forgotpassword";
import { setAccessTokenCookie } from "@/helpers/setaccesstoken";
import { setRefreshTokenCookie } from "@/helpers/setrefreshtoken";
import getCsrfToken from "@/helpers/getcsrftoken";

export default function LoginUser() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data:any) => {
    startTransition(async () => {
      try {
        const response=await API.post(`/api/login/`, data);
        console.log(response)
        setAccessTokenCookie(response.data.access)
        setRefreshTokenCookie(response.data.refresh)
        toast.success("Logged in successfully!", { position: "top-right", autoClose: 3000 });
        if(response.data.user.role=="vendor"){
          router.push("/vendorDashboard");
        }else if(response.data.user.role=="user"){
          router.push("/clientdashboard/clientprofile");
        }else{
          router.push("/superadmindashboard");
        }
      } catch (err:any) {
        console.log(err.response?.data?.details?.[0]);
        toast.error((err.response?.data?.details?.[0] || "Login failed"), {
          position: "top-right",
          autoClose: 5000,
        });
      }
    });
  };

  // ✅ Google Login success handler (API-based token exchange)
  const handleGoogleSuccess = async (credentialResponse: any) => {
  const id_token = credentialResponse.credential;
  console.log("Google ID Token:", id_token);
  
  try {
    const response = await API.post('/api/google/validate_token/', { 
      token: id_token 
    }, );
     setAccessTokenCookie(response.data.user.access)
    setRefreshTokenCookie(response.data.user.refresh)
    console.log("Google login response:", response);

    if (response.data?.user?.role) {
      toast.success("Google login successful!");
      // Handle routing based on role
      const roleRoutes:any = {
        vendor: "/vendorDashboard",
        user: "/clientdashboard/clientprofile",
        admin: "/superadmindashboard"
      };
      
      router.push(roleRoutes[response.data.user.role] || "/");
    } else {
      throw new Error("Role not specified");
    }
  } catch (error:any) {
    toast.error(
      error.response?.data?.error || 
      "Google authentication failed. Please try another method.",
      { position: "top-right", autoClose: 5000 }
    );
  }
};

  return (
    <div className="bg-white shadow-xl mt-10 mb-10 rounded-2xl p-8 max-w-lg mx-auto border border-gray-200 space-y-4">
      <ToastContainer />
      {isPending && (
        <div className="flex justify-center">
          <ColorRing visible={true} height="60" width="60" ariaLabel="loading" />
        </div>
      )}

      <h2 className="text-3xl font-bold text-primary text-center mb-6">
        Login <span className="text-secondary">to your account</span>
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            {...register("email")}
            type="text"
            placeholder="Email"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <div className="text-right">
          <ForgotPassword/>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 ${isSubmitting ? "bg-gray-400" : "bg-primary"} text-white font-semibold rounded-lg`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-3 text-gray-500">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* ✅ Google Login Button with API token exchange */}
      <div className="w-full flex items-center justify-center py-3">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google Sign-in Failed")}
        />
      </div>
    </div>
  );
}

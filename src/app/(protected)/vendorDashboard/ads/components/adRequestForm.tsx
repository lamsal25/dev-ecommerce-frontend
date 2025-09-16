"use client";

import { useForm } from "react-hook-form";
import API from "@/lib/api";
import { getUserData } from "@/app/(protected)/actions/getUser";
import axios from "axios";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { advertisementFormSchema } from "@/formSchema/ads";
import type { z } from "zod";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

type AdvertisementFormValues = z.infer<typeof advertisementFormSchema>;

export default function CreateAdvertisement() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdvertisementFormValues>({
    resolver: zodResolver(advertisementFormSchema),
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    if (!data.image || data.image.length === 0) {
      toast.error("Advertisement image is required");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("link", data.link);
      formData.append("position", data.position);
      formData.append("description", data.description);
      const startDate = new Date(data.start_date).toISOString();
      const endDate = new Date(data.end_date).toISOString();
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("image", data.image[0]);

      const token = getUserData();
      console.log("Token:", token);

      if (!token) {
        toast.error("You must be logged in to create an advertisement.");
        return;
      }

      const response = await API.post(
        "advertisements/vendor/create/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Advertisement created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        reset();
        setPreviewImage(null);
      } else {
        toast.error("Failed to create advertisement.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Server error occurred");
      } else {
        toast.error("Error connecting to the server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white border rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-secondary mb-6 text-center">
        📣 Submit Your Advertisement
      </h2>
      <p className="text-primary text-center mb-8">
        Promote your brand or product by booking a slot in our marketplace.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-5">

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Advertisement Title</label>
          <input
            type="text"
            {...register("title")}
            placeholder="e.g. Summer Sale - 50% Off"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Link (URL)</label>
          <input
            type="url"
            {...register("link")}
            placeholder="https://yourwebsite.com"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Ad Position</label>
          <select
            {...register("position")}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Position --</option>
            <option value="above_navbar">Above Navbar</option>
            <option value="homepage_middle">Homepage Middle</option>
            <option value="homepage_bottom">Homepage Bottom</option>
            <option value="productpage_sidebar">Productpage Sidebar</option>
            <option value="marketplace">Marketplace</option>
          </select>
          {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Start Date</label>
            <input
              type="datetime-local"
              {...register("start_date")}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">End Date</label>
            <input
              type="datetime-local"
              {...register("end_date")}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
          <textarea
            {...register("description")}
            placeholder="Short description of your advertisement"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Ad Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full border rounded-lg p-3 bg-gray-50 focus:outline-none"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreviewImage(URL.createObjectURL(file));
              }
            }}
          />
          {typeof errors.image?.message === "string" && (
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}

          {previewImage && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-1 text-gray-700">Image Preview:</p>
              <img
                src={previewImage}
                alt="Ad Preview"
                className="w-full max-h-64 object-contain border rounded-lg"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-secondary flex justify-center items-center gap-2 text-white font-semibold w-full p-3 rounded-lg hover:bg-secondary/90 transition duration-200"
        >
          {isLoading ? (
            <>
              <ClipLoader color="#fff" size={20} />
              Submitting...
            </>
          ) : (
            "🚀 Submit Advertisement"
          )}
        </button>

      </form>
    </div>
  );
}

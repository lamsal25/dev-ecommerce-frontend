"use client";
import React, { useTransition, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { marketProductFormSchema } from "@/formSchema/marketproductform";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "./ui/button";
import { ColorRing } from "react-loader-spinner";
import { CheckCircle, ChevronLeft, ChevronRight, Upload, Star } from "lucide-react";
import API from "@/lib/api";

export default function MarketPlaceForm({categories}:any) {
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({
  image: "",
  topImage: "",
  bottomImage: "",
  leftImage: "",
  rightImage: "",
});


  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(marketProductFormSchema),
    mode: "onChange",
    defaultValues: {
      isAvailable: true,
      
    }
  });

  const allFields = watch();

  

  const validateStep = async (step:any) => {
    let fieldsToValidate:any = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["category", "name", "description"];
        break;
      case 2:
        fieldsToValidate = ["price", "stock", "isAvailable"];
        break;
      case 3:
        fieldsToValidate = ["image", "topImage", "bottomImage", "leftImage", "rightImage"];
        break;
      default:
        break;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data:any) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        
        // Append text fields
        Object.keys(data).forEach(key => {
          if (key !== 'image' && key !== 'topImage' && key !== 'bottomImage' && key !== 'leftImage' && key !== 'rightImage') {
            formData.append(key, data[key]);
          }
        });

        // Append image files
        if (data.image?.[0]) formData.append('image', data.image[0]);
        if (data.topImage?.[0]) formData.append('topImage', data.topImage[0]);
        if (data.bottomImage?.[0]) formData.append('bottomImage', data.bottomImage[0]);
        if (data.leftImage?.[0]) formData.append('leftImage', data.leftImage[0]);
        if (data.rightImage?.[0]) formData.append('rightImage', data.rightImage[0]);

        const response = await API.post(`/products/createMarketPlaceProduct/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.status === 201) {
          toast.success(
            "Used product added successfully! It will be reviewed before being listed.",
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
        }
      } catch (error:any) {
        console.log("error is",error.response.status);
        if (error.response.status === 401) {
        toast.error(
           "You must login to add a product",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        }else{
          toast.error(
           error.response?.data || "Failed to add product",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        }
        
      }
    });
  };

const handleFileChange = (fieldName: any, files: FileList | null) => {
  if (files && files[0]) {
    setValue(fieldName, files);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreviews(prev => ({
        ...prev,
        [fieldName]: e.target?.result as string
      }));
    };
    reader.readAsDataURL(files[0]);
    
    trigger(fieldName);
  }
};
  const renderStarRating = (currentRating:any, onRatingChange:any) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star.toString())}
            className={`p-1 transition-colors ${
              star <= parseInt(currentRating || 0)
                ? "text-yellow-400"
                : "text-gray-300 hover:text-yellow-200"
            }`}
          >
            <Star size={24} fill="currentColor" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-xl mt-10 mb-10 rounded-2xl p-8 max-w-2xl mx-auto border border-gray-100">
       <ToastContainer
        />
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Add Used Product
      </h2>

      {isPending && (
        <div className="flex justify-center py-4">
          <ColorRing
            visible={true}
            height="60"
            width="60"
            ariaLabel="loading"
          />
        </div>
      )}

      {/* Progress indicator */}
      <div className="relative mb-10">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
        <div className="relative flex justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center z-10">
              <button
                type="button"
                onClick={() => step < currentStep && setCurrentStep(step)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step === currentStep
                    ? "bg-primary text-white scale-110 shadow-lg"
                    : step < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {step < currentStep ? <CheckCircle size={20} /> : step}
              </button>
              <span
                className={`text-xs mt-2 font-medium ${
                  step <= currentStep ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {step === 1 && "Product Info"}
                {step === 2 && "Pricing"}
                {step === 3 && "Images"}
                {step === 4 && "Review"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Product Information */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Product Information
            </h3>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              {...register("category")}
              className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((cat:any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                {...register("name")}
                placeholder="Enter product name"
                className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="Describe your product in detail..."
                rows={4}
                className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={nextStep}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Pricing & Availability */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Pricing & Availability
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  {...register("price")}
                  type="text"
                  placeholder="price"
                  className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Stock Quantity
                </label>
                <input
                  {...register("stock")}
                  type="text"
                  placeholder="stock"
                  className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <input
                {...register("isAvailable")}
                type="checkbox"
                id="isAvailable"
                className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="isAvailable" className="text-sm text-gray-700">
                Product is available for sale
              </label>
            </div>

                       

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                className="w-1/2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} /> Back
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                className="w-1/2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
  <div className="space-y-5">
    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
      Product Images
    </h3>
    <p className="text-sm text-gray-600 mb-4">
      Upload clear images from all required angles (max 5MB each)
    </p>

    <div className="grid grid-cols-2 gap-4">
      {[
        { name: "image", label: "Main", key: "main" },
        { name: "topImage", label: "Top", key: "top" },
        { name: "bottomImage", label: "Bottom", key: "bottom" },
        { name: "leftImage", label: "Left", key: "left" },
        { name: "rightImage", label: "Right", key: "right" },
      ].map(({ name, label }) => (
        <div key={name} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {label} View {errors.name && (
              <span className="text-red-500 text-xs">(required)</span>
            )}
          </label>
          <div
            className={`relative h-32 rounded-md border-2 border-dashed ${
              errors.name 
                ? "border-red-300 bg-red-50" 
                : imagePreviews[name] 
                  ? "border-primary/20" 
                  : "border-gray-300 hover:border-primary/40"
            } transition-colors flex items-center justify-center`}
          >
            {imagePreviews[name] ? (
              <>
                <img
                  src={imagePreviews[name]}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-contain p-2"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-primary text-xs font-medium px-2 py-1 rounded">
                    Change
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center p-2">
                <Upload className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Click to upload</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(name, e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id={name}
            />
          </div>
        </div>
      ))}
    </div>

    <div className="flex gap-3 pt-4">
      <Button
        type="button"
        onClick={prevStep}
        variant="outline"
        className="flex-1 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
      >
        <ChevronLeft size={18} /> Back
      </Button>
      <Button
        type="button"
        onClick={nextStep}
        className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
      >
        Review <ChevronRight size={18} />
      </Button>
    </div>
  </div>
)}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Review Your Product Listing
            </h3>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900 border-b pb-1">
                    Product Details
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Category:</span>{" "}
                      <span className="font-medium capitalize">
                        {allFields.category || "Not provided"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Name:</span>{" "}
                      <span className="font-medium">
                        {allFields.name || "Not provided"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Description:</span>{" "}
                      <span className="font-medium text-sm">
                        {allFields.description?.substring(0, 100)}
                        {allFields.description?.length > 100 ? "..." : ""}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900 border-b pb-1">
                    Pricing & Availability
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Price:</span>{" "}
                      <span className="font-medium text-green-600">
                        ${allFields.price || "0.00"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Stock:</span>{" "}
                      <span className="font-medium">
                        {allFields.stock || "0"} units
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Available:</span>{" "}
                      <span className={`font-medium ${allFields.isAvailable ? "text-green-600" : "text-red-600"}`}>
                        {allFields.isAvailable ? "Yes" : "No"}
                      </span>
                    </p>
                    
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-medium text-gray-900 border-b pb-1">
                  Images Uploaded
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className={allFields.image?.[0] ? "text-green-600" : "text-red-500"}>
                    Main Image: {allFields.image?.[0] ? "✓" : "✗"}
                  </p>
                  <p className={allFields.topImage?.[0] ? "text-green-600" : "text-red-500"}>
                    Top View: {allFields.topImage?.[0] ? "✓" : "✗"}
                  </p>
                  <p className={allFields.bottomImage?.[0] ? "text-green-600" : "text-red-500"}>
                    Bottom View: {allFields.bottomImage?.[0] ? "✓" : "✗"}
                  </p>
                  <p className={allFields.leftImage?.[0] ? "text-green-600" : "text-red-500"}>
                    Left View: {allFields.leftImage?.[0] ? "✓" : "✗"}
                  </p>
                  <p className={allFields.rightImage?.[0] ? "text-green-600" : "text-red-500"}>
                    Right View: {allFields.rightImage?.[0] ? "✓" : "✗"}
                  </p>
                </div>
              </div>

              
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                className="w-1/2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} /> Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-1/2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
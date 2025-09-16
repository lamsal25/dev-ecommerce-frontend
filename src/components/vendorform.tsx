"use client";

import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorFormSchema } from "@/formSchema/vendorapply";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import API from "@/lib/api";
import { Controller } from "react-hook-form";

export default function VendorApplicationForm() {
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
    control,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(vendorFormSchema),
    mode: "onChange",
  });

  const allFields = watch();

  const validateStep = async (step: any) => {
    let fieldsToValidate: any = [];
    switch (step) {
      case 1:
        fieldsToValidate = ["ownerName", "email", "username", "password", "phone"];
        break;
      case 2:
        fieldsToValidate = [
          "businessName",
          "businessType",
          "businessDescription",
          "registrationNumber",
          "registrationDocument"
        ];
        break;
      case 3:
        fieldsToValidate = ["address", "city", "country", "website"];
        break;
    }
    return await trigger(fieldsToValidate);
  };

  const nextStep = async () => {
    const valid = await validateStep(currentStep);
    if (valid) setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setValue("registrationDocument", e.target.files, { shouldValidate: true });
  };

  const onSubmit = (data:  any) => {
    console.log("Form data:", data);
    console.log("Selected file:", selectedFile);

    startTransition(async () => {
      try {
        const formData = new FormData();

        // Append all form fields except the file
        for (const key in data) {
          if (key !== "registrationDocument" && data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key]);
          }
        }

         // Add logo file if present
        if (logoFile) {
          formData.append('businessLogo', logoFile);
        }

        // Handle file upload - use selectedFile state
        if (selectedFile) {
          formData.append("registrationDocument", selectedFile);
        }

        // Log what's being sent
        console.log("FormData entries:");
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ', pair[1]);
        }

        const response = await API.post("/vendors/createVendor/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Application submitted successfully!");

        // Reset form after successful submission
        setSelectedFile(null);
        setCurrentStep(1);

      } catch (error: any) {
        console.error("Submission error:", error);
        console.error("Error response:", error.response?.data);

        const errorMessage = error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.details?.[0] ||
          "Registration failed";

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    });
  };

  return (
    <div className="bg-white shadow-xl mt-10 mb-10 rounded-2xl p-8 max-w-2xl mx-auto border border-gray-100">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Vendor Application
      </h2>

      <div className="relative mb-10">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
        <div className="relative flex justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center z-10">
              <button
                type="button"
                onClick={() => step < currentStep && setCurrentStep(step)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${step === currentStep
                    ? "bg-primary text-white scale-110 shadow-lg"
                    : step < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
              >
                {step < currentStep ? <CheckCircle size={20} /> : step}
              </button>
              <span
                className={`text-xs mt-2 font-medium ${step <= currentStep ? "text-gray-800" : "text-gray-500"
                  }`}
              >
                {step === 1 && "Contact"}
                {step === 2 && "Business"}
                {step === 3 && "Address"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Owner Name</label>
              <input
                {...register("ownerName")}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${errors.ownerName ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="John Doe"
              />
              {errors.ownerName && (
                <p className="text-red-500 text-sm">{errors.ownerName.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                {...register("email")}
                type="email"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="vendor@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input
                {...register("username")}
                type="text"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                {...register("password")}
                type="password"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                {...register("phone")}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="+1234567890"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
            <Button type="button" onClick={nextStep} className="w-full bg-primary text-white">
              Continue <ChevronRight size={18} />
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Business Name</label>
              <input
                {...register("businessName")}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${errors.businessName ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Techy Lads"
              />
              {errors.businessName && (
                <p className="text-red-500 text-sm">{errors.businessName.message}</p>
              )}
            </div>

            {/* Business Logo Upload */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Business Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="mx-auto h-24 w-24 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <p className="text-sm text-gray-600 mt-2">{logoFile?.name}</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Upload your business logo</p>
                    <p className="text-xs text-gray-500 mb-4">PNG, JPG, GIF up to 5MB</p>
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                      <Upload size={16} className="mr-2" />
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">Optional: Add your business logo to enhance your vendor profile</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Business Type</label>
              <input
                {...register("businessType")}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${errors.businessType ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Retail, Wholesale"
              />
              {errors.businessType && (
                <p className="text-red-500 text-sm">{errors.businessType.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Business Description</label>
              <textarea
                {...register("businessDescription")}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${errors.businessDescription ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Tell us about your business..."
                rows={3}
              />
              {errors.businessDescription && (
                <p className="text-red-500 text-sm">{errors.businessDescription.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Registration Number</label>
              <input
                {...register("registrationNumber")}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${errors.registrationNumber ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="123456"
              />
              {errors.registrationNumber && (
                <p className="text-red-500 text-sm">{errors.registrationNumber.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Upload Registration Document *</label>
              <div className="space-y-2">
                <Controller
                  name="registrationDocument"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${errors.registrationDocument ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                  )}
                />
                {selectedFile && (
                  <p className="text-sm text-green-600">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
              {errors.registrationDocument?.message &&
                typeof errors.registrationDocument.message === "string" && (
                  <p className="text-red-500 text-sm">{errors.registrationDocument.message}</p>
                )}
            </div>

            <div className="flex gap-3">
              <Button type="button" onClick={prevStep} variant="outline" className="w-1/2">
                <ChevronLeft size={18} /> Back
              </Button>
              <Button type="button" onClick={nextStep} className="w-1/2 bg-primary text-white">
                Continue <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Street Address</label>
              <textarea
                {...register("address")}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="123 Main St"
                rows={2}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">City</label>
              <input
                {...register("city")}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Kathmandu"
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <input
                {...register("country")}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Nepal"
              />
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Website <span className="text-gray-400">(optional)</span>
              </label>
              <input
                {...register("website")}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none ${errors.website ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="https://yourwebsite.com"
              />
              {errors.website && (
                <p className="text-red-500 text-sm">{errors.website.message}</p>
              )}
            </div>

            {/* Display selected file info on step 3 */}
            {selectedFile && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Registration Document:</strong> {selectedFile.name}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" onClick={prevStep} variant="outline" className="w-1/2">
                <ChevronLeft size={18} /> Back
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-1/2 bg-primary text-white">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
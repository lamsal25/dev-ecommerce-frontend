"use client";
import React, { useTransition, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema } from "@/formSchema/user";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "./ui/button";
import { DatePicker } from "./datepicker";
import { ColorRing } from "react-loader-spinner";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import API from "@/lib/api";

export default function RegisterUser() {
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
    control,
  } = useForm({
    resolver: zodResolver(userFormSchema),
    mode: "onChange", // This ensures validation happens on every change
    defaultValues: {
      termsAccepted: false,
    }
  });

  const termsAccepted = watch("termsAccepted");
  const allFields = watch();

  const validateStep = async (step:any) => {
    let fieldsToValidate:any = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["email", "username", "password", "confirmPassword"];
        break;
      case 2:
        fieldsToValidate = [
          "firstName",
          "lastName",
          "mobile",
          "dateOfBirth",
          "gender",
        ];
        break;
      case 3:
        fieldsToValidate = [
          "address",
          "city",
          "state",
          "country",
          "postalCode",
        ];
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
        const { termsAccepted, ...apiData } = data;
        const response = await API.post(
          `/users/register/`,
          apiData
        );
        if (response.status === 201) {
          toast.success(
            "Verification email sent. Please enter the provided otp in the link provided in the email.",
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
        }
      } catch (error:any) {
        console.log(error.response?.data);
        toast.error(
          error.response?.data?.details?.[0] || "Registration failed",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      }
    });
  };

  const formatDate = (date:any) => {
    if (!date) return "Not provided";
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

 

  return (
    <div className="bg-white shadow-xl mt-10 mb-10 rounded-2xl p-8 max-w-2xl mx-auto border border-gray-100">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Create Your Account
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
                {step === 1 && "Account"}
                {step === 2 && "Personal"}
                {step === 3 && "Address"}
                {step === 4 && "Review"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Account Information */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Account Details
            </h3>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                {...register("email")}
                placeholder="your@email.com"
                className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                {...register("username")}
                placeholder="Choose a username"
                className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Create a password"
                className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Re-enter your password"
                className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
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

        {/* Rest of the form steps remain the same */}
        
        {/* Step 2: Personal Information */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  placeholder="John"
                  className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  placeholder="Doe"
                  className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                {...register("mobile")}
                placeholder="+1 (123) 456-7890"
                className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.mobile ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <div>
                    <div
                      className={`${
                        errors.dateOfBirth
                          ? "border-red-500"
                          : "border-gray-300"
                      } border rounded-lg overflow-hidden`}
                    >
                      <DatePicker
                        value={field.value ? field.value.toISOString() : ""}
                        onChange={(dateString) => {
                          const dateObj = new Date(dateString);
                          field.onChange(dateObj);
                        }}
                      />
                    </div>
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                {...register("gender")}
                className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.gender ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
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

        {/* Step 3: Address Information */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Address Information
            </h3>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                {...register("address")}
                placeholder="123 Main St"
                className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  {...register("city")}
                  placeholder="New York"
                  className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  State/Province
                </label>
                <input
                  {...register("state")}
                  placeholder="NY"
                  className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  {...register("country")}
                  placeholder="United States"
                  className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  {...register("postalCode")}
                  placeholder="10001"
                  className={`input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.postalCode ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postalCode.message}
                  </p>
                )}
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
                type="button"
                onClick={nextStep}
                className="w-1/2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
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
              Review Your Information
            </h3>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900 border-b pb-1">
                    Account Details
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Email:</span>{" "}
                      <span className="font-medium">
                        {allFields.email || "Not provided"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Username:</span>{" "}
                      <span className="font-medium">
                        {allFields.username || "Not provided"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900 border-b pb-1">
                    Personal Information
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Name:</span>{" "}
                      <span className="font-medium">
                        {allFields.firstName || "Not"}{" "}
                        {allFields.lastName || "provided"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Mobile:</span>{" "}
                      <span className="font-medium">
                        {allFields.mobile || "Not provided"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Date of Birth:</span>{" "}
                      <span className="font-medium">
                        {formatDate(allFields.dateOfBirth)}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Gender:</span>{" "}
                      <span className="font-medium">
                        {allFields.gender || "Not provided"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-medium text-gray-900 border-b pb-1">
                  Address Information
                </h4>
                <div className="space-y-2">
                  <p>
                    <span className="text-gray-600">Address:</span>{" "}
                    <span className="font-medium">
                      {allFields.address || "Not provided"}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">City:</span>{" "}
                    <span className="font-medium">
                      {allFields.city || "Not provided"},{" "}
                      {allFields.state || ""} {allFields.postalCode || ""}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Country:</span>{" "}
                    <span className="font-medium">
                      {allFields.country || "Not provided"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <input
                {...register("termsAccepted")}
                type="checkbox"
                id="termsAccepted"
                className="mt-1 h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="termsAccepted" className="text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                . I understand that my data will be processed in accordance with
                these policies.
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm -mt-3">
                {errors.termsAccepted.message}
              </p>
            )}

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
                disabled={isSubmitting || !termsAccepted}
                className={`w-1/2 ${
                  !termsAccepted
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark"
                } text-white font-semibold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2`}
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
                    Processing...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
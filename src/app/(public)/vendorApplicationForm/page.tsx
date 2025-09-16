import React from "react";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";
import register1 from "@/assets/register1.png";
import register2 from "@/assets/register2.png";
import VendorApplicationForm from "@/components/vendorform";

export default function EnhancedVendorRegisterPage() {
  return (
    <section className="container mx-auto py-16 bg-gray-50">
      {/* Heading Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">Apply as a Vendor</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Partner with us and bring your products to a wider audience with
          <span className="text-secondary"> exclusive vendor privileges.</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 px-4 lg:px-16 items-center">
        {/* Vendor Form Side */}
        <div className="rounded-xl overflow-hidden shadow-2xl bg-white">
          <div className="bg-secondary p-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">Vendor Registration</h2>
            <div className="flex space-x-2">
              <div className="bg-white/20 p-1 rounded-full">
                <FaGoogle className="text-white" size={20} />
              </div>
            </div>
          </div>
          <VendorApplicationForm />
        </div>

        {/* Images Side with Benefits */}
        <div className="flex flex-col space-y-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Grow with <span className="text-primary">Confidence</span>
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <svg
                    className="h-5 w-5 text-secondary mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Dedicated vendor dashboard access
                </li>
                <li className="flex items-center text-gray-600">
                  <svg
                    className="h-5 w-5 text-secondary mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Marketing support for top sellers
                </li>
                <li className="flex items-center text-gray-600">
                  <svg
                    className="h-5 w-5 text-secondary mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Transparent earnings & timely payouts
                </li>
              </ul>
            </div>
            <div className="relative h-48 md:h-64">
              <Image
                src={register1}
                alt="Vendor Benefits"
                className="object-contain"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-48 md:h-64">
              <Image
                src={register2}
                alt="Secure Vendor Experience"
                className="object-contain"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Secure Vendor <span className="text-primary">Experience</span>
              </h3>
              <p className="text-gray-600">
                Vendor data is secured with best-in-class encryption. We ensure a
                seamless and trustworthy platform for your business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

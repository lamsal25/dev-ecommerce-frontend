import React from "react";
import used1 from "@/assets/login1.jpg";
import used2 from "@/assets/marketplace.jpg";
import Image from "next/image";

// import AddUsedProductForm from "@/components/add-used-product-form";
import { FaLeaf, FaLock } from "react-icons/fa";
import MarketPlaceForm from "@/components/marketplaceform";
import { getActiveCategories } from "@/app/(protected)/actions/category";

export const dynamic = 'force-dynamic'

export default async function AddUsedProductPage() {
  const response = await getActiveCategories()
  const data = response.data
  return (
    <section className="container mx-auto py-16 bg-gray-50">
      {/* Heading Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">Sell Your Pre-Loved Products</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Join a growing community of eco-conscious sellers and give your second-hand items a new home with <span className="text-secondary">TechyLads Marketplace</span>.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 px-4 lg:px-16 items-center">

        {/* Images Side with Benefits */}
        <div className="flex flex-col space-y-8">
          {/* Sustainability Benefit */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Sustainable <span className="text-primary">Choices</span>
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <FaLeaf className="text-secondary mr-2" />
                  Reduce waste by reselling quality items you no longer need
                </li>
                <li className="flex items-center text-gray-600">
                  <FaLock className="text-secondary mr-2" />
                  Safe, secure listing with trusted buyer verification
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Get paid quickly after successful sales
                </li>
              </ul>
            </div>
            <div className="relative h-48 md:h-64">
              <Image
                src={used1}
                alt="Second-hand products listing"
                className="object-contain"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Trust and Security Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-48 md:h-64">
              <Image
                src={used2}
                alt="Secure marketplace"
                className="object-contain"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Trusted <span className="text-primary">Marketplace</span>
              </h3>
              <p className="text-gray-600">
                We verify listings and buyers to keep your transactions safe and hassle-free.
              </p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="rounded-xl overflow-hidden shadow-2xl bg-white">
          <div className="bg-primary p-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">List a Product</h2>
            <div className="flex space-x-2">
              <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm font-medium">
                Used Item
              </div>
            </div>
          </div>
          {/* <AddUsedProductForm /> */}
          <MarketPlaceForm categories={data} />
        </div>
      </div>

      {/* Marketplace Trust Badges */}
      <div className="mt-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-center text-xl font-semibold text-gray-800 mb-6">
            Join sellers using trusted payment platforms
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            {["VISA", "PayPal", "Mastercard", "AmEx", "Apple Pay"].map((label, i) => (
              <div key={i} className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

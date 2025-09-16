import React from "react";
import { FcApproval, FcMoneyTransfer } from "react-icons/fc";
import { FaWarehouse } from "react-icons/fa";
 
const features = [
  {
    icon: <FcMoneyTransfer className="w-10 h-10" />,
    title: "Secure Online Payment",
    description: "Fast, secure, and convenient online payments through various trusted platforms.",
  },
  {
    icon: <FaWarehouse className="w-10 h-10 text-[#8bc34a]" />,
    title: "Fresh Stocks Weekly",
    description: "Get access to the newest stock arrivals and weekly discounts on your favorite products.",
  },
  {
    icon: <FcApproval className="w-10 h-10" />,
    title: "Quality Guaranteed",
    description: "We ensure top-notch quality and verified products that meet customer satisfaction.",
  },
];

export default function OurServicesSection() {
  return (
    <section className="py-16 bg-white px-4">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary">
          Why Shop With Us?
        </h2>
        <p className="text-gray-500 mt-2 text-base md:text-lg">
          Discover the benefits of choosing our store for all your shopping needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group rounded-2xl shadow-md p-6 transition hover:-translate-y-2 hover:shadow-xl duration-300 bg-gray-50"
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm text-center">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

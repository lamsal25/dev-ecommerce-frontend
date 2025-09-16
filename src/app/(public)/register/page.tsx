import React from "react";
import register1 from "@/assets/register1.png";
import register2 from "@/assets/register2.png";
import Image from "next/image";
import RegisterUser from "@/components/register-user";

import { FaGoogle } from "react-icons/fa";


export default function EnhancedRegisterPage() {
  return (
    <section className="container mx-auto py-16 bg-gray-50">
      {/* Heading Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">Create Your Account</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Join thousands of shoppers who've discovered the convenience of shopping with <span className="text-secondary">us.</span></p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 px-4 lg:px-16 items-center">
        {/* Registration Form Side */}
        <div className="rounded-xl overflow-hidden shadow-2xl bg-white  ">
          <div className="bg-primary p-4 flex  justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">Register Now</h2>
            <div className="flex space-x-2 ">
              <div className="bg-white/20 p-1 rounded-full">
                <FaGoogle className="text-white" size={20}/>
              </div>
             
            </div>
          </div>
          <RegisterUser />
        </div>

        {/* Images Side with Benefits */}
        <div className="flex flex-col space-y-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Exclusive Member <span className="text-primary">Benefits</span></h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 text-secondary mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fast checkout with saved shipping details
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 text-secondary mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Exclusive access to member-only deals
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 text-secondary mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Early access to sales and new products
                </li>
              </ul>
            </div>
            <div className="relative h-48 md:h-64">
              <Image
                src={register1}
                alt="Exclusive shopping benefits"
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
                alt="Shopping experience"
                className="object-contain"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Shopping <span className="text-primary">Experience</span></h3>
              <p className="text-gray-600">Your data is protected with industry-leading encryption and security protocols. Shop with confidence knowing your information is safe.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials or Trust Badges */}
      <div className="mt-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-center text-xl font-semibold text-gray-800 mb-6">Trusted by thousands of customers</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 font-semibold">VISA</span>
            </div>
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 font-semibold">PayPal</span>
            </div>
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 font-semibold">Mastercard</span>
            </div>
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 font-semibold">AmEx</span>
            </div>
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 font-semibold">Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
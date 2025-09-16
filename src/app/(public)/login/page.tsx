// pages/login.jsx (or app/login/page.jsx in the app‑dir)
import React from "react";
import LoginUser from "@/components/loginUser";
import Image from "next/image";
import register1 from "@/assets/register1.png";
import login1 from "@/assets/login1.jpg";
export const dynamic = 'force-dynamic'
export default function LoginPage() {
  return (
    <section className="container mx-auto py-12 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-12 items-center">
        {/* Left: Illustration / Benefits - Made smaller */}
        <div className="flex flex-col space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Exclusive Member <span className="text-primary">Benefits</span></h3>
              <ul className="space-y-2">
                <li className="flex items-start text-gray-600 text-sm">
                  <svg className="h-4 w-4 text-secondary mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fast checkout with saved shipping details
                </li>
                <li className="flex items-start text-gray-600 text-sm">
                  <svg className="h-4 w-4 text-secondary mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Exclusive access to member-only deals
                </li>
                <li className="flex items-start text-gray-600 text-sm">
                  <svg className="h-4 w-4 text-secondary mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Early access to sales and new products
                </li>
              </ul>
            </div>
            <div className="relative h-40 md:h-48">
              <Image
                src={register1}
                alt="Exclusive shopping benefits"
                className="object-contain"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-40 md:h-48">
              <Image
                src={login1}
                alt="Shopping experience"
                className="object-contain"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Shopping <span className="text-primary">Experience</span></h3>
              <p className="text-gray-600 text-sm">Your data is protected with industry-leading encryption and security protocols. Shop with confidence knowing your information is safe.</p>
            </div>
          </div>
        </div>

        {/* Right: Login Form - Maintained original size */}
        <div className="rounded-xl overflow-hidden shadow-2xl bg-white">
          <div className="bg-primary p-4">
            <h2 className="text-2xl font-semibold text-white text-center">
              Login to Your Account
            </h2>
          </div>
          <LoginUser />
        </div>
      </div>
    </section>
  );
}
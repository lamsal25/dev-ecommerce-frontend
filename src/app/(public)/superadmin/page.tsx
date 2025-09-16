// pages/superadmin-login.jsx (or app/superadmin-login/page.jsx in the app‑dir)
import React from "react";
import LoginSuperAdmin from "@/components/loginsuperadmin";
import Image from "next/image";
import register1 from "@/assets/register1.png";
import login1 from "@/assets/login1.jpg";

export default function SuperAdminLoginPage() {
  return (
    <section className="container mx-auto py-12 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-12 items-center">
        {/* Left: Admin Features - Made smaller */}
        <div className="flex flex-col space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Super Admin <span className="text-primary">Dashboard</span>
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start text-gray-600 text-sm">
                  <svg className="h-4 w-4 text-secondary mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Complete system administration control
                </li>
                <li className="flex items-start text-gray-600 text-sm">
                  <svg className="h-4 w-4 text-secondary mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  User management and access control
                </li>
                <li className="flex items-start text-gray-600 text-sm">
                  <svg className="h-4 w-4 text-secondary mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Advanced analytics and reporting
                </li>
              </ul>
            </div>
            <div className="relative h-40 md:h-48">
              <Image
                src={register1}
                alt="Admin dashboard features"
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
                alt="Secure admin access"
                className="object-contain"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Maximum Security <span className="text-primary">Access</span>
              </h3>
              <p className="text-gray-600 text-sm">
                Enhanced security protocols with multi-factor authentication and advanced encryption. 
                Administrative access is monitored and logged for maximum security.
              </p>
            </div>
          </div>
        </div>
        
        {/* Right: Super Admin Login Form */}
        <div className="rounded-xl overflow-hidden shadow-2xl bg-white">
          <div className="bg-primary p-4">
            <h2 className="text-2xl font-semibold text-white text-center">
              Super Admin Access
            </h2>
            <p className="text-white text-center text-sm mt-1 opacity-90">
              Authorized Personnel Only
            </p>
          </div>
          <LoginSuperAdmin />
        </div>
      </div>
    </section>
  );
}
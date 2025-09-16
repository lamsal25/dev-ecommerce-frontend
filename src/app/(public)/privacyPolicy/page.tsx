// app/privacy-policy/page.tsx
"use client";

import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-12 px-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white dark:bg-neutral-800 shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary dark:text-white mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Last updated: July 1, 2025
        </p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold mb-2">Introduction</h2>
            <p>
              Welcome to our Multi-Vendor eCommerce platform. This Privacy Policy
              explains how we collect, use, and safeguard your personal
              information when you interact with our website, vendors, and
              services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Information:</strong> Name, email address,
                password, and contact details.
              </li>
              <li>
                <strong>Order Details:</strong> Billing/shipping address,
                payment method (securely processed), and purchase history.
              </li>
              <li>
                <strong>Vendor Information:</strong> Business name, store
                details, and payment preferences for vendors.
              </li>
              <li>
                <strong>Technical Data:</strong> IP address, browser type,
                device, and cookies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">How We Use Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve our marketplace services.</li>
              <li>
                To process transactions securely and deliver your orders.
              </li>
              <li>
                To verify vendors and maintain trust across our platform.
              </li>
              <li>
                To communicate with you about updates, offers, or support.
              </li>
              <li>
                To comply with legal obligations and prevent fraudulent
                activity.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              Sharing Your Information
            </h2>
            <p>
              We do not sell your personal information. However, we may share it
              with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vendors to fulfill your orders and manage returns.</li>
              <li>Payment gateways to securely process transactions.</li>
              <li>
                Service providers (hosting, analytics, customer support).
              </li>
              <li>Authorities, when required by law or legal process.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Cookies & Tracking</h2>
            <p>
              Our website uses cookies and similar technologies to enhance your
              browsing experience, remember preferences, and analyze traffic. You
              can disable cookies in your browser settings, but some features
              may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Data Security</h2>
            <p>
              We use industry-standard encryption and security measures to
              protect your personal data. While we take reasonable steps, no
              method of online transmission is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access, update, or delete your personal data.</li>
              <li>Opt-out of promotional communications.</li>
              <li>
                Request data portability or restriction of processing where
                applicable.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> support@yourecommerce.com
            </p>
            <p>
              <strong>Address:</strong> Kathmandu, Nepal
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

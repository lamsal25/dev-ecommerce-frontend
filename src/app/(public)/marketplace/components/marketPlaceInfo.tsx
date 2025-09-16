import React from "react";
import { ShieldCheck, Gem, Zap } from "lucide-react";

export function MarketplaceInfo() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="mb-4 text-xl font-bold text-primary dark:text-white">
        About Our Marketplace
      </h3>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              Verified Quality
            </h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              All items undergo strict quality checks before listing.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gem className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              Unique Finds
            </h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Discover rare and one-of-a-kind items you won&apos;t find elsewhere.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              Fast Transactions
            </h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Secure payments and quick shipping options available.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Marketplace Stats
          </h4>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-primary">10K+</p>
              <p className="text-xs text-gray-500">Active Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">4.9★</p>
              <p className="text-xs text-gray-500">Avg. Rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">100%</p>
              <p className="text-xs text-gray-500">Verified Sellers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">24h</p>
              <p className="text-xs text-gray-500">Avg. Ship Time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
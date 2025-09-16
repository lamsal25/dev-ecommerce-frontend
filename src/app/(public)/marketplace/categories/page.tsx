import React, { Suspense } from "react";
import CategoriesGrid from "../components/categories-grid";
import { MarketplaceInfo } from "../components/marketPlaceInfo";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a skeleton component

export const dynamic = "force-dynamic";

export default function CategoriesSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 dark:bg-gray-950">
      <div className="container mx-auto px-4 md:px-12">
        {/* Section Header */}
        <div className="relative mb-16 text-center">
          <h2 className="mb-4 inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
            Discover Your Next <span className="text-secondary">Find</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
            Dive into curated categories packed with unique second‑hand
            treasures.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Grid (Left) - Wrapped in Suspense */}
          <div className="lg:w-2/3">
            <Suspense fallback={<CategoriesSkeleton />}>
              <CategoriesGrid />
            </Suspense>
          </div>

          {/* Marketplace Info Section (Right - Fixed) */}
          <div className="lg:w-1/3 lg:sticky lg:top-20 lg:h-fit">
            <MarketplaceInfo />
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-10 sm:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
      <Skeleton className="mx-auto h-12 w-48 rounded-full" />
    </div>
  );
}
import React from "react";
import Link from "next/link";
import { getActiveCategories } from "@/app/(protected)/actions/category";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export default async function CategoriesGrid() {
  const response = await getActiveCategories();
  const allCategories = response.data || [];

  // Limit to first 9 categories
  const categories = allCategories.slice(0, 9);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl border-l-8 p-2 text-primary font-semibold border-secondary">
        Categories in MarketPlace
      </h2>
      <div className="grid gap-10 sm:grid-cols-3">
        {categories.map((category: any) => (
          <Link
            key={category.id}
            href={`/marketplace/categories/productlistings/${category.id}`}
            className="group relative"
          >
            <article className="relative overflow-hidden rounded-2xl border shadow-lg">
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 h-full w-full" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 p-6">
                <h3 className="text-lg font-semibold text-primary dark:text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Hand‑picked goods, verified quality
                </p>
                <div className="mt-auto flex items-center text-primary">
                  <span className="text-sm font-medium">Shop now</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* View All */}
      <div className="mt-12 text-center">
        <Link
          href="/marketplace/allcategories"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-medium text-white shadow-lg"
        >
          View All Categories <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
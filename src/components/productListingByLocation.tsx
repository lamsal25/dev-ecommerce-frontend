import React from "react";
import ProductCard from "@/components/productCard";
import { Product } from "@/types/product";
import { ProductCardSkeleton } from "@/components/skeletons";

interface ProductListingByLocationProps {
  currentProducts: Product[];
  reviewStats: Record<string, { average: number; count: number }>;
  loading: boolean;
}

export default function ProductListingByLocation({
  currentProducts,
  reviewStats,
  loading,
}: ProductListingByLocationProps) {
  if (loading) {
    return <ProductCardSkeleton />;
  }

  return (
    <div className="grid container m-auto grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 p-4 py-10">
      {currentProducts.map((product) => {
        const stats = reviewStats[product.id] || { average: 0, count: 0 };

        return (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              rating: stats.average,
              reviews: stats.count,
            }}
          />
        );
      })}
    </div>
  );
}

import React from "react";
import ProductCard from "@/components/productCard";
import { ProductCardSkeleton } from "@/components/skeletons";

interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage?: number;
  rating?: number;
  reviews?: number;
  slug: string;
}

interface ProductListingProps {
  products: Product[];
  loading: boolean;
}

export default function ProductListing({ products, loading }: ProductListingProps) {
  if (loading) {
    return (
        <ProductCardSkeleton/>
    );
  }

  if (!products.length) {
    return <div className="text-center py-10 text-2xl">No products available.</div>;
  }

  return (
    <div className="grid py-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 w-full">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            ...product,
            rating: product.rating ?? 0,
            reviews: product.reviews ?? 0,
            discountPercentage: product.discountPercentage ?? 0,
          }}
        />
      ))}
    </div>
  );
}

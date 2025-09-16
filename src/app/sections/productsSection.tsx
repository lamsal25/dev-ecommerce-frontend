"use client";

import React, { useEffect, useState, Suspense } from "react";
import ProductTitleBar from "@/components/productTitleBar";
import { getActiveProducts } from "../(protected)/actions/product";
import { getBatchProductReviewStats } from "../(protected)/actions/review";
import { useRouter } from "next/navigation";
import ProductListing from "@/components/productListing";
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

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProductsAndReviews = async () => {
    try {
      setLoading(true);

      const response = await getActiveProducts();
      const prods: Product[] = response.data;

      const productIds = prods.map((product) => Number(product.id));
      const statsRes = await getBatchProductReviewStats(productIds);

      const productsWithStats = prods.map((p) => {
        const stats = statsRes.data?.[p.id] || { avg_rating: 0, total_reviews: 0 };
        return {
          ...p,
          rating: stats.avg_rating || 0,
          reviews: stats.total_reviews || 0,
        };
      });

      setProducts(productsWithStats);
    } catch (err) {
      console.error("Error fetching products or review stats:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndReviews();
  }, []);

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        {error}
        <button
          onClick={fetchProductsAndReviews}
          className="ml-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 container m-auto w-full px-4 sm:px-6">
      <div className="mx-auto">
        <ProductTitleBar
          badgeLabel="Hot Deals"
          highlight="Best Selling"
          title="Products"
          buttonLabel="View All"
          onButtonClick={() => router.push("/viewAllProduct")}
        />

        <Suspense fallback={<ProductCardSkeleton />}>
          <ProductListing products={products} loading={loading} />
        </Suspense>
      </div>
    </div>
  );
}

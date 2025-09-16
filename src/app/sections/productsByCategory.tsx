"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/productCard";
import ProductTitleBar from "@/components/productTitleBar";
import { getProductsByCategory } from "@/app/(protected)/actions/product";
import { getBatchProductReviewStats } from "@/app/(protected)/actions/review";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  rating?: number;
  reviews?: number;
  slug: string;
}

interface ReviewStats {
  average: number;
  count: number;
}

interface Props {
  id: number; // category id
}

export default function ProductsByCategory({ id}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviewStats, setReviewStats] = useState<Record<string, ReviewStats>>({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProductsAndStats = async () => {
      try {
        const res = await getProductsByCategory(id);
        console.log("Fetched categories:",res);
        const productList: Product[] = res || [];
        setProducts(productList);

        const productIds = productList.map((product) => Number(product.id));
        const statsRes = await getBatchProductReviewStats(productIds);

        const statsDict: Record<string, ReviewStats> = {};
        if (!statsRes.error && statsRes.data) {
          for (const [productId, stats] of Object.entries(statsRes.data)) {
            statsDict[productId] = {
              average: stats.avg_rating || 0,
              count: stats.total_reviews || 0,
            };
          }
        }

        setReviewStats(statsDict);
      } catch (error) {
        console.error("Error fetching products or review stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndStats();
  }, [id]);

  const viewProductsByCategory = () => {
    router.push(`/productsByCategory?categoryId=${id}`);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading products...
      </div>
    );
  }

  return (
    <div className="py-8 container m-auto w-full px-4 sm:px-6">
      <div className="mx-auto">
        <ProductTitleBar
          badgeLabel="Category"
          highlight="Explore"
          title=" Products"
          buttonLabel="View More"
          onButtonClick={viewProductsByCategory}
        />

        <div className="grid py-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 w-full">
          {products.map((product) => {
            const stats = reviewStats[product.id] || {
              average: product.rating ?? 0,
              count: product.reviews ?? 0,
            };

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
      </div>
    </div>
  );
}

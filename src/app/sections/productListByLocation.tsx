"use client";

import React, { useEffect, useState, Suspense } from "react";
import ProductTitleBar from "@/components/productTitleBar";
import { getProductsByLocation } from "../(protected)/actions/product";
import { getBatchProductReviewStats } from "../(protected)/actions/review";
import { useRouter } from "next/navigation";
import ProductListingByLocation from "@/components/productListingByLocation";
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

interface ReviewStats {
  average: number;
  count: number;
}

interface Props {
  location: string;
}

export default function ProductListByLocationPage({ location }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviewStats, setReviewStats] = useState<Record<string, ReviewStats>>({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchProductsAndStats = async () => {
    try {
      setLoading(true);

      const res = await getProductsByLocation(location);
      const productList: Product[] = res.data || [];
      setProducts(productList);

      const productIds = productList.map((product) => Number(product.id));
      const statsRes = await getBatchProductReviewStats(productIds);

      const statsDict: Record<string, ReviewStats> = {};
      if (!statsRes.error && statsRes.data) {
        for (const [id, stats] of Object.entries(statsRes.data)) {
          statsDict[id] = {
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

  useEffect(() => {
    fetchProductsAndStats();
  }, [location]);

  const viewProductsByLocation = (loc: string) => {
    router.push(`/productsByLocation?location=${loc}`);
  };

  return (
    <div className="py-8 container m-auto w-full px-4 sm:px-6">
      <div className="mx-auto">
        <ProductTitleBar
          badgeLabel={location}
          highlight="Top Picks in"
          title={` ${location}`}
          buttonLabel="View More"
          onButtonClick={() => viewProductsByLocation(location)}
        />

        <Suspense fallback={<ProductCardSkeleton />}>
          <ProductListingByLocation
            currentProducts={products}
            reviewStats={reviewStats}
            loading={loading}
          />
        </Suspense>
      </div>
    </div>
  );
}

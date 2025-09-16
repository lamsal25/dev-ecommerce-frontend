'use client';

import { useState } from 'react';
import MarketProductCard from '@/components/marketplaceproductcard';
import { CustomPagination } from "@/components/customPagination";
import { useSearchParams, useRouter } from 'next/navigation';

interface ProductListingProps {
  products: {
    id: string;
    name: string;
    image: string;
    originalPrice: number;
    discountedPrice: number;
    rating?: number;
    reviews?: number;
    slug: string;
  }[];
  initialSort: string;
  currentPage: number;
}

const PRODUCTS_PER_PAGE = 12;

export default function ProductListing({ 
  products, 
  initialSort, 
  currentPage 
}: ProductListingProps) {
  const [sortOption, setSortOption] = useState(initialSort);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (option: string) => {
    setSortOption(option);
    const params = new URLSearchParams(searchParams);
    params.set('sort', option);
    router.push(`?${params.toString()}`);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.discountedPrice - b.discountedPrice;
      case 'price-high':
        return b.discountedPrice - a.discountedPrice;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIdx = startIdx + PRODUCTS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIdx, endIdx);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (!currentProducts.length) {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2 text-primary">No products found</h3>
        <p className="text-gray-500">There are no products available in this category.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-500">
          Showing {sortedProducts.length} products
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
            className="text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {currentProducts.map((product) => (
          <MarketProductCard
            key={product.id}
            product={{
              ...product,
              rating: product.rating ?? 4,
              reviews: product.reviews ?? 12,
            }}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-8"
        />
      )}
    </>
  );
}
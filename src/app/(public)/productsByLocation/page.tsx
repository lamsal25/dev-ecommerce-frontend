'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { getProductsByLocation } from '@/app/(protected)/actions/product';
import { getBatchProductReviewStats } from '@/app/(protected)/actions/review';
import { useSearchParams } from 'next/navigation';
import { CustomPagination } from '@/components/customPagination';
import { Product } from '@/types/product';
import dynamic from 'next/dynamic';
import SidebarFilters from '@/components/sidebarFilters';
import ProductTitleBar from '@/components/productTitleBar';
import ContactSection from '@/app/sections/contactSection';
import { ProductCardSkeleton } from '@/components/skeletons';
import Link from 'next/link';

// Lazy load the product grid
const ProductGrid = dynamic(() => import('./productGrid'), {
  ssr: false,
  loading: () => <ProductCardSkeleton />,
});

export default function ProductsByLocation() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const productsPerPage = 12;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); 

  const searchParams = useSearchParams();
  const location = searchParams.get('location') || 'makalbari';

  // Enhanced product normalization with better type safety and defaults
  const normalizeProduct = (product: any): Product => ({
    id: String(product.id),
    name: product.name,
    description: product.description ?? '',
    image: product.image ?? '/placeholder.png',
    topImage: product.topImage ?? null,
    bottomImage: product.bottomImage ?? null,
    leftImage: product.leftImage ?? null,
    rightImage: product.rightImage ?? null,
    originalPrice: parseFloat(product.originalPrice),
    discountedPrice: parseFloat(product.discountedPrice),
    discountPercentage: product.discountPercentage 
      ? parseFloat(product.discountPercentage) 
      : 0,
    totalStock: product.totalStock ?? 0,
    has_sizes: product.has_sizes ?? false,
    isFeatured: product.isFeatured ?? false,
    rating: product.rating ?? 0,
    reviews: product.reviews ?? 0,
    category: product.category ?? {
      id: 0,
      name: 'Uncategorized',
      slug: '',
      image: '',
    },
    sizes: product.sizes ?? [],
    slug: product.slug,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products by location
      const response = await getProductsByLocation(location);
      let formattedProducts: Product[] = response.data.map(normalizeProduct);

      // Fetch review stats for better product information
      const productIds = formattedProducts.map((p) => Number(p.id));
      const statsRes = await getBatchProductReviewStats(productIds);

      // Merge stats into products
      formattedProducts = formattedProducts.map((p) => {
        const stats = statsRes.data?.[p.id] || {
          avg_rating: 0,
          total_reviews: 0,
        };
        return {
          ...p,
          rating: stats.avg_rating || 0,
          reviews: stats.total_reviews || 0,
        };
      });

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);

      // Update price range based on actual product prices
      if (formattedProducts.length > 0) {
        const max = Math.max(...formattedProducts.map(product => product.originalPrice));
        const roundedMax = Math.ceil(max / 100) * 100;
        setMaxPrice(roundedMax);
        setPriceRange([0, roundedMax]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [location]); // Added location dependency

  const applyFilters = React.useCallback(() => {
    let result = [...products];

    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.originalPrice - b.originalPrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.originalPrice - a.originalPrice);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
      default:
        // Keep original order or sort by featured status
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    // Apply price filter
    result = result.filter(product =>
      product.originalPrice >= priceRange[0] &&
      product.originalPrice <= priceRange[1]
    );

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, sortOption, priceRange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format location name for display
  const formatLocationName = (location: string) => {
    return location
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (error) {
    return (
      <div className="py-8 container mx-auto text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-md mx-auto">
          {error}
          <button
            onClick={fetchProducts}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="py-8 container mx-auto text-center">
        <div className="bg-gray-50 p-8 rounded-lg max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t find any products in {formatLocationName(location)} at the moment.
          </p>
          <Link href="/" className="text-primary hover:underline font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <SidebarFilters maxPrice={maxPrice} setPriceRange={setPriceRange} />

          {/* Main content */}
          <div className="flex-1">
            {/* Enhanced Header */}
            <div className="mb-8">
              <ProductTitleBar
                badgeLabel={`${formatLocationName(location)} Products`}
                highlight="Local Collection"
                title={`Products in ${formatLocationName(location)}`}
              />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
                <p className="text-sm text-gray-500">
                  Showing {filteredProducts.length} products in {formatLocationName(location)}
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex border rounded overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-2 text-sm transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-2 text-sm transition-colors ${
                        viewMode === 'list'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      List
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                  >
                    <option value="featured">Sort by: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <Suspense fallback={<ProductCardSkeleton />}>
              <ProductGrid
                currentProducts={currentProducts}
                loading={loading}
                viewMode={viewMode}   
              />
            </Suspense>

            {/* Pagination */}
            {totalPages > 1 && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            )}

            {/* Contact Section */}
            <ContactSection />
          </div>
        </div>
      </div>
    </div>
  );
}
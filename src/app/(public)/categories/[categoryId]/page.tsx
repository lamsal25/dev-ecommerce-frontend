'use client';

import { useEffect, useState } from 'react';
import { getProductsByCategory } from '@/app/(protected)/actions/product';
import ProductCard from '@/components/productCard';
import CategorySidebar from './components/categorySidebar';
import { notFound, useParams } from 'next/navigation';
import { CustomPagination } from '@/components/customPagination';
import { Skeleton } from '@/components/ui/skeleton';
import { List, Grid, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { CreateWishlistItem } from '@/app/(protected)/actions/wishlist';
import API from '@/lib/api';

interface Product {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  rating?: number;
  reviews?: number;
  slug: string;
  description?: string;
  discountPercentage?: number;
}

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // 👈 added
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const productsPerPage = 12;

  const id = Array.isArray(params.categoryId)
    ? params.categoryId[0]?.split("-").pop()
    : params.categoryId?.split("-").pop();

  const categoryId = Number(id);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const fetchedProducts = await getProductsByCategory(categoryId);

        if (!fetchedProducts) {
          notFound();
          return;
        }

        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const handleSort = (option: string) => {
    setSortOption(option);
    let sortedProducts = [...filteredProducts];

    switch (option) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // 'featured'
        sortedProducts = [...products];
    }

    setFilteredProducts(sortedProducts);
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add to Cart
  const addToCart = async (productID: number) => {
    try {
      const response = await API.post(
        `cart/`,
        { productID, product_type: "product", quantity: 1 },
        { withCredentials: true }
      );
      if (response.data.message === "Item Exits") {
        toast.error("This item is already in your cart.");
      } else {
        toast.success("Item added to cart Successfully");
      }
    } catch {
      toast.error("Failed to add to cart.");
    }
  };

  // Add to Wishlist
  const handleAddToWishlist = async (product: Product) => {
    try {
      const res = await CreateWishlistItem(Number(product.id));
      if (res.status === 200 || res.error === "Item already in wishlist") {
        toast.info("This item is already in your wishlist.");
      } else if (res.status === 201) {
        toast.success("Item added to wishlist successfully!");
      } else {
        toast.error("Please login to add to wishlist");
      }
    } catch {
      toast.error("Failed to add to wishlist.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* same skeleton as before */}
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/5">
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
            <div className="lg:w-4/5">
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-48" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!filteredProducts.length) {
    return (
      <div className="min-h-[400px] bg-gray-50">
        <div className="flex px-8 gap-x-8 items-center">
          <div className="lg:w-1/5">
            <CategorySidebar currentCategoryId={categoryId} />
          </div>
          <main className="container mx-auto px-4 text-center">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2 text-primary">
                No products found
              </h3>
              <p className="text-gray-500">
                There are no products available in this category.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/5">
            <CategorySidebar currentCategoryId={categoryId} />
          </div>

          {/* Products */}
          <div className="lg:w-4/5">
            {/* Header */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-gray-500">
                Showing {filteredProducts.length} products
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sortOption}
                  onChange={(e) => handleSort(e.target.value)}
                  className="text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="featured">Sort by: Standard</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>

                {/* Toggle buttons */}
                <div className="flex border border-gray-200 rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-gray-100 text-primary" : "text-gray-500"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-gray-100 text-primary" : "text-gray-500"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Listing */}
            {viewMode === "list" ? (
              <div className="space-y-4">
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-6 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    {/* Image */}
                    <Link href={`/productDetail/${product.slug}-${product.id}`}>
                      <Image
                        src={product.image ?? '/placeholder.png'}
                        alt={product.name}
                        width={256}
                        height={256}
                        className="w-64 h-64 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 content-center">
                      <h3 className="font-semibold text-lg">{product.name}</h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < (product.rating ?? 4)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          ({product.reviews ?? 12} reviews)
                        </span>
                      </div>

                      {/* Description */}
                      {product.description && (
                        <p
                          className="text-gray-600 text-sm mt-2 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html:
                              product.description.length > 150
                                ? product.description.substring(0, 150) + "..."
                                : product.description,
                          }}
                        />
                      )}

                      {/* Price */}
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-lg font-semibold text-primary">
                          ${Number(product.discountedPrice).toFixed(2)}
                        </span>
                        {product.originalPrice > product.discountedPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${Number(product.originalPrice).toFixed(2)}
                          </span>
                        )}
                        {product.discountPercentage && (
                          <span className="text-sm font-semibold text-red-600">
                            {product.discountPercentage}% Off
                          </span>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => addToCart(product.id)}
                          className="px-4 py-2 bg-primary text-white text-sm rounded-lg shadow hover:bg-primary/90 transition"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleAddToWishlist(product)}
                          className="px-4 py-2 border bg-secondary text-white text-sm rounded-lg hover:bg-secondary/80 transition"
                        >
                          Add to Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      id: String(product.id),
                      rating: product.rating ?? 4,
                      reviews: product.reviews ?? 12,
                    }}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

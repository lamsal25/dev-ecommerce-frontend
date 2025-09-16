"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "@/lib/api";
import { GetUserWishlist } from "@/app/(protected)/actions/wishlist";
import { getProductById } from "@/app/(protected)/actions/product";
import { getBatchProductReviewStats } from "@/app/(protected)/actions/review";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Loader2,
  Share2,
  Eye,
  Tag,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { Rating } from "@/components/ui/rating";
import { BenefitsOfChoosingUs } from "@/components/benefitsOfChoosingUS";
import { ProductCardSkeleton } from "@/components/skeletons";
import { Product, ProductSize } from "@/types/product";

type WishlistItem = {
  id: number;
  product_id: number;
  product_name: string;
  original_price: string;
  discounted_price?: string | null;
  added_at: string;
  product_image?: string | null;
  product_rating?: number | null;
  product_reviews?: number | null;
  stock_status?: "in_stock" | "out_of_stock" | "low_stock";
  product_slug?: string;
  product_category?: string;
  product_brand?: string;
};

export const dynamic = 'force-dynamic'

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<string>("recent");
  const [ratingStats, setRatingStats] = useState<
    Record<number, { average: number; count: number }>
  >({});

  // Size selection modal state
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedWishlistItemId, setSelectedWishlistItemId] = useState<
    number | null
  >(null);

  const loadWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await GetUserWishlist();
      if (res.error) {
        setError(res.error);
      } else if (res.data) {
        setWishlist(res.data);

        // Fetch fresh rating stats for all products in wishlist
        const productIds = res.data.map(
          (item: WishlistItem) => item.product_id
        );
        if (productIds.length > 0) {
          const statsRes = await getBatchProductReviewStats(productIds);
          if (!statsRes.error && statsRes.data) {
            const statsMap: Record<number, { average: number; count: number }> =
              {};
            Object.entries(statsRes.data).forEach(([productId, stats]) => {
              statsMap[Number(productId)] = {
                average: (stats as any)?.avg_rating || 0,
                count: (stats as any)?.total_reviews || 0,
              };
            });
            setRatingStats(statsMap);
          }
        }
      }
    } catch (err) {
      setError("Failed to load wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  // Helper function to check if product has sizes
  const productHasSizes = (product: Product): boolean => {
    if (product.has_sizes !== undefined) {
      return product.has_sizes;
    }
    return product.sizes && product.sizes.length > 0;
  };

  const handleAddToCartClick = async (
    productId: string,
    wishlistItemId: number
  ) => {
    try {
      // Fetch full product details to check if it has sizes
      const productRes = await getProductById(Number(productId));
      if (productRes.error || !productRes.data) {
        toast.error("Failed to load product details.", {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      const product = productRes.data;

      // If product has sizes, show size selection modal
      if (productHasSizes(product)) {
        setSelectedProduct(product);
        setSelectedWishlistItemId(wishlistItemId);
        setSizeModalOpen(true);
        return;
      }

      // If no sizes, add directly to cart
      await addToCart(productId, wishlistItemId);
    } catch (error) {
      console.error("Error checking product details:", error);
      toast.error("Failed to add item to cart.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const addToCart = async (
    productId: string,
    wishlistItemId: number,
    size?: string
  ) => {
    setAddingToCart(wishlistItemId);
    try {
      const cartData: any = {
        productID: productId,
        quantity: 1,
      };

      // Include size if provided
      if (size) {
        cartData.size = size;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/`,
        cartData,
        {
          withCredentials: true,
        }
      );

      const message = response.data.message;
      if (message === "Item Exits") {
        const sizeText = size ? ` (Size: ${size})` : "";
        toast.error(`This item${sizeText} is already in your cart.`, {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        const sizeText = size ? ` (Size: ${size})` : "";
        toast.success(`Item${sizeText} added to cart successfully!`, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart.", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setAddingToCart(null);
    }
  };

  const handleSizeModalConfirm = async () => {
    if (!selectedSize || !selectedProduct || !selectedWishlistItemId) {
      toast.error("Please select a size.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // Check if selected size is in stock
    const selectedSizeObj = selectedProduct.sizes?.find(
      (s: ProductSize) => s.size === selectedSize
    );

    if (!selectedSizeObj || selectedSizeObj.stock === 0) {
      toast.error("Selected size is out of stock.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    await addToCart(
      String(selectedProduct.id),
      selectedWishlistItemId,
      selectedSize
    );

    // Close modal and reset state
    setSizeModalOpen(false);
    setSelectedProduct(null);
    setSelectedSize(null);
    setSelectedWishlistItemId(null);
  };

  const handleDeleteFromWishlist = async (wishlistItemId: number) => {
    const confirmed = confirm(
      "Are you sure you want to remove this item from wishlist?"
    );
    if (!confirmed) return;

    try {
      const res = await API.delete(`wishlist/remove/${wishlistItemId}/`);
      const data = res.data;

      if (data.error) {
        toast.error(data.error, {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        toast.success(data.msg || "Removed from wishlist!", {
          position: "top-center",
          autoClose: 2000,
        });
        loadWishlist();
      }
    } catch (error) {
      toast.error("Failed to remove from wishlist.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleShareProduct = (product: WishlistItem) => {
    const shareData = {
      title: product.product_name,
      text: `Check out ${product.product_name} on our store!`,
      url: `${window.location.origin}/productDetail/${product.product_slug || product.product_id
        }`,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success("Link copied to clipboard!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const sortedWishlist = () => {
    const sorted = [...wishlist];

    switch (sortOption) {
      case "recent":
        sorted.sort(
          (a, b) =>
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
        );
        break;
      case "price_high":
        sorted.sort((a, b) => {
          const priceA = parseFloat(a.discounted_price || a.original_price);
          const priceB = parseFloat(b.discounted_price || b.original_price);
          return priceB - priceA;
        });
        break;
      case "price_low":
        sorted.sort((a, b) => {
          const priceA = parseFloat(a.discounted_price || a.original_price);
          const priceB = parseFloat(b.discounted_price || b.original_price);
          return priceA - priceB;
        });
        break;
      case "rating":
        sorted.sort((a, b) => {
          const ratingA = ratingStats[a.product_id]?.average || 0;
          const ratingB = ratingStats[b.product_id]?.average || 0;
          return ratingB - ratingA;
        });
        break;
    }

    return sorted;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
            Your Wishlist
          </h1>
          <p className="text-gray-500">Loading your saved items...</p>
        </div>
        <ProductCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-600 bg-red-50 px-6 py-4 rounded-lg max-w-md mx-auto mb-4">
            {error}
          </p>
          <Button onClick={loadWishlist} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const filteredWishlist = sortedWishlist();

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
            Your Wishlist
          </h1>
          <p className="text-gray-500">
            {wishlist.length === 0
              ? "Start saving your favorite items"
              : `You have ${wishlist.length} item${wishlist.length !== 1 ? "s" : ""
              } saved`}
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="capitalize">
                    {sortOption.replace("_", " ")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortOption("recent")}>
                    Recently Added
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("price_high")}>
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("price_low")}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("rating")}>
                    Highest Rating
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {filteredWishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl">
            <Heart className="h-16 w-16 text-gray-300 mb-4" strokeWidth={1} />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-400 max-w-md text-center mb-6">
              Save products you love by clicking the heart icon while shopping
            </p>
            <Link href="/viewAllProducts">
              <Button variant="default">
                <Tag className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWishlist.map((product) => {
              const original = parseFloat(product.original_price);
              const discounted = product.discounted_price
                ? parseFloat(product.discounted_price)
                : null;
              const finalPrice = discounted ?? original;
              const discountPercentage = discounted
                ? Math.round(((original - discounted) / original) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                    <button
                      className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                      onClick={() => handleDeleteFromWishlist(product.id)}
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 bg-white rounded-full shadow-sm hover:bg-blue-50 hover:text-blue-500 transition-colors"
                      onClick={() => handleShareProduct(product)}
                      aria-label="Share product"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>

                  <Link
                    href={`/productDetail/${product.product_slug || product.product_id
                      }`}
                    className="block"
                  >
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {product.product_image ? (
                        <img
                          src={product.product_image}
                          alt={product.product_name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-image"
                          >
                            <rect
                              width="18"
                              height="18"
                              x="3"
                              y="3"
                              rx="2"
                              ry="2"
                            />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="mb-2">
                      {product.product_brand && (
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          {product.product_brand}
                        </p>
                      )}
                      <Link
                        href={`/productDetail/${product.product_slug || product.product_id
                          }`}
                      >
                        <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-primary transition-colors">
                          {product.product_name}
                        </h3>
                      </Link>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <=
                              Math.round(
                                ratingStats[product.product_id]?.average || 0
                              )
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {(
                          ratingStats[product.product_id]?.average || 0
                        ).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({ratingStats[product.product_id]?.count || 0}{" "}
                        {(ratingStats[product.product_id]?.count || 0) === 1
                          ? "review"
                          : "reviews"}
                        )
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        Rs. {finalPrice.toFixed(2)}
                      </span>
                      {discounted && (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            Rs. {original.toFixed(2)}
                          </span>
                          <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                            -{discountPercentage}%
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/productDetail/${product.product_slug || product.product_id
                          }`}
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button
                        onClick={() =>
                          handleAddToCartClick(
                            String(product.product_id),
                            product.id
                          )
                        }
                        disabled={
                          addingToCart === product.id ||
                          product.stock_status === "out_of_stock"
                        }
                        size="sm"
                        className="flex-1"
                      >
                        {addingToCart === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <BenefitsOfChoosingUs />
      </div>

      {/* Size Selection Modal */}
      <Dialog open={sizeModalOpen} onOpenChange={setSizeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Size</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Eye className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Choose a size to add to cart
                  </p>
                </div>
              </div>

              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3">Available Sizes:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.sizes.map(
                      (sizeObj: ProductSize, index: number) => {
                        const isSelected = selectedSize === sizeObj.size;
                        const isOutOfStock = sizeObj.stock === 0;

                        return (
                          <button
                            key={index}
                            disabled={isOutOfStock}
                            onClick={() => setSelectedSize(sizeObj.size)}
                            className={`w-full h-16 rounded-md text-sm font-medium flex flex-col items-center justify-center transition-colors border-2
                            ${isSelected
                                ? "bg-orange-500 text-white border-orange-500"
                                : "border-gray-200 hover:border-orange-300 hover:text-orange-500 bg-white"
                              }
                            ${isOutOfStock
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                              }
                          `}
                          >
                            <span className="text-sm">{sizeObj.size}</span>
                            <small className="text-xs mt-1">
                              {isOutOfStock ? "Out" : sizeObj.stock}
                            </small>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSizeModalOpen(false);
                    setSelectedProduct(null);
                    setSelectedSize(null);
                    setSelectedWishlistItemId(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSizeModalConfirm}
                  disabled={!selectedSize}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

import React from 'react';
import Image from 'next/image';
import ProductCard from '@/components/productCard';
import { Product } from '@/types/product';
import { ProductCardSkeleton } from '@/components/skeletons';
import { Star } from "lucide-react";
import Link from 'next/link';
import { toast } from "react-toastify";
import { CreateWishlistItem } from "@/app/(protected)/actions/wishlist";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

interface ProductListingProps {
  currentProducts: Product[];
  loading: boolean;
  viewMode: "grid" | "list";
}

export default function ProductListing({ currentProducts, loading, viewMode }: ProductListingProps) {
  
  // Add to Cart function - similar to ProductCard
  const addToCart = async (productID: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/`,
        {
          productID,
          product_type: "product",
          quantity: 1,
        },
        {
          withCredentials: true,
        }
      );
      const message = response.data.message;
      if (message === "Item Exits") {
        toast.error("This item is already in your cart.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } else {
        toast.success("Item added to cart Successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.", {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
      });
    }
  };

  // Add to Wishlist function - similar to ProductCard
  const handleAddToWishlist = async (product: Product) => {
    try {
      const res = await CreateWishlistItem(Number(product.id));
      
      // Add logging to debug the response
      console.log('Wishlist response:', res);
      
      // Check different possible response structures
      if (res.status === 200 || res.error === "Item already in wishlist" || res.msg === "Item already exists") {
        toast.info("This item is already in your wishlist.", {
          position: "top-center",
          autoClose: 1000,
          theme: "light",
        });
      } else if (res.status === 200 || res.status === 201) {
        toast.success(res.msg || "Item added to wishlist successfully!", {
          position: "top-center",
          autoClose: 1000,
          theme: "light",
        });
      } else {
        // Handle unexpected response
        toast.error("Please login to add to wishlist", {
          position: "top-center",
          autoClose: 2000,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist. Please try again.", {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
      });
    }
  };

  // Add to Cart handler for list view
  const handleAddToCart = (product: Product) => {
    addToCart(product.id);
  };

  if (loading) {
    return <ProductCardSkeleton />;
  }

  //  List View
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="flex gap-6 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
          >
            {/* Product Image */}
            <Link href={`/productDetail/${product.slug}-${product.id}`}>
              <Image
                src={product.image ?? '/placeholder.png'}
                alt={product.name}
                width={256}
                height={256}
                className="w-64 h-64 object-cover hover:cursor-pointer rounded-lg"
              />
            </Link>

            {/* Product Info */}
            <div className="flex-1 content-center">
              <h3 className="font-semibold text-lg">{product.name}</h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < (product.rating ?? 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  ({product.reviews ?? 0} reviews)
                </span>
              </div>

              {/* Short Description */}
              <p
                className="text-gray-600 text-sm mt-2 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html:
                    product.description?.length > 150
                      ? product.description.substring(0, 150) + "..."
                      : product.description,
                }}
              ></p>

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

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="px-4 py-2 bg-primary hover:cursor-pointer text-white text-sm rounded-lg shadow hover:bg-primary/90 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddToWishlist(product)}
                  className="px-4 py-2 border bg-secondary hover:cursor-pointer text-white border-gray-300 text-sm rounded-lg hover:bg-secondary/80 transition"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 👉 Grid View
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 p-4">
      {currentProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            ...product,
            image: product.image ?? "/placeholder.png",
            discountPercentage: product.discountPercentage ?? 0,
          }}
        />
      ))}
    </div>
  );
}
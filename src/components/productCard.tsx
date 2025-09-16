import React from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { CreateWishlistItem } from "@/app/(protected)/actions/wishlist";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import API from "@/lib/api";
import axios from "axios";
import { useRouter } from "next/navigation";
type Product = {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  slug: string;
  rating?: number; // included here
  reviews?: number; // included here
  has_sizes: boolean;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  // const { rating, reviews } = product;
  const router = useRouter();

  const rating = product.rating ?? 0;
  const reviews = product.reviews ?? 0;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  const addToCart = async (productID: string) => {
  try {
    if (product.has_sizes) {
      router.push(`/productDetail/${product.slug}-${product.id}`);
      return;
    }

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
        theme: "light",
      });
    } else {
      toast.success("Item added to cart Successfully", {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
      });
    }
  } catch (error: any) {
    const backendError = error?.response?.data?.error;

    if (backendError) {
      toast.error(backendError, {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
      });
    } else {
      console.error("Unexpected error adding to cart:", error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
      });
    }
  }
};


  //add to wishlist
  const handleAddToWishlist = async () => {
    try {
      const res = await CreateWishlistItem(Number(product.id));

      // Add logging to debug the response
      console.log('Wishlist response:', res);

      // Check different possible response structures
      if (res.status === 200 || res.error === "Item already in wishlist" || res.msg === "Item already exists") {
        toast.info("This item is already in your wishlist.", {
          position: "top-center",
          autoClose: 2000,
          theme: "light",
        });
      } else if (res.status === 200 || res.status === 201) {
        toast.success(res.msg || "Item added to wishlist successfully!", {
          position: "top-center",
          autoClose: 2000,
          theme: "light",
        });
      } else {
        // Handle unexpected response
        toast.error("Something went wrong. Please try again.", {
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

  const getValidImageSrc = (url: string): string => {
    try {
      new URL(url);
      return url;
    } catch {
      return "/placeholder.jpg";
    }
  };

  const imageSrc = getValidImageSrc(product.image);

  const finalPrice =
    product.discountPercentage > 0
      ? Number(product.discountedPrice).toFixed(2)
      : Number(product.originalPrice);
  return (
    <div className="relative w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
      {" "}
      {/* Image */}
      <div className="relative w-full aspect-square">
        <Link href={`/productDetail/${product.slug}-${product.id}`}>
          <Image
            src={imageSrc}
            alt={product.name || "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm h-9 w-9"
            onClick={handleAddToWishlist}
          >
            <Heart size={18} className="text-gray-700" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm h-9 w-9"
            onClick={() => addToCart(product.id)}
          >
            <ShoppingCart size={18} className="text-gray-700" />
          </Button>

          {/* Dialog Trigger */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm h-9 w-9"
              >
                <Eye size={18} className="text-gray-700" />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-4xl rounded-lg p-0 overflow-hidden ">
              <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[400px]">
                {/* Image Side */}
                <div className="relative h-64 md:h-auto">
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details Side */}
                <div className="flex flex-col p-6">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Available now — ships within 24 hours
                    </p>
                  </DialogHeader>

                  <div className="space-y-4 flex-1">
                    {/* Price */}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${finalPrice}
                      </span>
                      {product.discountPercentage > 0 && (
                        <>
                          <span className="line-through text-gray-400 text-sm">
                            ${product.originalPrice}
                          </span>
                          <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                            Save {product.discountPercentage}%
                          </span>
                        </>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      {renderStars(rating)}
                      <span className="text-sm text-gray-500">
                        ({product.reviews} reviews)
                      </span>
                    </div>

                    {/* Features (optional list) */}
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>✅ 30-day return policy</li>
                      <li>✅ Free shipping over $50</li>
                      <li>✅ Trusted by 1,500+ customers</li>
                    </ul>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="pt-6 border-t border-gray-200 mt-4 flex gap-x-4">
                    <Button
                      className="flex-1 sm:text-xs md:text-base md:font-semibold  py-4 bg-secondary hover:bg-secondary/80 text-white"
                      onClick={() => addToCart(product.id)}
                    >
                      Add to Cart
                    </Button>

                    <Link href={`/productDetail/${product.slug}-${product.id}`}>
                      <Button className="flex-1  py-4 sm:text-xs md:text-base md:font-semibold bg-primary hover:bg-primary/80 text-white ">
                        View More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <h2 className="font-medium text-gray-900 dark:text-white line-clamp-1">
          {product.name}
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${finalPrice}
          </span>
          {product.discountPercentage > 0 && (
            <span className="line-through text-sm text-gray-400">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-2">
          {renderStars(rating)}
          <span className="ml-1 text-xs text-gray-500">
            ({reviews})
          </span>
        </div>
      </div>
    </div>
  );
}

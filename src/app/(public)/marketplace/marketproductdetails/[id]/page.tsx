"use client";
import { useEffect, useState, useCallback } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ChevronRight,
  Check,
  Star,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/lib/api";
import Carousel from "@/components/ui/carousel";
import ProductsSection from "@/app/sections/productsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import axios from "axios";

export default function ProductDetail() {
  const param = useParams();

  //- If param.id is an array (string[]), take the first element (param.id[0]) and split it.
  // - If param.id is a string, apply .split("-").pop() directly.
  // - The optional chaining (?.) ensures safety in case param.id is undefined.

  const id = Array.isArray(param.id)
    ? param.id[0]?.split("-").pop()
    : param.id?.split("-").pop();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageSlides, setImageSlides] = useState<
    { src: string; alt: string }[]
  >([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return notFound();

        const res = await API.get(`/products/getMarketplaceProductById/${id}`);
        const data = res.data.data;

        setProduct(data);

        const orderedImages = [
          data.image,
          data.topImage,
          data.bottomImage,
          data.leftImage,
          data.rightImage,
        ].filter(Boolean);

        setImageSlides(
          orderedImages.map((img, index) => {
            let viewType = "Main";
            if (index === 1) viewType = "Top";
            if (index === 2) viewType = "Bottom";
            if (index === 3) viewType = "Left";
            if (index === 4) viewType = "Right";

            return {
              src: img,
              alt:
                `${data.name} - ${viewType} view` || `Product ${viewType} view`,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching product:", error);
        notFound(); // fallback if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  const addToCart = async (productID: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/`,
        {
          productID,
          product_type: "marketplace",
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
    }
  };



  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-[500px] w-full rounded-xl" />
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-9 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-8 w-1/3" />
          <div className="space-y-4 pt-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-12" />
          </div>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-[50vh] flex flex-col items-center justify-center text-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Product not found
          </h2>
          <Button
            onClick={() => window.history.back()}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Go Back
          </Button>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-sm flex items-center text-gray-500">
        <Link href="/" className="hover:text-orange-500 transition-colors">
          Home
        </Link>
        <ChevronRight className="mx-2 w-4 h-4" />
        <Link
          href="/products"
          className="hover:text-orange-500 transition-colors"
        >
          Products
        </Link>
        <ChevronRight className="mx-2 w-4 h-4" />
        <span className="text-gray-800 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Grid */}
      <div className=" max-w-7xl m-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="sticky top-4 h-fit">
          <Carousel
            images={imageSlides}
            options={{ loop: true }}
            showThumbnails={true}
            isAutoPlay={false}
          />

          {/* Moved Description below the image */}
          <div
            className="prose max-w-none text-gray-700 mt-6 lg:hidden"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
          {/* Description (hidden on mobile since it's below the image) */}
          <div className="prose max-w-none text-gray-700 mb-6 mt-8 hidden lg:block"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <p className="text-2xl font-semibold text-orange-500">
                ${product.price}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 flex-grow h-12" onClick={() => addToCart(product.id)}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            {/* <Button
              variant="outline"
              className="p-3 border-gray-200 hover:bg-gray-50 h-12"
            >
              <Heart className="w-5 h-5 text-gray-500" />
            </Button> */}
            <Button
              variant="outline"
              className="p-3 border-gray-200 hover:bg-gray-50 h-12"
            >
              <Share2 className="w-5 h-5 text-gray-500" />
            </Button>
          </div>

          {/* Highlights */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-lg font-medium mb-4">Product Highlights</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Verified marketplace seller
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Authentic products guaranteed
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Secure payment processing</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Fast and reliable shipping
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Customer protection guarantee
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Easy returns and exchanges
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
        <ProductsSection />
      </div>
    </div>
  );
}

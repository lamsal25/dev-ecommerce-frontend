"use client";
import { useEffect, useState, useCallback } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { CreateWishlistItem } from "@/app/(protected)/actions/wishlist";
import { getUserData } from "@/app/(protected)/actions/getUser"; // Adjust path as needed
import { getBatchProductReviewStats } from "@/app/(protected)/actions/review";
import {
  getProductById,
} from "@/app/(protected)/actions/product";
import { GetVendor } from "@/app/(protected)/actions/vendor";
import "react-toastify/dist/ReactToastify.css";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ChevronRight,
  Check,
  Star,
  Share2,
  Store,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Carousel from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import ProductReview from "@/app/sections/productReview";
import { Product, ProductSize } from "@/types/product";
import ProductsByCategory from "@/app/sections/productsByCategory";

// Vendor type
interface Vendor {
  id: number;
  ownerName: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function ProductDetail() {
  const param = useParams();
  const id = Array.isArray(param.id)
    ? param.id[0]?.split("-").pop()
    : param.id?.split("-").pop();

  const [product, setProduct] = useState<Product | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedSizeStock, setSelectedSizeStock] = useState<number>(0);
  const [imageSlides, setImageSlides] = useState<{ src: string; alt: string }[]>([]);
  const [ratingStats, setRatingStats] = useState({ average: 0, count: 0 });
  const [userRole, setUserRole] = useState<string>("guest");

  // Check if product has sizes
  const productHasSizes = useCallback((product: Product): boolean => {
    if (product.has_sizes !== undefined) return product.has_sizes;
    return product.sizes && product.sizes.length > 0;
  }, []);

  // Available stock
  const getAvailableStock = useCallback(() => {
    if (!product) return 0;
    if (productHasSizes(product)) return selectedSizeStock;
    return product.totalStock || 0;
  }, [product, selectedSizeStock, productHasSizes]);

  // Out of stock check
  const isOutOfStock = useCallback(() => {
    if (!product) return true;
    if (productHasSizes(product)) {
      if (!selectedSize) return false;
      return selectedSizeStock === 0;
    }
    return (product.totalStock || 0) === 0;
  }, [product, selectedSize, selectedSizeStock, productHasSizes]);

  // Handle review stats update
  const handleReviewStatsChange = useCallback(
    (average: number, count: number) => {
      setRatingStats({ average, count });
    },
    []
  );

  // Handle size selection
  const handleSizeSelection = (size: string, stock: number) => {
    setSelectedSize(size);
    setSelectedSizeStock(stock);
    if (quantity > stock) setQuantity(1);
  };

  // Share product
  const handleShareProduct = (product: Product) => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on our store!`,
      url: `${window.location.origin}/productDetail/${product.id}`,
    };
    if (navigator.share) navigator.share(shareData).catch(console.error);
    else {
      navigator.clipboard.writeText(shareData.url);
      toast.success("Link copied to clipboard!", { position: "top-center", autoClose: 2000 });
    }
  };

  // Add to cart
  const addToCart = async (productID: number) => {
    if (!product) return;
    if (productHasSizes(product) && !selectedSize) {
      toast.error("Please select a size before adding to cart.", { position: "top-center", autoClose: 2000 });
      return;
    }
    const availableStock = getAvailableStock();
    if (availableStock === 0) {
      toast.error(productHasSizes(product) ? "Selected size is out of stock." : "Product is out of stock.", { position: "top-center", autoClose: 2000 });
      return;
    }
    if (quantity > availableStock) {
      toast.error(productHasSizes(product) ? `Only ${availableStock} items available for size ${selectedSize}.` : `Only ${availableStock} items available.`, { position: "top-center", autoClose: 2000 });
      return;
    }
    try {
      const cartData: any = { productID, quantity };
      if (productHasSizes(product) && selectedSize) cartData.size = selectedSize;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/`,
        cartData,
        { withCredentials: true }
      );
      if (response.data.message === "Item Exits") toast.error("This item is already in your cart.", { position: "top-center", autoClose: 2000 });
      else toast.success(`Item${selectedSize ? ` (Size: ${selectedSize})` : ""} added to cart successfully!`, { position: "top-center", autoClose: 2000 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item to cart. Please try again.", { position: "top-center", autoClose: 2000 });
    }
  };

  // Add to wishlist
  const handleAddToWishlist = async () => {
    if (!product?.id) return;
    const res = await CreateWishlistItem(Number(product.id));
    if (res.status === 200) toast.info("This item is already in your wishlist.", { position: "top-center", autoClose: 2000 });
    else toast.success(res.msg || "Item added to wishlist successfully!", { position: "top-center", autoClose: 2000 });
  };

  // Fetch product, vendor & review stats
  useEffect(() => {
    async function fetchProductAndStats() {
      if (!id) return notFound();
      try {
        const productRes = await getProductById(Number(id));
        if (!productRes.data) return notFound();
        const productData = productRes.data;
        setProduct(productData);

        const vendorRes = await GetVendor(productData.vendor);
        if (vendorRes.data) setVendor(vendorRes.data);

        const statsRes = await getBatchProductReviewStats([Number(id)]);
        if (statsRes.data) {
          const productStats = statsRes.data[Number(id)];
          setRatingStats({ average: productStats?.avg_rating || 0, count: productStats?.total_reviews || 0 });
        }

        if (productData.has_sizes && productData.sizes?.length) {
          const availableSize = productData.sizes.find((size: ProductSize) => size.stock > 0);
          if (availableSize) {
            setSelectedSize(availableSize.size);
            setSelectedSizeStock(availableSize.stock);
          }
        }

        const orderedImages = [
          productData.image,
          productData.topImage,
          productData.bottomImage,
          productData.leftImage,
          productData.rightImage,
        ].filter(Boolean);
        setImageSlides(orderedImages.map((img, index) => ({ src: img, alt: `${productData.name} image ${index + 1}` })));
      } catch (error) {
        console.error(error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchProductAndStats();
  }, [id]);

  // Fetch user role
  useEffect(() => {
    async function fetchUserRole() {
      try {
        const userData = await getUserData();
        console.log(userData.role);
        if (userData?.role) {
          setUserRole(userData.role);
        } else {
          setUserRole("guest");
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setUserRole("guest");
      }
    }
    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-[500px] w-full rounded-xl" />
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
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
  }

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[50vh] flex flex-col items-center justify-center text-center">
      <div className="bg-red-50 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Product not found</h2>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm flex items-center text-gray-500">
        <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <ChevronRight className="mx-2 w-4 h-4" />
        <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="max-w-7xl m-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left */}
        <div className="sticky top-4 h-fit">
          <Carousel images={imageSlides} options={{ loop: true }} showThumbnails={true} isAutoPlay={false} />
          <div className="prose max-w-none text-gray-700 mt-6 lg:hidden" dangerouslySetInnerHTML={{ __html: product.description }} />
          <div className="prose max-w-none text-gray-700 mb-6 mt-8 hidden lg:block" dangerouslySetInnerHTML={{ __html: product.description }}></div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Name & Vendor */}
          <div className="mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
            {vendor && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Store className="w-4 h-4" />
                <span>Sold by:</span>
                <Link href={`/vendorProfile/${vendor.id}`}><span className="font-medium text-gray-800">{vendor.ownerName}</span></Link>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={`w-4 h-4 ${star <= Math.round(ratingStats.average || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900">{ratingStats.average.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({ratingStats.count} {ratingStats.count === 1 ? "review" : "reviews"})</span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-3 mb-6">
            {(product.discountPercentage ?? 0) > 0 ? (
              <>
                <p className="text-2xl font-semibold text-orange-500">Rs. {Number(product.discountedPrice).toFixed(2)}</p>
                {Number(product.discountedPrice) < Number(product.originalPrice) && (
                  <>
                    <p className="text-lg text-gray-500 line-through">Rs. {Number(product.originalPrice)}</p>
                    <span className="bg-orange-100 text-orange-600 text-sm font-medium px-2 py-0.5 rounded">Save {Number(product.discountPercentage)}%</span>
                  </>
                )}
              </>
            ) : (
              <p className="text-2xl font-semibold text-gray-900">Rs. {product.originalPrice}</p>
            )}
          </div>

          {/* Sizes */}
          {productHasSizes(product) && product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Size: {selectedSize && <span className="text-orange-500">({selectedSize})</span>}</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sizeObj, index) => {
                  const isSelected = selectedSize === sizeObj.size;
                  const isOutOfStock = sizeObj.stock === 0;
                  return (
                    <button
                      key={index}
                      disabled={isOutOfStock}
                      onClick={() => handleSizeSelection(sizeObj.size, sizeObj.stock)}
                      className={`w-16 h-16 rounded-md text-sm font-medium flex flex-col items-center justify-center transition-colors border-2
                        ${isSelected ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 hover:border-orange-300 hover:text-orange-500 bg-white"}
                        ${isOutOfStock ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className="text-sm">{sizeObj.size}</span>
                      <small className="text-xs mt-1">{isOutOfStock ? "Out" : sizeObj.stock}</small>
                    </button>
                  );
                })}
              </div>
              {!selectedSize && product.sizes.length > 0 && <p className="text-sm text-red-500 mt-2">* Please select a size</p>}
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-3">Quantity:</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg border-gray-200 overflow-hidden w-fit">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-3 text-gray-600 hover:bg-gray-50 transition-colors"><Minus className="w-4 h-4" /></button>
                <input
                  type="number"
                  min={1}
                  max={getAvailableStock() || 999}
                  value={quantity}
                  onChange={e => {
                    const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                    const maxQuantity = getAvailableStock() || 999;
                    setQuantity(Math.min(newQuantity, maxQuantity));
                  }}
                  className="w-16 text-center border-none focus:ring-0 bg-transparent"
                />
                <button onClick={() => setQuantity(q => Math.min(q + 1, getAvailableStock() || 999))} className="px-3 py-3 text-gray-600 hover:bg-gray-50 transition-colors" disabled={quantity >= (getAvailableStock() || 999)}><Plus className="w-4 h-4" /></button>
              </div>
              {productHasSizes(product) ? selectedSize && selectedSizeStock > 0 && <span className="text-sm text-gray-500">{selectedSizeStock} available in size {selectedSize}</span> : product.totalStock > 0 && <span className="text-sm text-gray-500">{product.totalStock} available</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className={`text-white px-6 py-3 flex-grow h-12 ${(productHasSizes(product) && !selectedSize) || isOutOfStock() ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
              onClick={() => addToCart(Number(product.id))}
              disabled={(productHasSizes(product) && !selectedSize) || isOutOfStock()}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {productHasSizes(product) && !selectedSize ? "Select Size First" : isOutOfStock() ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button variant="outline" className="p-3 border-gray-200 hover:bg-gray-50 h-12" onClick={handleAddToWishlist}><Heart className="w-5 h-5" /></Button>
            <Button variant="outline" className="p-3 border-gray-200 hover:bg-gray-50 h-12" onClick={() => handleShareProduct(product)}><Share2 className="w-5 h-5" /></Button>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-lg font-medium mb-4">Product Highlights</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  High-quality materials for durability
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Free shipping on orders over $50
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  30-day hassle-free return policy
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Eco-friendly packaging</span>
              </li>
            </ul>
          </div>
        </div>
      </div>


      {/* Reviews */}
      <div className="max-w-7xl m-auto mt-16">
        <ProductReview
          productId={Number(id)}
          userRole={userRole as "vendor" | "user" | "superadmin"}
          onReviewStatsChange={handleReviewStatsChange}
        />
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-primary">You May Also Like</h2>
        <ProductsByCategory id={product.category.id} />
      </div>
    </div>
  );
}

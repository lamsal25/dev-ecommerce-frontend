"use client";
import React, { useState, useEffect } from "react";
import { GetVendor } from "@/app/(protected)/actions/vendor";
import { getProductsByVendorId } from "@/app/(protected)/actions/product";
import VendorReview from "@/app/sections/vendorReview";
import ProductCard from "@/components/productCard";

interface VendorPageProps {
  params: {
    id: string;
  };
}

export default function VendorProfile({ params }: VendorPageProps) {
  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [vendorError, setVendorError] = useState<string | null>(null);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await Promise.resolve(params);
        const { id } = resolvedParams;

        // Fetch vendor data
        const { data: vendorData, error: vendorErr } = await GetVendor(id);
        if (vendorErr) {
          setVendorError(vendorErr);
        } else {
          setVendor(vendorData);
        }

        // Fetch vendor products
        const { data: productsData, error: productsErr } = await getProductsByVendorId(id);
        if (productsErr) {
          setProductsError(productsErr);
        } else {
          setProducts(productsData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setVendorError("Failed to load vendor data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md border">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Vendor...</h2>
          <p className="text-gray-600">Please wait while we fetch the vendor information.</p>
        </div>
      </div>
    );
  }

  if (vendorError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md border">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Vendor</h2>
          <p className="text-red-600">{vendorError}</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md border">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Vendor Not Found</h2>
          <p className="text-gray-600">The vendor you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Vendor Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Vendor Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border overflow-hidden">
                  {vendor.image ? (
                    <img 
                      src={vendor.image} 
                      alt={`${vendor.businessName} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )}
                </div>
              </div>
              
              {/* Vendor Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-secondary mb-1">
                      {vendor.businessName}
                    </h1>
                    <p className="text-primary text-sm mb-3">{vendor.businessType}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      vendor.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {vendor.isApproved ? "✓ Verified" : "⏳ Pending"}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  {vendor.businessDescription}
                </p>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="flex items-center text-gray-700 text-sm">
                    <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="font-medium">{vendor.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700 text-sm">
                    <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-medium truncate">{vendor.email}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700 text-sm">
                    <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="font-medium">{vendor.city}</span>
                  </div>

                  {vendor.website && (
                    <a
                      href={vendor.website.startsWith("http") ? vendor.website : `https://${vendor.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-800 text-sm hover:text-blue-700 transition-colors"
                    >
                      <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center mr-2">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <span className="font-medium">Website</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-secondary mb-4">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-primary">Owner:</span>
                <span className="ml-2 font-medium text-gray-900">{vendor.ownerName}</span>
              </div>
              <div>
                <span className="text-primary">Registration:</span>
                <span className="ml-2 font-medium text-gray-900">{vendor.registrationNumber}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-primary">Address:</span>
                <span className="ml-2 font-medium text-gray-900">{vendor.address}, {vendor.city}, {vendor.country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary">Products by <span className="text-primary">{vendor.businessName}</span></h2>
              <span className="text-sm text-primary">
                {products?.length || 0} item{products?.length !== 1 ? 's' : ''}
              </span>
            </div>

            {productsError ? (
              <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-700 font-medium mb-1">Error Loading Products</p>
                <p className="text-red-600 text-sm">{productsError}</p>
              </div>
            ) : !products || products.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-1">No Products Available</h3>
                <p className="text-gray-600 text-sm">This vendor hasn't added any products yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product: any) => {
                  // Transform the product data to match ProductCard component expectations
                  const transformedProduct = {
                    id: product.id.toString(),
                    name: product.name,
                    image: product.image || "/placeholder.jpg",
                    originalPrice: product.originalPrice,
                    discountedPrice: product.discountedPrice || product.originalPrice,
                    discountPercentage: product.discountedPrice > 0 ? product.discountedPrice : 0,
                    slug: product.name.toLowerCase().replace(/\s+/g, '-'),
                    rating: product.rating || 4.5,
                    reviews: product.reviews || 0,
                  };

                  return (
                    <ProductCard
                      key={product.id}
                      product={transformedProduct}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Vendor Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            {/* <h2 className="text-xl font-semibold text-secondary mb-6">Customer Reviews</h2> */}
            <VendorReview vendorId={vendor.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
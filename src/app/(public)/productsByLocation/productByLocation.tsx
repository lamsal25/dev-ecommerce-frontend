'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { getProductsByLocation } from '@/app/(protected)/actions/product';
import { useSearchParams } from 'next/navigation';
import { CustomPagination } from '@/components/customPagination';
import { Product } from '@/types/product';
import dynamic from 'next/dynamic';
import SidebarFilters from '@/components/sidebarFilters';
import ProductHeader from '@/components/productHeader';
import ContactSection from '@/app/sections/contactSection';
import { ProductCardSkeleton } from '@/components/skeletons';
import Link from 'next/link';

// Lazy load the product grid
const ProductGrid = dynamic(() => import('./productGrid'), {
    ssr: false,
    loading: () => <ProductCardSkeleton />,
});

export default function ProductsByLocationContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<string>('featured');
    const [currentPage, setCurrentPage] = useState(1);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // ✅ view mode state
    const productsPerPage = 12;

    const searchParams = useSearchParams();
    const location = searchParams.get('location') || 'makalbari';

    const normalizeProduct = (product: any): Product => ({
        id: String(product.id),
        name: product.name,
        image: product.image,
        originalPrice: parseFloat(product.originalPrice),
        discountedPrice: parseFloat(product.discountedPrice),
        description: product.description ?? '',
        discountPercentage: product.discountPercentage ? parseFloat(product.discountPercentage) : undefined,
        slug: product.slug,
        rating: product.rating ? parseFloat(product.rating) : undefined,
        reviews: product.reviews ? parseInt(product.reviews) : undefined,
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getProductsByLocation(location);
            const formattedProducts: Product[] = response.data.map(normalizeProduct);

            setProducts(formattedProducts);
            setFilteredProducts(formattedProducts);

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
    }, [location]);

    const applyFilters = React.useCallback(() => {
        let result = [...products];

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
        }

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
                    <p className="text-gray-600 mb-4">We couldn&apos;t find any products at the moment.</p>
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
                    <SidebarFilters maxPrice={maxPrice} setPriceRange={setPriceRange} />

                    <div className="flex-1">
                        <ProductHeader
                            location={location}
                            filteredProductsLength={filteredProducts.length}
                            sortOption={sortOption}
                            setSortOption={setSortOption}
                            viewMode={viewMode} // ✅ controlled
                            setViewMode={setViewMode} // ✅ updatable
                        />

                        <Suspense fallback={<ProductCardSkeleton />}>
                            <ProductGrid
                                currentProducts={filteredProducts.slice(
                                    (currentPage - 1) * productsPerPage,
                                    currentPage * productsPerPage
                                )}
                                loading={loading}
                                viewMode={viewMode}
                            />
                        </Suspense>

                        {Math.ceil(filteredProducts.length / productsPerPage) > 1 && (
                            <CustomPagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(filteredProducts.length / productsPerPage)}
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="mt-8"
                            />
                        )}

                        <ContactSection />
                    </div>
                </div>
            </div>
        </div>
    );
}

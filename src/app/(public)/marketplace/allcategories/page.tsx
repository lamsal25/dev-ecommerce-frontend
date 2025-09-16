'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getActiveCategories } from '@/app/(protected)/actions/category';
import LoadingSpinner from '@/components/loadingSpinner';
import { BenefitsOfChoosingUs } from '@/components/benefitsOfChoosingUS';
 
interface Category {
    id: number;
    name: string;
    image: string;
    parent: Category | null;
    subcategories: Category[];
    slug: string;
 }

export const dynamic = 'force-dynamic'

export default function AllCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

   

    const fetchCategories = async () => {
        try {
            const response = await getActiveCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const toggleExpand = (categoryId: number) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const flattenCategories = (categories: Category[], searchTerm: string = ''): Category[] => {
        let result: Category[] = [];
        
        categories.forEach(category => {
            const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
            const subMatches = category.subcategories?.some(sub => 
                sub.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (searchTerm === '' || matchesSearch || subMatches) {
                result.push(category);
                
                if (expandedCategories[category.id] || searchTerm !== '') {
                    const subcategories = flattenCategories(category.subcategories || [], searchTerm);
                    result = result.concat(subcategories);
                }
            }
        });
        
        return result;
    };

    const filteredCategories = flattenCategories(categories, searchTerm);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-primary py-16 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-secondary">Explore Our Categories</h1>
                    <p className="text-xl max-w-2xl mx-auto">
                        Discover all available product categories in our store
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 px-4">
                    <div className="order-2 sm:order-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-primary">
                            {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
                        </span>
                    </div>

                    <div className="order-1 sm:order-2 w-full sm:max-w-md">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search categories..."
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {filteredCategories.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {filteredCategories.map((category, index) => (
                            <Link href={`/marketplace/categories/productlistings/${category.id}`} key={`${category.id}-${index}`}>

                                <div
                                    className={`group relative rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md bg-white cursor-pointer h-full flex flex-col ${category.parent ? 'ml-6 border-l-2 border-gray-200' : ''}`}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <div className="relative h-48 overflow-hidden flex-grow">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className={`w-full h-full object-cover transition-transform duration-300 ${hoveredIndex === index ? 'scale-105' : 'scale-100'}`}
                                        />
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                        {category.subcategories?.length > 0 && (
                                            <button
                                                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow-sm z-10"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleExpand(category.id);
                                                }}
                                            >
                                                {expandedCategories[category.id] ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                            {category.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                                            {category.parent && `Subcategory `}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 ">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">
                            No categories found
                        </h3>
                        <p className="mt-1 text-gray-500">
                            {searchTerm
                                ? 'Try adjusting your search or filter to find what you are looking for.'
                                : 'There are currently no categories available.'}
                        </p>
                    </div>
                )}
            </div>
            <BenefitsOfChoosingUs />
        </div>
    );
}
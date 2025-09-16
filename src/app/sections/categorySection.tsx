'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductTitleBar from '@/components/productTitleBar';
import { getActiveCategories } from '../(protected)/actions/category';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const response = await getActiveCategories();
      setCategories(response.data);
      console.log('Fetched categories:', response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const viewAllCategory = () => {
    router.push('/viewAllCategory');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="container mx-auto bg-gray-50 pt-12 pb-6">
      <div className=" ">
        {/* Product Title Bar */}
        <ProductTitleBar
          badgeLabel="Popular"
          highlight="Browse With"
          title="Categories"
          buttonLabel="View All"
          onButtonClick={() => viewAllCategory()}
        />

        {/* Category Cards */}
        {categories && Array.isArray(categories) && categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 py-10">
            {categories.map((category, index) => (
              <Link href={`/categories/${category.slug}-${category.id}`} key={category.id}>
                <div
                  className="group relative rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md bg-white cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="relative h-[180px] overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className={`w-full h-full object-cover transition-transform duration-300 
                ${hoveredIndex === index ? 'scale-105' : 'scale-100'}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                        No Image Available
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 
              ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                  <div className="relative p-3 text-center z-10">
                    <h3 className="font-medium text-black group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">No categories available.</div>
        )}
      </div>
    </section>
  );
}

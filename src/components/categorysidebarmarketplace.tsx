'use client'; // Mark this as a Client Component

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getActiveCategories } from '@/app/(protected)/actions/category';

interface Props {
  currentCategoryId: number;
}

interface Category {
  id: number;
  name: string;
}

export default function CategorySidebarMarketPlace({ currentCategoryId }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getActiveCategories();
        
        if (response.error) {
          throw new Error(response.error);
        }

        // Assuming response.data.data contains the categories array
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <aside className="w-64 bg-white rounded shadow p-4 hidden md:block">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <p className="text-gray-500 text-sm">Loading categories...</p>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-64 bg-white rounded shadow p-4 hidden md:block">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <p className="text-red-500 text-sm">{error}</p>
      </aside>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <aside className="w-64 bg-white rounded shadow p-4 hidden md:block">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <p className="text-gray-500 text-sm">No categories found.</p>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white rounded shadow p-4 hidden md:block">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        {categories.map((cat: Category) => (
          <li key={cat.id}>
            <Link
              href={`/marketplace/categories/productlistings/${cat.id}`}
              className={`block px-3 py-2 rounded hover:bg-primary hover:text-white transition ${  
                cat.id === currentCategoryId ? 'bg-primary text-white' : 'text-gray-700'
              }`}
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
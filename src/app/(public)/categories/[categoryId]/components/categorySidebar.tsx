'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getActiveCategories } from '@/app/(protected)/actions/category';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  currentCategoryId: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  subcategories?: Category[];
}

export default function CategorySidebar({ currentCategoryId }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getActiveCategories();

        if (response.error) {
          throw new Error(response.error);
        }

        setCategories(response.data);

        if (currentCategoryId) {
          const parentCategory = response.data.find(cat =>
            cat.subcategories?.some(sub => sub.id === currentCategoryId)
          );
          if (parentCategory) {
            setExpandedCategory(parentCategory.id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentCategoryId]);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
        <div className="bg-gray-50 text-gray-600 p-3 rounded-md text-sm">
          No categories found
        </div>
      </div>
    );
  }

  return (
    <aside className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
      <ul className="space-y-2">
        {categories.map((category: Category) => (
          <li key={category.id} className="group">
            {category.subcategories?.length ? (
              <Collapsible
                open={expandedCategory === category.id}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <div className="flex items-center">
                  <CollapsibleTrigger className="mr-2 text-gray-500 hover:text-gray-700 transition-colors">
                    {expandedCategory === category.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </CollapsibleTrigger>
                  <Link
                    href={`/categories/${category.slug}-${category.id}`}
                    className={`flex-1 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors ${
                      category.id === currentCategoryId
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-700 hover:text-blue-600 font-semibold'
                    }`}
                  >
                    {category.name}
                  </Link>
                </div>

                <CollapsibleContent className="ml-6 mt-1">
                  <ul className="space-y-1 border-l border-gray-200 pl-3 py-1">
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory.id}>
                        <Link
                          href={`/categories/${subcategory.slug}-${subcategory.id}`}
                          className={`block px-3 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors ${
                            subcategory.id === currentCategoryId
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : 'text-gray-600 hover:text-blue-600 font-medium'
                          }`}
                        >
                          {subcategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link
                href={`/categories/${category.slug}-${category.id}`}
                className={`block px-3 py-2 rounded-md hover:bg-blue-50 transition-colors ${
                  category.id === currentCategoryId
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:text-blue-600 font-semibold'
                }`}
              >
                {category.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
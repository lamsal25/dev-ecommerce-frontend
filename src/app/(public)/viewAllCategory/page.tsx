import { Suspense } from 'react';
import { getActiveCategories } from '@/app/(protected)/actions/category';
import { BenefitsOfChoosingUs } from '@/components/benefitsOfChoosingUS';
import CategoriesList from './categoriesList';
import { CategoriesSkeleton } from '@/components/categoriesSkeleton';
export const dynamic = 'force-dynamic';

export default async function AllCategoriesPage() {
    // Fetch categories on the server
    const categories = await getActiveCategories();

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Static Header */}
            <div className="bg-primary py-16 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-secondary">Explore Our Categories</h1>
                    <p className="text-xl max-w-2xl mx-auto">
                        Discover all available product categories in our store
                    </p>
                </div>
            </div>

            {/* Dynamic Content with Suspense for performance optimization */}
            <div className="container mx-auto px-4 py-12">
                <Suspense fallback={<CategoriesSkeleton />}>
                    {categories.data && categories.data.length > 0 ? (
                        <CategoriesList categories={categories.data} />
                    ) : (
                        <p className="text-center text-red-500 text-lg">
                            No categories found.
                        </p>
                    )}
                </Suspense>
            </div>

            {/* Static Benefits Section */}
            <BenefitsOfChoosingUs />
        </div>
    );
}

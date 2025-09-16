import { notFound } from 'next/navigation';
import { getApprovedMarketplaceProductsByCategory } from '@/app/(protected)/actions/product';
import ProductTitleBar from '@/components/productTitleBar';
import { BenefitsOfChoosingUs } from '@/components/benefitsOfChoosingUS';
import CategorySidebarMarketPlace from '@/components/categorysidebarmarketplace';
import ProductListing from '../components/productlistings';
import { Suspense } from 'react';
import { ProductsSkeleton } from '../components/products-skeleton';

interface Product {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  rating?: number;
  reviews?: number;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { categoryId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const categoryId = parseInt(params.categoryId, 10);
  const sortOption = searchParams.sort || 'featured';
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;

  const products = await getApprovedMarketplaceProductsByCategory(categoryId);

  if (!products) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <ProductTitleBar
          badgeLabel="Hot Deals"
          highlight="Best Selling"
          title="Products"
        />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/5">
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
              <CategorySidebarMarketPlace currentCategoryId={categoryId} />
            </div>
          </div>

          <div className="lg:w-4/5">
            <Suspense fallback={<ProductsSkeleton />}>
              <ProductListing 
                products={products} 
                initialSort={sortOption as string}
                currentPage={page}
              />
            </Suspense>
          </div>
        </div>
      </main>
      <BenefitsOfChoosingUs />
    </div>
  );
}
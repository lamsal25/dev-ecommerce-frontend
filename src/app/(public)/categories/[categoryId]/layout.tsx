// app/(protected)/categories/layout.tsx
import { BenefitsOfChoosingUs } from '@/components/benefitsOfChoosingUS';
import ProductTitleBar from '@/components/productTitleBar';

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <ProductTitleBar
          badgeLabel="Hot Deals"
          highlight="Best Selling"
          title="Products"
        />
      </div>
      
      {children}
      
      <BenefitsOfChoosingUs />
    </div>
  );
}
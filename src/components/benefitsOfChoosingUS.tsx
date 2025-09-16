import ProductTitleBar from '@/components/productTitleBar';
import { ReactNode } from 'react';

interface BenefitItem {
  icon: ReactNode | string;
  title: string;
  description: string;
}

interface CategoryBenefitsProps {
  benefits?: BenefitItem[];
  className?: string;
}

export function BenefitsOfChoosingUs({
  benefits = defaultBenefits,
  className = '',
}: CategoryBenefitsProps) {
  return (
    <section 
      className={`my-10 bg-gray-50 py-8 container m-auto rounded-lg ${className}`}
      aria-label="Shopping benefits"
    >
        <div className="container mx-auto px-4 py-6">
                <ProductTitleBar
                  badgeLabel="100%"
                  highlight="Benefits of"
                  title="Choosing US"
                />
              </div>

       <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 bg-gray-50 shadow-2xl">
        
        {benefits.map((item, i) => (
          <div 
            key={i} 
            className="text-center p-4 hover:scale-[1.02] transition-transform duration-200"
          >
            <div className="text-3xl mb-3" aria-hidden="true">
              {item.icon}
            </div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const defaultBenefits: BenefitItem[] = [
  {
    icon: '🚚',
    title: "Free Shipping",
    description: "On orders over $50"
  },
  {
    icon: '🔄',
    title: "Easy Returns",
    description: "30-day return policy"
  },
  {
    icon: '🛡️',
    title: "Secure Payment",
    description: "100% secure checkout"
  },
    { icon: '⭐', title: "Premium", description: "Exclusive items" },

  { icon: '📞', title: "Support", description: "24/7 customer service" }
];
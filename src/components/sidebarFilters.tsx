// components/static/SidebarFilters.tsx
'use client';

import React from 'react';
import { PriceFilter } from '@/components/priceFilter';
import PromoBanner from '@/components/productPagePromoBanner';

interface SidebarFiltersProps {
  maxPrice: number;
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function SidebarFilters({ maxPrice, setPriceRange }: SidebarFiltersProps) {
  return (
    <aside className="lg:w-64">
      <div className="sticky top-4 space-y-6">
        <PromoBanner />
        <PriceFilter maxPrice={maxPrice} onPriceChange={setPriceRange} />
      </div>
    </aside>
  );
}
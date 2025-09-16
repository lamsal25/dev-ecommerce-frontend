// components/PriceFilter.tsx
'use client';

import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

interface PriceFilterProps {
  maxPrice: number;
  onPriceChange: (value: number[]) => void;
}

export function PriceFilter({ maxPrice, onPriceChange }: PriceFilterProps) {
  const [priceRange, setPriceRange] = useState([0, maxPrice]);

  const handleChange = (value: number[]) => {
    setPriceRange(value);
    onPriceChange(value);
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm p-5 sticky top-4 h-auto overflow-y-auto">
      <h3 className="font-medium mb-4 text-lg">Filters</h3>
      
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            value={priceRange}
            max={maxPrice}
            step={10}
            onValueChange={handleChange}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
}
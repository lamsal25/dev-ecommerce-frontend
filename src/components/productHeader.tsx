'use client';

import React from 'react';
import ProductTitleBar from '@/components/productTitleBar';
import { List, Grid } from 'lucide-react';

interface ProductHeaderProps {
  location: string;
  filteredProductsLength: number;
  sortOption: string;
  setSortOption: React.Dispatch<React.SetStateAction<string>>;
  viewMode: "grid" | "list"; // 👈 added
  setViewMode: React.Dispatch<React.SetStateAction<"grid" | "list">>; // 👈 added
}

export default function ProductHeader({
  location,
  filteredProductsLength,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
}: ProductHeaderProps) {
  return (
    <div className="mb-8">
      <ProductTitleBar
        badgeLabel="All Products"
        highlight="Complete Collection in"
        title={location}
      />

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Showing {filteredProductsLength} products
        </p>

        <div className="flex items-center gap-3">
          {/* Sorting dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>

          {/* View toggle buttons */}
          <div className="flex border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-gray-100 text-primary" : "text-gray-500"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-gray-100 text-primary" : "text-gray-500"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

// components/PromoBannerSection.tsx
import React, { useEffect, useState } from 'react';
import HomePagePromoBanner from '@/components/homePagePromoBanner';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterval } from '@/hooks/useInterval';
import API from '@/lib/api';
 // Default banner when no ads are running
const DEFAULT_BANNER = {
  id: 'default',
  image: '/default-promo.jpg', // Make sure to have this image in your public folder
  // discountText: 'SPECIAL OFFER',
  title: 'Discover Our',
  // subheading: 'Latest Collection',
  description: 'Explore our wide range of products with exclusive deals just for you',
  buttonText: 'Explore Now',
  // link: '/products'
};

type Banner = {
  id: string | number;
  image: string;
  // discountText: string;
  title: string;
  // subheading: string;
  description: string;
  // buttonText: string;
  link?: string;
};

export default function MarketplaceAds() {
  const [promotions, setPromotions] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API fetch
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        // In a real app, you would fetch from your API
        const response = await API.get('advertisements/getAdsByPosition/marketplace/');

        console.log(response.data)
        setPromotions(response.data); 
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Auto-rotate promotions
  useInterval(() => {
    if (promotions.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }
  }, 8000);

  if (isLoading) {
    return (
      <section className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse bg-gray-200 rounded-xl h-96 w-full"></div>
        </div>
      </section>
    );
  }

  // Use default banner if no promotions are available
  const displayBanner = promotions.length > 0 ? promotions[currentIndex] : DEFAULT_BANNER;

  return (
    <section className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayBanner.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HomePagePromoBanner banner={displayBanner} />
          </motion.div>
        </AnimatePresence>

        {/* Indicators if multiple banners */}
        {promotions.length > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to promotion ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
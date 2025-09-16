"use client";

import React, { useEffect, useState } from 'react';
import TopAdBanner from '@/components/topAdBanner';
import { AnimatePresence, motion } from 'framer-motion';
import { useInterval } from '@/hooks/useInterval';
import API from '@/lib/api';

const DEFAULT_BANNER = {
  id: 'default',
  image: '/logo.png', // Your default logo
  title: '✨ Special limited-time offers available! Shop now and save big! ✨',
  ctaText: 'Shop Now',
  link: '/specials'
};

type TopAdBannerProps = {
  id: string | number;
  image: string;
  title?: string;
  link?: string;
  ctaText: string;
};

export default function TopAdBannerSection() {
  const [banners, setBanners] = useState<TopAdBannerProps[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await API.get('advertisements/getAdsByPosition/sidebar/');
        setBanners(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching top banners:', error);
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useInterval(() => {
    if (banners.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }
  }, 8000);

  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-r from-blue-500 to-blue-700 h-12 md:h-16 animate-pulse"></div>
    );
  }

  const displayBanner = banners.length > 0 ? banners[currentIndex] : DEFAULT_BANNER;

  return (
    <div className="w-full sticky top-0 z-50 shadow-md">
      <AnimatePresence mode="wait">
        <div key={displayBanner.id} className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-95"></div>
          
          {/* Content container - added max-w and padding adjustments */}
          <div className="relative max-w-screen-xl mx-auto px-2 sm:px-4 md:px-6">
            <TopAdBanner banner={displayBanner} />
          </div>
          
          {/* Progress indicator */}
          {banners.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 8, ease: 'linear' }}
                key={displayBanner.id}
              />
            </div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};
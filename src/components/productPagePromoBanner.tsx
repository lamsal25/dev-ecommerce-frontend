'use client';

// components/PromoBanner.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInterval } from '@/hooks/useInterval';
import { useState, useEffect } from 'react';
import API from '@/lib/api';

type PromoBannerProps = {
  id: string | number;
  title: string;
  description: string;
  ctaText: string;
  link: string;
  theme?: 'primary' | 'secondary' | 'destructive' | 'success';
};

const DEFAULT_PROMOS: PromoBannerProps[] = [
  {
    id: 1,
    title: "Summer Sale!",
    description: "Get 20% off on all items this week",
    ctaText: "Shop Now",
    link: "/summer-sale",
    theme: "primary"
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Discover our latest collection",
    ctaText: "Explore",
    link: "/new-arrivals",
    theme: "secondary"
  },
  {
    id: 3,
    title: "Limited Stock",
    description: "Only a few items left at these prices",
    ctaText: "Grab Yours",
    link: "/clearance",
    theme: "destructive"
  }
];

const themeClasses = {
  primary: "from-primary to-primary/80",
  secondary: "from-secondary to-secondary/80",
  destructive: "from-destructive to-destructive/80",
  success: "from-green-500 to-green-600"
};

export default function ProductPagePromoBanner() {
  const [promos, setPromos] = useState<PromoBannerProps[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch - replace with your actual API call
    const fetchPromos = async () => {
      try {
        // const response = await fetch('/api/promotions');
        const response = await API.get('advertisements/getAdsByPosition/productpage_sidebar/');
        // setPromos(data.length ? data : DEFAULT_PROMOS);
        
        // Using mock data for now
        setPromos(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setPromos(DEFAULT_PROMOS);
        setIsLoading(false);
      }
    };

    fetchPromos();
  }, []);

  // Auto-rotate promotions every 8 seconds
  useInterval(() => {
    if (promos.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }
  }, 8000);

  if (isLoading) {
    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg h-28 animate-pulse"></div>
    );
  }

  const currentPromo = promos[currentIndex] || DEFAULT_PROMOS[0];
  const theme = currentPromo.theme || 'primary';

  return (
    <motion.div
      key={currentPromo.id}
      className={`mb-6 p-6 bg-gradient-to-r ${themeClasses[theme]} rounded-xl text-white shadow-lg overflow-hidden relative`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] bg-repeat"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <motion.h3 
          className="font-bold text-xl md:text-2xl mb-2"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {currentPromo.title}
        </motion.h3>
        
        <motion.p 
          className="text-sm md:text-base mb-4 opacity-90"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {currentPromo.description}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href={currentPromo.link}>
            <Button 
              variant="outline" 
              className={`bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm ${
                theme === 'destructive' ? 'text-white' : 'text-white'
              }`}
            >
              View More
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Progress indicator */}
      {promos.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 8, ease: 'linear' }}
            key={currentPromo.id}
          />
        </div>
      )}
    </motion.div>
  );
}
// components/HomePagePromoBanner.tsx
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

export default function HomePagePromoBanner({ banner }: { banner: Banner }) {
  return (
    <motion.section
      className="w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl overflow-hidden shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Section */}
      <div className="relative h-64 md:h-96 w-full">
        <div className="absolute top-8 -left-14 w-48 transform -rotate-45 bg-white/80 text-red-600 text-xs uppercase font-semibold text-center py-1 z-20 shadow-lg">
          Advertisement
        </div>



        <Image
          src={banner.image}
          alt={`Promo: ${banner.title}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Text Content */}
      <div className="p-6 md:p-8 flex flex-col justify-center gap-4 bg-gradient-to-br from-gray-50 to-white">
        {/* {banner.discountText && (
          <motion.p 
            className="text-xs font-bold text-orange-600 uppercase tracking-wider"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {banner.discountText}
          </motion.p>
        )} */}

        <motion.h2
          className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {banner.title} <br />
          {/* <span className="text-primary">{banner.subheading}</span> */}
        </motion.h2>

        <motion.p
          className="text-sm md:text-base text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {banner.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a
            href={banner.link || '#'}
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105"
          >
            Visit Now →
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};


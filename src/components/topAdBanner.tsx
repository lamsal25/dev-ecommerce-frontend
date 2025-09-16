import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type TopAdBannerProps = {
  id: string | number;
  image: string;
  title?: string;
  link?: string;
  ctaText?: string;
};

export default function TopAdBanner({ banner }: { banner: TopAdBannerProps }) {
  return (
    <div className="flex items-center justify-between py-2 sm:py-3 min-h-[3rem] sm:h-12 px-2 sm:px-0">
      {/* Image - Now visible on mobile with smaller size */}
      {/* {banner.image && (
        <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
          <Image
            src={banner.image}
            alt="Advertisement"
            fill
            className="object-contain drop-shadow-md"
            quality={100}
            priority
          />
        </div>
      )} */}

      {/* Title with responsive text and line-clamp */}
      <div className="flex-1 mx-2 sm:mx-4 text-center">
        <motion.p
          className="text-white text-xs sm:text-sm md:text-base font-medium line-clamp-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {banner.title}
        </motion.p>
      </div>

      {/* CTA Button - Now visible on mobile with compact version */}
      <motion.a
        href={banner.link || '#'}
        className="bg-white text-orange-600 hover:bg-orange-600 hover:text-white text-[0.65rem] xs:text-xs sm:text-xs font-semibold uppercase tracking-wide px-2 sm:px-4 py-1 sm:py-1.5 rounded-full whitespace-nowrap transition-all duration-200 flex-shrink-0"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="xs:hidden ">{banner.ctaText || 'Visit Now'}</span>
        {/* <span className="xs:hidden">Shop</span> */}
        <span className="hidden sm:inline">&nbsp;&rarr;</span>
      </motion.a>
    </div>
  );
};
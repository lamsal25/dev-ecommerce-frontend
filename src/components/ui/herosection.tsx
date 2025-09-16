"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Gem, ShieldCheck, Zap, ArrowRight, Star, Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

// Sample product data
const featuredItems = [
  {
    id: 1,
    title: "Asus Laptop ROG",
    price: "$2,250",
    rating: 4.8,
    likes: 124,
    image: "/gem1.jpg",
    verified: true
  },
  {
    id: 2,
    title: "Washing Machine",
    price: "$1,850",
    rating: 4.6,
    likes: 89,
    image: "/gem2.jpg",
    verified: true
  },
  {
    id: 3,
    title: "Gucci Bag",
    price: "$3,750",
    rating: 4.9,
    likes: 156,
    image: "/gem3.jpg",
    verified: true
  }
];

// Fixed decorative elements data
const decorativeElements = [
  { width: 120, height: 150, left: 10, top: 15, rotate: 30, duration: 15 },
  { width: 180, height: 120, left: 80, top: 25, rotate: 145, duration: 20 },
  { width: 150, height: 180, left: 40, top: 60, rotate: 270, duration: 18 },
  { width: 200, height: 150, left: 70, top: 70, rotate: 60, duration: 22 }
];

export function HeroSectionOne() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-950">
      {/* Decorative elements - only render on client */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden">
          {decorativeElements.map((element, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{
                duration: element.duration,
                delay: i * 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
              className="absolute"
              style={{
                width: element.width,
                height: element.height,
                left: `${element.left}%`,
                top: `${element.top}%`,
                background: `radial-gradient(circle, rgba(56,182,255,0.3) 0%, rgba(138,43,226,0.1) 100%)`,
                borderRadius: '30%',
                rotate: element.rotate
              }}
            />
          ))}
        </div>
      )}

      {/* Main content container */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-20 md:px-8 lg:py-24">
        <div className="flex w-full flex-col items-center gap-16 lg:flex-row lg:items-start lg:gap-12">
          {/* Left column - Text content */}
          <div className="flex flex-1 flex-col items-start lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-blue-600 shadow-sm backdrop-blur-sm dark:bg-gray-800/80 dark:text-blue-400"
            >
              <Zap size={16} className="text-secondary" />
              <span className="text-primary">Trusted by 10,000+ collectors</span>
            </motion.div>

            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="block"
              >
                The Premier Marketplace
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="block bg-gradient-to-r from-primary to-primary/45 bg-clip-text text-transparent"
              >
                For Best Products
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="mt-6 text-lg text-gray-600 dark:text-gray-400"
            >
              Discover authenticated products from trusted sellers worldwide. 
              Our verification system ensures every piece meets the highest <span className="text-secondary">standards.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3"
            >
              {[
                { value: "10K+", label: "Verified Listings" },
                { value: "4.9 ★", label: "Avg. Rating" },
                { value: "100%", label: "Authenticity" }
              ].map((stat, index) => (
                <div key={index} className="rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-gray-800/80">
                  <div className="text-2xl font-bold text-primary dark:text-white">{stat.value}</div>
                  <div className="text-sm text-secondary/80">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1 }}
              className="mt-12 flex flex-wrap gap-4"
            >
              <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/70 px-6 py-3 font-medium text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                <ShoppingCart size={18} />
                <span><Link href="/marketplace/categories">Browse Collection</Link></span>
                <ArrowRight size={16} />
              </button>
              <Link href={"/marketplace/sellitems"}>
              <button className="rounded-xl border-2 border-primary bg-white px-6 py-3 font-medium text-primary transition-all hover:-translate-y-1 hover:bg-blue-50 dark:border-blue-500 dark:bg-transparent dark:text-blue-500 dark:hover:bg-gray-800/50">
                Sell Your Items
              </button>
              </Link>
            </motion.div>
          </div>

          {/* Right column - Featured listings */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"
            >
              {featuredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.2 }}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
                    {item.verified && (
                      <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-blue-600 backdrop-blur-sm dark:bg-gray-900/90 dark:text-blue-400">
                        <ShieldCheck size={12} />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">{item.price}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span>{item.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Heart size={14} className="fill-red-400 text-red-400" />
                          <span>{item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

           
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React from "react";
import { WobbleCard } from "@/components/ui/wobble-card";
import Image from "next/image";
import login1 from "@/assets/login1.jpg";
import Link from "next/link";
import { ArrowRight, Store, User } from "lucide-react";
import { motion } from "framer-motion";

export default function WobbleCardDemo() {
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      {/* Page Header with improved styling */}
      <motion.div 
        className="text-center space-y-3 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="inline-block px-4 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Account Registration
        </motion.div>
        <motion.h2 
          className="text-4xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Select Your Account <span className="text-primary">Type</span>
        </motion.h2>
        <motion.p 
          className="text-gray-500 text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Choose the account type that best fits your needs for an optimized experience
        </motion.p>
      </motion.div>

      {/* Updated layout with better spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
        {/* LEFT COLUMN - Enhanced with better typography and visuals */}
        <motion.div 
          className="flex flex-col justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-sm"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="max-w-md mx-auto text-center">
            <motion.div 
              className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto"
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <ArrowRight className="w-6 h-6 text-primary" />
            </motion.div>
            <motion.h3 
              className="text-3xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Join our platform with the right account type for you
            </motion.h3>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              Our streamlined registration process ensures you get access to all the features 
              you need, whether you're selling products or making purchases.
            </motion.p>
            <ul className="space-y-4">
              {[
                "Quick & secure registration",
                "Personalized dashboard",
                "Role-specific features"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center gap-3 justify-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1 + (index * 0.2) }}
                >
                  <motion.div 
                    className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.2 }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </motion.div>
                  <span className="text-gray-700 dark:text-gray-200">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* RIGHT COLUMN - Improved card design */}
        <div className="flex flex-col space-y-8">
          {/* Vendor Card - CENTERED */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <WobbleCard containerClassName="relative h-[250px] overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-xl">
              {/* Enhanced background with gradient overlay */}
              <Image
                src={login1}
                alt="Vendor illustration"
                fill
                className="object-cover"
              />
              
              {/* Improved overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/50 to-black/30" />

              {/* Content with CENTERED positioning and typography */}
              <div className="relative z-10 flex h-full p-8">
                <div className="flex flex-col justify-center items-center text-center w-full">
                  <motion.div 
                    className="flex flex-col items-center gap-3 mb-3"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <motion.div 
                      className="bg-white/20 p-2 rounded-full backdrop-blur-sm"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Store className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">Vendor Account</h3>
                  </motion.div>
                  
                  <div className="space-y-4 flex flex-col items-center">
                    <motion.p 
                      className="text-white/90 max-w-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                    >
                      Sell products and manage your business with powerful vendor tools
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        href="/vendorApplicationForm" 
                        className="group flex items-center gap-2 bg-secondary hover:bg-secondary/90 px-6 py-3 rounded-md text-white font-medium transition-all"
                      >
                        Register as Vendor
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                        >
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </WobbleCard>
          </motion.div>

          {/* Customer Card - CENTERED */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <WobbleCard containerClassName="relative h-[250px] overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-xl">
              {/* Enhanced background with gradient overlay */}
              <Image
                src={login1}
                alt="Customer illustration"
                fill
                className="object-cover"
              />
              
              {/* Improved overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 via-primary/60 to-primary/40" />

              {/* Content with CENTERED positioning and typography */}
              <div className="relative z-10 flex h-full p-8">
                <div className="flex flex-col justify-center items-center text-center w-full">
                  <motion.div 
                    className="flex flex-col items-center gap-3 mb-3"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <motion.div 
                      className="bg-white/20 p-2 rounded-full backdrop-blur-sm"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <User className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">Customer Account</h3>
                  </motion.div>
                  
                  <div className="space-y-4 flex flex-col items-center">
                    <motion.p 
                      className="text-white/90 max-w-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    >
                      Shop with ease and track your orders with our customer features
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        href="/register" 
                        className="group flex items-center gap-2 bg-white hover:bg-white/90 px-6 py-3 rounded-md text-primary font-medium transition-all"
                      >
                        Register as Customer
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                        >
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </WobbleCard>
          </motion.div>
        </div>
      </div>
      
      {/* Added footer element */}
      <motion.div 
        className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.6 }}
      >
        <p className="text-gray-500">
          Already have an account?{" "}
          <motion.span whileHover={{ scale: 1.05 }}>
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in here
            </Link>
          </motion.span>
        </p>
      </motion.div>
    </div>
  );
}
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const NetworkErrorPage = () => {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 text-black md:flex-row md:items-center md:justify-start md:px-12 lg:px-24 relative overflow-hidden">
      {/* Animated grid background */}
      <motion.div 
        className="absolute inset-0 overflow-hidden opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-grid-black/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
      </motion.div>

      {/* Desktop Image (hidden on mobile) - Now properly sized */}
      <motion.div
        className="hidden md:block absolute right-0 top-0 h-full w-[45%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Image
          src="/images/errorimages/404.png"
          alt="Server Error Illustration"
          fill
          className="object-contain object-center"
          priority
        />
      </motion.div>

      {/* Main content container - Adjusted for full height */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:h-full md:justify-center md:w-[55%]">
        {/* Text content */}
        <motion.div
          className="w-full md:pr-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Error number */}
          <motion.div
            className="mb-8"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-[8rem] md:text-[10rem] font-bold leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-black to-gray-600">
              404
            </span>
          </motion.div>

          {/* Error message */}
          <div className="space-y-6">
            <motion.h2 
              className="text-2xl md:text-3xl font-medium tracking-tight"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Network Connection Failed
            </motion.h2>

            <motion.p 
              className="text-gray-600 md:text-lg"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              The server couldn &apos;t be reached. Please check your connection or try again later.
            </motion.p>

            {/* Action button */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="pt-6"
            >
              <button
                onClick={() => window.location.reload()}
                className="
                  relative px-8 py-3 
                  border border-black border-opacity-20 
                  bg-black bg-opacity-5 
                  rounded-full
                  overflow-hidden
                  hover:bg-opacity-10
                  transition-all
                  duration-300
                  group
                  text-black
                  md:px-10 md:py-4
                "
              >
                <span className="relative z-10 font-medium tracking-wide md:text-lg">
                  Retry Connection
                </span>
                <motion.span
                  className="absolute inset-0 bg-black bg-opacity-10"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </button>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            className="mt-12 text-gray-500 text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <p>Need assistance? Contact <span className="text-gray-700">support@domain.com</span></p>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Image (hidden on desktop) - Adjusted for full width */}
      <motion.div
        className="mt-12 w-full px-6 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="relative w-full h-64">
          <Image
            src="/images/errorimages/404.png"
            alt="Server Error"
            fill
            className="object-contain"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default NetworkErrorPage;
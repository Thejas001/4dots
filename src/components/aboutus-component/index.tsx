"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const AboutUsComponent = () => {
  // Animation variants
  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const slideInUp = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.6, -0.05, 0.01, 0.99] } },
  };

  const lineExpand = {
    hidden: { width: 0 },
    visible: { width: "100%", transition: { duration: 0.8, ease: "easeOut" } },
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <main className="min-h-screen bg-white overflow-hidden w-full">
      {/* Premium Back Button */}
      <motion.div
        className="pt-8 px-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-black transition-all duration-300 font-medium text-lg group pl-2"
          legacyBehavior
        >
          <a className="inline-flex items-center space-x-2">
            <motion.span
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-black"
              whileHover={{ x: -4 }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </motion.span>
            <span className="group-hover:translate-x-1 transition-transform">Back to Home</span>
          </a>
        </Link>
      </motion.div>

      {/* Luxury Hero Section */}
      <motion.section
        className="py-24 px-0 text-center"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1
          className="text-6xl sm:text-7xl lg:text-9xl font-extrabold text-black mb-8 tracking-tight px-2"
          variants={scaleIn}
        >
          About{" "}
          <span className="relative inline-block">
            <span className="relative z-10">
              <span className="text-black">4</span>
              <span className="text-black">D</span>
              <span className="text-black">o</span>
              <span className="text-black">t</span>
              <span className="text-black">s</span>
            </span>
            <motion.span
              className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
              variants={lineExpand}
              initial="hidden"
              animate="visible"
            />
          </span>
        </motion.h1>
        <motion.p
          className="text-xl sm:text-2xl text-gray-600 font-medium leading-relaxed px-2"
          variants={slideInUp}
        >
          One Platform. Every Print. For Everyone.
        </motion.p>
        <motion.div
          className="mt-12 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-800 to-transparent"
          variants={lineExpand}
          initial="hidden"
          animate="visible"
        />
      </motion.section>

      {/* Premium Content Sections */}
      <motion.section
        className="py-20 px-0"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full space-y-32">
          {/* Introduction */}
          <motion.div className="relative text-center" variants={slideInUp}>
            <motion.h2
              className="text-4xl sm:text-5xl font-extrabold text-black mb-8 px-2"
              variants={scaleIn}
            >
              Your All-in-One Online Printing Destination
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6 font-medium px-2"
              variants={slideInUp}
            >
              4Dots.in is your comprehensive online printing solution. Whether you&#39;re a student, a professional, an artist, or a business owner, we offer a seamless and reliable platform for all your printing needs.
            </motion.p>
            <motion.p
              className="text-lg sm:text-xl text-gray-600 leading-relaxed font-medium px-2"
              variants={slideInUp}
            >
              From academic documents to personalized photo products, from business essentials to creative projects—if it can be printed, you&#39;ll find it here.
            </motion.p>
            <motion.div
              className="mt-12 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-800 to-transparent"
              variants={lineExpand}
              initial="hidden"
              animate="visible"
            />
          </motion.div>

          {/* What We Offer Section */}
          <motion.div className="relative text-center" variants={slideInUp}>
            <motion.h2
              className="text-4xl sm:text-5xl font-extrabold text-black mb-12 px-2"
              variants={scaleIn}
            >
              What We Offer
            </motion.h2>
            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-6">
              {/* Academic Services */}
              <motion.div
                className="bg-white border border-gray-100 rounded-lg shadow-sm w-64 h-64 flex flex-col items-center justify-center hover:shadow-md hover:bg-gray-50 transition-all duration-300 md:mx-0 mx-auto max-w-md"
                variants={slideInUp}
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 mb-4"
                  variants={scaleIn}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </motion.div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-black mb-2">Academic Services</h3>
                  <p className="text-gray-600 text-sm">Study materials, assignments, soft binding, hard binding, spiral binding</p>
                </div>
              </motion.div>

              {/* Photo Products */}
              <motion.div
                className="bg-white border border-gray-100 rounded-lg shadow-sm w-64 h-64 flex flex-col items-center justify-center hover:shadow-md hover:bg-gray-50 transition-all duration-300 md:mx-0 mx-auto max-w-md"
                variants={slideInUp}
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 mb-4"
                  variants={scaleIn}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </motion.div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-black mb-2">Photo Products</h3>
                  <p className="text-gray-600 text-sm">Polaroids, photo frames, canvas prints, and customized photo products</p>
                </div>
              </motion.div>

              {/* Business Essentials */}
              <motion.div
                className="bg-white border border-gray-100 rounded-lg shadow-sm w-64 h-64 flex flex-col items-center justify-center hover:shadow-md hover:bg-gray-50 transition-all duration-300 md:mx-0 mx-auto max-w-md"
                variants={slideInUp}
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 mb-4"
                  variants={scaleIn}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </motion.div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-black mb-2">Business Essentials</h3>
                  <p className="text-gray-600 text-sm">Visiting cards, brochures, flyers, stickers, and brand collateral</p>
                </div>
              </motion.div>

              {/* End-to-End Solutions */}
              <motion.div
                className="bg-white border border-gray-100 rounded-lg shadow-sm w-64 h-64 flex flex-col items-center justify-center hover:shadow-md hover:bg-gray-50 transition-all duration-300 md:mx-0 mx-auto max-w-md"
                variants={slideInUp}
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 mb-4"
                  variants={scaleIn}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-black mb-2">Complete Solutions</h3>
                  <p className="text-gray-600 text-sm">End-to-end printing solutions for personal and professional use</p>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="mt-12 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-800 to-transparent"
              variants={lineExpand}
              initial="hidden"
              animate="visible"
            />
          </motion.div>

          {/* Why Choose Us Section */}
          <motion.div className="relative text-center" variants={slideInUp}>
            <motion.h2
              className="text-4xl sm:text-5xl font-extrabold text-black mb-12 px-2"
              variants={scaleIn}
            >
              Why Choose 4Dots.in
            </motion.h2>
            <div className="space-y-12">
              <motion.div className="flex flex-col items-center space-y-2 px-2" variants={slideInUp}>
                <motion.div
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black transition-all duration-300"
                  variants={scaleIn}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">Easy Online Ordering</h3>
                  <p className="text-gray-600">Seamless online ordering process with doorstep delivery</p>
                </div>
              </motion.div>
              <motion.div className="flex flex-col items-center space-y-2 px-2" variants={slideInUp}>
                <motion.div
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black transition-all duration-300"
                  variants={scaleIn}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">Transparent Pricing</h3>
                  <p className="text-gray-600">Clear pricing with no minimum order stress</p>
                </div>
              </motion.div>
              <motion.div className="flex flex-col items-center space-y-2 px-2" variants={slideInUp}>
                <motion.div
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black transition-all duration-300"
                  variants={scaleIn}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">High-Quality Output</h3>
                  <p className="text-gray-600">Premium quality tailored for all age groups and industries</p>
                </div>
              </motion.div>
              <motion.div className="flex flex-col items-center space-y-2 px-2" variants={slideInUp}>
                <motion.div
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black transition-all duration-300"
                  variants={scaleIn}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">Universal Platform</h3>
                  <p className="text-gray-600">Designed to serve both individuals and businesses</p>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="mt-12 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-800 to-transparent"
              variants={lineExpand}
              initial="hidden"
              animate="visible"
            />
          </motion.div>

          {/* Service Area Section */}
          <motion.div className="relative text-center" variants={slideInUp}>
            <motion.h2
              className="text-4xl sm:text-5xl font-extrabold text-black mb-6 px-2"
              variants={scaleIn}
            >
              Our Service Area
            </motion.h2>
            <motion.p
              className="text-xl sm:text-2xl text-gray-600 leading-relaxed mb-8 font-medium px-2"
              variants={slideInUp}
            >
              Presently, we are actively delivering and printing across <span className="font-semibold text-black">Kerala</span>. 
              Our services will soon be available in other states, as we expand to serve customers nationwide.
            </motion.p>
            <motion.div
              className="inline-flex items-center space-x-2 bg-gray-200/50 rounded-full px-6 py-3 border border-gray-300/50 hover:bg-gray-300/50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">Currently Serving Kerala</span>
            </motion.div>
            <motion.div
              className="mt-12 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-800 to-transparent"
              variants={lineExpand}
              initial="hidden"
              animate="visible"
            />
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
};

export default AboutUsComponent;
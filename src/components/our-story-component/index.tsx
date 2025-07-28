"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const OurStoryComponent = () => {
  // Premium animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
    }
  }
};


  const timelineDot = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200
      }
    },
    hover: {
      scale: 1.2,
      backgroundColor: "#000000",
      boxShadow: "0 0 0 6px rgba(0,0,0,0.05)",
      transition: { duration: 0.3 }
    }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      {/* Full-width back button */}
      <motion.div
        className="w-full pt-8 px-6 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-700 hover:text-black transition-all duration-300 font-medium text-lg group"
        >
          <motion.span 
            className="inline-block w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200"
            whileHover={{ rotate: -45 }}
            transition={{ type: "spring" }}
          >
            <svg
              className="w-4 h-4 transform transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </motion.span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">Back to Home</span>
        </Link>
      </motion.div>

      {/* Full-bleed hero section */}
      <motion.section
        className="w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Our <span className="text-black relative inline-block">
            <span className="relative z-10">Story</span>
            <motion.span 
              className="absolute bottom-1 left-0 w-full h-2 bg-black/10 -z-0"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
        </motion.h1>
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-gray-600 font-medium leading-relaxed max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          From a Local Print Shop to a Nationwide Vision
        </motion.p>
        <motion.div
          className="mt-12 sm:mt-16 w-4 h-4 rounded-full bg-black mx-auto relative"
          variants={timelineDot}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <motion.div 
            className="absolute inset-0 rounded-full bg-black/10 animate-ping"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        </motion.div>
      </motion.section>

      {/* Full-width timeline section */}
      <motion.section
        className="w-full py-12 sm:py-20 px-6 sm:px-12 lg:px-16 relative"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Responsive timeline connector */}
        <motion.div 
          className="absolute left-6 sm:left-8 md:left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-gray-200 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
        />

        <div className="w-full space-y-20 sm:space-y-28 md:space-y-32">
          {/* Timeline Item 1 */}
          <motion.div className="relative w-full flex items-start" variants={fadeInUp}>
            <div className="absolute left-4 sm:left-6 top-3 z-10">
              <motion.div
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black flex items-center justify-center border-2 border-white shadow-sm"
                variants={timelineDot}
                whileHover="hover"
              >
                <motion.div className="w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>
            </div>
            <div className="pl-12 sm:pl-16 md:pl-20 w-full">
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                <span className="font-bold text-black">4Dots</span> began with a simple observation: printing shouldn&apos;t be complicated or expensive—especially for students. As we interacted with hundreds of students who came in daily with notes, assignments, and project work, one thing became clear—there was no dedicated platform that made printing affordable, accessible, and easy for them.
              </p>
            </div>
          </motion.div>

          {/* Timeline Item 2 */}
          <motion.div className="relative w-full flex items-start" variants={fadeInUp}>
            <div className="absolute left-4 sm:left-6 top-3 z-10">
              <motion.div
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black flex items-center justify-center border-2 border-white shadow-sm"
                variants={timelineDot}
                whileHover="hover"
              >
                <motion.div className="w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>
            </div>
            <div className="pl-12 sm:pl-16 md:pl-20 w-full">
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                So we started small.
              </motion.h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                In a modest corner of West Hill, Calicut, we set up a physical print shop. It quickly became more than just a shop—it became a hub for local students.
              </p>
            </div>
          </motion.div>

          {/* Timeline Item 3 */}
          <motion.div className="relative w-full flex items-start" variants={fadeInUp}>
            <div className="absolute left-4 sm:left-6 top-3 z-10">
              <motion.div
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black flex items-center justify-center border-2 border-white shadow-sm"
                variants={timelineDot}
                whileHover="hover"
              >
                <motion.div className="w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>
            </div>
            <div className="pl-12 sm:pl-16 md:pl-20 w-full">
              <div className="space-y-6">
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                  We listened, learned, and realized that what we were building wasn&apos;t just for our neighborhood. The need was far greater. Students across the country deserved this convenience.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                  While managing the shop, we began developing a larger vision: an online platform that could serve students across India.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Timeline Item 4 */}
          <motion.div className="relative w-full flex items-start" variants={fadeInUp}>
            <div className="absolute left-4 sm:left-6 top-3 z-10">
              <motion.div
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black flex items-center justify-center border-2 border-white shadow-sm"
                variants={timelineDot}
                whileHover="hover"
              >
                <motion.div className="w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>
            </div>
            <div className="pl-12 sm:pl-16 md:pl-20 w-full">
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                A Bigger Discovery
              </motion.h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                As we grew, we discovered something even bigger—printing needs aren&apos;t limited to students. Parents printing school projects, professionals printing presentations, entrepreneurs printing marketing materials, designers printing art—everyone needed a reliable, simple, and quality printing solution.
              </p>
            </div>
          </motion.div>

          {/* Timeline Item 5 */}
          <motion.div className="relative w-full flex items-start" variants={fadeInUp}>
            <div className="absolute left-4 sm:left-6 top-3 z-10">
              <motion.div
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black flex items-center justify-center border-2 border-white shadow-sm"
                variants={timelineDot}
                whileHover="hover"
              >
                <motion.div className="w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>
            </div>
            <div className="pl-12 sm:pl-16 md:pl-20 w-full">
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                That&apos;s how <span className="font-extrabold">4Dots.in</span> was born.
              </motion.h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                A platform for everyone—from kids to college students, from small businesses to large enterprises. Whether you need one print or a thousand, 4Dots is ready to serve with care, quality, and commitment.
              </p>
            </div>
          </motion.div>

          {/* Final Timeline Item */}
          <motion.div className="relative w-full flex items-start" variants={fadeInUp}>
            <div className="absolute left-4 sm:left-6 top-3 z-10">
              <motion.div
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black flex items-center justify-center border-2 border-white shadow-sm"
                variants={timelineDot}
                whileHover="hover"
              >
                <motion.div className="w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>
            </div>
            <div className="pl-12 sm:pl-16 md:pl-20 w-full">
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Our Journey
              </motion.h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-8 sm:mb-10 font-normal">
                What started as a student-friendly print shop has now become a full-fledged pan-India printing platform—built with purpose, backed by real experiences, and driven by the people we serve.
              </p>
              <motion.div
                className="inline-flex items-center space-x-3 bg-gray-50 rounded-full px-5 sm:px-6 py-2 sm:py-3 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100 shadow-sm hover:shadow-md max-w-max"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium text-gray-800 text-sm sm:text-base">This is our story. And it&apos;s just getting started.</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
};

export default OurStoryComponent;
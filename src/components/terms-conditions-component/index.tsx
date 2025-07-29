"use client";

import React from "react";
import Link from "next/link";
// Optional: Uncomment to enable Framer Motion animations
// import { motion } from "framer-motion";

const TermsAndConditionsComponent = () => {
  // Optional: Framer Motion animation variants (uncomment to use)
  /*
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
  */

  return (
    <main className="min-h-screen bg-white text-black mx-0">
      {/* Navigation */}
      <div className="pt-12 px-0 mx-0">
        <Link href="/" className="group inline-flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center border border-black rounded-full group-hover:bg-black group-hover:text-white transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span className="text-sm font-medium tracking-wider">RETURN HOME</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="px-0 pt-16 pb-20 mx-0">
        <div className="w-full text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-8 border-2 border-black rounded-2xl mx-auto">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Terms and <span className="text-red-500">Conditions</span>
          </h1>
          <p className="text-xl text-gray-700 mb-10">
            Please read these terms carefully before using our services
          </p>
          <div className="inline-flex items-center gap-3 border border-black rounded-full px-6 py-3 mx-auto">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium tracking-wider">UPDATED: 29 APR 2025</span>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="px-0 pb-32 mx-0">
        <div className="w-full border-t border-b border-black">
          {/* Section Header */}
          <div className="py-12 text-center border-b border-black">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Terms and Conditions</h2>
            <div className="w-24 h-0.5 bg-black mx-auto mb-6"></div>
            <p className="text-gray-700">
              Comprehensive guidelines for using our services
            </p>
          </div>

          {/* Policy Items */}
          <div className="divide-y divide-black">
            {/* Item 1 */}
            <div className="py-12 px-0">
              <div className="w-full flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 flex items-center justify-center border-2 border-black rounded-xl mx-auto">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Accuracy of Details
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    The names and details provided during the order will be printed exactly as entered. Please ensure spelling, capitalization, and other information are correct before submitting.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="py-12 px-0">
              <div className="w-full flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 flex items-center justify-center border-2 border-black rounded-xl mx-auto">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Printing Material
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    All nameslips are printed on high-quality sticker paper, designed to be durable and easy to apply.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="py-12 px-0">
              <div className="w-full flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 flex items-center justify-center border-2 border-black rounded-xl mx-auto">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Design and Layout
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    While we ensure clear and legible printing, the layout and font style will follow standard format.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 4 */}
            <div className="py-12 px-0">
              <div className="w-full flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 flex items-center justify-center border-2 border-black rounded-xl mx-auto">
                    <span className="text-2xl font-bold">4</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Order Confirmation
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Once payment is completed, the order is considered confirmed and will be processed immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 5 */}
            <div className="py-12 px-0">
              <div className="w-full flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 flex items-center justify-center border-2 border-black rounded-xl mx-auto">
                    <span className="text-2xl font-bold">5</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Usage
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    These nameslips are intended for personal and institutional use. Commercial resale is not permitted without prior agreement with 4Dots.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 6 */}
            <div className="py-12 px-0">
              <div className="w-full flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 flex items-center justify-center border-2 border-black rounded-xl mx-auto">
                    <span className="text-2xl font-bold">6</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Customer Support
                  </h3>
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      If you have any questions about these Terms and Conditions, please contact us through our support channels:
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center border border-black rounded-lg">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PRIMARY SUPPORT CHANNEL</p>
                          <a href="mailto:4dotsclt@gmail.com" className="font-medium hover:underline">4dotsclt@gmail.com</a>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center border border-black rounded-lg">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PHONE SUPPORT</p>
                          <a href="tel:+91903761189" className="font-medium hover:underline">+91 903761189</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Footer */}
            <div className="py-12 px-0 text-center">
              <div className="w-full text-center">
                <div className="inline-flex items-center gap-3 mb-5">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium tracking-wider">LEGAL DISCLAIMER</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  By using our services, you agree to these terms and conditions. Please review them carefully before placing your order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="pb-12 px-0 text-center">
        <p className="text-sm text-gray-600">© 2025 4Dots. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default TermsAndConditionsComponent;
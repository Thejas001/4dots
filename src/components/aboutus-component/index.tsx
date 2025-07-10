import React from "react";
import Link from "next/link";

const AboutUsComponent = () => {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Back Button */}
        <div className="pt-6 px-20">
          <div className="w-full">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-10 px-20">
          <div className="w-full">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                About <span>
                  <span style={{ color: '#000000' }}>4</span>
                  <span style={{ color: '#0093D3' }}>D</span>
                  <span style={{ color: '#CC016B' }}>o</span>
                  <span style={{ color: '#FFF10D' }}>t</span>
                  <span style={{ color: '#000000' }}>s</span>
                  <span style={{ color: '#000000' }}>.in</span>
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-medium w-full mx-auto leading-relaxed">
                One Platform. Every Print. For Everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-20">
          <div className="w-full">
            {/* Introduction */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16">
              <div className="w-full">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Your All-in-One Online Printing Destination
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  4Dots.in is your comprehensive online printing solution. Whether you&apos;re a student, a professional, 
                  an artist, or a business owner, we offer a seamless and reliable platform for all your printing needs.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  From academic documents to personalized photo products, from business essentials to creative projects—if it can be printed, you&apos;ll find it here.
                </p>
              </div>
            </div>

            {/* What We Offer Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                What We Offer
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Academic Services */}
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Academic Services</h3>
                  <p className="text-gray-600">
                    Study materials, assignments, soft binding, hard binding, spiral binding
                  </p>
                </div>

                {/* Photo Products */}
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Photo Products</h3>
                  <p className="text-gray-600">
                    Polaroids, photo frames, canvas prints, and customized photo products
                  </p>
                </div>

                {/* Business Essentials */}
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Essentials</h3>
                  <p className="text-gray-600">
                    Visiting cards, brochures, flyers, stickers, and brand collateral
                  </p>
                </div>

                {/* End-to-End Solutions */}
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Solutions</h3>
                  <p className="text-gray-600">
                    End-to-end printing solutions for personal and professional use
                  </p>
                </div>
              </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Why Choose 4Dots.in
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Online Ordering</h3>
                      <p className="text-gray-600">Seamless online ordering process with doorstep delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
                      <p className="text-gray-600">Clear pricing with no minimum order stress</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">High-Quality Output</h3>
                      <p className="text-gray-600">Premium quality tailored for all age groups and industries</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Universal Platform</h3>
                      <p className="text-gray-600">Designed to serve both individuals and businesses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Area Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 md:p-12 text-white">
              <div className="w-full text-center">
                <h2 className="text-3xl font-bold mb-6">Our Service Area</h2>
                <p className="text-xl mb-8 leading-relaxed">
                  Presently, we are actively delivering and printing across <span className="font-semibold">Kerala</span>. 
                  Our services will soon be available in other states, as we expand to serve customers nationwide.
                </p>
                <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-6 py-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">Currently Serving Kerala</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
};
export default AboutUsComponent;
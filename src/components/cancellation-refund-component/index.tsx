import React from "react";
import Link from "next/link";

const CancellationRefundComponent = () => {
    return(
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Back Button */}
        <div className="pt-8 px-20">
          <div className="w-full">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative px-20">
          <div className="w-full">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
                Cancellation & <span className="text-red-600">Refund</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 font-medium w-full mx-auto leading-relaxed mb-6">
                Our policies for order cancellation and refund processing
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-gray-700">Last Updated: April 29, 2025</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 px-20">
          <div className="w-full">
            <div className="bg-white rounded-3xl shadow-xl p-12 md:p-16 relative overflow-hidden">
              {/* Background Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-50 to-pink-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-50 to-yellow-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              
              <div className="prose prose-xl max-w-none relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-full mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Cancellation and Refund Policy</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-pink-600 mx-auto rounded-full"></div>
                </div>

                {/* Policy Content */}
                <div className="space-y-10">
                  {/* Section 1 */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 border-l-4 border-red-600">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">1</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Non-Refundable Items</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          Since each nameslip is custom printed and cannot be reused, cancellations or refunds are not possible once the printing process has started.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border-l-4 border-orange-600">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Damaged Items</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          In the rare case of damage during shipping or a printing error from our side, we will reprint and resend the nameslips at no extra cost. Proof of damage must be shared within 24 hours of delivery.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 border-l-4 border-blue-600">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                          If you have any questions about our Cancellation and Refund Policy, please contact us:
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-lg text-gray-700">
                              Email:{' '}
                              <a href="mailto:4dotsclt@gmail.com" className="text-blue-600 hover:text-blue-800 underline font-medium">
                                4dotsclt@gmail.com
                              </a>
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-lg text-gray-700">
                              Phone:{' '}
                              <a href="tel:+91903761189" className="text-blue-600 hover:text-blue-800 underline font-medium">
                                +91 903761189
                              </a>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="mt-16 p-8 bg-gradient-to-r from-gray-50 to-red-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-900">Important Notice</span>
                  </div>
                  <p className="text-center text-gray-700 leading-relaxed">
                    Please review this policy carefully before placing your order. Custom printed items cannot be cancelled or refunded once printing begins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
};
export default CancellationRefundComponent;
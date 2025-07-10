import React from "react";
import Link from "next/link";

const TermsAndConditionsComponent = () => {
    return (
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
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
                Terms and <span className="text-blue-600">Conditions</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 font-medium w-full mx-auto leading-relaxed mb-6">
                Please read these terms carefully before using our services
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-50 to-teal-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              
              <div className="prose prose-xl max-w-none relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
                </div>

                {/* Terms Content */}
                <div className="space-y-10">
                  {/* Section 1 */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 border-l-4 border-blue-600">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">1</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Accuracy of Details</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          The names and details provided during the order will be printed exactly as entered. Please ensure spelling, capitalization, and other information are correct before submitting.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border-l-4 border-green-600">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Printing Material</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          All nameslips are printed on high-quality sticker paper, designed to be durable and easy to apply.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-8 border-l-4 border-purple-600">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Design and Layout</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          While we ensure clear and legible printing, the layout and font style will follow standard format.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border-l-4 border-orange-600">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">4</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Order Confirmation</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          Once payment is completed, the order is considered confirmed and will be processed immediately.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 5 */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 border-l-4 border-red-600">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">5</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Usage</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          These nameslips are intended for personal and institutional use. Commercial resale is not permitted without prior agreement with <span style={{ color: '#000000' }}>4</span>
                          <span style={{ color: '#0093D3' }}>D</span>
                          <span style={{ color: '#CC016B' }}>o</span>
                          <span style={{ color: '#FFF10D' }}>t</span>
                          <span style={{ color: '#000000' }}>s</span>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 6 */}
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-2xl p-8 border-l-4 border-indigo-600">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">6</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          If you have any questions about these Terms and Conditions, please contact us at{' '}
                          <a href="mailto:4dotsclt@gmail.com" className="text-blue-600 hover:text-blue-800 underline font-medium">
                            4dotsclt@gmail.com
                          </a>{' '}
                          or{' '}
                          <a href="tel:+91903761189" className="text-blue-600 hover:text-blue-800 underline font-medium">
                            +91 903761189
                          </a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="mt-16 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-900">Important Notice</span>
                  </div>
                  <p className="text-center text-gray-700 leading-relaxed">
                    By using our services, you agree to these terms and conditions. Please review them carefully before placing your order.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
};

export default TermsAndConditionsComponent;
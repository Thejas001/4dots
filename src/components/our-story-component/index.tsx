import React from "react";
import Link from "next/link";

const OurStoryComponent = () => {
    return (
        <main className="min-h-screen bg-gradient-to-br w-full from-blue-50 to-indigo-100">
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
        <section className="relative py-24 px-20">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
                Our <span className="text-blue-600">Story</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 font-medium w-full mx-auto leading-relaxed">
                From a Local Print Shop to a Nationwide Vision
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 px-20">
          <div className="w-full">
            {/* Story Content */}
            <div className="space-y-16">
              {/* Introduction */}
              <div className="bg-white rounded-3xl shadow-xl p-12 md:p-16">
                <div className="prose prose-xl max-w-none">
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    <span style={{ color: '#000000' }}>4</span>
                    <span style={{ color: '#0093D3' }}>D</span>
                    <span style={{ color: '#CC016B' }}>o</span>
                    <span style={{ color: '#FFF10D' }}>t</span>
                    <span style={{ color: '#000000' }}>s</span> began with a simple observation: printing shouldn&apos;t be complicated or expensive—especially for students. As we interacted with hundreds of students who came in daily with notes, assignments, and project work, one thing became clear—there was no dedicated platform that made printing affordable, accessible, and easy for them.
                  </p>
                </div>
              </div>

              {/* Starting Small */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-xl p-12 md:p-16 text-white">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-8">So we started small.</h2>
                  <p className="text-2xl leading-relaxed">
                    In a modest corner of West Hill, Calicut, we set up a physical print shop. It quickly became more than just a shop—it became a hub for local students.
                  </p>
                </div>
              </div>

              {/* Learning and Growing */}
              <div className="bg-white rounded-3xl shadow-xl p-12 md:p-16">
                <div className="prose prose-xl max-w-none">
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    We listened, learned, and realized that what we were building wasn&apos;t just for our neighborhood. The need was far greater. Students across the country deserved this convenience.
                  </p>
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    While managing the shop, we began developing a larger vision: an online platform that could serve students across India.
                  </p>
                </div>
              </div>

              {/* Discovery */}
              <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-3xl shadow-xl p-12 md:p-16 text-white">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-8">A Bigger Discovery</h2>
                  <p className="text-2xl leading-relaxed">
                    As we grew, we discovered something even bigger—printing needs aren&apos;t limited to students. Parents printing school projects, professionals printing presentations, entrepreneurs printing marketing materials, designers printing art—everyone needed a reliable, simple, and quality printing solution.
                  </p>
                </div>
              </div>

              {/* Birth of 4Dots.in */}
              <div className="bg-white rounded-3xl shadow-xl p-12 md:p-16">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-8">
                    That&apos;s how <span style={{ color: '#000000' }}>4</span>
                    <span style={{ color: '#0093D3' }}>D</span>
                    <span style={{ color: '#CC016B' }}>o</span>
                    <span style={{ color: '#FFF10D' }}>t</span>
                    <span style={{ color: '#000000' }}>s</span>.in was born.
                  </h2>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    A platform for everyone—from kids to college students, from small businesses to large enterprises. Whether you need one print or a thousand, 4Dots is ready to serve with care, quality, and commitment.
                  </p>
                </div>
              </div>

              {/* Journey Summary */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-3xl shadow-xl p-12 md:p-16 text-white">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-8">Our Journey</h2>
                  <p className="text-2xl leading-relaxed mb-8">
                    What started as a student-friendly print shop has now become a full-fledged pan-India printing platform—built with purpose, backed by real experiences, and driven by the people we serve.
                  </p>
                  <div className="inline-flex items-center space-x-3 bg-white/20 rounded-full px-8 py-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-medium text-lg">This is our story. And it&apos;s just getting started.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
};

export default OurStoryComponent;
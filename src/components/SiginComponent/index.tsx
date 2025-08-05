"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import OTPInputComponent from "../OTPInput/OTPInput";

interface SigininComponentProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SigininComponent: React.FC<SigininComponentProps> = ({ isOpen = true, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Remove the loading state since it's handled by the layout
  // if (isLoading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-white">
  //       <Loader />
  //     </div>
  //   );
  // }

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
             {/* Modal */}
       <div className={`relative mx-4 w-full max-w-md transform transition-all duration-300 ${
         isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
       }`}>
                  {/* Close Button - Full Circle Clickable */}
          <button
            onClick={onClose}
            className="absolute -top-6 -right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 hover:scale-110 cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

                  {/* Modal Content */}
          <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-200">
           
                       {/* Content */}
            <div className="relative z-10 p-8">
              {/* Header with Simple Icon and Title */}
              <div className="text-center mb-8">
                {/* Simple Icon */}
                <div className="mx-auto mb-6">
                  <Image
                    src="/images/login/sign_in_icon.svg"
                    alt="App Icon"
                    width={48}
                    height={48}
                    className="mx-auto"
                  />
                </div>

                {/* Title */}
                <div className="mt-4">
                  <h2 className="mb-3 text-2xl font-bold text-gray-900">
                    LOGIN
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Enter your mobile number to receive a verification code
                  </p>
                </div>
              </div>

                           {/* OTP Form */}
              <div className="space-y-6">
                <div className="rounded-xl bg-gray-50 p-6 border border-gray-200">
                  <OTPInputComponent onLoginSuccess={onClose} />
                </div>
              </div>

             {/* Footer */}
             <div className="mt-6 text-center">
               <p className="text-xs text-gray-500">
                 By continuing, you agree to our{" "}
                 <Link href="/terms-and-conditions" className="text-blue-600 hover:text-blue-700 underline font-medium">
                   Terms of Service
                 </Link>
               </p>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

export default SigininComponent;

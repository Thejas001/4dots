'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const OfflinePage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showTips, setShowTips] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Check network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-reload when back online
  useEffect(() => {
    if (isOnline && isRetrying) {
      window.location.reload();
    }
  }, [isOnline, isRetrying]);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => setIsRetrying(false), 5000);
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 text-black relative overflow-hidden md:flex-row md:p-0">
      {/* Background grid */}
      <div className="absolute inset-0 overflow-hidden opacity-5 bg-grid-black/[0.03]" />

      {/* Left Side - Image (full height on desktop) */}
      <motion.div
        className="w-full md:w-1/2 h-[300px] md:h-screen flex items-center justify-center md:justify-end"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="relative w-full h-full max-w-2xl md:max-w-none md:w-full md:h-full">
          <Image
            src="/images/errorimages/offline.png"
            alt="Offline Illustration"
            fill
            className="object-contain object-center"
            priority
            sizes="(max-width: 968px) 100vw, 50vw"
          />
        </div>
      </motion.div>

      {/* Right Side - Content (full height on desktop) */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center md:items-start md:justify-center md:h-screen md:pl-16 lg:pl-24 xl:pl-32 py-12">
        {/* Error heading */}
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-center md:text-left"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          You are Offline
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl lg:text-3xl mb-10 text-gray-600 text-center md:text-left"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Oops! We cannot connect to the internet right now.
        </motion.p>

        {/* Retry button with progress animation */}
        <motion.div
          className="w-full max-w-md mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full py-4 md:py-5 rounded-full bg-black text-white font-medium text-lg md:text-xl relative overflow-hidden hover:bg-gray-800 transition-all"
          >
            <span className="relative z-10">
              {isRetrying ? 'Connecting...' : 'Retry Connection'}
            </span>
            {isRetrying && (
              <motion.div
                className="absolute bottom-0 left-0 h-1.5 bg-white"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            )}
          </button>
        </motion.div>

        {/* Troubleshooting tips expandable section */}
        <div className="w-full max-w-lg">
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center justify-between w-full py-4 px-6 rounded-lg mb-2 bg-gray-100 hover:bg-gray-200 transition-colors text-lg"
          >
            <span className="font-medium">Troubleshooting Tips</span>
            <motion.div
              animate={{ rotate: showTips ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.div>
          </button>

          <AnimatePresence>
            {showTips && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-b-lg bg-gray-100 text-lg"
              >
                <div className="p-6 space-y-4 text-left">
                  <div className="flex items-start">
                    <span className="mr-3 mt-1.5 inline-block h-3 w-3 rounded-full bg-black" />
                    <p>Check your Wi-Fi or mobile data connection</p>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 mt-1.5 inline-block h-3 w-3 rounded-full bg-black" />
                    <p>Restart your router or modem</p>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 mt-1.5 inline-block h-3 w-3 rounded-full bg-black" />
                    <p>Disable and re-enable airplane mode</p>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 mt-1.5 inline-block h-3 w-3 rounded-full bg-black" />
                    <p>Try connecting to a different network</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
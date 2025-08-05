"use client";

import React, { useState } from 'react';
import { FaWhatsapp } from "react-icons/fa";

const FloatingWhatsApp = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    const phoneNumber = "919037061189";
    const message = "Hello! I'm interested in your printing services.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-16 right-0 mb-2 px-3 py-2 bg-[#242424] text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span>Chat with us on WhatsApp!</span>
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#242424] absolute -bottom-1 right-4"></div>
          </div>
        </div>
      )}
      
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Chat with us on WhatsApp"
      >
        <FaWhatsapp className="text-2xl" />
      </button>
    </div>
  );
};

export default FloatingWhatsApp; 
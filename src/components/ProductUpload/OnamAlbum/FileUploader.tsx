"use client";

import React, { useState } from "react";

const defaultImages = [
 "/images/product/onam-car2.jpg",
  "/images/product/onam-car3.jpg",
  "/images/product/onam-car4.jpg", // Replace with the actual image path of the business card
   "/images/product/onam-car5.gif",
];

const FileUploader: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main Business Card */}
      <div className="relative w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <img
          src={defaultImages[currentImageIndex]}
          alt="Business Card"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Thumbnails (optional, can be removed if not needed) */}
      <div className="flex gap-3 mt-4 overflow-x-auto hide-scrollbar">
        {defaultImages.map((src, index) => (
          <div
            key={index}
            className={`w-20 h-20 flex-shrink-0 rounded-lg border cursor-pointer overflow-hidden ${
              index === currentImageIndex ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <img
              src={src}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
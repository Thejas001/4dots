
"use client";

import React, { useState, useEffect } from "react";

const defaultImages = [
  "/images/product/onam-car5.gif",
  "/images/product/onam-car2.jpg",
  "/images/product/onam-car3.jpg",
  "/images/product/onam-car4.jpg",
];

interface FileUploaderProps {
  fileList: { url: string; name: string; type: string }[];
}

const FileUploader: React.FC<FileUploaderProps> = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Always use default images
  const imagesToShow = defaultImages;

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imagesToShow.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [imagesToShow.length]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {imagesToShow.length > 0 ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={imagesToShow[currentImageIndex]}
            alt="Slideshow"
            className="w-full h-full object-contain rounded-lg"
          />
          {/* Navigation dots */}
          <div className="absolute bottom-4 flex justify-center w-full">
            {imagesToShow.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === currentImageIndex ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No images to display</p>
      )}
    </div>
  );
};

export default FileUploader;

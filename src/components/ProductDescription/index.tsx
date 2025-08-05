"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  name: string; // should map from 'ProductName'
  description: string; // should map from 'Description'
  ProductDetailsImages: {
    Id: number;
    ImageUrl: string;
  }[];
}

interface ProductDescriptionProps {
  product: Product | null;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  const fallbackProduct: Product = {
    name: "Default Product Name",
    description: "Default Product Description",
    ProductDetailsImages: [
      {
        Id: 1,
        ImageUrl: "/images/product/Rectangle971.svg",
      },
    ],
  };

  const displayProduct = {
    ...product,
    ProductDetailsImages:
      product?.ProductDetailsImages && product.ProductDetailsImages.length > 0
        ? product.ProductDetailsImages
        : fallbackProduct.ProductDetailsImages,
  } as Product;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const images = displayProduct.ProductDetailsImages || [];

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const isLongDescription = displayProduct.description.length > 150;
  const shortDescription = displayProduct.description.slice(0, 150) + "...";

  // Reset current index when images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [displayProduct.ProductDetailsImages]);

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-6">
    {/* Main Content */}
    <div className="flex flex-col-reverse lg:flex-row items-start lg:items-center gap-6 lg:gap-16">
      {/* Left Section (Text) */}
      <div className="w-full lg:w-1/2 text-black">
        <h1 className="text-xl sm:text-2xl lg:text-[34px] font-semibold">
          {displayProduct.name}
        </h1>
        <p className="mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-xl text-gray-700">
          Product Description
        </p>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-500 leading-relaxed">
          {isLongDescription && !showFullDescription
            ? shortDescription
            : displayProduct.description}
        </p>
  
        {isLongDescription && (
          <div className="mt-3 sm:mt-4">
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-600 hover:text-blue-800 text-sm sm:text-base underline italic"
            >
              {showFullDescription ? "Hide Details" : "View Details"}
            </button>
          </div>
        )}
      </div>
  
      {/* Right Section (Image Carousel) */}
      {images.length > 0 && (
        <div className="w-full sm:w-[70%] md:w-[60%] lg:w-2/5 flex flex-col items-center relative">
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
            {/* Left Arrow */}
            {images.length > 1 && (
              <button
                onClick={prevImage}
                aria-label="Previous Image"
                className="absolute top-1/2 left-2 sm:-left-5 transform -translate-y-1/2 bg-[#FFFFFF80] p-1 sm:p-2 flex items-center justify-center rounded-full cursor-pointer"
              >
                <img
                  src="/images/icon/image-left-arrow.svg"
                  alt="Previous"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>
            )}
  
            {/* Main Image */}
            <img
              src={images[currentIndex].ImageUrl}
              alt={displayProduct.name}
              className="w-full max-h-64 object-contain rounded-lg transition-opacity duration-300"
            />
  
            {/* Right Arrow */}
            {images.length > 1 && (
              <button
                onClick={nextImage}
                aria-label="Next Image"
                className="absolute top-1/2 right-2 sm:-right-5 transform -translate-y-1/2 bg-[#FFFFFF80] p-1 sm:p-2 flex items-center justify-center rounded-full cursor-pointer"
              >
                <img
                  src="/images/icon/image-right-arrow.svg"
                  alt="Next"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>
            )}
          </div>
  
          {/* Pagination Dots */}
          {images.length > 1 && (
            <div className="flex justify-center mt-2 sm:mt-3">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 mx-1 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-gray-900 h-3 w-3"
                      : "bg-gray-300 w-2 h-2 mt-0.5"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  
    {/* Divider */}
    <div className="mt-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="2"
        viewBox="0 0 1354 2"
        fill="none"
      >
        <path
          d="M1 1L1353 1.00012"
          stroke="#E6E6E6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  </div>
  );
}  

export default ProductDescription;
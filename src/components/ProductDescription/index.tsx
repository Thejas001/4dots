"use client";
import React, { useState } from "react";
import Link from "next/link";

interface Product {
  name: string;
  description: string;
}

interface ProductDescriptionProps {
  product: Product | null;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  console.log("Received Product Data:", product);

  const fallbackProduct: Product = {
    name: "Default Product Name",
    description: "Default Product Description",
  };

  const displayProduct = product || fallbackProduct;

  const images = [
    "/images/product/Rectangle971.svg",
    "/images/product/Rectangle971.svg",
    "/images/product/Rectangle971.svg",
    "/images/product/Rectangle971.svg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="px-4 md:px-20 py-6">
      {/* Back Button */}
      <div className="mb-4">
        <Link href="/" passHref>
          <div className="flex items-center cursor-pointer">
            <img src="/images/login/back-arrow.svg" alt="Back" className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col-reverse lg:flex-row items-center gap-6 lg:gap-16">
        {/* Left Section (Text) */}
        <div className="w-full lg:w-1/2 text-black">
          <h1 className="text-lg lg:text-[34px] font-semibold">
            {displayProduct.name}
          </h1>
          <p className="mt-2 lg:mt-4 text-sm lg:text-xl text-gray-700">Product Description</p>
          <p className="mt-3 text-sm lg:text-base text-gray-500 leading-relaxed">
            {displayProduct.description}
          </p>
          <div className="mt-4">
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm lg:text-base underline italic">
              View Details
            </a>
          </div>
        </div>

        {/* Right Section (Image Carousel) */}
        <div className="lg:w-2/5 md:h-[330px] flex flex-col items-center relative">
          {/* Image Display */}
          <div className="relative w-full max-w-md">
            {/* Left Arrow */}
            <button
              onClick={prevImage}
              aria-label="Previous Image"
              className="absolute top-1/2 md:-left-5 transform -translate-y-1/2 bg-[#FFFFFF80] p-2 flex items-center justify-center rounded-[38px] cursor-pointer"
            >
              <img src="/images/icon/image-left-arrow.svg" alt="Previous" className="w-5 h-5" />
            </button>

            {/* Main Image */}
            <img
              src={images[currentIndex]}
              alt={displayProduct.name}
              className="w-full object-contain rounded-lg transition-opacity duration-300"
            />

            {/* Right Arrow */}
            <button
              onClick={nextImage}
              aria-label="Next Image"
              className="absolute top-1/2 md:-right-5 transform -translate-y-1/2 bg-[#FFFFFF80] p-2 flex items-center justify-center rounded-[38px] cursor-pointer"
            >
              <img src="/images/icon/image-right-arrow.svg" alt="Next" className="w-5 h-5" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-3">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 mx-1 rounded-full transition-all ${
                  index === currentIndex ? "bg-gray-900 h-3 w-3" : "bg-gray-300 w-2 h-2 mt-0.5"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="2" viewBox="0 0 1354 2" fill="none">
          <path d="M1 1L1353 1.00012" stroke="#E6E6E6" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

export default ProductDescription;

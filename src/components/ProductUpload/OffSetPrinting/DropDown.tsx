"use client";
import React, { useState, useMemo  } from "react";
import { Product } from "@/app/models/products";
import {noticeTypeQualityRules} from "@/utils/bindingdisable"; // Adjust the import path as necessary

const DropDown = ({
    productDetails,
    onSizeChange,
    onQuantityChange,
    onQualityChange
}:{
    productDetails: Product,
    onSizeChange: (size: string) => void;
    onQuantityChange: (quantity: number) => void;
    onQualityChange: (quality: string) => void; 
}) => {

      const [isOpenSize, setIsOpenSize] = useState(false);
      const [selectedSize, setSelectedSize] = useState("");
    
      const [isOpenQuantity, setIsOpenQuantity] = useState(false);
      const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);

      const [isOpenQuality, setIsOpenQuality] = useState(false);
      const [selectedQuality, setSelectedQulaity] = useState("");
      
      const sizeOptions = productDetails.NoticeType || [];
      const sizeQuantity = productDetails.quantity || []; // Change this to quantity
      const qualityOptions = productDetails.Quality || [];

const getFilteredQualities = () => {
  const isOffsetPrinting = productDetails.name === "Offset Printing";

  if (!isOffsetPrinting) return qualityOptions;

  const allowedQualities = noticeTypeQualityRules[selectedSize];
  if (allowedQualities) {
    return qualityOptions.filter((q) =>
      allowedQualities.includes(q.toUpperCase())
    );
  }

  // If no rule defined, return all
  return qualityOptions;
};

      
    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-[45px] w-full">
        {/* Left DropDown Section */}
            <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2">
                <div className="h-auto">
                <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
                     Size
                </label>
                <button
                    onClick={() => setIsOpenSize(!isOpenSize)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
                >
                    <span className="text-gray-700 font-medium">
                        {selectedSize || "Click to select size"}
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {isOpenSize && (
                    <div className="mt-2 border rounded-md bg-white">
                        {sizeOptions.map((option, index) => (
                            <div
                                key={index}
                                className={`px-5 py-3 text-sm cursor-pointer border-b last:border-b-0 ${
                                    selectedSize === option
                                        ? "bg-[#242424] text-white"
                                        : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                                }`}
                                onClick={() => { 
                                    setSelectedSize(option); 
                                    onSizeChange(option);
                                    setIsOpenSize(false); }}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
                </div>
                {/**Quantity DropDown */}
                <div className="h-auto">
                <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
                     Quantity
                </label>
                <button
                    onClick={() => setIsOpenQuantity(!isOpenQuantity)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
                >
                    <span className="text-gray-700 font-medium">
                        {selectedQuantity || "Click to select quantity"}
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {isOpenQuantity && (
                    <div className="mt-2 border rounded-md bg-white">
                        {sizeQuantity.map((option, index) => (
                            <div
                                key={index}
                                className={`px-5 py-3 text-sm cursor-pointer border-b last:border-b-0 ${
                                    selectedQuantity === option
                                        ? "bg-[#242424] text-white"
                                        : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                                }`}
                                onClick={() => { 
                                    setSelectedQuantity(option); 
                                    onQuantityChange(option);
                                    setIsOpenQuantity(false); }}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
                </div>
            </div>

        {/* Right DropDown Section */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
            <div className="h-auto">
            <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
                Quality
            </label>
            <button
                onClick={() => setIsOpenQuality(!isOpenQuality)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
            >
                <span className="text-gray-700 font-medium">
                    {selectedQuality || "Click to select quality"}
                </span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpenQuality && (
                <div className="mt-2 border rounded-md bg-white">
                    {getFilteredQualities().map((option, index) => (
                        <div
                            key={index}
                            className={`px-5 py-3 text-sm cursor-pointer border-b last:border-b-0 ${
                                selectedQuality === option
                                    ? "bg-[#242424] text-white"
                                    : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                            }`}
                            onClick={() => { 
                                setSelectedQulaity(option); 
                                onQualityChange(option);
                                setIsOpenQuality(false); 
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
            </div>
        </div>
    </div>
    );
};

export default DropDown;
"use client";
import React, { useState } from "react";
import { Product } from "@/app/models/products";
import { isDoubleSidedAvailable } from "@/utils/priceFinder";

const DropDown = ({
  productDetails,
  onSizeChange,
  onCopiesChange,
  pageCount,
  selectedColor,
}: {
  productDetails: Product;
  onSizeChange: (size: string) => void;
  onCopiesChange: (copies: number) => void;
  pageCount?: number;
  selectedColor?: string;
}) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCopies, setSelectedCopies] = useState("");

  const allSizeOptions = productDetails.sizes || [];
  
  // Filter double-sided options based on pricing availability
  const sizeOptions = allSizeOptions.filter(option => {
    // If it's not a double-sided option, always show it
    if (!option.toLowerCase().includes("double side")) {
      return true;
    }
    
    // If we don't have page count or color selected, show all options
    if (!pageCount || !selectedColor) {
      return true;
    }
    
    // For double-sided options, check if pricing is available
    const mappedColor = selectedColor === "B/W" ? "BlackAndWhite" : "Color";
    const isAvailable = isDoubleSidedAvailable(
      productDetails.PaperPrintingPricingRules,
      option,
      mappedColor,
      pageCount,
      parseInt(selectedCopies) || 1
    );
    
    if (process.env.NODE_ENV === 'development') {
    }
    
    return isAvailable;
  });
  
  // Debug logging for available sizes
  if (process.env.NODE_ENV === 'development') {
  }
  const copiesOptions = ["1", "2", "3", "4", "5"];

  const [isOpenSize, setIsOpenSize] = useState(false);
  const [isOpenCopies, setIsOpenCopies] = useState(false);

  return (
    <div className="flex w-full flex-col gap-6 md:flex-row md:gap-[45px]">
      {/* Size Dropdown */}
      <div className="flex flex-col gap-5 md:gap-10 w-full md:w-1/2">
      <div className="h-auto">
       <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
      Select Size
        </label>
        <div
            className="relative border rounded-md focus:ring-2 focus:ring-gray-300 py-3 px-5 bg-white cursor-pointer"
            onClick={() => setIsOpenSize(!isOpenSize)}
        >
          <div className="text-sm font-normal text-gray-700">
            {selectedSize || "Select Size"}
          </div>
          <span className="absolute right-5 top-1/2 -translate-y-1/2 transform text-gray-400">
            ▼
          </span>
        </div>
        {isOpenSize && (
          <ul className="z-10 mt-1 w-full rounded-md border bg-white py-3 shadow-lg">
            {sizeOptions.map((option, index) => (
              <li
                key={index}
                className={`cursor-pointer px-5 py-3 text-sm ${
                  selectedSize === option
                    ? "bg-[#242424] text-white"
                    : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                }`}
                onClick={() => {
                  setSelectedSize(option);
                  onSizeChange(option); // ✅ Pass to parent
                  setIsOpenSize(false);
                  
                  // Debug logging for selected size
                  if (process.env.NODE_ENV === 'development') {
                  }
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
        </div>
      </div>

      {/* No. of Copies Dropdown */}
      <div className="flex w-full flex-col gap-4 md:w-1/2">
      <div className="h-auto">
      <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
      No. of Copies
        </label>
        <input
            type="number"
            className="border rounded-md focus:ring-2 focus:ring-gray-300 py-2.5 px-5 bg-white text-gray-700 w-full"
            value={selectedCopies || ""}
            min="1"
            placeholder="Enter No. of Copies"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCopies(value);
              onCopiesChange(Number(value));
            }}
          />
      </div>
      </div>
    </div>
  );
};

export default DropDown;

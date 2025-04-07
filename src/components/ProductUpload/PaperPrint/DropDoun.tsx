"use client";
import React, { useState } from "react";
import { Product } from "@/app/models/products";

const DropDown = ({ 
  productDetails, 
  onSizeChange, 
  onCopiesChange 
}: { 
  productDetails: Product;
  onSizeChange: (size: string) => void;
  onCopiesChange: (copies: number) => void;
}) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCopies, setSelectedCopies] = useState("1");

  const sizeOptions = productDetails.sizes || [];
  const copiesOptions = ["1", "2", "3", "4", "5"];

  const [isOpenSize, setIsOpenSize] = useState(false);
  const [isOpenCopies, setIsOpenCopies] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-[45px] w-full">
      {/* Size Dropdown */}
      <div className="flex flex-col gap-4 w-full md:w-1/2">
        <label className="block text-[#242424] text-base font-medium mb-2.5">
          Select Size
        </label>
        <div
          className="relative border rounded-md py-3 px-5 bg-white cursor-pointer"
          onClick={() => setIsOpenSize(!isOpenSize)}
        >
          <div className="text-sm font-normal text-gray-700">{selectedSize || "Select Size"}</div>
          <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400">▼</span>
        </div>
        {isOpenSize && (
          <ul className="z-10 w-full mt-1 py-3 bg-white border rounded-md shadow-lg">
            {sizeOptions.map((option, index) => (
              <li
                key={index}
                className={`px-5 py-3 text-sm cursor-pointer ${
                  selectedSize === option ? "bg-[#242424] text-white" : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                }`}
                onClick={() => { 
                  setSelectedSize(option); 
                  onSizeChange(option); // ✅ Pass to parent
                  setIsOpenSize(false); 
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* No. of Copies Dropdown */}
      <div className="flex flex-col gap-4 w-full md:w-1/2">
        <label className="block text-[#242424] text-base font-medium mb-2.5">
          No. of Copies
        </label>
        <div
          className="relative border rounded-md py-3 px-5 bg-white cursor-pointer"
          onClick={() => setIsOpenCopies(!isOpenCopies)}
        >
          <div className="text-sm font-normal text-gray-700">{selectedCopies}</div>
          <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400">▼</span>
        </div>
        {isOpenCopies && (
          <ul className="z-10 w-full mt-1 py-3 bg-white border rounded-md shadow-lg">
            {copiesOptions.map((option, index) => (
              <li
                key={index}
                className={`px-5 py-3 text-sm cursor-pointer ${
                  selectedCopies === option ? "bg-[#242424] text-white" : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                }`}
                onClick={() => { 
                  setSelectedCopies(option); 
                  onCopiesChange(Number(option)); // ✅ Pass to parent
                  setIsOpenCopies(false); 
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DropDown;

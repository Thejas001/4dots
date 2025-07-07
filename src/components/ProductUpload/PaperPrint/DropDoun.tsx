"use client";
import React, { useState } from "react";
import { Product } from "@/app/models/products";

const DropDown = ({
  productDetails,
  onSizeChange,
  onCopiesChange,
}: {
  productDetails: Product;
  onSizeChange: (size: string) => void;
  onCopiesChange: (copies: number) => void;
}) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCopies, setSelectedCopies] = useState("");

  const sizeOptions = productDetails.sizes || [];
  const copiesOptions = ["1", "2", "3", "4", "5"];

  const [isOpenSize, setIsOpenSize] = useState(false);
  const [isOpenCopies, setIsOpenCopies] = useState(false);

  return (
    <div className="flex w-full flex-col gap-6 md:flex-row md:gap-[45px]">
      {/* Size Dropdown */}
      <div className="flex w-full flex-col gap-4 md:w-1/2">
        <label className="mb-2.5 block text-base font-medium text-[#242424]">
          Select Size
        </label>
        <div
          className="relative cursor-pointer rounded-md border bg-white px-5 py-3"
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
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* No. of Copies Dropdown */}
      <div className="flex w-full flex-col gap-4 md:w-1/2">
        <label className="mb-2.5 block text-base font-medium text-[#242424]">
          No. of Copies
        </label>
        <input
            type="number"
            className="w-full rounded-md border bg-white px-5 py-3 text-gray-700 focus:ring-2 focus:ring-gray-300"
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
  );
};

export default DropDown;

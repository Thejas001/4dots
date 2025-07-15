"use client";
import React, { useState ,useEffect } from "react";
import { Product } from "@/app/models/products";

const Product1DropDown = ({ 
    productDetails ,
    onSizeChange, 
    onQuantityChange,
    UpdatedQuantity   
  }
    : { 
      productDetails: Product 
      onSizeChange: (size: string) => void;
      onQuantityChange: (quantity: number) => void;
      UpdatedQuantity: number | null;
    }) => {
  
  const [isOpenSize, setIsOpenSize] = useState(false);
  const [isOpenQuantity, setIsOpenQuantity] = useState(false);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  
  const sizeOptions = productDetails.sizes || [];
  const sizeQuantity = productDetails.quantity || [];

  useEffect(() => {
    setSelectedQuantity(UpdatedQuantity);
  }, [UpdatedQuantity]);


  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-[45px] w-full">
      {/* Left DropDown Section */}
      <div className="flex flex-col gap-3 w-full sm:w-1/2">
        <div className="h-auto">
          <label className="block text-[#242424] text-sm sm:text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
            Select Size
          </label>
          <div
            className="relative border rounded-md focus:ring-2 focus:ring-gray-300 py-2 px-3 sm:py-3 sm:px-5 bg-white cursor-pointer w-full"
            onClick={() => setIsOpenSize(!isOpenSize)}
          >
            <div className="text-sm sm:text-base font-normal text-gray-700">{selectedSize || "Select Size"}</div>
            <span className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
              ▼
            </span>
          </div>
          {isOpenSize && (
            <ul className="z-10 w-full mt-1 py-2 sm:py-3 bg-white border rounded-md shadow-lg">
              {sizeOptions.map((option, index) => (
                <li
                  key={index}
                  className={`px-3 sm:px-5 py-2 sm:py-3 text-sm sm:text-base cursor-pointer ${
                    selectedSize === option ? "bg-[#242424] text-white" : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                  }`}
                  onClick={() => { 
                    setSelectedSize(option); 
                    onSizeChange(option);
                    setIsOpenSize(false); }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right DropDown Section */}
      <div className="flex flex-col gap-3 w-full sm:w-1/2">
        <div className="h-auto">
          <label className="block text-[#242424] text-sm sm:text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            className="border rounded-md focus:ring-2 focus:ring-gray-300 py-2 px-3 sm:py-3 sm:px-5 bg-white text-gray-700 w-full text-sm sm:text-base"
            placeholder="Enter Quantity"
            value={selectedQuantity || ""}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setSelectedQuantity(value);
              onQuantityChange(value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Product1DropDown;
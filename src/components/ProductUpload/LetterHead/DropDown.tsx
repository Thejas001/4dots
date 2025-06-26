"use client";
import React, { useState } from "react";
import { Product } from "@/app/models/products";
import {letterHeadRules} from "@/utils/bindingdisable"

const DropDown = ({
    productDetails,
    onSizeChange,
    onQuantityChange,
    onQualityChange,
    selectedOption
}:{
    productDetails: Product,
    onSizeChange: (size: string) => void;
    onQuantityChange: (quantity: number) => void;
    onQualityChange: (quality: string) => void; 
    selectedOption: string;
}) => {

      const [isOpenSize, setIsOpenSize] = useState(false);
      const [selectedSize, setSelectedSize] = useState("");
    
      const [isOpenQunatity, setIsOpenQuantity] = useState(false);
      const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);

      const [isOpenQuality, setIsOpenQuality] = useState(false);
      const [selectedQuality, setSelectedQulaity] = useState("");
      
      const sizeOptions = productDetails.sizes || [];
      const quantityOptions = productDetails.quantity || [];
      const qualityOptions = productDetails.Quality || [];


      
// Get Available Quantity
const getAvailableQuantities = () => {
  if (productDetails.name !== "Letter Head") return quantityOptions;

  if (selectedOption === "Colour" && selectedQuality === "100GSM") {
    console.log("Letter Head Colour 100GSM selected");
    return letterHeadRules.Colour.Quantity["100GSM"];
  }

  return quantityOptions;
};

        // Get Available Sizes
        const getAvailableSizes = () => {
        if (productDetails.name !== "Letter Head") return sizeOptions;

        if (selectedOption === "Colour") {
            return letterHeadRules.Colour.Size;
        }

        return sizeOptions;
        };

        // Apply filters
        const filteredQuantities = getAvailableQuantities();
        const filteredSizes = getAvailableSizes();
            
    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-[45px] w-full">
        {/* Left DropDown Section */}
            <div className="flex flex-col gap-5 md:gap-10 w-full md:w-1/2">
                <div className="h-auto">
                <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
                    Quality
                </label>
                <div
                    className="relative border rounded-md focus:ring-2 focus:ring-gray-300 py-3 px-5 bg-white cursor-pointer"
                    onClick={() => setIsOpenQuality(!isOpenQuality)}
                >
                    <div className="text-sm font-normal text-gray-700">{selectedQuality || "Quality"}</div>
                    <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ▼
                    </span>
                </div>
                {isOpenQuality && (
                    <ul className="z-10 w-full mt-1 py-3 bg-white border rounded-md shadow-lg">
                    {qualityOptions.map((option, index) => (
                        <li
                        key={index}
                        className={`px-5 py-3 text-sm cursor-pointer ${
                            selectedQuality === option ? "bg-[#242424] text-white" : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                        }`}
                        onClick={() => { 
                            setSelectedQulaity(option); 
                            onQualityChange(option);
                            setIsOpenQuality(false); }}
                        >
                        {option}
                        </li>
                    ))}
                    </ul>
                )}
                </div>
                {/**Orientation DropDown */}
                <div className="h-auto">
                <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
                Size
                </label>
                <div
                    className="relative border rounded-md focus:ring-2 focus:ring-gray-300 py-3 px-5 bg-white cursor-pointer"
                    onClick={() => setIsOpenSize(!isOpenSize)}
                >
                    <div className="text-sm font-normal text-gray-700">{selectedSize || "Size"}</div>
                    <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ▼
                    </span>
                </div>
                {isOpenSize && (
                    <ul className="z-10 w-full mt-1 py-3 bg-white border rounded-md shadow-lg">
                    {filteredSizes.map((option, index) => (
                        <li
                        key={index}
                        className={`px-5 py-3 text-sm cursor-pointer ${
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
        <div className="flex flex-col gap-4 w-full md:w-1/2">
            <div className="h-auto">
            <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
                Quantity
            </label>
            <div
                className="relative border rounded-md focus:ring-2 focus:ring-gray-300 py-3 px-5 bg-white cursor-pointer"
                onClick={() => setIsOpenQuantity(!isOpenQunatity)}
            >
                <div className="text-sm font-normal text-gray-700">{selectedQuantity || "Quantity"}</div>
                <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                ▼
                </span>
            </div>
            {isOpenQunatity && (
                <ul className="z-10 w-full mt-1 py-3 bg-white border rounded-md shadow-lg">
                {getAvailableQuantities().map((option, index) => (
                    <li
                    key={index}
                    className={`px-5 py-3 text-sm cursor-pointer ${
                        selectedQuantity === option ? "bg-[#242424] text-white" : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                    }`}
                    onClick={() => { 
                    const quantity = Number(option);
                    setSelectedQuantity(quantity); 
                    onQuantityChange(quantity);
                    setIsOpenQuantity(false);  }}
                    >
                    {option}
                    </li>
                ))}
                </ul>
            )}
            </div>
        </div>
    </div>
    );
};

export default DropDown;
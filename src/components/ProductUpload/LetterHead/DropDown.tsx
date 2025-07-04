"use client";
import React, { useState, useMemo } from "react";
import { Product } from "@/app/models/products";
import { letterHeadVariants } from "./letterHeadVariants";

// Define the type for letterHeadVariants
interface LetterHeadVariant {
  Service: string;
  Quality: string;
  Quantity: number; // Aligned with onQuantityChange expecting number
  Sizes: Record<string, string | null>;
}

interface Props {
  productDetails: Product;
  onSizeChange: (size: string) => void;
  onQuantityChange: (quantity: number) => void;
  onQualityChange: (quality: string) => void;
  selectedOption: string;
}

const DropDown = ({
  productDetails,
  onSizeChange,
  onQuantityChange,
  onQualityChange,
  selectedOption,
}: Props) => {
  const [isOpenSize, setIsOpenSize] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [isOpenQuantity, setIsOpenQuantity] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [isOpenQuality, setIsOpenQuality] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("");

  const sizeOptions = productDetails.sizes || [];
  const quantityOptions = productDetails.quantity || [];
  const qualityOptions = productDetails.Quality || [];

  // Get Available Qualities
  const availableQualities = useMemo(() => {
    const filtered = letterHeadVariants.filter((v) => v.Service === selectedOption);
    return [...new Set(filtered.map((v) => v.Quality))];
  }, [selectedOption]);

  // Get Available Quantities
  const availableQuantities = useMemo(() => {
    const filtered = letterHeadVariants.filter(
      (v) => v.Service === selectedOption && v.Quality === selectedQuality
    );
    return [...new Set(filtered.map((v) => v.Quantity))];
  }, [selectedOption, selectedQuality]);

  // Get Available Sizes
  const availableSizes = useMemo(() => {
    const filtered = letterHeadVariants.filter(
      (v) =>
        v.Service === selectedOption &&
        v.Quality === selectedQuality &&
        v.Quantity === selectedQuantity
    );

    if (filtered.length === 0) return [];

    const sizes = Object.entries(filtered[0].Sizes)
      .filter(([_, value]) => value !== null && value !== "NIL")
      .map(([size]) => size);

    return sizes;
  }, [selectedOption, selectedQuality, selectedQuantity]);

  // Reset dependent selections when quality or quantity changes
  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    onQualityChange(quality);
    setSelectedQuantity(null); // Reset quantity
    setSelectedSize(""); // Reset size
    setIsOpenQuality(false);
  };

  const handleQuantityChange = (quantity: number) => {
    setSelectedQuantity(quantity);
    onQuantityChange(quantity);
    setSelectedSize(""); // Reset size
    setIsOpenQuantity(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-[45px] w-full">
      {/* Left DropDown Section */}
      <div className="flex flex-col gap-5 md:gap-10 w-full md:w-1/2">
        {/* Quality Dropdown */}
        <div className="h-auto">
          <label
            htmlFor="quality-select"
            className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5"
          >
            Quality
          </label>
          <div
            id="quality-select"
            role="combobox"
            aria-expanded={isOpenQuality}
            className="relative border rounded-md focus:ring-2 focus:ring-gray-300 py-3 px-5 bg-white cursor-pointer"
            onClick={() => setIsOpenQuality(!isOpenQuality)}
          >
            <div className="text-sm font-normal text-gray-700">
              {selectedQuality || "Quality"}
            </div>
            <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
              ▼
            </span>
          </div>
          {isOpenQuality && (
            <ul
              className="z-10 w-full mt-1 py-3 bg-white border rounded-md shadow-lg"
              role="listbox"
            >
             {qualityOptions
                .filter((option) => availableQualities.includes(option)) // ✅ only available
                .map((option, index) => (
                    <li
                        key={index}
                        role="option"
                        aria-selected={selectedQuality === option}
                        className={`px-5 py-3 text-sm cursor-pointer ${
                            selectedQuality === option
                                ? "bg-[#242424] text-white"
                                : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                        }`}
                        onClick={() => {
                            handleQualityChange(option);
                        }}
                    >
                        {option}
                    </li>
            ))}

            </ul>
          )}
        </div>

        {/* Size Dropdown */}
        <div className="h-auto">
          <label
            htmlFor="size-select"
            className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5"
          >
            Size
          </label>
          <div
            id="size-select"
            role="combobox"
            aria-expanded={isOpenSize}
            className="relative border rounded-md focus:ring-2 focus:ring-gray-300 py-3 px-5 bg-white cursor-pointer"
            onClick={() => setIsOpenSize(!isOpenSize)}
          >
            <div className="text-sm font-normal text-gray-700">{selectedSize || "Size"}</div>
            <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
              ▼
            </span>
          </div>
          {isOpenSize && (
            <ul
              className="z-10 w-full mt-1 py-3 bg-white border rounded-md shadow-lg"
              role="listbox"
            >
            {sizeOptions
                .filter((option) => availableSizes.includes(option)) // ✅ Filter only available
                .map((option, index) => (
                    <li
                        key={index}
                        role="option"
                        aria-selected={selectedSize === option}
                        className={`px-5 py-3 text-sm cursor-pointer ${
                            selectedSize === option
                                ? "bg-[#242424] text-white"
                                : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                        }`}
                        onClick={() => {
                            setSelectedSize(option);
                            onSizeChange(option);
                            setIsOpenSize(false);
                        }}
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
        {/* Quantity Dropdown */}
        <div className="h-auto">
          <label
            htmlFor="quantity-select"
            className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5"
          >
            Quantity
          </label>
          <div
            id="quantity-select"
            role="combobox"
            aria-expanded={isOpenQuantity}
            className="relative border rounded-md focus:ring-2 focus:ring-gray-300 py-3 px-5 bg-white cursor-pointer"
            onClick={() => setIsOpenQuantity(!isOpenQuantity)}
          >
            <div className="text-sm font-normal text-gray-700">
              {selectedQuantity || "Quantity"}
            </div>
            <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
              ▼
            </span>
          </div>
          {isOpenQuantity && (
            <ul
              className="z-10 w-full mt-1 py-3 bg-white border rounded-md shadow-lg"
              role="listbox"
            >
            {quantityOptions
                .map(Number) // ensure numbers
                .filter((option) => availableQuantities.includes(option)) // ✅ show only available
                .map((option, index) => (
                    <li
                        key={index}
                        role="option"
                        aria-selected={selectedQuantity === option}
                        className={`px-5 py-3 text-sm cursor-pointer ${
                            selectedQuantity === option
                                ? "bg-[#242424] text-white"
                                : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                        }`}
                        onClick={() => {
                            handleQuantityChange(option);
                        }}
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
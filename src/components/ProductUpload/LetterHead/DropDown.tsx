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
  showQualityButton: boolean;
  showQualityOptions: boolean;
  showQuantityInput: boolean;
  showSizeButton: boolean;
  showSizeOptions: boolean;
  onShowQualityOptions: (show: boolean) => void;
  onShowQuantityInput: (show: boolean) => void;
  onShowSizeButton: (show: boolean) => void;
  onShowSizeOptions: (show: boolean) => void;
}

const DropDown = ({
  productDetails,
  onSizeChange,
  onQuantityChange,
  onQualityChange,
  selectedOption,
  showQualityButton,
  showQualityOptions,
  showQuantityInput,
  showSizeButton,
  showSizeOptions,
  onShowQualityOptions,
  onShowQuantityInput,
  onShowSizeButton,
  onShowSizeOptions,
}: Props) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
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

  // Handle quality selection with progressive disclosure
  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    onQualityChange(quality);
    setSelectedQuantity(null); // Reset quantity
    setSelectedSize(""); // Reset size
    onShowQualityOptions(false); // Close quality options
    onShowQuantityInput(true); // Show quantity input
    onShowSizeButton(false); // Hide size button
    onShowSizeOptions(false); // Hide size options
  };

  // Handle quantity selection with progressive disclosure
  const handleQuantityChange = (quantity: number) => {
    setSelectedQuantity(quantity);
    onQuantityChange(quantity);
    setSelectedSize(""); // Reset size
    onShowSizeButton(true); // Show size button
    onShowSizeOptions(false); // Hide size options
  };

  // Handle size selection with progressive disclosure
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    onSizeChange(size);
    onShowSizeOptions(false); // Close size options
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-[45px] w-full">
      {/* Mobile Layout: Progressive disclosure */}
      <div className="flex flex-col gap-5 md:gap-10 w-full md:hidden">
        {/* Quality Section */}
        {showQualityButton && !showQualityOptions && selectedOption && (
          <div className="h-auto">
            <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
              Quality
            </label>
            <button
              onClick={() => onShowQualityOptions(true)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
            >
              <span className="text-gray-700 font-medium">
                {selectedQuality || "Click to select quality"}
              </span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Quality Options */}
        {showQualityOptions && (
          <div className="h-auto">
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px]">
                Quality
              </label>
              <button
                onClick={() => onShowQualityOptions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="border rounded-md bg-white">
              {qualityOptions
                .filter((option) => availableQualities.includes(option))
                .map((option, index) => (
                  <div
                    key={index}
                    className={`px-5 py-3 text-sm cursor-pointer border-b last:border-b-0 ${
                      selectedQuality === option
                        ? "bg-[#242424] text-white"
                        : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                    }`}
                    onClick={() => handleQualityChange(option)}
                  >
                    {option}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Quantity Section */}
        {showQuantityInput && selectedQuality && (
          <div className="h-auto">
            <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
              Quantity
            </label>
            <select
              value={selectedQuantity || ""}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                handleQuantityChange(value);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="">Select quantity</option>
              {availableQuantities.map((quantity) => (
                <option key={quantity} value={quantity}>
                  {quantity} copies
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Size Section */}
        {showSizeButton && !showSizeOptions && selectedQuantity && (
          <div className="h-auto">
            <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
              Size
            </label>
            <button
              onClick={() => onShowSizeOptions(true)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
            >
              <span className="text-gray-700 font-medium">
                {selectedSize || "Click to select size"}
              </span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Size Options */}
        {showSizeOptions && (
          <div className="h-auto">
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px]">
                Size
              </label>
              <button
                onClick={() => onShowSizeOptions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="border rounded-md bg-white">
              {sizeOptions
                .filter((option) => availableSizes.includes(option))
                .map((option, index) => (
                  <div
                    key={index}
                    className={`px-5 py-3 text-sm cursor-pointer border-b last:border-b-0 ${
                      selectedSize === option
                        ? "bg-[#242424] text-white"
                        : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                    }`}
                    onClick={() => handleSizeChange(option)}
                  >
                    {option}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout: Progressive disclosure */}
      <div className="hidden md:flex md:flex-row gap-6 md:gap-[45px] w-full">
        {/* Left Section */}
        <div className="flex flex-col gap-5 md:gap-10 w-full md:w-1/2">
          {/* Quality Section */}
          {showQualityButton && !showQualityOptions && selectedOption && (
            <div className="h-auto">
              <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
                Quality
              </label>
              <button
                onClick={() => onShowQualityOptions(true)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
              >
                <span className="text-gray-700 font-medium">
                  {selectedQuality || "Click to select quality"}
                </span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Quality Options */}
          {showQualityOptions && (
            <div className="h-auto">
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px]">
                  Quality
                </label>
                <button
                  onClick={() => onShowQualityOptions(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="border rounded-md bg-white">
                {qualityOptions
                  .filter((option) => availableQualities.includes(option))
                  .map((option, index) => (
                    <div
                      key={index}
                      className={`px-5 py-3 text-sm cursor-pointer border-b last:border-b-0 ${
                        selectedQuality === option
                          ? "bg-[#242424] text-white"
                          : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                      }`}
                      onClick={() => handleQualityChange(option)}
                    >
                      {option}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Size Section */}
          {showSizeButton && !showSizeOptions && selectedQuantity && (
            <div className="h-auto">
              <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
                Size
              </label>
              <button
                onClick={() => onShowSizeOptions(true)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
              >
                <span className="text-gray-700 font-medium">
                  {selectedSize || "Click to select size"}
                </span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Size Options */}
          {showSizeOptions && (
            <div className="h-auto">
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px]">
                  Size
                </label>
                <button
                  onClick={() => onShowSizeOptions(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="border rounded-md bg-white">
                {sizeOptions
                  .filter((option) => availableSizes.includes(option))
                  .map((option, index) => (
                    <div
                      key={index}
                      className={`px-5 py-3 text-sm cursor-pointer border-b last:border-b-0 ${
                        selectedSize === option
                          ? "bg-[#242424] text-white"
                          : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                      }`}
                      onClick={() => handleSizeChange(option)}
                    >
                      {option}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          {/* Quantity Section */}
          {showQuantityInput && selectedQuality && (
            <div className="h-auto">
              <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
                Quantity
              </label>
              <select
                value={selectedQuantity || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  handleQuantityChange(value);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="">Select quantity</option>
                {availableQuantities.map((quantity) => (
                  <option key={quantity} value={quantity}>
                    {quantity} copies
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropDown;
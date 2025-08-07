"use client";
import React, { useState, useEffect } from "react";
import { Product } from "@/app/models/products";

const Product1DropDown = ({ 
    productDetails,
    onSizeChange, 
    onQuantityChange,
    onPriceCalculation,
    onError,
    onPricingRuleChange,
    onSelectedPriceChange,
    onFrameColorChange,
    UpdatedQuantity   
  }
    : { 
      productDetails: Product;
      onSizeChange: (size: string) => void;
      onQuantityChange: (quantity: number) => void;
      onPriceCalculation: (price: number | null, error: string | null) => void;
      onError: (error: string) => void;
      onPricingRuleChange: (rule: any) => void;
      onSelectedPriceChange: (price: number | null) => void;
      onFrameColorChange: (color: string) => void;
      UpdatedQuantity: number | null;
    }) => {
  
  const [isOpenSize, setIsOpenSize] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [selectedFrameColor, setSelectedFrameColor] = useState<string>("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Progressive disclosure states
  const [showSizeDropdown, setShowSizeDropdown] = useState<boolean>(false);
  const [showFrameColor, setShowFrameColor] = useState<boolean>(false);
  
  const sizeOptions = productDetails.sizes || [];
  const frameColorOptions = ["Black", "White", "Brown"];

  // Function to find pricing based on size and quantity
  const findPriceForSizeAndQuantity = (size: string, quantity: number) => {
    const matchingRule = productDetails.PhotoFramePricingRules?.find(rule => {
      const [min, max] = rule.QuantityRange.ValueName.split("-").map(Number);
      return (
        rule.Size?.ValueName.trim() === size.trim() &&
        quantity >= min && quantity <= max
      );
    });

    if (matchingRule) {
      return {
        price: matchingRule.Price * quantity,
        rule: matchingRule
      };
    }

    return null;
  };

  // Handle quantity selection - Step 1
  const handleQuantityChange = (quantity: number) => {
    setSelectedQuantity(quantity);
    onQuantityChange(quantity);

    if (quantity > 0) {
      setShowSizeDropdown(true); // Show size dropdown after quantity selection
      setShowFrameColor(false); // Hide frame color
    } else {
      setShowSizeDropdown(false);
      setShowFrameColor(false);
    }

    // Clear previous price calculations
    setCalculatedPrice(null);
    setErrorMessage(null);
    onPriceCalculation(null, null);
    onPricingRuleChange(null);
    onSelectedPriceChange(null);
    onError("");
  };

  // Handle size selection - Step 3 (with immediate price calculation)
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    onSizeChange(size);
    setIsOpenSize(false); // Close size dropdown
    setShowFrameColor(true); // Show frame color after size selection

    // Calculate price immediately when size is selected
    if (size && selectedQuantity && selectedQuantity > 0) {
      const result = findPriceForSizeAndQuantity(size, selectedQuantity);
      if (result) {
        setCalculatedPrice(result.price);
        setErrorMessage(null);
        onPriceCalculation(result.price, null);
        onPricingRuleChange(result.rule);
        onSelectedPriceChange(result.price);
        onError("");
      } else {
        setCalculatedPrice(null);
        setErrorMessage("Not a valid quantity for the selected size.");
        onPriceCalculation(null, "Not a valid quantity for the selected size.");
        onPricingRuleChange(null);
        onSelectedPriceChange(null);
        onError("Not a valid quantity for the selected size.");
      }
    }
  };

  // Handle frame color selection - Step 4
  const handleFrameColorChange = (color: string) => {
    setSelectedFrameColor(color);
    onFrameColorChange(color);
  };

  useEffect(() => {
    setSelectedQuantity(UpdatedQuantity);
  }, [UpdatedQuantity]);

  useEffect(() => {
    if (selectedSize && selectedQuantity && selectedQuantity > 0) {
      const result = findPriceForSizeAndQuantity(selectedSize, selectedQuantity);
      if (result) {
        setCalculatedPrice(result.price);
        setErrorMessage(null);
        onPriceCalculation(result.price, null);
        onPricingRuleChange(result.rule);
        onSelectedPriceChange(result.price);
        onError("");
      } else {
        setCalculatedPrice(null);
        setErrorMessage("Quantity is out of the valid range for the selected size.");
        onPriceCalculation(null, "Quantity is out of the valid range for the selected size.");
        onPricingRuleChange(null);
        onSelectedPriceChange(null);
        onError("Quantity is out of the valid range for the selected size.");
      }
    }
  }, [selectedSize, selectedQuantity]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Step 1: Quantity Input */}
      <div className="w-full">
        <div className="h-auto">
          <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            className="border rounded-md focus:ring-2 focus:ring-gray-300 py-2.5 px-5 bg-white text-gray-700 w-full"
            placeholder="Enter Quantity"
            value={selectedQuantity || ""}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              handleQuantityChange(value);
            }}
          />
        </div>
      </div>

      {/* Step 2: File Uploader - This will be handled in parent component */}
      
      {/* Step 3: Size Dropdown with Price - Only show after quantity is entered */}
      {showSizeDropdown && (
        <div className="w-full">
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
                      handleSizeChange(option);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
            
            {/* Price Display - Show immediately after size selection */}
            {calculatedPrice && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Price:</span>
                  <span className="text-lg font-bold text-gray-900">₹{calculatedPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Frame Color Selection - Only show after size is selected */}
      {showFrameColor && (
        <div className="w-full">
          <div className="h-auto">
            <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
              Frame Color
            </label>
            <div className="relative flex flex-wrap gap-4 sm:gap-6 md:gap-7.5">
              {/* Black */}
              <label className="flex cursor-pointer items-center mb-2 sm:mb-0">
                <input
                  type="radio"
                  name="frame-color"
                  value="Black"
                  checked={selectedFrameColor === "Black"}
                  onChange={(e) => handleFrameColorChange(e.target.value)}
                  className="peer hidden"
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#242424] peer-checked:ring-2 peer-checked:ring-[#242424] peer-checked:ring-offset-2">
                  <div className="h-8.5 w-8.5 rounded-full bg-[#242424]"></div>
                </div>
                <span className="ml-1 text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">
                  Black
                </span>
              </label>

              {/* White */}
              <label className="flex cursor-pointer items-center mb-2 sm:mb-0">
                <input
                  type="radio"
                  name="frame-color"
                  value="White"
                  checked={selectedFrameColor === "White"}
                  onChange={(e) => handleFrameColorChange(e.target.value)}
                  className="peer hidden"
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#242424] peer-checked:ring-2 peer-checked:ring-[#242424] peer-checked:ring-offset-2">
                  <div className="h-8.5 w-8.5 rounded-full border border-[#242424] bg-[#ffffff]"></div>
                </div>
                <span className="ml-1 text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">
                  White
                </span>
              </label>

              {/* Brown */}
              <label className="flex cursor-pointer items-center mb-2 sm:mb-0">
                <input
                  type="radio"
                  name="frame-color"
                  value="Brown"
                  checked={selectedFrameColor === "Brown"}
                  onChange={(e) => handleFrameColorChange(e.target.value)}
                  className="peer hidden"
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#723100] peer-checked:ring-2 peer-checked:ring-[#723100] peer-checked:ring-offset-2">
                  <div className="h-8.5 w-8.5 rounded-full bg-[#723100]"></div>
                </div>
                <span className="ml-1 text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">
                  Brown
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product1DropDown;
import React, { useEffect } from "react";
import { findPricingRule, findAddonPrice } from "@/utils/priceFinder";
import { PaperPrintingPricingRule, PaperPrintAddonRule , Addon } from "@/app/models/products";

interface PriceCalculatorProps {
  pricingRules: PaperPrintingPricingRule[];
  addons: Addon[];
  selectedSize: string;
  selectedColor: "B/W" | "Color";
  pageCount: number;
  noOfCopies: number;
  selectedBindingType?: string;
  customCopies?: number;
  copySelection: string;
  onPriceUpdate: (price: number | null) => void;
}

// Identify double-sided paper sizes based on naming pattern
const isDoubleSided = (paperSize: string): boolean => 
  paperSize.toUpperCase().includes("DOUBLE SIDE");

// Function to parse addon price (e.g., "60/book" → 60)
const parseAddonPrice = (priceStr: string): number => {
  const price = parseFloat(priceStr.split("/")[0]);
  return isNaN(price) ? 0 : price;
};

const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  pricingRules,
  addons,
  selectedSize,
  selectedColor,
  pageCount,
  noOfCopies,
  selectedBindingType,
  copySelection,
  customCopies,
  onPriceUpdate,
}) => {
  useEffect(() => {
    // Input validation
    if (!pricingRules?.length || 
        !selectedSize || 
        !selectedColor || 
        pageCount <= 0 || 
        noOfCopies <= 0) {
      onPriceUpdate(null);
      return;
    }

    const mappedColor = selectedColor === "B/W" ? "BlackAndWhite" : "Color";

    // Find the pricing rule
    const result = findPricingRule(pricingRules, selectedSize, mappedColor, pageCount);

    if (!result) {
      console.warn("No matching pricing rule found.");
      onPriceUpdate(null);
      return;
    }

    // Calculate base price with double-sided adjustment
    const doubleSided = isDoubleSided(selectedSize);
    const sheets = doubleSided ? Math.ceil(pageCount / 2) : pageCount;
    const basePrice = result.PricePerPage * sheets * noOfCopies;


    console.log("Addonsssss:", addons);
    console.log("Selected Binding Type:", selectedBindingType);

    // Calculate addon price
    let addonPrice = 0;
    if (selectedBindingType) {
      const addonRule = findAddonPrice( // ✅ Get the full object
        addons,
        selectedBindingType,
        selectedSize,
        mappedColor,
        pageCount
      );
    
      console.log("Addon Rule:", addonRule);
    
      if (addonRule) {
        const pricePerAddon = parseFloat(addonRule.Price.split("/")[0]); // ✅ Extract the numeric price
    
        if (!isNaN(pricePerAddon)) {
          let addonBookCount = 0;
    
          if (copySelection === "all") {
            // Apply addon to all copies
            addonBookCount = noOfCopies;
          } else if (!copySelection || copySelection === "") {
            // Ensure customCopies is a valid number, default to 0 if undefined
            const validCustomCopies = customCopies && customCopies > 0 ? customCopies : 0;
            addonBookCount = validCustomCopies <= noOfCopies ? validCustomCopies : 0;
          }
    
          addonPrice = pricePerAddon * addonBookCount; // ✅ Update the outer addonPrice
        } else {
          console.warn("Invalid addon price.");
        }
      }
    }
    
    // Calculate total price
    const totalPrice = basePrice + addonPrice;
    
    console.log(
      `Double-Sided: ${doubleSided}, Sheets: ${sheets}, Base Price: ${basePrice}, Addon Price: ${addonPrice}, Total Price: ${totalPrice}`
    );
    
    onPriceUpdate(totalPrice);
  }, [
    pricingRules,
    addons,
    selectedSize,
    selectedColor,
    pageCount,
    noOfCopies,
    selectedBindingType,
    copySelection,
    customCopies,
    onPriceUpdate,
  ]);

  return null;
};

export default PriceCalculator;
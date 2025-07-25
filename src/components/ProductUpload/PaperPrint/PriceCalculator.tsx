import React, { useEffect } from "react";
import { findPricingRule, findAddonPrice } from "@/utils/priceFinder";
import { PaperPrintingPricingRule, Addon } from "@/app/models/products";

interface PriceCalculatorProps {
  pricingRules: PaperPrintingPricingRule[];
  addons: Addon[];
  selectedSize: string;
  selectedColor: "B/W" | "Color" | null;
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
    // ✅ Input validation
    if (
      !pricingRules?.length ||
      !selectedSize ||
      !selectedColor ||
      pageCount <= 0 ||
      noOfCopies <= 0
    ) {
      onPriceUpdate(null);
      return;
    }

    const mappedColor = selectedColor === "B/W" ? "BlackAndWhite" : "Color";
    const doubleSided = isDoubleSided(selectedSize);

    // ✅ Calculate total sheets across all copies
    const totalSheets = doubleSided
      ? Math.ceil(pageCount / 2) * noOfCopies
      : pageCount * noOfCopies;

    // ✅ Use total sheets to find correct pricing slab
    const result = findPricingRule(
      pricingRules,
      selectedSize,
      mappedColor,
      totalSheets
    );

    if (!result) {
      console.warn("No matching pricing rule found for total sheets:", totalSheets);
      onPriceUpdate(null);
      return;
    }

    // ✅ Calculate base price
    const basePrice = result.PricePerPage * totalSheets;

    // ✅ Calculate addon price if applicable
    let addonPrice = 0;
    if (selectedBindingType) {
      const addonRule = findAddonPrice(
        addons,
        selectedBindingType,
        selectedSize,
        mappedColor,
        pageCount
      );

      if (addonRule) {
        const pricePerAddon = parseAddonPrice(addonRule.Price);

        if (!isNaN(pricePerAddon)) {
          let addonBookCount = 0;

          if (copySelection === "all") {
            addonBookCount = noOfCopies;
          } else if (!copySelection || copySelection === "") {
            const validCustomCopies = customCopies && customCopies > 0 ? customCopies : 0;
            addonBookCount = validCustomCopies <= noOfCopies ? validCustomCopies : 0;
          }

          addonPrice = pricePerAddon * addonBookCount;
        }
      }
    }

    // ✅ Calculate total price and update parent
    const totalPrice = basePrice + addonPrice;
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

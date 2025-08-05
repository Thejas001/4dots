import React, { useEffect } from "react";
import { findPricingRule, findAddonPrice, isPageCountValid } from "@/utils/priceFinder";
import { PaperPrintingPricingRule, Addon } from "@/app/models/products";

interface PriceCalculatorProps {
  pricingRules: PaperPrintingPricingRule[];
  addons: Addon[];
  selectedSize: string;
  selectedColor: "B/W" | "Color" | null;
  pageCount: number;
  noOfCopies: number;
  selectedBindingType?: string;
  selectedLaminationType?: string;
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
  selectedLaminationType,
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
      if (process.env.NODE_ENV === 'development') {
        console.warn("❌ PriceCalculator: Invalid inputs", {
          pricingRulesLength: pricingRules?.length,
          selectedSize,
          selectedColor,
          pageCount,
          noOfCopies
        });
      }
      onPriceUpdate(null);
      return;
    }

    const mappedColor = selectedColor === "B/W" ? "BlackAndWhite" : "Color";
    const doubleSided = isDoubleSided(selectedSize);

    // Check if page count is valid for the selected size and color
    const isPageCountValidForSelection = isPageCountValid(pricingRules, selectedSize, mappedColor, pageCount);

    if (process.env.NODE_ENV === 'development') {
      console.log("🔍 PriceCalculator inputs:", {
        selectedSize,
        selectedColor,
        mappedColor,
        pageCount,
        noOfCopies,
        doubleSided,
        isPageCountValidForSelection
      });
      console.log("📋 Available pricing rules:", pricingRules.map(rule => ({
        size: rule.PaperSize?.ValueName,
        color: rule.ColorType?.ValueName,
        pageRange: rule.PageRange?.ValueName,
        price: rule.PricePerPage
      })));
    }

    // If page count is not valid, log warning but continue with fallback pricing
    if (!isPageCountValidForSelection) {
      if (process.env.NODE_ENV === 'development') {
        console.warn("⚠️ Page count not exactly matched, will try fallback pricing:", {
          pageCount,
          selectedSize,
          mappedColor
        });
      }
      // Don't return null - let the findPricingRule function handle fallback
    }

    // ✅ Calculate total sheets across all copies
    // For double-sided printing, we need to calculate sheets differently
    let effectivePageCount = pageCount;
    if (doubleSided) {
      effectivePageCount = Math.ceil(pageCount / 2);
    }
    
    const totalSheets = effectivePageCount * noOfCopies;
    
    if (process.env.NODE_ENV === 'development') {
      console.log("📊 Sheet calculation:", {
        originalPageCount: pageCount,
        effectivePageCount,
        noOfCopies,
        totalSheets,
        doubleSided
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log("📊 Page count calculation:", {
        originalPageCount: pageCount,
        effectivePageCount,
        doubleSided,
        totalSheets
      });
    }

    // ✅ Use total sheets to find correct pricing slab
    if (process.env.NODE_ENV === 'development') {
      console.log("🔍 Calling findPricingRule with:", {
        selectedSize,
        mappedColor,
        totalSheets,
        pricingRulesLength: pricingRules.length
      });
    }
    
    const result = findPricingRule(
      pricingRules,
      selectedSize,
      mappedColor,
      totalSheets
    );

    if (!result) {
      if (process.env.NODE_ENV === 'development') {
        console.warn("❌ No matching pricing rule found for:", {
          selectedSize,
          mappedColor,
          totalSheets,
          availableRules: pricingRules.map(r => ({
            size: r.PaperSize?.ValueName,
            color: r.ColorType?.ValueName,
            pageRange: r.PageRange?.ValueName,
            price: r.PricePerPage
          }))
        });
      }
      onPriceUpdate(null);
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log("✅ Found pricing rule:", result);
    }

    // ✅ Calculate base price
    // For double-sided, we need to calculate price per sheet, not per page
    let pricePerUnit;
    if (doubleSided) {
      // For double-sided, price is per sheet
      pricePerUnit = result.PricePerPage;
    } else {
      // For single-sided, price is per page
      pricePerUnit = result.PricePerPage;
    }
    
    const basePrice = pricePerUnit * totalSheets;
    if (process.env.NODE_ENV === 'development') {
      console.log("💰 Base price calculation:", {
        pricePerUnit: pricePerUnit,
        totalSheets,
        basePrice,
        doubleSided
      });
    }

    // ✅ Calculate addon price if applicable
    let addonPrice = 0;
    
    // Calculate binding addon price
    if (selectedBindingType) {
      if (process.env.NODE_ENV === 'development') {
        console.log("🔗 Calculating binding addon price for:", selectedBindingType);
      }
      
      const addonRule = findAddonPrice(
        addons,
        selectedBindingType,
        selectedSize,
        mappedColor,
        pageCount
      );

      if (addonRule) {
        const pricePerAddon = parseAddonPrice(addonRule.Price);
        if (process.env.NODE_ENV === 'development') {
          console.log("📦 Binding addon rule found:", {
            addonRule,
            pricePerAddon
          });
        }

        if (!isNaN(pricePerAddon)) {
          let addonBookCount = 0;

          if (copySelection === "all") {
            addonBookCount = noOfCopies;
          } else if (!copySelection || copySelection === "") {
            const validCustomCopies = customCopies && customCopies > 0 ? customCopies : 0;
            addonBookCount = validCustomCopies <= noOfCopies ? validCustomCopies : 0;
          }

          addonPrice += pricePerAddon * addonBookCount;
          if (process.env.NODE_ENV === 'development') {
            console.log("🔗 Binding addon price calculation:", {
              pricePerAddon,
              addonBookCount,
              addonPrice
            });
          }
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn("❌ No binding addon rule found for:", {
            selectedBindingType,
            selectedSize,
            mappedColor,
            pageCount
          });
        }
      }
    }

    // Calculate lamination addon price
    if (selectedLaminationType) {
      if (process.env.NODE_ENV === 'development') {
        console.log("🔗 Calculating lamination addon price for:", selectedLaminationType);
      }
      
      const addonRule = findAddonPrice(
        addons,
        selectedLaminationType,
        selectedSize,
        mappedColor,
        pageCount
      );

      if (addonRule) {
        const pricePerAddon = parseAddonPrice(addonRule.Price);
        if (process.env.NODE_ENV === 'development') {
          console.log("📦 Lamination addon rule found:", {
            addonRule,
            pricePerAddon
          });
        }

        if (!isNaN(pricePerAddon)) {
          // For lamination, calculate based on total page count (uploaded PDF pages × quantity)
          const totalPageCount = pageCount * noOfCopies;

          addonPrice += pricePerAddon * totalPageCount;
          if (process.env.NODE_ENV === 'development') {
            console.log("🔗 Lamination addon price calculation:", {
              pricePerAddon,
              totalPageCount,
              addonPrice
            });
          }
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn("❌ No lamination addon rule found for:", {
            selectedLaminationType,
            selectedSize,
            mappedColor,
            pageCount
          });
        }
      }
    }

    // ✅ Calculate total price and update parent
    const totalPrice = basePrice + addonPrice;
    if (process.env.NODE_ENV === 'development') {
      console.log("💵 Final price calculation:", {
        basePrice,
        addonPrice,
        totalPrice
      });
    }
    
    onPriceUpdate(totalPrice);

  }, [
    pricingRules,
    addons,
    selectedSize,
    selectedColor,
    pageCount,
    noOfCopies,
    selectedBindingType,
    selectedLaminationType,
    copySelection,
    customCopies,
    onPriceUpdate,
  ]);

  return null;
};

export default PriceCalculator;

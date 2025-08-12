import PriceCalculator from "../PaperPrint/PriceCalculator";

// utils/offsetPriceCalculator.ts
interface OffsetPrintingPricingRule {
  Price: number;
  NoticeType: { ValueName: string; AttributeID: number; ValueID: number };
  Quality: { ValueName: string; AttributeID: number; ValueID: number };
  Quantity: { ValueName: string; AttributeID: number; ValueID: number };
}

export const findOffsetPrintingPricingRule1 = (
  pricingRules: OffsetPrintingPricingRule[] | undefined,
  selectedSize: string,
  selectedQuality: string,
): OffsetPrintingPricingRule | null => {
  if (!pricingRules || pricingRules.length === 0) {
    return null;
  }


  const rule = pricingRules.find(
    (rule) =>
      rule.NoticeType?.ValueName.trim().toLowerCase() === selectedSize.trim().toLowerCase() &&
      rule.Quality?.ValueName.trim().toLowerCase() === selectedQuality.trim().toLowerCase() &&
      rule.Quantity?.ValueName.trim() === "1000",
  );

  if (!rule) {
    return null;
  }

  return rule;
};

export const calculateOffsetPrintingPrice = (
  pricingRules: OffsetPrintingPricingRule[] | undefined,
  selectedSize: string,
  selectedQuantity: number,
  selectedQuality: string,
): number | null => {
  if (selectedQuantity === null || selectedQuantity <= 0) {
    return null;  // ✅ Return null for invalid quantity
  }

  const rule = findOffsetPrintingPricingRule1(pricingRules, selectedSize, selectedQuality);

  if (!rule) {
    return null;
  }

  const basePrice = rule.Price; // Price for 1000 units
  const pricePerUnit = basePrice; // Calculate price per unit
  const totalPrice = pricePerUnit * selectedQuantity; // Multiply by desired units
  return Number(totalPrice.toFixed(2)); // Round to 2 decimal places
};

export default { findOffsetPrintingPricingRule1, calculateOffsetPrintingPrice };
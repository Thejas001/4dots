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
    console.warn("No Offset Printing pricing rules available.");
    return null;
  }

  console.log(`Inputs: Size=${selectedSize}, Quality=${selectedQuality}`);

  const rule = pricingRules.find(
    (rule) =>
      rule.NoticeType?.ValueName.trim().toLowerCase() === selectedSize.trim().toLowerCase() &&
      rule.Quality?.ValueName.trim().toLowerCase() === selectedQuality.trim().toLowerCase() &&
      rule.Quantity?.ValueName.trim() === "1000",
  );

  console.log("✅ Matched Offset Printing Pricing Rule:", rule);
  if (!rule) {
    console.warn(`No pricing rule found for Size=${selectedSize}, Quality=${selectedQuality}, Quantity=1000`);
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
    console.warn("Quantity must be greater than 0.");
    return null;  // ✅ Return null for invalid quantity
  }

  const rule = findOffsetPrintingPricingRule1(pricingRules, selectedSize, selectedQuality);

  if (!rule) {
    console.error("No pricing rule found.");
    return null;
  }

  const basePrice = rule.Price; // Price for 1000 units
  const pricePerUnit = basePrice; // Calculate price per unit
  const totalPrice = pricePerUnit * selectedQuantity; // Multiply by desired units

  console.log(
    `Calculated Price: BasePrice=${basePrice}, PricePerUnit=${pricePerUnit}, Quantity=${selectedQuantity}, Total=${totalPrice}`,
  );

  return Number(totalPrice.toFixed(2)); // Round to 2 decimal places
};

export default { findOffsetPrintingPricingRule1, calculateOffsetPrintingPrice };
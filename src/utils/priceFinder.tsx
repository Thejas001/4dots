import {
  PaperPrintingPricingRule,
  NameSlipPricingRule,
  PhotoFramePricingRule,
  BusinessCardPricingRule,
  OffsetPrintingPricingRule,
  LetterHeadPricingRule,
  PolaroidCardPricingRule,
  CanvasPricingRule,
  PaperPrintAddonRule,
} from "@/app/models/products";


const findAddonPageRange = (
  pageCount: number,
  rules: any[] // ✅ Accept AddonRule[] instead of PaperPrintingPricingRule[]
) => {
  const matchingRule = rules.find((rule) => {
    if (!rule.PageRange) return false; // Safe check for missing values

    const [min, max] = rule.PageRange.split("-").map(Number); // Convert "101-500" → [101, 500]

    return pageCount >= min && pageCount <= max;
  });

  return matchingRule ? matchingRule.PageRange : null; // ✅ Return the PageRange directly
};


// ✅ Function to determine the correct page range based on user input
const findPageRange = (
  pageCount: number,
  pricingRules: PaperPrintingPricingRule[],
) => {
  const matchingRule = pricingRules.find((rule) => {
    if (!rule.PageRange?.ValueName) return false; // Safe check for missing values

    const [min, max] = rule.PageRange.ValueName.split("-").map(Number); // Convert "101-500" → [101, 500]

    return pageCount >= min && pageCount <= max;
  });

  return matchingRule ? matchingRule.PageRange.ValueName : null;
};


// ✅ Function to find the correct pricing rule for paper printing and addons
export const findPricingRule = (
  pricingRules: PaperPrintingPricingRule[] | undefined,
  selectedSize: string,
  selectedColor: string,
  pageCount: number
) => {

  if (!pricingRules || pricingRules.length === 0) {
    console.warn("No pricing rules available.");
    return null;
  }

  // Find the correct page range based on user input
  const matchedPageRange = findPageRange(pageCount, pricingRules);
  console.log("Matched Page Range:", matchedPageRange);

  if (!matchedPageRange) {
    console.warn(`No matching page range found for ${pageCount} pages.`);
    return null;
  }

  // Find the pricing rule that matches size, color, and page range
  const rule = pricingRules.find(
    (rule) =>
      rule.PaperSize?.ValueName === selectedSize &&
      rule.ColorType?.ValueName === selectedColor &&
      rule.PageRange?.ValueName === matchedPageRange
  ) || null;

  console.log("Matched Pricing Rule:", rule);

  if (!rule) {
    console.warn("No matching pricing rule found.");
    return null;
  }
  const extractedData: PaperPrintingPricingRule = {
    PricePerPage: rule.PricePerPage,
    PaperSize: { 
      ValueName: rule.PaperSize?.ValueName || "" ,
      AttributeID: rule.PaperSize?.AttributeID || 0,
      ValueID: rule.PaperSize?.ValueID || 0,
    }, // ✅ Keep as object
    ColorType: { 
      ValueName: rule.ColorType?.ValueName || "" ,
      AttributeID: rule.ColorType?.AttributeID || 0,
      ValueID: rule.ColorType?.ValueID || 0,
    }, // ✅ Keep as object
    PageRange: {
       ValueName: rule.PageRange?.ValueName || "",
       AttributeID: rule.PageRange?.AttributeID || 0,
       ValueID: rule.PageRange?.ValueID || 0,
      },
  };
  console.log("extracted Attribute IDs & Value Names:", extractedData);
  return extractedData;
};


//addon

export const findAddonPrice = (
  addons: any[] | undefined,
  selectedBindingType: string,
  selectedSize: string,
  selectedColor: string,
  pageCount: number
) => {
  console.log("Starting addonPriceFinder...");
  console.log("Binding Type:", selectedBindingType);
  console.log("Selected Size:", selectedSize);
  console.log("Selected Color:", selectedColor);
  console.log("Page Count:", pageCount);

  if (!addons || addons.length === 0) {
    console.warn("No addons available.");
    return null;
  }

  // Find the correct addon based on binding type
  const addon = addons.find((addon) => addon.AddonName === selectedBindingType);

  if (!addon) {
    console.warn(`No addon found for binding type: ${selectedBindingType}`);
    return null;
  }

  // Extract pricing rules from the addon
  const Rules = addon.Rules || [];

  // Find the correct page range
  const pageRange = findAddonPageRange(pageCount, Rules); // ✅ Pass AddonRule[]
  console.log("Matched Page Range:", pageRange);

  if (!pageRange) {
    console.warn("No matching page range found.");
    return null;
  }

  // Find the matching rule within the addon
  const matchedRule = addon.Rules.find(
    (rule: any) =>
      rule.PaperSize === selectedSize &&
      rule.ColorName === selectedColor &&
      rule.PageRange === pageRange // ✅ Match the calculated pageRange
  ) || null;

  console.log("Matched Addon Rule:", matchedRule);

  if (!matchedRule) {
    console.warn("No matching addon rule found.");
    return null;
  }
    //const numericPrice = parseFloat(matchedRule.Price.split("/")[0]);
    // return isNaN(numericPrice) ? null : numericPrice;

    return matchedRule;
};


// ✅ Function to find the correct pricing rule for photo frames
export const findPhotoFramePricingRule = (
  pricingRules: PhotoFramePricingRule[] | undefined,
  selectedSize: string,
  selectedQuantity: string
) => {
  if (!pricingRules || pricingRules.length === 0) {
    console.warn("No photo frame pricing rules available.");
    return null;
  }

  const quantity = parseInt(selectedQuantity, 10);

  // Find the pricing rule for the exact selected quantity
  let rule = pricingRules.find(
    (rule) =>
      rule.Size?.ValueName === selectedSize &&
      rule.Quantity?.ValueName === selectedQuantity
  );

  // Find the pricing rule for Quantity 8 (API expects this when quantity > 8)
  const ruleFor8Frames = pricingRules.find(
    (rule) =>
      rule.Size?.ValueName === selectedSize &&
      rule.Quantity?.ValueName === "8"
  );

  // If quantity > 8, use Quantity 8's attributes but adjust the price
  if (quantity > 8 && ruleFor8Frames) {
    const perFramePrice = ruleFor8Frames.Price / 8; // Get per-frame price
    const totalPrice = parseFloat((perFramePrice * quantity).toFixed(3)); // Limit to 3 decimal places

    return {
      Price: totalPrice, // Max 3 decimal places
      Size: {
        ValueName: ruleFor8Frames.Size?.ValueName || "",
        AttributeID: ruleFor8Frames.Size?.AttributeID || 0,
        ValueID: ruleFor8Frames.Size?.ValueID || 0,
      },
      Quantity: {
        ValueName: "8", // API should always receive 8
        AttributeID: ruleFor8Frames.Quantity?.AttributeID || 0,
        ValueID: ruleFor8Frames.Quantity?.ValueID || 0,
      },
    };
  }

  // If an exact match is found, return it
  if (rule) {
    return {
      Price: parseFloat(rule.Price.toFixed(3)), // Ensure max 3 decimal places
      Size: {
        ValueName: rule.Size?.ValueName || "",
        AttributeID: rule.Size?.AttributeID || 0,
        ValueID: rule.Size?.ValueID || 0,
      },
      Quantity: {
        ValueName: rule.Quantity?.ValueName || "",
        AttributeID: rule.Quantity?.AttributeID || 0,
        ValueID: rule.Quantity?.ValueID || 0,
      },
    };
  }

  console.warn("No exact match found for selected size and quantity.");
  return null;
};




export const findBusinessCardPricingRule = (
  pricingRules: BusinessCardPricingRule[] | undefined,
  selectedCardType: string,
  selectedFinish: string,
) => {
  if (!pricingRules || pricingRules.length === 0) {
    console.warn("No business card pricing rules available.");
    return null;
  }

  // Ensure selectedCardType and selectedFinish match the API structure
  const rule =
    pricingRules.find(
      (rule) =>
        rule.CardType?.ValueName === selectedCardType &&
        rule.Finish?.ValueName === selectedFinish,
    ) || null;

  console.log("Matched Business Card Pricing Rule:", rule);
  if (!rule) {
    return null; // Return null if no rule is found
  }

  const extractedData: BusinessCardPricingRule = {
    Price: rule.Price,
    CardType: {
      ValueName:rule.CardType?.ValueName || "",
      AttributeID: rule.CardType?.AttributeID || 0,
      ValueID: rule.CardType?.ValueID || 0,
    }, // Extracting ValueName
    Finish: {
      ValueName:rule.Finish?.ValueName || "",
      AttributeID: rule.Finish?.AttributeID || 0,
      ValueID: rule.Finish?.ValueID || 0,
    },
  };
  console.log("Extracted Attribute IDs & Value Names:", extractedData);
  return extractedData;
};

// offsetprintg
export const findOffsetPrintingPricingRule = (
  pricingRules: OffsetPrintingPricingRule[] | undefined,
  selectedSize: string,
  selectedQuantity: number,
  selectedQuality: string,
) => {
  if (!pricingRules || pricingRules.length === 0) {
    console.warn("No Offset Printing pricing rules available.");
    return null;
  }

  const rule =
    pricingRules.find(
      (rule) =>
        rule.NoticeType?.ValueName.trim() === selectedSize.trim() &&
        rule.Quality?.ValueName.trim() === selectedQuality.trim() &&
        rule.Quantity?.ValueName.trim() === selectedQuantity.toString().trim(), // ✅ Fix: Convert to string
    ) || null;

  console.log("✅ Matched Offset Printing Pricing Rule:", rule);
  if (!rule) {
    return null; // Return null if no rule is found
  }
  const extractedData: OffsetPrintingPricingRule = {
    Price: rule.Price,
    NoticeType: { 
      ValueName: rule.NoticeType?.ValueName || "" ,
      AttributeID: rule.NoticeType?.AttributeID || 0,
      ValueID: rule.NoticeType?.ValueID || 0,
    }, // ✅ Keep as object
    Quality: { 
      ValueName: rule.Quality?.ValueName || "" ,
      AttributeID: rule.Quality?.AttributeID || 0,
      ValueID: rule.Quality?.ValueID || 0,
    }, // ✅ Keep as object
    Quantity: {
       ValueName: rule.Quantity?.ValueName || "",
       AttributeID: rule.Quantity?.AttributeID || 0,
       ValueID: rule.Quantity?.ValueID || 0,
      },
  };
  console.log("extracted Attribute IDs & Value Names:", extractedData);
  return extractedData;
};

//Letter Head
export const findLetterHeadPricingRule = (
  pricingRules: LetterHeadPricingRule[] | undefined,
  selectedService: string,
  selectedSize: string,
  selectedQuantity: number,
  selectedQuality: string,
): LetterHeadPricingRule | null => {
  // Ensure correct return type
  if (!pricingRules || pricingRules.length === 0) {
    console.warn("No Letterhead pricing rules available.");
    return null;
  }

  if (selectedService === "Black And White" && selectedQuantity < 500) {
    console.warn(
      "B/W printing is only available for quantities of 500 or more.",
    );
    return null; // No valid pricing rule if below 500 quantity
  }

  const rule =
    pricingRules.find(
      (rule) =>
        rule.Service?.ValueName.trim() === selectedService.trim() &&
        rule.Size?.ValueName.trim() === selectedSize.trim() &&
        rule.Quality?.ValueName.trim() === selectedQuality.trim() &&
        rule.Quantity?.ValueName.trim() === selectedQuantity.toString().trim(),
    ) || null;

  console.log("✅ Matched Letterhead Pricing Rule:", rule);

  if (!rule) {
    return null; // Return null if no rule is found
  }

  // ✅ Include `ValueName` in the return object
  const extractedData: LetterHeadPricingRule = {
    Price: rule.Price,
    Service: {
      ValueName: rule.Service?.ValueName || "",
      AttributeID: rule.Service?.AttributeID || 0,
      ValueID: rule.Service?.ValueID || 0,
    },
    Size: {
      ValueName: rule.Size?.ValueName || "",
      AttributeID: rule.Size?.AttributeID || 0,
      ValueID: rule.Size?.ValueID || 0,
    },
    Quality: {
      ValueName: rule.Quality?.ValueName || "",
      AttributeID: rule.Quality?.AttributeID || 0,
      ValueID: rule.Quality?.ValueID || 0,
    },
    Quantity: {
      ValueName: rule.Quantity?.ValueName || "",
      AttributeID: rule.Quantity?.AttributeID || 0,
      ValueID: rule.Quantity?.ValueID || 0,
    },
  };

  console.log("xtracted Attribute IDs & Value Names:", extractedData);
  return extractedData;
};

export const findPolaroidCardPricingRule = (
  pricingRules: PolaroidCardPricingRule[] | undefined,
  selectedSize: string,
  selectedQuantity: string | number,
): PolaroidCardPricingRule | null => {
  if (!pricingRules || pricingRules.length === 0) {
    console.warn("No Polaroid Card pricing rules available.");
    return null;
  }

  console.log("Checking Against Selected Values:");
  console.log("| Size:", selectedSize, "| Quantity:", selectedQuantity);
  console.log("Available Pricing Rules:", pricingRules);

  // Ensure `selectedQuantity` is a number
  const selectedQty =
    typeof selectedQuantity === "string"
      ? Number(selectedQuantity)
      : selectedQuantity;
  if (isNaN(selectedQty)) {
    console.error("❌ Invalid quantity format:", selectedQuantity);
    return null;
  }

  const rule =
    pricingRules.find((rule) => {
      if (!rule.QuantityRange?.ValueName) return false;

      const [min, max] = rule.QuantityRange.ValueName.split("-").map(Number);

      return (
        rule.Size?.ValueName.trim() === selectedSize.trim() &&
        selectedQty >= min &&
        (isNaN(max) || selectedQty <= max)
      );
    }) || null;

  console.log("✅ Matched Polaroid Card Pricing Rule:", rule);

  if (!rule) {
    console.warn("❌ No matching rule found.");
    return null;
  }

  // ✅ Extract IDs correctly
  const extractedData: PolaroidCardPricingRule = {
    Price: rule.Price,
    Size: {
      ValueName: rule.Size?.ValueName || "",
      AttributeID: rule.Size?.AttributeID ?? -1, // Ensure IDs are not missing
      ValueID: rule.Size?.ValueID ?? -1,
    },
    QuantityRange: {
      ValueName: rule.QuantityRange?.ValueName || "",
      AttributeID: rule.QuantityRange?.AttributeID ?? -1, // Ensure IDs are not missing
      ValueID: rule.QuantityRange?.ValueID ?? -1,
    },
  };

  console.log("📦 Extracted Pricing Rule Data:", extractedData);
  return extractedData;
};

export const findNameSlipPricingRule = (
  pricingRules: NameSlipPricingRule[] | undefined,
  selectedSize: string,
  selectedQuantity: number, // ✅ Now taking quantity as a number
) => {
  if (!pricingRules || pricingRules.length === 0) {
    console.warn("No NameSlip pricing rules available.");
    return null;
  }

  console.log("Checking Against Selected Values:");
  console.log("| Size:", selectedSize, "| Quantity:", selectedQuantity);
  console.log("Available Pricing Rules:", pricingRules);

  const rule =
    pricingRules.find((rule) => {
      if (!rule.QuantityRange?.ValueName) return false; // 🔹 Ensure valid range format

      const [min, max] = rule.QuantityRange.ValueName.split("-").map(Number);

      return (
        rule.Size?.ValueName.trim() === selectedSize.trim() &&
        selectedQuantity >= min &&
        (isNaN(max) || selectedQuantity <= max) // 🔹 Handles cases where max is undefined
      );
    }) || null;

  console.log("✅ Matched NameSlip Pricing Rule:", rule);

  if (!rule) return null; // 🔹 Return null if no rule is found

  // ✅ Extract the relevant details (keeping ValueName + IDs)
  const extractedData: NameSlipPricingRule = {
    Price: rule.Price,
    Size: {
      ValueName: rule.Size?.ValueName || "",
      AttributeID: rule.Size?.AttributeID || 0,
      ValueID: rule.Size?.ValueID || 0,
    },
    QuantityRange: {
      ValueName: rule.QuantityRange?.ValueName || "",
      AttributeID: rule.QuantityRange?.AttributeID || 0,
      ValueID: rule.QuantityRange?.ValueID || 0,
    },
  };

  console.log("Extracted Pricing Rule Data:", extractedData);
  return extractedData;
};


// findCanvasPricingRule.ts
export const findCanvasPricingRule = (
  pricingRules: CanvasPricingRule[] | undefined,
  sqftRange: number
) => {
  if (!pricingRules || pricingRules.length === 0) {
    console.warn("No Canvas pricing rules available.");
    return null;
  }

  console.log("Checking Against Square Feet Value:", sqftRange);
  console.log("Available Pricing Rules:", pricingRules);

  const rule =
    pricingRules.find((rule) => {
      if (!rule.SquareFeetRange?.ValueName) return false;

      const valueName = rule.SquareFeetRange.ValueName.trim();

      // Handle "Up to X sqft" format
      if (valueName.startsWith("Up to")) {
        const maxSqft = parseInt(valueName.replace(/\D/g, ""), 10);
        return sqftRange <= maxSqft;
      }

      // Handle "X-Y sqft" format (e.g., "11-50 sqft")
      const rangeMatch = valueName.match(/(\d+)-(\d+)/);
      if (rangeMatch) {
        const min = parseInt(rangeMatch[1], 10);
        const max = parseInt(rangeMatch[2], 10);
        return sqftRange >= min && sqftRange <= max;
      }

      // Handle "Above X sqft" format
      if (valueName.startsWith("Above")) {
        const minSqft = parseInt(valueName.replace(/\D/g, ""), 10);
        return sqftRange > minSqft;
      }

      return false;
    }) || null;

  console.log("✅ Matched Canvas Pricing Rule:", rule);

  if (!rule) return null;

  const extractedData: CanvasPricingRule = {
    PricePerSquareFoot : rule.PricePerSquareFoot , // Fix incorrect Price key
    SquareFeetRange: {
      ValueName: rule.SquareFeetRange?.ValueName || "",
      AttributeID: rule.SquareFeetRange?.AttributeID || 0,
      ValueID: rule.SquareFeetRange?.ValueID || 0,
    },
  };

  console.log("Extracted Pricing Rule Data:", extractedData);
  return extractedData;
};

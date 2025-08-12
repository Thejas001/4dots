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

    const pageRangeStr = rule.PageRange;
    
    // Handle "501-above" format
    if (pageRangeStr.includes("above")) {
      const min = parseInt(pageRangeStr.split("-")[0]);
      return pageCount >= min;
    }
    
    // Handle regular range format like "101-500"
    const [min, max] = pageRangeStr.split("-").map(Number);
    return pageCount >= min && pageCount <= max;
  });

  return matchingRule ? matchingRule.PageRange : null; // ✅ Return the PageRange directly
};


// ✅ Function to determine the correct page range based on user input
const findPageRange = (
  pageCount: number,
  pricingRules: PaperPrintingPricingRule[],
) => {
  if (process.env.NODE_ENV === 'development') {
;
  }
  

  
  const matchingRule = pricingRules.find((rule) => {
    if (!rule.PageRange?.ValueName) return false; // Safe check for missing values

    const pageRangeStr = rule.PageRange.ValueName;
    
    // Handle "501-above" format
    if (pageRangeStr.includes("above")) {
      const min = parseInt(pageRangeStr.split("-")[0]);
      const matches = pageCount >= min;
      if (process.env.NODE_ENV === 'development') {
      }
      return matches;
    }
    
    // Handle regular range format like "101-500"
    const [min, max] = pageRangeStr.split("-").map(Number);
    const matches = pageCount >= min && pageCount <= max;
    if (process.env.NODE_ENV === 'development') {
    }
    return matches;
  });

  const result = matchingRule ? matchingRule.PageRange.ValueName : null;
  if (process.env.NODE_ENV === 'development') {
  }
  return result;
};


// ✅ Function to get valid page ranges for a given size and color
export const getValidPageRanges = (
  pricingRules: PaperPrintingPricingRule[] | undefined,
  selectedSize: string,
  selectedColor: string
): string[] => {
  if (!pricingRules || pricingRules.length === 0) {
    return [];
  }

  // Normalize size names for better matching
  const normalizeSizeName = (size: string) => {
    return size
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/single sided/g, 'single side')
      .replace(/double sided/g, 'double side')
      .replace(/13\*19/g, '13x19')
      .replace(/13x19/g, '13x19')
      .replace(/13 \* 19/g, '13x19')
      .replace(/13\*19 double side/g, '13x19 double side')
      .replace(/13 \* 19 double side/g, '13x19 double side');
  };

  const normalizedSelectedSize = normalizeSizeName(selectedSize);
  
  // Find all rules that match the size and color
  const matchingRules = pricingRules.filter(rule => {
    const ruleSize = normalizeSizeName(rule.PaperSize?.ValueName || "");
    const ruleColor = rule.ColorType?.ValueName || "";
    
    return ruleSize === normalizedSelectedSize && ruleColor === selectedColor;
  });

  // Extract unique page ranges
  const validPageRanges = [...new Set(
    matchingRules.map(rule => rule.PageRange?.ValueName).filter(Boolean)
  )];

  return validPageRanges;
};

// ✅ Function to check if double-sided option should be available for a given page count
export const isDoubleSidedAvailable = (
  pricingRules: PaperPrintingPricingRule[] | undefined,
  selectedSize: string,
  selectedColor: string,
  pageCount: number,
  noOfCopies: number = 1 // Default to 1 if not provided
): boolean => {
  if (!pricingRules || pricingRules.length === 0) {
    if (process.env.NODE_ENV === 'development') {
    }
    return true; // Temporarily allow all options when no pricing rules
  }

  if (process.env.NODE_ENV === 'development') {

    
    // Check specifically for 13*19 rules
    const thirteenNineteenRules = pricingRules.filter(rule => 
      rule.PaperSize?.ValueName?.toLowerCase().includes('13')
    );

  }

  // Normalize size names for better matching
  const normalizeSizeName = (size: string) => {
    return size
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/single sided/g, 'single side')
      .replace(/double sided/g, 'double side')
      .replace(/13\*19/g, '13x19')
      .replace(/13x19/g, '13x19')
      .replace(/13 \* 19/g, '13x19')
      .replace(/13\*19 double side/g, '13x19 double side')
      .replace(/13 \* 19 double side/g, '13x19 double side');
  };

  const normalizedSelectedSize = normalizeSizeName(selectedSize);
  
  // Calculate sheet count for double-sided printing
  const sheetCount = Math.ceil(pageCount / 2);
  const totalSheets = sheetCount * noOfCopies;
  
  if (process.env.NODE_ENV === 'development') {

  }
  
  // For 13*19 double side: check if total sheets >= 100
  if (selectedSize.toLowerCase().includes('13') && selectedSize.toLowerCase().includes('double')) {
    if (totalSheets < 100) {
      if (process.env.NODE_ENV === 'development') {
 
      }
      return false;
    }
  }
  
  // For 13*19 single side: not available for B/W
  if (selectedSize.toLowerCase().includes('13') && !selectedSize.toLowerCase().includes('double') && selectedColor === "BlackAndWhite") {
    if (process.env.NODE_ENV === 'development') {

    }
    return false;
  }
  
  // For double-sided availability check, we need to consider that quantity will be multiplied
  // Check if there's any quantity that would make the total sheets fall within a pricing range
  // We'll check with a minimum quantity of 1 to see if the base sheet count has any pricing rule
  // For example: 141 pages / 2 = 71 sheets, then 71 * 2 copies = 142 total sheets
  // But for availability check, we need to check if the sheet count (71) has any pricing rule
  const matchedPageRange = findPageRange(sheetCount, pricingRules);
  
  if (process.env.NODE_ENV === 'development') {

  }
  
  if (!matchedPageRange) {
    // No page range found for this sheet count - hide the option
    if (process.env.NODE_ENV === 'development') {
    }
    
    // If no pricing rules exist at all, show the option for debugging
    if (pricingRules.length === 0) {
      if (process.env.NODE_ENV === 'development') {
      }
      return true;
    }
    
    return false; // Hide the option - no pricing rule exists
  }
  
  // Check if there's a pricing rule that matches size, color, and page range
  const hasPricingRule = pricingRules.some(rule => {
    const ruleSize = normalizeSizeName(rule.PaperSize?.ValueName || "");
    const ruleColor = rule.ColorType?.ValueName || "";
    const rulePageRange = rule.PageRange?.ValueName || "";
    
    const sizeMatch = ruleSize === normalizedSelectedSize;
    const colorMatch = ruleColor === selectedColor;
    const pageRangeMatch = rulePageRange === matchedPageRange;
    
    return sizeMatch && colorMatch && pageRangeMatch;
  });

  return hasPricingRule;
};

// ✅ Function to check if a page count is valid for a given size and color
export const isPageCountValid = (
  pricingRules: PaperPrintingPricingRule[] | undefined,
  selectedSize: string,
  selectedColor: string,
  pageCount: number
): boolean => {
  if (!pricingRules || pricingRules.length === 0) {
    return false;
  }

  // Normalize size names for better matching
  const normalizeSizeName = (size: string) => {
    return size
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/single sided/g, 'single side')
      .replace(/double sided/g, 'double side')
      .replace(/13\*19/g, '13x19')
      .replace(/13x19/g, '13x19')
      .replace(/13 \* 19/g, '13x19')
      .replace(/13\*19 double side/g, '13x19 double side')
      .replace(/13 \* 19 double side/g, '13x19 double side');
  };

  const normalizedSelectedSize = normalizeSizeName(selectedSize);
  
  // Find all rules that match the size and color
  const matchingRules = pricingRules.filter(rule => {
    const ruleSize = normalizeSizeName(rule.PaperSize?.ValueName || "");
    const ruleColor = rule.ColorType?.ValueName || "";
    
    return ruleSize === normalizedSelectedSize && ruleColor === selectedColor;
  });

  // Check if any rule's page range includes the given page count
  return matchingRules.some(rule => {
    const pageRangeStr = rule.PageRange?.ValueName || "";
    
    // Handle "501-above" format
    if (pageRangeStr.includes("above")) {
      const min = parseInt(pageRangeStr.split("-")[0]);
      return pageCount >= min;
    }
    
    // Handle regular range format like "101-500"
    const [min, max] = pageRangeStr.split("-").map(Number);
    return pageCount >= min && pageCount <= max;
  });
};

// ✅ Function to find the correct pricing rule for paper printing and addons
export const findPricingRule = (
  pricingRules: PaperPrintingPricingRule[] | undefined,
  selectedSize: string,
  selectedColor: string,
  pageCount: number
) => {

  if (!pricingRules || pricingRules.length === 0) {
    return null;
  }

  // Normalize size names for better matching
  const normalizeSizeName = (size: string) => {
    return size
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/single sided/g, 'single side')
      .replace(/double sided/g, 'double side')
      .replace(/13\*19/g, '13x19') // Handle 13*19 variations
      .replace(/13x19/g, '13x19') // Standardize to 13x19
      .replace(/13 \* 19/g, '13x19') // Handle 13 * 19 variations
      .replace(/13\*19 double side/g, '13x19 double side') // Handle 13*19 double side
      .replace(/13 \* 19 double side/g, '13x19 double side'); // Handle 13 * 19 double side
  };

  const normalizedSelectedSize = normalizeSizeName(selectedSize);
  
  // Only log in development mode to improve performance
  if (process.env.NODE_ENV === 'development') {

  }

  // Find the correct page range based on user input
  const matchedPageRange = findPageRange(pageCount, pricingRules);
  
  if (process.env.NODE_ENV === 'development') {
  }

  if (!matchedPageRange) {
    return null;
  }

  // Find the pricing rule that matches size, color, and page range
  const rule = pricingRules.find(
    (rule) => {
      const ruleSize = normalizeSizeName(rule.PaperSize?.ValueName || "");
      const ruleColor = rule.ColorType?.ValueName || "";
      const rulePageRange = rule.PageRange?.ValueName || "";
      
      const sizeMatch = ruleSize === normalizedSelectedSize;
      const colorMatch = ruleColor === selectedColor;
      const pageRangeMatch = rulePageRange === matchedPageRange;
      
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        if (!sizeMatch) {
        }
        if (!colorMatch) {
        }
        if (!pageRangeMatch) {
        }
      }
      
      return sizeMatch && colorMatch && pageRangeMatch;
    }
  ) || null;



  if (process.env.NODE_ENV === 'development') {
  }

  if (!rule) {
    // Only show detailed debugging in development
    if (process.env.NODE_ENV === 'development') {
    }
    
    // No fallback pricing - only use exact matches

  // For double-sided printing, use the same process as single-sided but with sheet count
  if (selectedSize.toLowerCase().includes("double side")) {
    // Calculate sheet count for double-sided printing
    const sheetCount = Math.ceil(pageCount / 2);
    
    if (process.env.NODE_ENV === 'development') {

    }
    
    // Find the correct page range based on sheet count (same process as single-sided)
    const matchedPageRange = findPageRange(sheetCount, pricingRules);
    
    if (process.env.NODE_ENV === 'development') {
    }

    if (!matchedPageRange) {
      return null;
    }

    // Find the pricing rule that matches size, color, and page range (same as single-sided)
    const rule = pricingRules.find(
      (rule) => {
        const ruleSize = normalizeSizeName(rule.PaperSize?.ValueName || "");
        const ruleColor = rule.ColorType?.ValueName || "";
        const rulePageRange = rule.PageRange?.ValueName || "";
        
        const sizeMatch = ruleSize === normalizedSelectedSize;
        const colorMatch = ruleColor === selectedColor;
        const pageRangeMatch = rulePageRange === matchedPageRange;
        
        if (process.env.NODE_ENV === 'development') {
        }
        
        return sizeMatch && colorMatch && pageRangeMatch;
      }
    ) || null;

    if (rule) {
      return rule;
    } else {
      return null;
    }
  }

  // No hardcoded fallbacks - only use actual pricing rules
  if (process.env.NODE_ENV === 'development') {

    }
    
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
  
  if (process.env.NODE_ENV === 'development') {
  }
  
  return extractedData;
};

// ✅ Utility function to check for missing pricing rules
export const checkMissingPricingRules = (
  pricingRules: PaperPrintingPricingRule[] | undefined,
  availableSizes: string[]
) => {
  if (!pricingRules || !availableSizes) {
    if (process.env.NODE_ENV === 'development') {
    }
    return;
  }

  const normalizeSizeName = (size: string) => {
    return size
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/single sided/g, 'single side')
      .replace(/double sided/g, 'double side')
      .replace(/13\*19/g, '13x19') // Handle 13*19 variations
      .replace(/13x19/g, '13x19'); // Standardize to 13x19
  };

  const availableRuleSizes = new Set(
    pricingRules.map(rule => normalizeSizeName(rule.PaperSize?.ValueName || ""))
  );

  const missingSizes = availableSizes.filter(size => {
    const normalizedSize = normalizeSizeName(size);
    return !availableRuleSizes.has(normalizedSize);
  });

  if (missingSizes.length > 0) {
    if (process.env.NODE_ENV === 'development') {
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
    }
  }

  return missingSizes;
};


//addon

export const findAddonPrice = (
  addons: any[] | undefined,
  selectedBindingType: string,
  selectedSize: string,
  selectedColor: string,
  pageCount: number
) => {


  if (!addons || addons.length === 0) {
    return null;
  }

  // Find the correct addon based on binding type
  const addon = addons.find((addon) => addon.AddonName === selectedBindingType);

  if (!addon) {
    return null;
  }

  // Extract pricing rules from the addon
  const Rules = addon.Rules || [];

  // Find the correct page range
  const pageRange = findAddonPageRange(pageCount, Rules); // ✅ Pass AddonRule[]

  if (!pageRange) {
    return null;
  }

  // Find the matching rule within the addon
  const matchedRule = addon.Rules.find(
    (rule: any) =>
      rule.PaperSize === selectedSize &&
      rule.ColorName === selectedColor &&
      rule.PageRange === pageRange // ✅ Match the calculated pageRange
  ) || null;


  if (!matchedRule) {
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

  return null;
};




export const findBusinessCardPricingRule = (
  pricingRules: BusinessCardPricingRule[] | undefined,
  selectedCardType: string,
  selectedFinish: string,
) => {
  if (!pricingRules || pricingRules.length === 0) {
    return null;
  }

  // Ensure selectedCardType and selectedFinish match the API structure
  const rule =
    pricingRules.find(
      (rule) =>
        rule.CardType?.ValueName === selectedCardType &&
        rule.Finish?.ValueName === selectedFinish,
    ) || null;

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
    return null;
  }

  const rule =
    pricingRules.find(
      (rule) =>
        rule.NoticeType?.ValueName.trim() === selectedSize.trim() &&
        rule.Quality?.ValueName.trim() === selectedQuality.trim() &&
        rule.Quantity?.ValueName.trim() === "1000",    ) || null;

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
    return null;
  }



  // Map selected service to possible pricing rule values
  const getServiceMapping = (service: string) => {
    const mappings = {
      "B/W": ["B/W", "Black And White", "Black & White", "BW"],
      "Color": ["Color", "Colour", "Full Color", "Full Colour"]
    };
    return mappings[service as keyof typeof mappings] || [service];
  };

  const possibleServices = getServiceMapping(selectedService);

  if (selectedService === "B/W" && selectedQuantity < 500) {
    return null; // No valid pricing rule if below 500 quantity
  }

  const rule =
    pricingRules.find(
      (rule) => {
        const serviceMatch = possibleServices.some(service => 
          rule.Service?.ValueName.trim().toLowerCase() === service.trim().toLowerCase()
        );
        const sizeMatch = rule.Size?.ValueName.trim().toLowerCase() === selectedSize.trim().toLowerCase();
        const qualityMatch = rule.Quality?.ValueName.trim().toLowerCase() === selectedQuality.trim().toLowerCase();
        const quantityMatch = rule.Quantity?.ValueName.trim() === selectedQuantity.toString().trim();
  
        
        return serviceMatch && sizeMatch && qualityMatch && quantityMatch;
      }
    ) || null;


  if (!rule) {
    pricingRules.forEach((rule, index) => {

    });
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

  return extractedData;
};

export const findPolaroidCardPricingRule = (
  pricingRules: PolaroidCardPricingRule[] | undefined,
  selectedSize: string,
  selectedQuantity: string | number,
): PolaroidCardPricingRule | null => {
  if (!pricingRules || pricingRules.length === 0) {
    return null;
  }



  // Ensure `selectedQuantity` is a number
  const selectedQty =
    typeof selectedQuantity === "string"
      ? Number(selectedQuantity)
      : selectedQuantity;
  if (isNaN(selectedQty)) {
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


  if (!rule) {
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

  return extractedData;
};

export const findNameSlipPricingRule = (
  pricingRules: NameSlipPricingRule[] | undefined,
  selectedSize: string,
  selectedQuantity: number, // ✅ Now taking quantity as a number
) => {
  if (!pricingRules || pricingRules.length === 0) {
    return null;
  }


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

  return extractedData;
};


// findCanvasPricingRule.ts
export const findCanvasPricingRule = (
  pricingRules: CanvasPricingRule[] | undefined,
  sqftRange: number
) => {
  if (!pricingRules || pricingRules.length === 0) {
    return null;
  }



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


  if (!rule) return null;

  const extractedData: CanvasPricingRule = {
    PricePerSquareFoot : rule.PricePerSquareFoot , // Fix incorrect Price key
    SquareFeetRange: {
      ValueName: rule.SquareFeetRange?.ValueName || "",
      AttributeID: rule.SquareFeetRange?.AttributeID || 0,
      ValueID: rule.SquareFeetRange?.ValueID || 0,
    },
  };

  return extractedData;
};

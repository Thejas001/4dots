import {
  OffsetPrintingPricingRule,
  LetterHeadPricingRule,
  PolaroidCardPricingRule,
  NameSlipPricingRule,
  BusinessCardPricingRule,
  PhotoFramePricingRule,
  CanvasPricingRule,
  PaperPrintingPricingRule,
  PaperPrintAddonRule,
} from "@/app/models/products";

export const extractPhotoFramePricingRules = (
  pricingRules: any[],
) : PhotoFramePricingRule[] => {
  
  // console.log("Raw PricingRules Data:", pricingRules);
 
  const extractedRules =
    pricingRules
      ?.filter((rule) => rule.Size && rule.Quantity) // ✅ Keep only Photo Frame rules
      .map((rule) => ({
        Size: { 
          ValueName: rule.Size?.ValueName || "", 
          AttributeID: rule.Size?.AttributeID || 0,
          ValueID: rule.Size?.ValueID || 0,
        },
        Quantity: { 
          ValueName: rule.Quantity?.ValueName ,
          AttributeID: rule.Quantity?.AttributeID || 0,
          ValueID: rule.Quantity?.ValueID || 0,},
        Price: rule.Price || 0, 
      })) || [];
      
      // console.log("Extracted Photo Frame Pricing Rules:", extractedRules);
      return extractedRules;
};

export const extractBusinessCardPricingRules = (
  pricingRules: any[],
) : BusinessCardPricingRule[] => {
  // console.log("Raw PricingRules Data:", pricingRules);

  const extractedRules =
    pricingRules?.map((rule) => ({
      CardType: {
        ValueName:rule.CardType?.ValueName || "",
        AttributeID: rule.CardType?.AttributeID || 0,
        ValueID: rule.CardType?.ValueID || 0,
      }, // Extracting ValueName
      Finish: {
        ValueName:rule.Finish?.ValueName || "",
        AttributeID: rule.Finish?.AttributeID || 0,
        ValueID: rule.Finish?.ValueID || 0,
      }, // Extracting ValueName
      Price: rule.Price || 0, // Defaulting price if not available
    })) || [];
    
  // console.log("Extracted Business Card Pricing Rules:", extractedRules);
  return extractedRules;
};


export const extractPaperPrintingPricingRules = (
  pricingRules: any[],
  addons: any[]
): PaperPrintingPricingRule[] => {
  if (!pricingRules || !Array.isArray(pricingRules)) {
    console.warn("Invalid pricing rules input:", pricingRules);
    return [];
  }

  const extractedRules = pricingRules.map((rule) => {
    // Filter and map addons only if they exist and have valid Rules
    const matchingAddons = addons
      .filter((addon) => {
        // Ensure addon.Rules exists and is an array
        if (!addon.Id ||!addon.Rules || !Array.isArray(addon.Rules)) {
          console.warn("Invalid addon.Rules for addon:", addon);
          return false;
        }
        return true;
      })
      .flatMap((addon) => {
        // Find matching rules within the addon
        return addon.Rules
          .filter((addonRule: any) => 
            addonRule.PaperSize === rule.PaperSize.ValueName &&
            addonRule.ColorName === rule.ColorType.ValueName &&
            addonRule.PageRange === rule.PageRange.ValueName
          )
          .map((addonRule: any) => ({
            Id: addon.Id,
            AddonName: addon.AddonName,
            PaperSize: addonRule.PaperSize,
            ColorName: addonRule.ColorName,
            PageRange: addonRule.PageRange,
            Price: addonRule.Price,
          }));
      });

    return {
      PaperSize: {
        ValueName: rule.PaperSize?.ValueName || "",
        AttributeID: rule.PaperSize?.AttributeID || 0,
        ValueID: rule.PaperSize?.ValueID || 0,
      },
      ColorType: {
        ValueName: rule.ColorType?.ValueName || "",
        AttributeID: rule.ColorType?.AttributeID || 0,
        ValueID: rule.ColorType?.ValueID || 0,
      },
      PageRange: {
        ValueName: rule.PageRange?.ValueName || "",
        AttributeID: rule.PageRange?.AttributeID || 0,
        ValueID: rule.PageRange?.ValueID || 0,
      },
      PricePerPage: rule.PricePerPage || 0,
      Addons: matchingAddons,
    };
  });

  console.log("Extracted PaperPrint Pricing Rules with Addons:", extractedRules);
  return extractedRules;
};

export const extractOffsetPrintingPricingRules = (
  pricingRules: any[],
): OffsetPrintingPricingRule[] => {
  console.log("Raw PricingRules Data:", pricingRules);

  const extractedRules =
    pricingRules?.map((rule) => ({
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
        }, // ✅ Keep as object
      Price: rule.Price || 0,
    })) || [];

  console.log("Extracted Offset Printing Pricing Rules:", extractedRules);
  return extractedRules;
};

export const extractLetterHeadPricingRules = (
  pricingRules: any[],
): LetterHeadPricingRule[] => {
  console.log("Raw PricingRules Data:", pricingRules);

  const extractedRules =
    pricingRules?.map((rule) => ({
      Service: {
        ValueName: rule.Service?.ValueName || "",
        AttributeID: rule.Service?.AttributeID || 0,
        ValueID: rule.Service?.ValueID || 0,
      }, // ✅ Added Service

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
      Price: rule.Price || 0,
    })) || [];

  console.log("Extracted Letterhead Pricing Rules:", extractedRules);
  return extractedRules;
};

export const extractPolaroidPricingRules = (
  pricingRules: any[],
): PolaroidCardPricingRule[] => {
  console.log("Raw PricingRules Data:", pricingRules);

  const extractedRules =
    pricingRules?.map((rule) => ({
      Size: {
        ValueName: rule.Size?.ValueName || "",
        AttributeID: rule.Size?.AttributeID || 0,
        ValueID: rule.Size?.ValueID || 0,
      },
      QuantityRange: {
        ValueName: rule.QuantityRange?.ValueName || "",
        AttributeID: rule.QuantityRange?.AttributeID || 0,
        ValueID: rule.QuantityRange?.ValueID || 0,
      }, // 🔄 Keep as string
      Price: rule.Price || 0,
    })) || [];

  console.log("Extracted Polaroid Pricing Rules:", extractedRules);
  return extractedRules;
};

export const extracNameSlipPricingRules = (
  pricingRules: any[],
): NameSlipPricingRule[] => {
  console.log("Raw PricingRules Data:", pricingRules);

  const extractedRules =
    pricingRules?.map((rule) => ({
      Size: {
        ValueName: rule.Size?.ValueName || "",
        AttributeID: rule.Size?.AttributeID || 0,
        ValueID: rule.Size?.ValueID || 0,
      },
      QuantityRange: {
        ValueName: rule.QuantityRange?.ValueName || "",
        AttributeID: rule.QuantityRange?.AttributeID || 0,
        ValueID: rule.QuantityRange?.ValueID || 0,
      }, // 🔄 Keep as string
      Price: rule.Price || 0,
    })) || [];

  console.log("Extracted Polaroid Pricing Rules:", extractedRules);
  return extractedRules;
};

export const extractCanvasPricingRules = (
  pricingRules: any[]
): CanvasPricingRule[] => {
  console.log("Raw PricingRules Data:", pricingRules);

  const extractedRules =
    pricingRules?.map((rule) => ({
      SquareFeetRange: {
        ValueName: rule.SquareFeetRange?.ValueName || "", // FIXED: Correct key
        AttributeID: rule.SquareFeetRange?.AttributeID || 0,
        ValueID: rule.SquareFeetRange?.ValueID || 0,
      },
      PricePerSquareFoot : rule.PricePerSquareFoot  || 0, // FIXED: Correct key
    })) || [];

  console.log("Extracted Canvas Pricing Rules:", extractedRules);
  return extractedRules;
};


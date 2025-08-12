export const isBindingAllowed = (
  bindingName: string,
  pageCount: number,
  paperSize: string,
  colorType: string
) => {
  const normalizedPaperSize = paperSize.trim().toLowerCase();
  
  // Normalize size names for better matching
  const normalizeSizeName = (size: string) => {
    return size
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/single sided/g, 'single side')
      .replace(/double sided/g, 'double side');
  };
  
  const normalizedSize = normalizeSizeName(normalizedPaperSize);
  
  const isA4Size = 
    normalizedSize === "a4 single side" || 
    normalizedSize === "a4 double side";
  const isA3Size = 
    normalizedSize === "a3 single side" || 
    normalizedSize === "a3 double side";
  const is12x18Size = 
    normalizedSize === "12*18 single side" || 
    normalizedSize === "12*18 double side";
  const is13x19Size = 
    normalizedSize === "13*19 single side" || 
    normalizedSize === "13*19 double side" ||
    normalizedSize === "13*19 single sided" || 
    normalizedSize === "13*19 double sided";
  const isBW = colorType === "BlackAndWhite" || colorType === "B/W";
  const isColor = colorType === "Color";

  if (process.env.NODE_ENV === 'development') {
  }

  // A4 rules (already present)
  if (isA4Size) {
    if (isBW) {
      if (pageCount <= 100) {
        return ["Spiral Binding", "Soft Binding", "Hard Binding"].includes(bindingName);
      } else if (pageCount > 100 && pageCount <= 500) {
        return ["Soft Binding", "Hard Binding"].includes(bindingName);
      } else {
        return false;
      }
    } else if (isColor) {
      if (pageCount <= 100) {
        return ["Spiral Binding", "Soft Binding", "Hard Binding"].includes(bindingName);
      } else {
        return false;
      }
    }
  }

  // A3 rules
  if (isA3Size) {
    if (isBW) {
      if (pageCount <= 100) {
        return ["Spiral Binding"].includes(bindingName);
      } else {
        return false;
      }
    } else if (isColor) {
      // No binding allowed for color prints (all NIL)
      return false;
    }
  }

  // 12*18 and 13*19 rules - now use same logic as A4
  if (is12x18Size || is13x19Size) {
    if (isBW) {
      if (pageCount <= 100) {
        return ["Spiral Binding", "Soft Binding", "Hard Binding"].includes(bindingName);
      } else if (pageCount > 100 && pageCount <= 500) {
        return ["Soft Binding", "Hard Binding"].includes(bindingName);
      } else {
        return false;
      }
    } else if (isColor) {
      if (pageCount <= 100) {
        return ["Spiral Binding", "Soft Binding", "Hard Binding"].includes(bindingName);
      } else {
        return false;
      }
    }
  }

  // For other paper sizes or conditions, allow binding by default
  return true;
};




export const noticeTypeQualityRules: Record<string, string[]> = {
  "A5(SINGLE SIDE)": ["100GSM"],
  "A5(DOUBLE SIDE)": ["100GSM"],
  "A3(SINGLE SIDE)": ["100GSM"],
  "A3(DOUBLE SIDE)": ["100GSM"],
  // others can be added later
};


export const letterHeadRules = {
  Colour: {
    Quality: ["80GSM", "100GSM"],
    Quantity: {
      "100GSM": ["500", "1000"]
    },
    Size: ["21X28CM", "21X29.7CM", "21X35.5CM"]
  }
};
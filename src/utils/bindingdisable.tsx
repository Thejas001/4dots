export const isBindingAllowed = (
  bindingName: string,
  pageCount: number,
  paperSize: string,
  colorType: string
) => {
  const normalizedPaperSize = paperSize.trim().toLowerCase();
  const isA4Size = 
    normalizedPaperSize === "a4 single side" || 
    normalizedPaperSize === "a4 double side";
  const isA3Size = 
    normalizedPaperSize === "a3 single side" || 
    normalizedPaperSize === "a3 double side";
  const is12x18Size = 
    normalizedPaperSize === "12*18 single side" || 
    normalizedPaperSize === "12*18 double side";
  const is13x19Size = 
    normalizedPaperSize === "13*19 single sided" || 
    normalizedPaperSize === "13*19 double sided";
  const isBW = colorType === "BlackAndWhite" || colorType === "B/W";
  const isColor = colorType === "Color";

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

  // 12*18 rules (no binding allowed for any case)
  if (is12x18Size) {
    return false;
  }

  // 13*19 rules (no binding allowed for any case)
  if (is13x19Size) {
    return false;
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
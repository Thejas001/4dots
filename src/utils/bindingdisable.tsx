export const isBindingAllowed = (
  bindingName: string,
  pageCount: number,
  paperSize: string,
  colorType: string
) => {
  const isA4Size = paperSize === "A4 Single Side" || paperSize === "A4 Double Side";

  // For A4 size, restrict Soft, Hard, and Spiral Binding to 100 pages or fewer
  if (
    isA4Size &&
    (bindingName === "Soft Binding" || bindingName === "Hard Binding" || bindingName === "Spiral Binding")
  ) {
    return pageCount <= 100; // Allow only if page count is 100 or less
  }

  // For other bindings or other paper sizes, allow by default
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


// utils/validatePrint.ts
export const validatePrintSelection = (
    selectedSize: string,
    selectedOption: "B/W" | "Color" | "",
    pageCount: number
  ): string => {
    if (!selectedSize || !selectedOption) return "";
  
    if (selectedSize.includes("13x19")) {
      if (selectedOption === "Color" && pageCount <= 100) {
        return "Color printing for 13x19 is only available for pages above 100.";
      }
      if (selectedOption === "B/W") {
        return "Black & White printing is not available for 13x19.";
      }
    }
  
    return ""; // No error
  };
  
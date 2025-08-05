import { useState, useMemo, useEffect } from "react";
import { Product } from "@/app/models/products";
import {isBindingAllowed} from "@/utils/bindingdisable";
import { getCombinedAddons } from "@/utils/laminationAddons";

interface AddOnServiceProps {
  productDetails: Product;
  onBindingTypeChange: (bindingType: string) => void;
  onBinderColorChange: (binderColor: string) => void;
  onCopySelectionChange: (value: string) => void;
  onCustomCopiesChange: (value: string) => void;
  onLaminationTypeChange: (laminationType: string) => void;
  pageCount: number;
  paperSize: string;
  colorType: string;
  noOfCopies: number;
}

const AddOnService = ({
  productDetails,
  onBindingTypeChange,
  onBinderColorChange,
  onCopySelectionChange,
  onCustomCopiesChange,
  onLaminationTypeChange,
  pageCount,
  paperSize,
  colorType,
  noOfCopies,
}: AddOnServiceProps) => {
  const [copySelection, setCopySelection] = useState("");
  const [bindingType, setBindingType] = useState("");
  const [customCopies, setCustomCopies] = useState<string>("");
  const [binderColor, setBinderColor] = useState("Black");
  const [showBindingOptions, setShowBindingOptions] = useState(false);
  const [laminationType, setLaminationType] = useState("");

  // Add lamination addons to the existing addons
  const laminationAddons = [
    {
      Id: 4,
      AddonName: "Lamination Matt",
      Rules: [
        {
          PaperSize: "13*19 SINGLE SIDE",
          ColorName: "Color",
          PageRange: "101-500",
          Price: "7/page"
        },
        {
          PaperSize: "13*19 SINGLE SIDE",
          ColorName: "Color",
          PageRange: "501 and above",
          Price: "6/page"
        },
        {
          PaperSize: "13*19 DOUBLE SIDE",
          ColorName: "Color",
          PageRange: "101-500",
          Price: "7/page"
        },
        {
          PaperSize: "13*19 DOUBLE SIDE",
          ColorName: "Color",
          PageRange: "501 and above",
          Price: "6/page"
        }
      ]
    },
    {
      Id: 5,
      AddonName: "Lamination Glossy",
      Rules: [
        {
          PaperSize: "13*19 SINGLE SIDE",
          ColorName: "Color",
          PageRange: "101-500",
          Price: "7/page"
        },
        {
          PaperSize: "13*19 SINGLE SIDE",
          ColorName: "Color",
          PageRange: "501 and above",
          Price: "6/page"
        },
        {
          PaperSize: "13*19 DOUBLE SIDE",
          ColorName: "Color",
          PageRange: "101-500",
          Price: "7/page"
        },
        {
          PaperSize: "13*19 DOUBLE SIDE",
          ColorName: "Color",
          PageRange: "501 and above",
          Price: "6/page"
        }
      ]
    }
  ];

  // Combine existing addons with lamination addons
  const allAddons = useMemo(() => {
    return getCombinedAddons(productDetails?.Addons);
  }, [productDetails?.Addons]);

  const bindingTypes = useMemo(() => {
    if (!allAddons) return [];
    return Array.from(new Set(allAddons.map((addon) => addon.AddonName)));
  }, [allAddons]);

  const allowedBindingTypes = bindingTypes
    .filter(type => isBindingAllowed(type, pageCount, paperSize, colorType));

  // Get lamination types (filter out binding types and ensure uniqueness)
  const laminationTypes = useMemo(() => {
    if (!allAddons) return [];
    const bindingTypeNames = ["Spiral Binding", "Soft Binding", "Hard Binding"];
    
    // Check if lamination should be available
    const isLaminationAvailable = () => {
      // Lamination is available for all sizes with page count 101 and above
      const isPageCountValid = pageCount >= 101;
      
      // Only available for Color (not B/W)
      const isColorType = colorType === "Color";
      
      return isPageCountValid && isColorType;
    };
    
    // Only show lamination types if conditions are met
    if (!isLaminationAvailable()) {
      return [];
    }
    
    const laminationTypeNames = allAddons
      .filter(addon => !bindingTypeNames.includes(addon.AddonName))
      .map(addon => addon.AddonName);
    
    // Remove duplicates and return unique lamination types
    return Array.from(new Set(laminationTypeNames));
  }, [allAddons, paperSize, pageCount, colorType]);

  // Combine binding and lamination types for display
  const allBindingAndLaminationTypes = useMemo(() => {
    return [...allowedBindingTypes, ...laminationTypes];
  }, [allowedBindingTypes, laminationTypes]);

  // Debug log
  console.log("allowedBindingTypes", allowedBindingTypes, { pageCount, paperSize, colorType });
  console.log("laminationTypes", laminationTypes);

  const isSelectionComplete = !!paperSize && !!colorType && pageCount > 0;

  // Validate customCopies whenever noOfCopies changes or customCopies changes
  useEffect(() => {
    const numValue = parseInt(customCopies);
    if (customCopies && !isNaN(numValue) && numValue > noOfCopies) {
      console.log('useEffect: Clearing invalid customCopies value', numValue, 'max:', noOfCopies);
      setCustomCopies('');
      onCustomCopiesChange('');
    }
  }, [noOfCopies, customCopies, onCustomCopiesChange]);

  const handleBindingTypeChange = (selectedType: string) => {
    setBindingType(selectedType);
    onBindingTypeChange(selectedType);
  };

  const handleLaminationTypeChange = (selectedType: string) => {
    setLaminationType(selectedType);
    onLaminationTypeChange(selectedType);
  };

  const handleBinderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value;
    setBinderColor(selectedColor);
    onBinderColorChange(selectedColor);
  };

  const handleCopySelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked ? "all" : "";
    setCopySelection(value);
    onCopySelectionChange(value);

    // Reset customCopies when "All Copies" is selected
    if (value === "all") {
      setCustomCopies("");
      onCustomCopiesChange("");
    }
  };

  // Calculate lamination price
  const calculateLaminationPrice = (laminationTypeName: string) => {
    const addonRule = allAddons.find(addon => addon.AddonName === laminationTypeName);
    if (!addonRule) {
      return 0;
    }

    const mappedColor = colorType === "B/W" ? "BlackAndWhite" : "Color";
    
    // For lamination, calculate based on total page count (uploaded PDF pages × quantity)
    const totalPageCount = pageCount * noOfCopies;

    // Normalize paper size for matching
    const normalizePaperSize = (size: string) => {
      return size
        .toUpperCase()
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/SINGLE SIDED/g, 'SINGLE SIDE')
        .replace(/DOUBLE SIDED/g, 'DOUBLE SIDE');
    };

    const normalizedPaperSize = normalizePaperSize(paperSize);

    // Find the correct page range for the total page count
    const findAddonPageRange = (pageCount: number, rules: any[]) => {
      const matchingRule = rules.find((rule: any) => {
        if (!rule.PageRange) return false;
        const pageRangeStr = rule.PageRange;
        
        // Handle "501 and above" format
        if (pageRangeStr.includes("above")) {
          const min = parseInt(pageRangeStr.split(" ")[0]);
          return pageCount >= min;
        }
        
        // Handle regular range format like "101-500"
        const [min, max] = pageRangeStr.split("-").map(Number);
        return pageCount >= min && pageCount <= max;
      });
      
      return matchingRule ? matchingRule.PageRange : null;
    };

    const pageRange = findAddonPageRange(totalPageCount, addonRule.Rules || []);
    
    if (!pageRange) {
      return 0;
    }

    // Find the appropriate pricing rule for this addon
    const addonPricingRule = addonRule.Rules?.find((rule: any) => 
      normalizePaperSize(rule.PaperSize) === normalizedPaperSize && 
      rule.ColorName === mappedColor &&
      rule.PageRange === pageRange
    );

    if (addonPricingRule) {
      // Parse the price from string format like "7/page"
      const priceString = addonPricingRule.Price.toString();
      let pricePerUnit = 0;
      
      if (priceString.includes('/page')) {
        pricePerUnit = parseFloat(priceString.replace('/page', ''));
        return pricePerUnit * totalPageCount;
      } else {
        // Try to parse as a simple number
        pricePerUnit = parseFloat(priceString);
        return pricePerUnit * totalPageCount;
      }
    }
    
    return 0;
  };


  return (
    <div className="space-y-6">
      {/* Step 1: Copy Selection */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Binding Application</h3>
        <p className="text-sm text-gray-600 mb-4">Choose how many copies to bind</p>
        
        <div className="space-y-4">
          {/* All Copies Option */}
          <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-all duration-200 cursor-pointer">
                                                   <input
                type="radio"
                name="copy-selection"
                value="all"
                checked={copySelection === "all"}
                onChange={(e) => {
                  setCopySelection(e.target.value);
                  onCopySelectionChange(e.target.value);
                  if (e.target.value === "all") {
                    setCustomCopies("");
                    onCustomCopiesChange("");
                  }
                }}
                className="w-5 h-5 text-black border-gray-300 focus:ring-black focus:ring-2 accent-black"
              />
            <div className="ml-3 flex-1">
              <div className="font-medium text-gray-900">All Copies</div>
              <div className="text-sm text-gray-600">Apply binding to all copies in your order</div>
            </div>
          </label>

          {/* Custom Copies Option */}
          <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-all duration-200 cursor-pointer">
                                                   <input
                type="radio"
                name="copy-selection"
                value="custom"
                checked={copySelection === "custom"}
                onChange={(e) => {
                  setCopySelection(e.target.value);
                  onCopySelectionChange("");
                }}
                className="w-5 h-5 text-black border-gray-300 focus:ring-black focus:ring-2 accent-black"
              />
            <div className="ml-3 flex-1">
              <div className="font-medium text-gray-900">Custom Copies</div>
              <div className="text-sm text-gray-600">Apply binding to a specific number of copies</div>
                             {copySelection === "custom" && (
                 <div className="mt-3">
                  <input
                      type="number"
                      placeholder="Enter number of copies"
                      min="1"
                      max={noOfCopies || 1}
                      value={customCopies}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = parseInt(value);

                        if (!/^\d*$/.test(value)) return;
                        
                        // Only allow valid numbers within range
                        if (value === '') {
                          setCustomCopies('');
                          onCustomCopiesChange('');
                        } 
                        
                        if (!isNaN(numValue) && numValue >= 1 && numValue <= noOfCopies) {
                          setCustomCopies(value);
                          onCustomCopiesChange(value);
                        } 
                        
                        // If invalid, don't update state (input stays as is)
                      }}
                      className="border px-3 py-2 rounded-md text-gray-700 w-32 focus:outline-none focus:ring-2 focus:ring-black border-gray-300"
                    />
                    <div className="text-xs mt-1 text-gray-500">
                      Maximum: {noOfCopies || 1} copies
                    </div>
                    {customCopies !== '' && parseInt(customCopies) > noOfCopies && (
                      <div className="text-xs text-red-500 mt-1">
                        Maximum allowed is {noOfCopies} copies.
                      </div>
                    )}


                 </div>
               )}
            </div>
          </label>
        </div>

        {/* Continue Button - Removed to auto-proceed */}
      </div>

      {/* Step 2: Binding and Lamination Type Selection */}
      {copySelection && (
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Binding & Lamination Options</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Select your preferred binding and lamination options</p>
          
          {!isSelectionComplete ? (
            <div className="text-gray-500 font-medium">Please select paper size, color, and upload your file.</div>
          ) : allBindingAndLaminationTypes.length > 0 ? (
            <div className="space-y-3">
              {allBindingAndLaminationTypes.map((type, index) => {
                const isSelected = bindingType === type || laminationType === type;
                const isLaminationType = laminationTypes.includes(type);
                
                // Calculate price for this type
                let addonPrice = 0;
                
                if (isLaminationType) {
                  addonPrice = calculateLaminationPrice(type);
                } else {
                  // Calculate binding price
                  const addonRule = productDetails.Addons?.find(addon => addon.AddonName === type);
                  
                  if (addonRule) {
                    const mappedColor = colorType === "B/W" ? "BlackAndWhite" : "Color";
                    const isDoubleSided = paperSize.toUpperCase().includes("DOUBLE SIDE");
                    const totalSheets = isDoubleSided
                      ? Math.ceil(pageCount / 2) * (copySelection === "all" ? 1 : parseInt(customCopies) || 1)
                      : pageCount * (copySelection === "all" ? 1 : parseInt(customCopies) || 1);
                    
                    // Find the appropriate pricing rule for this addon
                    const addonPricingRule = addonRule.Rules?.find(rule => 
                      rule.PaperSize === paperSize && 
                      rule.ColorName === mappedColor
                    );
                    
                    if (addonPricingRule) {
                      // Parse the price from string format like "140/book" or "50/page"
                      const priceString = addonPricingRule.Price.toString();
                      let pricePerUnit = 0;
                      
                      if (priceString.includes('/book')) {
                        pricePerUnit = parseFloat(priceString.replace('/book', ''));
                        addonPrice = pricePerUnit; // Fixed price per book
                      } else if (priceString.includes('/page')) {
                        pricePerUnit = parseFloat(priceString.replace('/page', ''));
                        addonPrice = pricePerUnit * totalSheets;
                      } else {
                        // Try to parse as a simple number
                        pricePerUnit = parseFloat(priceString);
                        addonPrice = pricePerUnit * totalSheets;
                      }
                    }
                  }
                }
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-black bg-gray-100"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    onClick={() => {
                      if (isLaminationType) {
                        handleLaminationTypeChange(type);
                        // Clear binding selection when lamination is selected
                        if (bindingType) {
                          handleBindingTypeChange("");
                        }
                      } else {
                        handleBindingTypeChange(type);
                        // Clear lamination selection when binding is selected
                        if (laminationType) {
                          handleLaminationTypeChange("");
                        }
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">
                        {type}
                        {isLaminationType && (
                          <span className="ml-2 text-xs text-gray-500">(Lamination)</span>
                        )}
                      </div>
                      <div className="text-right">
                        {addonPrice > 0 ? (
                          <div className="text-sm font-semibold text-gray-900">
                            ₹{addonPrice.toFixed(2)}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            {isSelected ? "Selected" : "Click to select"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 font-medium">No binding or lamination available for this selection.</div>
          )}
        </div>
      )}

      {/* Binder Color - Only for Hard Binding */}
      {bindingType === "Hard Binding" && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Binder Color</h3>
          <p className="text-sm text-gray-600 mb-4">Choose the color for your hard binding</p>
          
          <div className="space-y-4">
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-all duration-200 cursor-pointer">
                             <input
                 type="radio"
                 name="binder-color"
                 value="Black"
                 checked={binderColor === "Black"}
                 onChange={() => {
                   setBinderColor("Black");
                   onBinderColorChange("Black");
                 }}
                 className="w-5 h-5 text-black border-gray-300 focus:ring-black focus:ring-2 accent-black"
               />
              <div className="ml-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black border-2 border-gray-300"></div>
                <span className="font-medium text-gray-900">Black</span>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-all duration-200 cursor-pointer">
                             <input
                 type="radio"
                 name="binder-color"
                 value="White"
                 checked={binderColor === "White"}
                 onChange={() => {
                   setBinderColor("White");
                   onBinderColorChange("White");
                 }}
                 className="w-5 h-5 text-black border-gray-300 focus:ring-black focus:ring-2 accent-black"
               />
              <div className="ml-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300"></div>
                <span className="font-medium text-gray-900">White</span>
              </div>
            </label>

            <div className="p-4 border-2 border-gray-200 rounded-lg bg-white">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">Custom Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="#RRGGBB"
                    value={binderColor.startsWith('#') ? binderColor : ''}
                    onChange={e => {
                      setBinderColor(e.target.value);
                      onBinderColorChange(e.target.value);
                    }}
                                         className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 w-32 focus:outline-none focus:ring-2 focus:ring-black"
                    maxLength={7}
                  />
                  <div className="w-8 h-8 rounded-full border-2 border-gray-300" 
                       style={{ backgroundColor: binderColor.startsWith('#') ? binderColor : '#fff' }}></div>
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-2 block">Enter a hex color code (e.g., #FF0000)</span>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default AddOnService;
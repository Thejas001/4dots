import { useState, useMemo, useEffect } from "react";
import { Product } from "@/app/models/products";
import {isBindingAllowed} from "@/utils/bindingdisable";

interface AddOnServiceProps {
  productDetails: Product;
  onBindingTypeChange: (bindingType: string) => void;
  onBinderColorChange: (binderColor: string) => void;
  onCopySelectionChange: (value: string) => void;
  onCustomCopiesChange: (value: string) => void;
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

  const bindingTypes = useMemo(() => {
    if (!productDetails?.Addons) return [];
    return Array.from(new Set(productDetails.Addons.map((addon) => addon.AddonName)));
  }, [productDetails]);

  const allowedBindingTypes = bindingTypes
    .filter(type => isBindingAllowed(type, pageCount, paperSize, colorType));

  // Debug log
  console.log("allowedBindingTypes", allowedBindingTypes, { pageCount, paperSize, colorType });

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

      {/* Step 2: Binding Type Selection */}
      {copySelection && (
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Binding Type</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Select your preferred binding type</p>
          
                     {!isSelectionComplete ? (
             <div className="text-gray-500 font-medium">Please select paper size, color, and upload your file.</div>
           ) : allowedBindingTypes.length > 0 ? (
             <div className="space-y-3">
               {allowedBindingTypes.map((type, index) => {
                 const isSelected = bindingType === type;
                 
                                   // Calculate price for this binding type
                  const addonRule = productDetails.Addons?.find(addon => addon.AddonName === type);
                  let bindingPrice = 0;
                  
                  console.log(`Debugging binding price for ${type}:`, {
                    addonRule,
                    colorType,
                    paperSize,
                    pageCount,
                    copySelection,
                    customCopies
                  });
                  
                  if (addonRule) {
                    const mappedColor = colorType === "B/W" ? "BlackAndWhite" : "Color";
                    const isDoubleSided = paperSize.toUpperCase().includes("DOUBLE SIDE");
                    const totalSheets = isDoubleSided
                      ? Math.ceil(pageCount / 2) * (copySelection === "all" ? 1 : parseInt(customCopies) || 1)
                      : pageCount * (copySelection === "all" ? 1 : parseInt(customCopies) || 1);
                    
                    console.log(`Calculated values for ${type}:`, {
                      mappedColor,
                      isDoubleSided,
                      totalSheets,
                      availableRules: addonRule.Rules
                    });
                    
                    // Find the appropriate pricing rule for this addon
                    const addonPricingRule = addonRule.Rules?.find(rule => 
                      rule.PaperSize === paperSize && 
                      rule.ColorName === mappedColor
                    );
                    
                    console.log(`Pricing rule found for ${type}:`, addonPricingRule);
                    
                    if (addonPricingRule) {
                      // Parse the price from string format like "140/book" or "50/page"
                      const priceString = addonPricingRule.Price.toString();
                      let pricePerUnit = 0;
                      
                      if (priceString.includes('/book')) {
                        pricePerUnit = parseFloat(priceString.replace('/book', ''));
                        bindingPrice = pricePerUnit; // Fixed price per book
                      } else if (priceString.includes('/page')) {
                        pricePerUnit = parseFloat(priceString.replace('/page', ''));
                        bindingPrice = pricePerUnit * totalSheets;
                      } else {
                        // Try to parse as a simple number
                        pricePerUnit = parseFloat(priceString);
                        bindingPrice = pricePerUnit * totalSheets;
                      }
                      
                      console.log(`Final price for ${type}:`, bindingPrice);
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
                      onClick={() => handleBindingTypeChange(type)}
                    >
                     <div className="flex items-center justify-between">
                       <div className="font-medium text-gray-900">
                         {type}
                       </div>
                       <div className="text-right">
                         {bindingPrice > 0 ? (
                           <div className="text-sm font-semibold text-gray-900">
                             ₹{bindingPrice.toFixed(2)}
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
             <div className="text-gray-500 font-medium">No binding available for this Page Count.</div>
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
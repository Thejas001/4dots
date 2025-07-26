import { useState, useMemo } from "react";
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
}: AddOnServiceProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copySelection, setCopySelection] = useState("");
  const [bindingType, setBindingType] = useState("");
  const [customCopies, setCustomCopies] = useState<string>("");
  const [binderColor, setBinderColor] = useState("Black");
  const [isOpenBinding, setIsOpenBinding] = useState(false);

  const bindingTypes = useMemo(() => {
    if (!productDetails?.Addons) return [];
    return Array.from(new Set(productDetails.Addons.map((addon) => addon.AddonName)));
  }, [productDetails]);

  const allowedBindingTypes = bindingTypes
    .filter(type => isBindingAllowed(type, pageCount, paperSize, colorType));

  // Debug log
  console.log("allowedBindingTypes", allowedBindingTypes, { pageCount, paperSize, colorType });

  const isSelectionComplete = !!paperSize && !!colorType && pageCount > 0;

  const handleBindingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
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

  const handleCustomCopiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomCopies(value);
    onCustomCopiesChange(value);
  };

  return (
    <div className="relative w-full">
      {/* Button to Toggle Dropdown 
      {!isOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 border border-black rounded-lg text-[#242424] hover:bg-[#242424] hover:text-[#fff]"
        >
          View Add-on Services
        </button>
      )}*/}

      {/* Dropdown Content */}

        <div className="mt-2 w-full relative">
          {/* Close Button (X)
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            ✕
          </button> */}

          {/* Add-on Services Title */}
          <span className="text-lg font-semibold">Add Binding</span>

          {/* Two-column layout for Add Binding To and Select Binding Type */}
          <div className="flex flex-row gap-12 w-full items-start">
            {/* Left Column: Add Binding To */}
            <div className="flex-1 min-w-0">
              <label className="block text-black font-medium mb-2"></label>
              <div className="flex items-center  gap-6">
                {/* All Copies */}
                <label className="flex mt-2 items-center gap-2">
                  <input
                    type="checkbox"
                    name="binding"
                    value="all"
                    checked={copySelection === "all"}
                    onChange={handleCopySelectionChange}
                    className="w-5 h-5 border-gray-400"
                  />
                  <span className="text-black">All Copies</span>
                </label>
                {/* Custom */}
                <div className="flex flex-col ml-2 mt-6.5 ">
                  <div className="flex items-center gap-2">
                    <span className="text-black font-medium">Custom</span>
                    <input
                      type="number"
                      placeholder="Numerical Text"
                      min="0"
                      value={customCopies}
                      onChange={handleCustomCopiesChange}
                      className="border border-gray-300 px-4 py-2 rounded-md text-gray-500 w-32 no-spinner"
                      disabled={copySelection === "all"}
                    />
                  </div>
                  <span className="text-gray-500 text-xs ml-2 mt-1">(type no.of copies)</span>
                </div>
              </div>
            </div>
            {/* Right Column: Select Binding Type */}
            <div className="flex-1 min-w-0">
              <label className="block text-black font-medium mb-2">Select Binding Type</label>
              {!isSelectionComplete ? (
                <div className="text-gray-500 font-medium">Please select paper size, color, and upload your file.</div>
              ) : allowedBindingTypes.length > 0 ? (
                <div className="relative border rounded-md focus:ring-2 focus:ring-gray-300 py-3 px-5 bg-white cursor-pointer w-full"
                     onClick={() => setIsOpenBinding(!isOpenBinding)}>
                  <div className="text-sm font-normal text-gray-700">
                    {bindingType || "Select Binding Type"}
                  </div>
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 transform text-gray-400">
                    ▼
                  </span>
                  {isOpenBinding && (
                    <ul className="z-10 mt-1 w-full rounded-md border bg-white py-3 shadow-lg absolute left-0 top-full">
                      {allowedBindingTypes.map((type, index) => (
                        <li
                          key={index}
                          className={`cursor-pointer px-5 py-3 text-sm ${
                            bindingType === type
                              ? "bg-[#242424] text-white"
                              : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                          }`}
                          onClick={e => {
                            e.stopPropagation();
                            setBindingType(type);
                            onBindingTypeChange(type);
                            setIsOpenBinding(false);
                          }}
                        >
                          {type}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 font-medium">No binding available for this Page Count.</div>
              )}
            </div>
          </div>
          {/* Binder Color - Only for Hard Binding */}
          {bindingType === "Hard Binding" && (
            <div className="flex-1 flex-col mt-10">
              <div>
                <label className="block text-[#242424] text-base font-semibold leading-6 tracking-[-0.2px] mb-3">
                  Binder Color
                </label>
              </div>
              <div className="flex flex-row gap-6 mb-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="binder-color"
                    value="Black"
                    checked={binderColor === "Black"}
                    disabled={binderColor.startsWith('#') && binderColor.length === 7}
                    onChange={() => {
                      setBinderColor("Black");
                      onBinderColorChange("Black");
                    }}
                    className="peer hidden"
                  />
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${binderColor === "Black" ? "border-[#242424] ring-2 ring-[#242424]" : "border-gray-300 group-hover:border-[#242424]"}`}>
                    <div className="w-8 h-8 rounded-full bg-[#242424]"></div>
                  </div>
                  <span className={`ml-2 text-base font-medium transition-colors duration-200
                    ${binderColor === "Black" ? "text-[#242424]" : "text-gray-500 group-hover:text-[#242424]"}`}>Black</span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="binder-color"
                    value="White"
                    checked={binderColor === "White"}
                    disabled={binderColor.startsWith('#') && binderColor.length === 7}
                    onChange={() => {
                      setBinderColor("White");
                      onBinderColorChange("White");
                    }}
                    className="peer hidden"
                  />
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${binderColor === "White" ? "border-[#242424] ring-2 ring-[#242424]" : "border-gray-300 group-hover:border-[#242424]"}`}>
                    <div className="w-8 h-8 rounded-full bg-[#fff]"></div>
                  </div>
                  <span className={`ml-2 text-base font-medium transition-colors duration-200
                    ${binderColor === "White" ? "text-[#242424]" : "text-gray-500 group-hover:text-[#242424]"}`}>White</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[#242424] mr-2">Custom Color</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="#RRGGBB"
                    value={binderColor.startsWith('#') ? binderColor : ''}
                    onChange={e => {
                      setBinderColor(e.target.value);
                      onBinderColorChange(e.target.value);
                    }}
                    className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 w-32 focus:outline-none focus:ring-2 focus:ring-[#242424] transition"
                    maxLength={7}
                  />
                  <span className="absolute right-2">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="2" width="16" height="16" rx="4" fill={binderColor.startsWith('#') ? binderColor : "#fff"} stroke="#242424" strokeWidth="1.5"/>
                    </svg>
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-2 block">Enter a hex color code (e.g., #FF0000)</span>
            </div>
          )}
          {/* End Binder Color */}
        </div>
     
    </div>
  );
};

export default AddOnService;
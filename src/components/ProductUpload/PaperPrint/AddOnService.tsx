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

  const bindingTypes = useMemo(() => {
    if (!productDetails?.Addons) return [];
    return Array.from(new Set(productDetails.Addons.map((addon) => addon.AddonName)));
  }, [productDetails]);

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
      {/* Button to Toggle Dropdown */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 border border-black rounded-lg text-[#242424] hover:bg-[#242424] hover:text-[#fff]"
        >
          View Add-on Services
        </button>
      )}

      {/* Dropdown Content */}
      {isOpen && (
        <div className="mt-2 w-full relative">
          {/* Close Button (X) */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            ✕
          </button>

          {/* Add-on Services Title */}
          <span className="text-lg font-semibold">Add-on Services</span>

          {/* Add Binding To Section */}
          <div className="mt-6 flex items-center space-x-4">
            <label className="flex items-center space-x-2">
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

            <div className="mt-5">
              <label className="text-black font-medium">Custom</label>
              <p className="text-gray-500 text-sm">(type no. of copies)</p>
            </div>

            <input
              type="text"
              placeholder="Number"
              value={customCopies}
              onChange={handleCustomCopiesChange}
              className="border border-gray-300 px-3 py-2 mt-12.5 rounded-md text-gray-500 w-24"
              disabled={copySelection === "all"}
            />
            {/* Select Binding Type Section */}
            <div className="mt-4 ml-10">
              <label className="block text-black font-medium mb-2">Select Binding Type</label>
              <select
                value={bindingType}
                onChange={handleBindingTypeChange}
                className="w-full border border-gray-300 px-3 py-2 h-auto rounded-md text-gray-500"
              >
                <option value="">Select Binding Type</option>
                {bindingTypes.map((type, index) => (
                  <option 
                  key={index} 
                  value={type}
                  disabled={!isBindingAllowed(type, pageCount, paperSize, colorType)}
                  >{type}</option>
                ))}
              </select>
            </div>
          </div>
          {/**Binder Color */}
          <div className="flex-1 flex-col mt-10">
            <div className="">
              <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">Binder Color</label>
            </div>
            <div className="relative flex flex-row gap-7.5">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="frame-color"
                  value="Black"
                  checked={binderColor === "Black"}
                  onChange={handleBinderColorChange}
                  className="peer hidden"
                  id="black"
                />
                <div className="w-9 h-9 rounded-full border-2 border-[#242424] flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-[#242424]"></div>
                </div>
                <span className="ml-1 text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">Black</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="frame-color"
                  value="White"
                  checked={binderColor === "White"}
                  onChange={handleBinderColorChange}
                  className="peer hidden"
                  id="white"
                />
                <div className="w-8.5 h-8.5 rounded-full border-2 border-[#242424] peer-checked:bg-[#fff]"></div>
                <span className="ml-1 text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">White</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="frame-color"
                  value="Brown"
                  checked={binderColor === "Brown"}
                  onChange={handleBinderColorChange}
                  className="peer hidden"
                  id="brown"
                />
                <div className="w-8.5 h-8.5 rounded-full border-2 border-[#723100] bg-[#723100]"></div>
                <span className="ml-1 text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">Brown</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddOnService;
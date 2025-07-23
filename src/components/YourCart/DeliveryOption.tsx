'use client'
import React, { useState } from "react";

interface DeliveryOptionProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}


const DeliveryOption: React.FC<DeliveryOptionProps> = ({ selectedOption, setSelectedOption }) => {
  //const [selectedOption, setSelectedOption] = useState(""); // Track which option is selected

  return (
    <div className="flex flex-col rounded-[20px] w-full max-w-[468px] border border-[#ECECEC] py-5 mb-4 px-2 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-center">
        <span className="text-[#000] text-lg font-medium">Select Delivery Type</span>
      </div>

      {/* Options */}
      <div className="flex flex-col space-y-4 mt-4">
        {/* Pick-Up Option */}
        <div
          className="flex flex-row items-center cursor-pointer gap-2 sm:gap-4"
          onClick={() => setSelectedOption("Pickup")} // Set selected option
        >
          {/* Radio Button */}
          <div
            className={`w-7.5 h-7.5 flex items-center justify-center rounded-full border ${
              selectedOption === "Pickup" ? "border-4 border-[#242424]" : "border-2 border-[#D1D5DB]"
            }`}
          ></div>
          <span className="text-[#242424] text-base font-medium leading-6 tracking-tighter-[-0.2px]">Pick-up from shop location</span>
        </div>

        {/* Delivery Option */}
        <div
          className="flex flex-row items-center gap-2 sm:gap-4 cursor-pointer"
          onClick={() => setSelectedOption("Delivery")} // Set selected option
        >
         {/* Radio Button */}
         <div
            className={`w-7.5 h-7.5 flex items-center justify-center rounded-full border ${
              selectedOption === "Delivery" ? "border-4 border-[#242424]" : "border-2 border-[#D1D5DB]"
            }`}
          ></div>
          <span className="text-[#242424] text-base font-medium leading-6 tracking-tighter-[-0.2px]">Deliver the product</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOption;

'use client'
import React, { useState } from "react";
import AddressModal from "./AddressModal";

interface AddressProps {
  hideLabel?: boolean;
  buttonStyle?: "black" | "default";
  buttonAlignment?: "left" | "right";
}

const AddressOption : React.FC<AddressProps> = ({ hideLabel, buttonStyle = "default", buttonAlignment = "right" }) => {
  const [selectedOption, setSelectedOption] = useState(""); // Track which option is selected
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col rounded-[20px]  xl:max-w-[468px] border border-[#ECECEC] py-5 mb-4">
      {/* Header */}
      <div className="flex items-center justify-center">
        <span className="text-[#000] text-lg font-medium">Address</span>
      </div>

      {/* Options */}
      <div className="flex flex-col space-y-4 mt-4 px-4">
        {/* Pick-Up Option */}
        <div
          className="flex items-center cursor-pointer gap-4"
          onClick={() => setSelectedOption("pickup")} // Set selected option
        >
          {/* Radio Button */}
          <div
            className={`w-7.5 h-7.5 flex items-center justify-center rounded-full border ${
              selectedOption === "pickup" ? "border-4 border-[#242424]" : "border-2 border-[#D1D5DB]"
            }`}
          ></div>
          <span className="text-[#242424] text-base font-medium leading-6 tracking-tighter-[-0.2px]"> 
            206, 2nd Floor, Valiulla Complex, Nagdevi Street,
            <br />
            Nagdevi - 400003
            </span>
        </div>

        {/* Delivery Option 
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => setSelectedOption("delivery")} // Set selected option
        >
         {/* Radio Button 
         <div
            className={`w-7.5 h-7.5 flex items-center justify-center rounded-full border ${
              selectedOption === "delivery" ? "border-4 border-[#242424]" : "border-2 border-[#D1D5DB]"
            }`}
          ></div>
          <span className="text-[#242424] text-base font-medium leading-6 tracking-tighter-[-0.2px]">Delivery the product</span>
        </div> */}

              {/* Address Button - Customizable Position & Style */}
      <div className={`mb-4 mr-[21px] mt-7.5 flex items-center ${buttonAlignment === "left" ? "justify-start" : "justify-end"}`}>
        <button
          className={`flex items-center justify-center rounded-full border px-5 py-2 text-sm md:text-base xl:h-10 xl:w-[211px] transition
            ${buttonStyle === "black" ? "bg-black text-white border-black hover:bg-gray-800" : "bg-[#FCFCFC] text-[#242424] border-[#242424] hover:bg-gray-200"}
          `}
          onClick={() => setIsModalOpen(true)}
        >
          Add New Address
        </button>
      </div>

        {/* Address Modal */}
        <AddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      </div>
    </div>
  );
};

export default AddressOption;

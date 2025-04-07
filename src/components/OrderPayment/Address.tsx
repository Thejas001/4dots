'use client'
import React, { useState } from "react";
import AddressModal from "../YourCart/AddressModal";

interface AddressProps {
  hideLabel?: boolean;
  buttonStyle?: "black" | "default";
  buttonAlignment?: "left" | "right";
}

const Address: React.FC<AddressProps> = ({ hideLabel, buttonStyle = "default", buttonAlignment = "right" }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="ml-5 flex flex-1 flex-col">
      <div className="mt-[15px] flex items-start gap-2.5">
        {/* Radio Button */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setSelectedOption("pickup")}
        >
          <div
            className={`w-7 h-7 flex items-center justify-center rounded-full border ${
              selectedOption === "pickup" ? "border-4 border-[#242424]" : "border-2 border-[#D1D5DB]"
            }`}
          ></div>
        </div>

        {/* Conditional Rendering for Address Label */}
        {!hideLabel && (
          <div className="flex-shrink-0">
            <label className="text-sm font-semibold text-[#000] xl:text-lg">
              Address1 :
            </label>
          </div>
        )}

        <div className="ml-2 xl:w-[429px]">
          <span className="h-auto text-sm font-normal text-[#000] xl:text-lg">
            206, 2nd Floor, Valiulla Complex, Nagdevi Street,
            <br />
            Nagdevi - 400003
          </span>
        </div>
      </div>

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
  );
};

export default Address;

'use client'
import React, { useState } from "react";

interface PaymentMethodProps {
  selectedPaymentOption: string;
  setSelectedPaymentOption: (option: string) => void;
}


const PaymentMethod: React.FC<PaymentMethodProps> = ({ selectedPaymentOption, setSelectedPaymentOption }) => {
  //const [selectedOption, setSelectedOption] = useState(""); // Track which option is selected

  return (
    <div className="flex flex-col rounded-[20px]  xl:max-w-[468px] border border-[#ECECEC] py-5 mb-4">
      {/* Header */}
      <div className="flex items-center justify-center">
        <span className="text-[#000] text-lg font-medium">Select Payment Type</span>
      </div>

      {/* Options */}
      <div className="flex flex-col space-y-4 mt-4 px-4">
        {/* Pick-Up Option */}
        <div
          className="flex items-center cursor-pointer gap-4"
          onClick={() => setSelectedPaymentOption("CashOnDelivery")} // Set selected option
        >
          {/* Radio Button */}
          <div
            className={`w-7.5 h-7.5 flex items-center justify-center rounded-full border ${
              selectedPaymentOption === "CashOnDelivery" ? "border-4 border-[#242424]" : "border-2 border-[#D1D5DB]"
            }`}
          ></div>
          <span className="text-[#242424] text-base font-medium leading-6 tracking-tighter-[-0.2px]">Cash On Delivery</span>
        </div>

        {/* Delivery Option */}
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => setSelectedPaymentOption("Online")} // Set selected option
        >
         {/* Radio Button */}
         <div
            className={`w-7.5 h-7.5 flex items-center justify-center rounded-full border ${
              selectedPaymentOption === "Online" ? "border-4 border-[#242424]" : "border-2 border-[#D1D5DB]"
            }`}
          ></div>
          <span className="text-[#242424] text-base font-medium leading-6 tracking-tighter-[-0.2px]">Online Payment</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;

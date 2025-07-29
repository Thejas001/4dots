'use client'
import React, { useState } from "react";

interface PaymentMethodProps {
  selectedPaymentOption: string;
  setSelectedPaymentOption: (option: string) => void;
  totalPrice: number;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ selectedPaymentOption, setSelectedPaymentOption, totalPrice }) => {
  //const [selectedOption, setSelectedOption] = useState(""); // Track which option is selected
  const isCashDisabled = totalPrice > 150;
  const handleCashClick = () => {
    if (isCashDisabled) {
      alert("Cash on Delivery is only available for orders up to ₹150.");
      return;
    }
    setSelectedPaymentOption("CashOnDelivery");
  };
  return (
    <div className="flex flex-col rounded-[20px] w-full max-w-[468px] border border-[#ECECEC] py-5 mb-4 px-2 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-center">
        <span className="text-[#000] text-lg font-medium">Select Payment Type</span>
      </div>
      {/* Options */}
      <div className="flex flex-col space-y-4 mt-4">
        {/* Cash On Delivery Option */}
        <div
          className={`flex flex-row items-center cursor-pointer gap-2 sm:gap-4 ${isCashDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleCashClick}
        >
          {/* Radio Button */}
          <div
            className={`w-7.5 h-7.5 flex items-center justify-center rounded-full border ${
              selectedPaymentOption === "CashOnDelivery" ? "border-4 border-[#242424]" : "border-2 border-[#D1D5DB]"
            }`}
            style={{ background: isCashDisabled ? '#f3f3f3' : undefined }}
          ></div>
          <span className="text-[#242424] text-base font-medium leading-6 tracking-tighter-[-0.2px]">Cash On Delivery</span>
          {isCashDisabled && (
            <span className="ml-2 text-xs text-red-500">(Only for orders up to ₹150)</span>
          )}
        </div>
        {/* Online Payment Option */}
        <div
          className="flex flex-row items-center gap-2 sm:gap-4 cursor-pointer"
          onClick={() => setSelectedPaymentOption("Online")}
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

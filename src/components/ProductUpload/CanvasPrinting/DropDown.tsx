"use client";
import React, { useState, useEffect } from "react";

const DropDown = ({ onSqftChange }: { onSqftChange: (sqft: number) => void }) => {
  const [selectedWidth, setSelectedWidth] = useState<number | null>(null);
  const [selectedHeight, setSelectedHeight] = useState<number | null>(null);
  const [calculatedSquareFeet, setCalculatedSquareFeet] = useState<number | null>(null);

  useEffect(() => {
    if (selectedWidth && selectedHeight) {
      const sqft = selectedWidth * selectedHeight;
      setCalculatedSquareFeet(sqft);
      onSqftChange(sqft); // Pass the calculated value to the parent
    } else {
      setCalculatedSquareFeet(null);
      onSqftChange(null); // Reset in parent
    }
  }, [selectedWidth, selectedHeight, onSqftChange]);

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-[45px] w-full">
        {/* Left DropDown Section */}
            <div className="flex flex-col gap-5 md:gap-10 w-full md:w-1/2">
            <div className="h-auto">
                <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
                    Width
                </label>
                    <input
                    type="number"
                    className="border rounded-md focus:ring-2 focus:ring-gray-300 py-3 px-5 bg-white text-gray-700 w-full"
                    value={selectedWidth || ""}
                    placeholder="Enter Width"
                    onChange={(e) => setSelectedWidth(Number(e.target.value) || null)}
                    min="1"
                    />
                </div>
            </div>

            {/* Right DropDown Section */}
            <div className="flex flex-col gap-4 w-full md:w-1/2">
            <div className="h-auto">
                <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
                    Heigth
                </label>
                    <input
                    type="number"
                    className="border rounded-md focus:ring-2 focus:ring-gray-300 py-3 px-5 bg-white text-gray-700 w-full"
                    value={selectedHeight || ""}
                    placeholder="Enter Heigth"
                    onChange={(e) => setSelectedHeight(Number(e.target.value) || null)}
                    min="1"
                    />
                </div>
            </div>
    </div>
    );
};

export default DropDown;
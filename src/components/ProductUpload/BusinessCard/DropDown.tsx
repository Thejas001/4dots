"use client";
import React, { useState } from "react";
import { Product } from "@/app/models/products";

const DropDown = ({
    productDetails,
    onCardChange,
    onSurfaceChange 
}:{
    productDetails: Product, 
    onCardChange: (card: string) => void,
    onSurfaceChange: (surface: string) => void
}) => {

       const [isOpenCard, setIsOpenCard] = useState(false);
  //   const [isOpenQuantity, setIsOpenQuantity] = useState(false);

     const [SelectedCard , setSelectedCard] = useState("");
    // const [SelectedQuantity , setSelectedQuantity] = useState<number | null>(null);

     const cardTypes = productDetails.cardType || [];
    // const quantity = productDetails.quantity || [];
	 
	 const [isOpen2, setIsOpen2] = useState(false);
     const options2 = ["Item 1", "Item 2", "Item 3"];
     const [selected2, setSelected2] = useState("");
     const [selectedSurface, setSelectedSurface] = useState(""); 

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-[45px] w-full">
        {/* Left DropDown Section */}
            <div className="flex flex-col gap-4 w-full md:w-1/2">
                <label className="text-base font-medium text-[#242424]">Surface Finish</label>
                     {/* Color Options */}
                    <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-10">
                    <div
                    className="flex items-center cursor-pointer gap-2 sm:gap-4"
                    onClick={() => {
                        setSelectedSurface("Glossy Finish");
                        onSurfaceChange("GLOSSY");
                    }}>
                    {/* Radio Button */}
                    <div
                        className={`w-7.5 h-7.5 flex items-center justify-center rounded-full border ${
                        selectedSurface === "Glossy Finish" ? "border-4 border-[#242424]" : "border-2 border-[#D1D5DB]"
                        }`}
                    ></div>
                    <span className="text-[#242424] text-sm sm:text-base font-medium leading-6 tracking-tighter-[-0.2px]">Glossy Finish</span>
                    </div>

                    {/* Delivery Option */}
                    <div
                    className="flex items-center gap-2 sm:gap-4 cursor-pointer"
                    onClick={() => {
                        setSelectedSurface("Matte Finish");
                        onSurfaceChange("MATT");
                    }}>
                    {/* Radio Button */}
                    <div
                        className={`w-7.5 h-7.5 flex items-center justify-center rounded-full border ${
                        selectedSurface === "Matte Finish" ? "border-4 border-[#242424]" : "border-2 border-[#D1D5DB]"
                        }`}
                    ></div>
                    <span className="text-[#242424] text-sm sm:text-base font-medium leading-6 tracking-tighter-[-0.2px]">Matte Finish</span>
                    </div>
                </div>
                {/**Orientation DropDown 
                <div className="h-auto mt-10">
                    <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
                        Quantity
                    </label>
                <div
                    className="relative border rounded-md focus:ring-2 focus:ring-gray-300 py-3 px-5 bg-white cursor-pointer"
                    onClick={() => setIsOpen2(!isOpen2)}
                >
                    <div className="text-sm font-normal text-gray-700">{selected2 || "Dropdown"}</div>
                    <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ▼
                    </span>
                </div>
                {isOpen2 && (
                    <ul className="z-10 w-full mt-1 py-3 bg-white border rounded-md shadow-lg">
                    {options2.map((option, index) => (
                        <li
                        key={index}
                        className={`px-5 py-3 text-sm cursor-pointer ${
                            selected2 === option ? "bg-[#242424] text-white" : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                        }`}
                        onClick={() => { setSelected2(option); setIsOpen2(false); }}
                        >
                        {option}
                        </li>
                    ))}
                    </ul>
                )}
                </div>*/}
            </div>


        {/* Right DropDown Section */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
            <div className="h-auto">
            <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">
                 Card Type
            </label>
            <div
                className="relative border rounded-md focus:ring-2 focus:ring-gray-300 py-2.5 sm:py-3 px-4 sm:px-5 bg-white cursor-pointer w-full"
                onClick={() => setIsOpenCard(!isOpenCard)}
            >
                <div className="text-sm font-normal text-gray-700">{SelectedCard || "Select Card Type"}</div>
                <span className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                ▼
                </span>
            </div>
            {isOpenCard && (
                <ul className="z-10 w-full mt-1 py-2 sm:py-3 bg-white border rounded-md shadow-lg">
                {cardTypes.map((option, index) => (
                    <li
                    key={index}
                    className={`px-4 sm:px-5 py-2.5 sm:py-3 text-sm cursor-pointer ${
                        SelectedCard === option ? "bg-[#242424] text-white" : "bg-white text-[#242424] hover:bg-[#242424] hover:text-white"
                    }`}
                    onClick={() => { 
                        setSelectedCard(option); 
                        onCardChange(option);
                        setIsOpenCard(false); 
                    }}
                    >
                    {option}
                    </li>
                ))}
                </ul>
            )}
            </div>
        </div>
    </div>
    );
};

export default DropDown;
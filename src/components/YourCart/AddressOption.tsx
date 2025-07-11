'use client'
import React, { useState , useEffect } from "react";
import AddressModal from "@/components/OrderPayment/AddressModal"; // Adjust the import path as necessary
import { getUserAddress } from "@/utils/api"; // Adjust the import path as necessary

interface AddressProps {
  hideLabel?: boolean;
  buttonStyle?: "black" | "default";
  buttonAlignment?: "left" | "right";
}

interface AddressType {
  Id: number;
  Address: string;
  City: string;
  Country: string;
  PinCode: string;
  IsPrimary: boolean;
}

const AddressOption : React.FC<AddressProps> = ({ hideLabel, buttonStyle = "default", buttonAlignment = "right" }) => {
  const [selectedOption, setSelectedOption] = useState(""); // Track which option is selected
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchAddress = async () => {
        setLoading(true);
        try {
          const data = await getUserAddress();
          setAddress(data); // ✅ Adjust if your API returns nested structure
          const primary = data.find((addr: AddressType) => addr.IsPrimary);
          if (primary) setSelectedOption(primary.Id.toString());

        } catch (err) {
          console.error("Failed to fetch address", err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAddress();
    }, []);
  
    const refreshAddresses = async () => {
      try {
        const data = await getUserAddress();
        setAddress(data);
      } catch (err) {
        console.error("Failed to fetch address", err);
      }
    };

  return (
    <div className="flex flex-col rounded-[20px] w-full max-w-[468px] border border-[#ECECEC] py-5 mb-4 px-2 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-center">
        <span className="text-[#000] text-lg font-medium">Address</span>
      </div>

      {/* Options */}
      <div className="flex flex-col space-y-4 mt-4">
        {/* Pick-Up Option */}
        {loading ? (
         <p className="text-sm text-gray-500">Loading addresses...</p>
            ) : address.length > 0 ? (
           address.map((addr) => (
        <div key={addr.Id}
          className="flex flex-row items-center cursor-pointer gap-2 sm:gap-4"
          onClick={() => setSelectedOption(addr.Id.toString())} // Set selected option
        >
          {/* Radio Button */}
          <div
            className={`w-7.5 h-7.5 flex items-center justify-center rounded-full border ${
              selectedOption === addr.Id.toString()
 ? "border-4 border-[#242424]" : "border-2 border-[#D1D5DB]"
            }`}
          ></div>
          <span className="text-[#242424] text-base font-medium leading-6 tracking-tighter-[-0.2px]"> 
          {addr.Address},<br />
          {addr.City}, {addr.Country} - {addr.PinCode}
            </span>
        </div>
           ))
        ) : (
          <p className="text-sm text-gray-500">No addresses available</p>
        )}
      <div className={`mb-4 mr-0 sm:mr-[21px] mt-7.5 flex items-center w-full ${buttonAlignment === "left" ? "justify-start" : "justify-end"}`}>
        <button
          className={`flex items-center justify-center rounded-full border px-5 py-2 text-sm md:text-base xl:h-10 w-full sm:w-auto xl:w-[211px] transition
            ${buttonStyle === "black" ? "bg-black text-white border-black hover:bg-gray-800" : "bg-[#FCFCFC] text-[#242424] border-[#242424] hover:bg-gray-200"}
          `}
          onClick={() => setIsModalOpen(true)}
        >
          Add New Address
        </button>
      </div>

        {/* Address Modal */}
        <AddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddressAdded={refreshAddresses} />

      </div>
    </div>
  );
};

export default AddressOption;

'use client';
import React, { useState } from "react";
import AddressModal from "../OrderPayment/AddressModal";

export interface AddressType {
  Id: number;
  Address: string;
  City: string;
  Country: string;
  PinCode: string;
  IsPrimary: boolean;
}

interface AddressProps {
  address?: AddressType[];
  loading: boolean;
  error?: boolean;
  refreshAddresses: () => Promise<void>;
  hideLabel?: boolean;
  buttonStyle?: "black" | "default";
  buttonAlignment?: "left" | "right";
}

const Address: React.FC<AddressProps> = ({
  address = [],
  loading,
  error,
  refreshAddresses,
  hideLabel,
  buttonStyle = "default",
  buttonAlignment = "right",
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddressAdded = async () => {
    setIsModalOpen(false);
    await refreshAddresses(); // re-fetch updated address list
  };

  return (
    <div className="ml-5 flex flex-1 flex-col">
      <div className="mt-4 flex items-start gap-2.5">
        {!hideLabel && (
          <div className="flex-shrink-0">
            <label className="text-sm font-semibold text-[#000] xl:text-lg">
              Address1 :
            </label>
          </div>
        )}

        <div className="ml-2 xl:w-[429px]">
          <span className="h-auto text-sm font-normal text-[#000] xl:text-lg">
            {loading ? (
              "Loading address..."
            ) : error ? (
              <span className="text-red-500">Error loading addresses</span>
            ) : address.length > 0 ? (
              <div className="space-y-4">
                {address.map((addr) => (
                  <div
                    key={addr.Id}
                    className="flex items-start gap-2.5 cursor-pointer"
                    onClick={() => setSelectedOption(addr.Id.toString())}
                  >
                    <div className="flex items-center pt-1">
                      <div
                        className={`w-6 h-6 flex items-center justify-center rounded-full border ${
                          selectedOption === addr.Id.toString()
                            ? "border-4 border-[#242424]"
                            : "border-2 border-[#D1D5DB]"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <p>{addr.Address}</p>
                      <p>
                        {addr.City}, {addr.Country} - {addr.PinCode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              "No address found"
            )}
          </span>
        </div>
      </div>

      {/* Add New Address Button */}
      <div
        className={`mb-4 mr-[21px] mt-7.5 flex items-center ${
          buttonAlignment === "left" ? "justify-start" : "justify-end"
        }`}
      >
        <button
          className={`flex items-center justify-center rounded-full border px-5 py-2 text-sm md:text-base xl:h-10 xl:w-[211px] transition ${
            buttonStyle === "black"
              ? "bg-black text-white border-black hover:bg-gray-800"
              : "bg-[#FCFCFC] text-[#242424] border-[#242424] hover:bg-gray-200"
          }`}
          onClick={() => setIsModalOpen(true)}
        >
          Add New Address
        </button>
      </div>

      {/* Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddressAdded={handleAddressAdded}
      />
    </div>
  );
};

export default Address;

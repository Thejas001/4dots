'use client'
import React, { useState , useEffect } from "react";
import AddressModal from "../OrderPayment/AddressModal";
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


const Address: React.FC<AddressProps> = ({ hideLabel, buttonStyle = "default", buttonAlignment = "right" }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      try {
        const data = await getUserAddress();
        setAddress(data); // ✅ Adjust if your API returns nested structure
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
<div className="ml-5 flex flex-1 flex-col">
  <div className="mt-4 flex items-start gap-2.5">
    {/* Label */}
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
        ) : address.length > 0 ? (
          <div className="space-y-4">
            {address.map((addr) => (
              <div
                key={addr.Id}
                className="flex items-start gap-2.5 cursor-pointer"
                onClick={() => setSelectedOption(addr.Id.toString())}
              >
                {/* Address Radio */}
                <div className="flex items-center pt-1">
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full border ${
                      selectedOption === addr.Id.toString()
                        ? "border-4 border-[#242424]"
                        : "border-2 border-[#D1D5DB]"
                    }`}
                  />
                </div>

                {/* Address Text */}
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

  {/* Address Button */}
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

  {/* Address Modal */}
  <AddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}  onAddressAdded={refreshAddresses}/>
</div>

  );
};

export default Address;

"use client";
import React from "react";
import { IoClose } from "react-icons/io5"; 
import { addUserAddress } from "@/utils/api";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressAdded?: () => void;
}

const AddressModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center text-[#242424]  z-50">
      {/* Background Blur */}
      <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative bg-[#fff] top-18 p-6 rounded-lg shadow-lg  w-[753px] md:p-7.5 max-h-[80vh] overflow-y-auto">
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 text-center">
            <h2 className="text-lg font-medium text-[#242424]">Add New Address</h2>
          </div>

          {/* Close Button */}
          <button
            className="flex items-center justify-center w-6 h-6 rounded-full bg-[#ECECEC]"
            onClick={onClose}
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>


        {/* Address Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div className="sm:col-span-2">
            <label className="block text-base font-normal  mb-2.5">
              Your Name <span className="text-gray-500 italic"></span>
            </label>
            <input type="text" className="w-full md:h-11.5  p-1 rounded-md border border-gray-300 bg-white" placeholder="Enter landmark" />
          </div>

          <div className="relative w-full sm:col-span-2">
            <label className="block text-base font-normal  mb-2.5">
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              className="peer w-full p-3 border border-gray-300 rounded-md bg-white resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
              placeholder="Enter your address"
            ></textarea>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-base font-normal  mb-2.5">
              Landmark <span className="text-gray-500 italic">(Optional)</span>
            </label>
            <input type="text" className="w-full md:h-11.5  p-1 rounded-md border border-gray-300 bg-white" placeholder="Enter landmark" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-base font-normal mb-2.5">City</label>
            <input type="text" className="w-full md:h-11.5   p-1 rounded-md border border-gray-300 bg-white" placeholder="Enter city" />
          </div>

          <div className="sm:col-span-2">
              <label className="text-base font-norma mb-2.5">Phone Number</label>
              <div className="flex items-center overflow-hidden  rounded-md border border-gray-300 bg-white">
                <div className="flex items-center px-4">
                  <img
                    src="/images/login/flag-india.svg"
                    alt="India Flag"
                    className="mr-2 h-5 w-5"
                  />
                  <span className="mr-1 font-medium text-gray-400">|</span>
                  <span className="font-medium text-gray-400">+91</span>
                </div>
                <input
                  type="text"
                  className="w-full flex-1 p-3 outline-none   bg-white"
                  placeholder="Enter phone number"
                />
              </div>
            </div>


          <div className=" ">
            <label className="block text-base font-normal mb-2.5">Country</label>
            <select className="w-full  md:h-11.5 border p-2 rounded text-[#8D93A5]">
              <option className=" text-sm font-normal">Select Country</option>
              <option>India</option>
              <option>USA</option>
            </select>
          </div>

          <div className="">
            <label className="block text-base font-normal mb-2.5">ZIP / Postcode</label>
            <input type="text" className="w-full md:h-11.5  p-1 rounded-md border border-gray-300 bg-white" placeholder="Enter ZIP" />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button className="md:w-[179px] bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition">
            Add Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;

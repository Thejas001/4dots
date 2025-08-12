"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { addUserAddress } from "@/utils/api";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressAdded?: () => void;
}

const AddressModal = ({ isOpen, onClose, onAddressAdded }: AddressModalProps) => {
  const [formData, setFormData] = useState({
    Address: "",
    City: "",
    Country: "",
    PinCode: "",
    Landmark: "",
    IsPrimary: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.Address.trim()) newErrors.Address = "Address is required";
    if (!formData.City.trim()) newErrors.City = "City is required";
    if (!formData.Country.trim()) newErrors.Country = "Country is required";
    if (!formData.PinCode.trim()) newErrors.PinCode = "Postcode is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    try {
      const response = await addUserAddress(formData);
      onClose();
      if (onAddressAdded) onAddressAdded();
    } catch (error) {
      alert("Failed to add address. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


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
        <form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {/* Address */}
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                value={formData.Address}
                onChange={(e) => handleChange("Address", e.target.value)}
                rows={3}
                className={`w-full p-3 border rounded-md bg-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.Address ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your full address"
              />
              {errors.Address && (
                <p className="mt-1 text-sm text-red-500">{errors.Address}</p>
              )}
            </div>

            {/* Landmark */}
            <div className="sm:col-span-2">
              <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">
                Landmark <span className="text-gray-500 italic">(Optional)</span>
              </label>
              <input
                id="landmark"
                type="text"
                value={formData.Landmark}
                onChange={(e) => handleChange("Landmark", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter nearby landmark"
              />
            </div>

            {/* City */}
            <div className="sm:col-span-2">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                type="text"
                value={formData.City}
                onChange={(e) => handleChange("City", e.target.value)}
                className={`w-full p-3 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.City ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter city"
              />
              {errors.City && (
                <p className="mt-1 text-sm text-red-500">{errors.City}</p>
              )}
            </div>

            {/* Phone Number 
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className={`flex items-center overflow-hidden rounded-md border ${
                errors.PhoneNumber ? "border-red-500" : "border-gray-300"
              }`}>
                <div className="flex items-center px-4 bg-gray-50 h-full">
                  <img
                    src="/images/login/flag-india.svg"
                    alt="India Flag"
                    className="mr-2 h-5 w-5"
                  />
                  <span className="mr-1 font-medium text-gray-400">|</span>
                  <span className="font-medium text-gray-400">+91</span>
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={formData.PhoneNumber}
                  onChange={(e) => handleChange("PhoneNumber", e.target.value)}
                  className="w-full flex-1 p-3 outline-none bg-white"
                  placeholder="Enter phone number"
                />
              </div>
              {errors.PhoneNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.PhoneNumber}</p>
              )}
            </div>
*/}
            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                id="country"
                value={formData.Country}
                onChange={(e) => handleChange("Country", e.target.value)}
                className={`w-full p-3 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.Country ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
              </select>
              {errors.Country && (
                <p className="mt-1 text-sm text-red-500">{errors.Country}</p>
              )}
            </div>

            {/* ZIP Code */}
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                ZIP / Postcode <span className="text-red-500">*</span>
              </label>
              <input
                id="pincode"
                type="text"
                value={formData.PinCode}
                onChange={(e) => handleChange("PinCode", e.target.value)}
                className={`w-full p-3 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.PinCode ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter postal code"
              />
              {errors.PinCode && (
                <p className="mt-1 text-sm text-red-500">{errors.PinCode}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
          <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "Add New Address"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
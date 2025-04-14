import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { updateUserDetails } from "@/utils/api";  

const ProfileModal = ({ isOpen, onClose, onProfileUpdated  }: { isOpen: boolean; onClose: () => void;  onProfileUpdated: () => void   }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  if (!isOpen) return null; // Prevent rendering when closed

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUserDetails({ FirstName: name });
      setSuccess(true);
      onProfileUpdated();
      onClose(); // Close modal after successful update
    } catch (err: any) {
      setError(err || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
       {/* Background Blur */}
       <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="bg-[#fff] p-6 rounded-2xl shadow-lg md:w-[753px] relative">
        <div className="flex items-center justify-between mb-4">
                 <div className="flex-1 text-center">
                   <h2 className="text-lg font-medium text-[#242424]">Edit Profile</h2>
                 </div>
       
                 {/* Close Button */}
                 <button
                   className="flex items-center justify-center w-6 h-6 rounded-full bg-[#ECECEC]"
                   onClick={onClose}
                 >
                   <IoClose className="w-6 h-6" />
                 </button>
               </div>
        {/* Form */}
        <form className="space-y-5" onSubmit={handleUpdate}>
        {/* Name Field */}
          <div>
            <label className="block text-base font-normal text-[#242424] mb-2.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              className="w-full md:h-11.5   p-2 rounded-md border border-gray-300 bg-white"
            />
          </div>

          {/* Phone Number Field */}
          <div>
              <label className="text-base font-normal text-[#242424] space-x-2.5">Phone Number</label>
              <div className="flex items-center overflow-hidden mt-2.5  rounded-md border border-gray-300 bg-white">
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

          {/* Update Button */}
            <div className="flex justify-end mt-6">
                <button disabled={loading} type="submit" className="md:w-[179px] bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition">
                 {loading ? "Updating..." : "Update Profile"}
                </button>
            </div>
            {/* Optional Feedback */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mt-2">Profile updated successfully!</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;

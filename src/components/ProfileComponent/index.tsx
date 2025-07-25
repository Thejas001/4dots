"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProfileModal from "@/components/ProfileModal";
import Address from "@/components/OrderPayment/Address";
import UserProfileOrder from "./UserProfileOrder";
import { getUserDetails } from "@/utils/api";

interface UserDetails {
  Name: string;
  PhoneNumber: string;
}

const ProfileComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const router = useRouter();

  const refreshUser = async (currentName?: string) => {
    try {
      const data = await getUserDetails();
      if (data.Name !== currentName) {
        setUserName(data.Name || "");
        setUserDetails(data);
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const handleProfileUpdated = () => {
    refreshUser();
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const handleLogout = () => {
    document.cookie = "jwtToken=; path=/; max-age=0; SameSite=Lax; Secure";
    localStorage.removeItem("jwtToken");
    router.push("/");
  };

  function getInitials(name: string) {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return (
    <div className="bg-[#fff] h-full grid grid-rows-[auto,1fr]">
      {/* Top Section */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-8 px-4 sm:px-10 md:px-20 py-4">
        {/* Back Button */}
        <div className="border rounded-[4px] border-[#242424] p-1">
          <Link href="/">
            <img
              src="/images/icon/Arrow-icon.svg"
              alt="Back"
              className="w-4 h-4"
            />
          </Link>
        </div>
        {/* Profile Heading */}
        <span className="text-[#000] text-lg sm:text-xl md:text-2xl font-normal">
          Your Profile
        </span>
        {/* Logout Button */}
        <div className="ml-auto">
          <div
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-[28px] border border-[#B5B5B5] bg-[#ECECEC] px-3 py-1.5 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M13.496 21H6.5C5.395 21 4.5 19.849 4.5 18.429V5.57C4.5 4.151 5.395 3 6.5 3H13.5M16 15.5L19.5 12L16 8.5M9.5 11.996H19.5"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-base font-normal text-black">Logout</span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-4 sm:px-10 md:px-20 pb-10">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Profile Card */}
          <div className="flex flex-row gap-4 items-start rounded-[10px] border border-[#ECECEC] p-5 w-full">
            {/* Profile Icon */}
            <div className="w-[200px] h-[100px] flex items-center justify-center rounded-[10px] bg-[#ECECEC] text-gray-700 font-medium text-lg">
              {getInitials(userDetails?.Name || "UserName")}
            </div>

            {/* User Details */}
            <div className="flex flex-col gap-1 xl:gap-3 flex-grow sm:ml-4 w-full">
              <div className="text-[#000] text-xl font-normal">
                {userDetails?.Name || "UserName"}
              </div>
              <div>
                <span className="text-[15px] font-normal text-[#000]">
                  Mobile Number :
                </span>
                <span className="pl-2.5 text-[#06f] text-base underline">
                  {userDetails?.PhoneNumber || ""}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-4 sm:mt-0 sm:ml-auto">
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-[#B5B5B5] bg-[#F7F7F7] px-3 py-1.5 text-sm sm:px-5 sm:py-2.5 sm:text-sm text-xs"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                >
                  <path
                    d="M14.4748 1.89692C15.6147 0.757016 17.4628 0.757016 18.6028 1.89692C19.7427 3.03683 19.7427 4.88498 18.6028 6.02488L13.0627 11.565C12.7533 11.8744 12.5595 12.0683 12.3432 12.237C12.0884 12.4356 11.8128 12.606 11.5211 12.745C11.2735 12.863 11.0135 12.9497 10.5983 13.088L8.1779 13.8948C7.73103 14.0438 7.23835 13.9275 6.90528 13.5944C6.5722 13.2613 6.45589 12.7686 6.60485 12.3218L7.41166 9.90135C7.55001 9.48621 7.63667 9.22615 7.75468 8.97853C7.89367 8.68689 8.06402 8.41125 8.26272 8.15651C8.43142 7.94022 8.62527 7.7464 8.93472 7.43699L14.4748 1.89692Z"
                    fill="#242424"
                  />
                </svg>
                Edit Details
              </button>
              <ProfileModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onProfileUpdated={handleProfileUpdated}
              />
            </div>
          </div>

          {/* User Orders */}
          <UserProfileOrder />
        </div>

        {/* Right Column - Address Section */}
        <div className="border border-[#ECECEC] rounded-[10px] p-4 w-full min-h-[300px]">
          <Address hideLabel buttonAlignment="left" buttonStyle="black" />
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
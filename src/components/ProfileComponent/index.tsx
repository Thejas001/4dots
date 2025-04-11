"use client";
import React , { useState } from "react";
import { useRouter } from "next/navigation"; 
import Image from "next/image";
import Link from "next/link";
import ProfileModal from "@/components/ProfileModal";
import Address from "@/components/OrderPayment/Address";
import { motion } from "framer-motion";
import { IoIosLogOut } from "react-icons/io";
import UserProfileOrder from "./UserProfileOrder";


const ProfileComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "jwtToken=; path=/; max-age=0; SameSite=Lax; Secure";

    localStorage.removeItem("jwtToken"); // Clear stored authentication token
    router.push("/"); // Navigate to landing page
  };

  return ( 

<div className=" grid grid-rows-[auto,1fr]  bg-[#fff] h-full">
    {/* Top Section */} 
    <div className="flex items-center mt-4 gap-[33.5px] px-20">
      {/* Back Button */}
      <div className="border rounded-[4px] border-[#242424] p-1">
        <Link href="/">
          <div className="text-gray-600 hover:text-gray-900 cursor-pointer">
            <img
              src="/images/icon/Arrow-icon.svg"
              alt="Back"
              className="w-4 h-4"
            />
          </div>
        </Link>
      </div>
      {/* Your Cart Text */}
      <span className="text-[#000] text-[22px] font-normal leading-[26px]">
        Your Profile
      </span>
    </div>
    {/* Logout Button */}
    <div className="flex justify-end px-20">
  <div onClick={handleLogout} className="flex items-center rounded-[28px] border border-[#B5B5B5] bg-[#ECECEC] gap-2 px-3 py-1.5 cursor-pointer">
    <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13.496 21H6.5C5.395 21 4.5 19.849 4.5 18.429V5.57C4.5 4.151 5.395 3 6.5 3H13.5M16 15.5L19.5 12L16 8.5M9.5 11.996H19.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span className="text-base font-normal text-black">Logout</span>
  </div>
</div>

  
    {/* Bottom Section */}
    <div className="grid h-auto grid-cols-12 xl:grid-cols-2 pl-36 mt-9">
    <div className="flex flex-col">
    {/** Profile Card */}
    <div className="flex items-start rounded-[10px] border border-[#ECECEC] md:w-[631px] p-5">
      
      {/** Profile Icon */}
      <div className="w-[100px] h-[100px] flex items-center justify-center rounded-[10px] bg-[#ECECEC] text-gray-700 font-medium text-lg">
        RR
      </div>

      {/** User Details */}
      <div className="flex ml-[17px] flex-col gap-5 flex-grow">
        <div className="text-[#000] text-xl font-normal">userName</div>
        <div>
          <span className="text-base font-normal text-[#000]">Mobile Number :</span>
          <span className="pl-2.5 text-[#06f] text-base font-normal leading-[26px] underline decoration-solid decoration-auto underline-offset-auto">
            +91982345566
          </span>
        </div>
      </div>

      {/** Edit Button */}
      <div>
        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 rounded-lg border border-[#B5B5B5] bg-[#F7F7F7] px-5 py-2.5 text-sm text-[#000] cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4515 1.04199L11.7493 1.04199C12.0945 1.04199 12.3743 1.32181 12.3743 1.66699C12.3743 2.01217 12.0945 2.29199 11.7493 2.29199H10.4993C8.51749 2.29199 7.09398 2.29332 6.01066 2.43897C4.94533 2.5822 4.30306 2.85461 3.82835 3.32932C3.35363 3.80404 3.08122 4.4463 2.93799 5.51164C2.79234 6.59495 2.79102 8.01847 2.79102 10.0003C2.79102 11.9822 2.79234 13.4057 2.93799 14.489C3.08122 15.5543 3.35363 16.1966 3.82835 16.6713C4.30306 17.146 4.94533 17.4185 6.01066 17.5617C7.09398 17.7073 8.51749 17.7087 10.4993 17.7087C12.4812 17.7087 13.9047 17.7073 14.988 17.5617C16.0534 17.4185 16.6956 17.146 17.1704 16.6713C17.6451 16.1966 17.9175 15.5543 18.0607 14.489C18.2064 13.4057 18.2077 11.9822 18.2077 10.0003V8.75033C18.2077 8.40515 18.4875 8.12533 18.8327 8.12533C19.1779 8.12533 19.4577 8.40515 19.4577 8.75033V10.0481C19.4577 11.9718 19.4577 13.4793 19.2996 14.6556C19.1377 15.8595 18.7999 16.8095 18.0542 17.5552C17.3086 18.3009 16.3585 18.6387 15.1546 18.8005C13.9784 18.9587 12.4708 18.9587 10.5472 18.9587H10.4515C8.52788 18.9587 7.02034 18.9587 5.8441 18.8005C4.64016 18.6387 3.69014 18.3009 2.94446 17.5552C2.19879 16.8095 1.861 15.8595 1.69914 14.6556C1.541 13.4793 1.54101 11.9718 1.54102 10.0481V9.95251C1.54101 8.02885 1.541 6.52132 1.69914 5.34508C1.861 4.14113 2.19879 3.19111 2.94446 2.44544C3.69014 1.69976 4.64016 1.36198 5.8441 1.20011C7.02034 1.04197 8.52787 1.04198 10.4515 1.04199ZM14.4748 1.89692C15.6147 0.757016 17.4628 0.757016 18.6028 1.89692C19.7427 3.03683 19.7427 4.88498 18.6028 6.02488L13.0627 11.565C12.7533 11.8744 12.5595 12.0683 12.3432 12.237C12.0884 12.4356 11.8128 12.606 11.5211 12.745C11.2735 12.863 11.0135 12.9497 10.5983 13.088L8.1779 13.8948C7.73103 14.0438 7.23835 13.9275 6.90528 13.5944C6.5722 13.2613 6.45589 12.7686 6.60485 12.3218L7.41166 9.90135C7.55001 9.48621 7.63667 9.22615 7.75468 8.97853C7.89367 8.68689 8.06402 8.41125 8.26272 8.15651C8.43142 7.94022 8.62527 7.7464 8.93472 7.43699L14.4748 1.89692ZM17.7189 2.7808C17.0671 2.12906 16.0104 2.12906 15.3587 2.7808L15.0448 3.09466C15.0637 3.17454 15.0902 3.26972 15.127 3.37588C15.2465 3.72009 15.4725 4.17342 15.8994 4.60032C16.3263 5.02722 16.7796 5.25321 17.1238 5.37263C17.23 5.40947 17.3251 5.43593 17.405 5.45485L17.7189 5.141C18.3706 4.48925 18.3706 3.43255 17.7189 2.7808ZM16.4203 6.43957C15.9903 6.25465 15.4895 5.95821 15.0155 5.4842C14.5415 5.0102 14.245 4.50934 14.0601 4.07937L9.84727 8.29221C9.50018 8.6393 9.36405 8.77695 9.24836 8.92528C9.1055 9.10844 8.98302 9.30662 8.88308 9.51631C8.80215 9.68612 8.73991 9.86944 8.58469 10.3351L8.22477 11.4149L9.08482 12.2749L10.1646 11.915C10.6302 11.7598 10.8136 11.6975 10.9834 11.6166C11.1931 11.5167 11.3912 11.3942 11.5744 11.2513C11.7227 11.1356 11.8604 10.9995 12.2075 10.6524L16.4203 6.43957Z" fill="#242424"/>
          </svg>
          Edit Details
        </button>
        <ProfileModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  
      {/**Your Order */}
      <UserProfileOrder />
    </div>
      {/**Address Section*/}
        <div className="col-span-12 xl:col-span-1 ml-6 mr-20 rounded-[10px] border border-[#ECECEC] max-h-40 overflow-auto">
            <Address hideLabel buttonAlignment="left" buttonStyle="black" />
          </div>

    </div>

  </div>  
    );
};

export default ProfileComponent;

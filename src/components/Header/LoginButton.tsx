"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { useModal } from "@/contexts/ModalContext";

const LoginButton = () => { 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { openLoginModal } = useModal();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken"); // Check if the user has a token
    setIsLoggedIn(!!token); // Convert token existence to boolean
  }, []); 

  // Listen for login success to update the button
  useEffect(() => {
    const handleLoginSuccess = () => {
      setIsLoggedIn(true);
    };

    window.addEventListener("userLoggedIn", handleLoginSuccess);
    return () => window.removeEventListener("userLoggedIn", handleLoginSuccess);
  }, []);

  if (isLoggedIn) {
    return (
      <Link href="/profile">
        <div className="flex items-center bg-[#ECECEC] border border-[#B5B5B5] rounded-full w-[84px] h-8 ml-0 px-1 py-2 cursor-pointer">
          <div className="bg-black text-white rounded-full w-7 h-7 flex items-center justify-center">
            <FaUser />
          </div>
          <span className="text-[#242424] w-[40px] h-[21px] text-sm font-medium pl-1">
            Profile
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div 
      onClick={openLoginModal}
      className="flex items-center bg-[#ECECEC] border border-[#B5B5B5] rounded-full w-[84px] h-8 ml-0 px-1 py-2 cursor-pointer hover:bg-[#E0E0E0] transition-colors duration-200"
    >
      <div className="bg-black text-white rounded-full w-7 h-7 flex items-center justify-center">
        <FaUser />
      </div>
      <span className="text-[#242424] w-[40px] h-[21px] text-sm font-medium pl-1">
        Login
      </span>
    </div>
  );
};

export default LoginButton;

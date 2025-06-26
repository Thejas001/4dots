"use client";
import Link from "next/link";
import React, { useState, useEffect , useRef } from "react";
import CartButton from "./CartButton";
import OrderButton from "./OrderButton";
import LoginButton from "./LoginButton";
import { useCartStore } from "@/utils/store/cartStore";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = useCartStore((state) => state.cartCount);
  const orderBadgeCount = useCartStore((state) => state.orderBadgeCount);


  // Toggle function to open/close the dropdown
  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prevState) => !prevState);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && !document.getElementById("mobile-menu")?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 z-[999] w-full bg-[#fff] shadow-[0px_4px_16px_0px_rgba(91,91,91,0.05)] border">
      <div className="flex w-full justify-between items-center px-5 md:px-20">
        {/* Left Section (Logo) */}
        <div className="mt-6.5 mb-4.5 flex flex-col items-start">
          <Link href="/" className="cursor-pointer">
          <div className="flex mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="99" height="12" viewBox="0 0 99 12" fill="none" className="w-[51.345px] md:w-[98.465px]">
              <circle cx="5.73256" cy="5.73256" r="5.73256" fill="#0093D3" />
              <circle cx="34.7326" cy="5.73256" r="5.73256" fill="#CC016B" />
              <circle cx="63.7326" cy="5.73256" r="5.73256" fill="#FFF10D" />
              <circle cx="92.7326" cy="5.73256" r="5.73256" fill="black" />
            </svg>
          </div>
          <div className="flex font-semibold text-base md:text-[32px] md:mt-1.5">
            <span className="text-black md:ml-0.5">4</span>
            <span className="text-black ml-1 md:ml-2">D</span>
            <span className="text-black ">o</span>
            <span className="text-black">t</span>
            <span className="text-black">s</span>
          </div>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Menu Buttons (visible only on larger screens) */}
          <div className="hidden sm:flex gap-11">
            <button className="text-gray-700 hover:text-blue-500 relative group">
              <span className="absolute bottom-0 left-0 w-full bg-[#242424] opacity-0 transition-all duration-100 group-hover:opacity-100 group-hover:h-1" style={{ height: "1px" }}></span>
              <div className="transition-transform duration-100 group-hover:-translate-y-1">
                <CartButton />
                {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
      )}
              </div>
            </button>

            <button className="text-gray-700 hover:text-blue-500 relative group">
              <span className="absolute bottom-0 left-0 w-full bg-[#242424] opacity-0 transition-all duration-100 group-hover:opacity-100 group-hover:h-1" style={{ height: "1px" }}></span>
              <div className="transition-transform duration-100 group-hover:-translate-y-1">
                <OrderButton />
                {orderBadgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {orderBadgeCount}
                    </span>
                  )}
              </div>
            </button>

            <button className="text-gray-700 hover:text-blue-500">
              <LoginButton />
            </button>
          </div>

          {/* Hamburger Icon (Small Screens) */}
          <button
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            onClick={toggleDropdown}
            className="sm:hidden block rounded-sm border border-stroke bg-white p-2 shadow-sm dark:border-strokedark dark:bg-boxdark"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="block absolute right-0 h-full w-full">
                <span className={`relative left-0 top-0 my-1 block h-0.5 bg-[#242424] transition-all duration-200 ease-in-out ${isOpen ? "w-0" : "w-full delay-300"}`}></span>
                <span className={`relative left-0 top-0 my-1 block h-0.5 bg-[#242424] transition-all duration-200 ease-in-out ${isOpen ? "w-0" : "w-full delay-400"}`}></span>
                <span className={`relative left-0 top-0 my-1 block h-0.5 bg-[#242424] transition-all duration-200 ease-in-out ${isOpen ? "w-0" : "w-full delay-500"}`}></span>
              </span>

              <span className={`absolute right-0 h-full w-full rotate-45 transition-all duration-300 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}>
                <span className="absolute left-2.5 top-0 block h-full w-0.5 bg-black dark:bg-white"></span>
                <span className="absolute left-0 top-2.5 block h-0.5 w-full bg-black dark:bg-white"></span>
              </span>
            </span>
          </button>
        </div>
      </div>


      {isOpen && (
        <div id="mobile-menu" className="sm:hidden absolute top-[60px] right-0 w-full shadow-lg py-4 z-50 bg-white">
          <button className="block w-full text-right px-4 py-2 bg-[#242424] text-[#fff] hover:bg-[#fff] hover:text-[#242424]">
            Your Cart
          </button>
          
          <Link href="/Order">
          <button className="block w-full text-right px-4 py-2 bg-[#242424] text-[#fff] hover:bg-[#fff] hover:text-[#242424]">
            Your Order
          </button>
          </Link>
          
          <Link href="/auth/signin">
          <button className="block w-full text-right px-4 py-2 bg-[#242424] text-[#fff] hover:bg-[#fff] hover:text-[#242424]">
              <span>Login</span>
          </button>
          </Link>

        </div>
  )}
</header>

  );
};

export default Header;

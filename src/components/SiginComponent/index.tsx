"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Carousel from "../Carousel";
import OTPInputComponent from "../OTPInput/OTPInput";

import Loader from "../common/Loader";

const SigininComponent = () =>{
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(() => {
        const timeout = setTimeout(() => setIsLoading(false), 500); // adjust as needed
        return () => clearTimeout(timeout);
      }, []);

      if (isLoading) {
        return (
          <div className="flex min-h-screen items-center justify-center">
            <Loader />
          </div>
        );
      }
    
    return(
        <div>
        <div className="mb-6 ml-12 mt-3">
        <Link href={"/"}>
     {/**  <img src={"/images/login/back-arrow.svg"} alt={"Back Button"} />*/}
        <Image
          src="/images/login/back-arrow.svg"
          alt="Back Button"
          width={24}
          height={24}
          priority
        />

        </Link>
      </div>
      <div className=" mx-12 mb-12 flex  flex-col md:flex-row">
        {/* Image Section */}
        <div
          className="order-last flex w-full items-start justify-center  px-0 md:order-first md:w-1/2 md:px-0"
          style={{ backgroundImage: "/images/login/sign_in_carousel.png" }}
        >
          <Carousel />
        </div>
        {/* Mobile Number Verification Section */}
        <div className="flex w-full flex-col items-center justify-center px-6 pb-16  md:w-1/2 md:px-20">
          {/* Image on Top 
          <img
            src={"/images/login/sign_in_icon.svg"}
            alt={"Top Illustration"}
            className="mb-4"
          />*/}
          <Image
            src="/images/login/sign_in_icon.svg"
            alt="Top Illustration"
            width={400} // adjust size
            height={400}
            priority
            className="mb-4"
          />

          <OTPInputComponent />
        </div>

        {/* Image Section for Mobile */}
        <div
          className="mt-10 h-1/3 w-full bg-cover bg-center md:hidden"
          style={{ backgroundImage: "url('https://via.placeholder.com/600')" }}
        ></div>
      </div>
        </div>

    );
};

export default SigininComponent;
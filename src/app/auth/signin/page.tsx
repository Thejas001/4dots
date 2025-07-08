
import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OTPInputComponent from "@/components/OTPInput/OTPInput";
import Carousel from "@/components/Carousel";


export const metadata: Metadata = {
  title: "4 Dots | Signin",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

const SignIn: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mb-6 ml-12 mt-3">
        <Link href={"/"}>
        <img src={"/images/login/back-arrow.svg"} alt={"Back Button"} />
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
          {/* Image on Top */}
          <img
            src={"/images/login/sign_in_icon.svg"}
            alt={"Top Illustration"}
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
    </DefaultLayout>
  );
};

export default SignIn;
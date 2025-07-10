
import React from "react";
import Link from "next/link";
import Image from "next/image";
import SigininComponent from "@/components/SiginComponent";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OTPInputComponent from "@/components/OTPInput/OTPInput";
import Carousel from "@/components/Carousel";
import Loader from "@/components/common/Loader"; // ✅ your existing loader


export const metadata: Metadata = {
  title: "4 Dots | Signin",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

const SignIn: React.FC = () => {
  return (
    <DefaultLayout>
            <div className="mb-6 mt-3">
        <Link href={"/"}>
          <Image
            src="/images/login/back-arrow.svg"
            alt="Back Button"
            width={24}
            height={24}
            priority
          />
        </Link>
      </div>
      <SigininComponent />
    </DefaultLayout>
  );
};

export default SignIn;
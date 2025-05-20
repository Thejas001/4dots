import React from "react";
import YourCart from "@/components/YourCart";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Script from "next/script";

const Cart = () => {
  return (
    <DefaultLayout>
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
          />
       <YourCart />  
    </DefaultLayout>
      
  );
};

export default Cart;
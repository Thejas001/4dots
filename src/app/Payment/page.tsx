import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrderPayment from "@/components/OrderPayment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "4 Dots | Payment",
  description:
    "4 Dots",
};

const Payment = () => {
    return (
    <DefaultLayout>
    <OrderPayment />
    </DefaultLayout>
    );
};
export default Payment;
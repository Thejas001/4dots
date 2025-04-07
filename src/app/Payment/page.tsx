import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrderPayment from "@/components/OrderPayment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "4 Dots | Payment",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Payment = () => {
    return (
    <DefaultLayout>
    <OrderPayment />
    </DefaultLayout>
    );
};
export default Payment;
import React from "react";
import OrderComponent from "@/components/OrderComponent";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "4 Dots | Order",
  description:
    "4 Dots",
}; 

const Order = () => {
    return (
        <DefaultLayout>
            <OrderComponent />
        </DefaultLayout>
        
    );

};

export default Order;
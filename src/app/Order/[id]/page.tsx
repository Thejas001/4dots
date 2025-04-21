import React from "react";
import OrderDetailsComponent from "@/components/OrderDetailsComponent";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
interface OrderPageProps {
  params: { id: string };
}

const OrderDetailsPage = ({ params }: OrderPageProps) => {
  const orderId = params.id;

  return (
    <DefaultLayout>
      <OrderDetailsComponent orderId={orderId} />
    </DefaultLayout>
  );
};

export default OrderDetailsPage;

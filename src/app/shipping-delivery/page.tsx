import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from 'next/link';
import ShippingDeliveryComponent from '@/components/shipping-deliverycomponent';

const ShippingDeliveryPage = () => {
  return (
    <DefaultLayout>
        <ShippingDeliveryComponent />
    </DefaultLayout>
  );
};

export default ShippingDeliveryPage; 
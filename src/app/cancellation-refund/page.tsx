import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from 'next/link';
import CancellationRefundComponent from '@/components/cancellation-refund-component';

const CancellationRefundPage = () => {
  return (
    <DefaultLayout>
      <CancellationRefundComponent />
    </DefaultLayout>
  );
};

export default CancellationRefundPage; 
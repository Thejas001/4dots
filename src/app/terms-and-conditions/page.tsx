import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from 'next/link';
import TermsAndConditionsComponent from '@/components/terms-conditions-component';
const TermsAndConditionsPage = () => {
  return (
    <DefaultLayout>
      <TermsAndConditionsComponent />
    </DefaultLayout>
  );
};

export default TermsAndConditionsPage; 
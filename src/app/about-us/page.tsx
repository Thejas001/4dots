import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from 'next/link';
import AboutUsComponent from '@/components/aboutus-component';
const AboutUsPage = () => {
  return (
    <DefaultLayout>
      <AboutUsComponent />
    </DefaultLayout>
  );
};

export default AboutUsPage; 
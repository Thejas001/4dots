import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from 'next/link';
import OurStoryComponent from '@/components/our-story-component';
const OurStoryPage = () => {
  return (
    <DefaultLayout>
      <OurStoryComponent />
    </DefaultLayout>
  );
};

export default OurStoryPage; 
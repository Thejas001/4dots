
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProfileComponent from "@/components/ProfileComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "4 Dots | Profile",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Profile = () => {
  return ( 
    <DefaultLayout>
      <ProfileComponent />
    </DefaultLayout>
    
    );
};

export default Profile;

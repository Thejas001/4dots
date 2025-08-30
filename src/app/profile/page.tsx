
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProfileComponent from "@/components/ProfileComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "4 Dots | Profile",
  description:
    "4 Dots",
};

const Profile = () => {
  return ( 
    <DefaultLayout>
      <ProfileComponent />
    </DefaultLayout>
    
    );
};

export default Profile;

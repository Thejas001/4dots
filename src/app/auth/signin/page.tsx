"use client";
import React, { useState } from "react";
import SigininComponent from "@/components/SiginComponent";

const SignIn: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // You can add navigation logic here if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <SigininComponent 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default SignIn;
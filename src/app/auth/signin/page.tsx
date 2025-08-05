"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SigininComponent from "@/components/SiginComponent";

const SignIn: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Redirect to home page when modal is closed
    router.push("/");
  };

  // Redirect to home if modal is closed
  useEffect(() => {
    if (!isModalOpen) {
      router.push("/");
    }
  }, [isModalOpen, router]);

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
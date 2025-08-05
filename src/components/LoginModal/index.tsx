"use client";
import React from "react";
import { useModal } from "@/hooks/useModal";
import SigininComponent from "../SiginComponent";

interface LoginModalProps {
  children: React.ReactNode;
  className?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ children, className = "" }) => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <div onClick={openModal} className={`cursor-pointer ${className}`}>
        {children}
      </div>
      
      <SigininComponent isOpen={isOpen} onClose={closeModal} />
    </>
  );
};

export default LoginModal; 
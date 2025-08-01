"use client";
import React, { ReactNode } from "react";

import Header from "@/components/Header";
import Footer from "../Footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-full bg-[#FCFCFC] max-w-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}
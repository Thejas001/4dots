"use client";
import React, { ReactNode } from "react";

import Header from "@/components/Header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex w-full">
        {/* <!-- ===== Sidebar Start ===== --> */}
        {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col w-full">
          {/* <!-- ===== Header Start ===== --> */}
          <div>
          <Header />
          </div>
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="w-full bg-[#FCFCFC] ">{children}</div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
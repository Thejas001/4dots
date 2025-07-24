"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { Toaster } from "react-hot-toast";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> : children}
        </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#000', // default black background
                color: '#fff',      // white text
                borderRadius: '10px',
                padding: '20px 32px',
                fontSize: '1.25rem',
                minWidth: '320px',
              },
              // Custom styles for error toasts
              error: {
                style: {
                  background: '#e53935', // red background for errors
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#e53935',
                },
              },
            }}
          />

    
    </body>
    </html>
  );
}

"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { Toaster } from "react-hot-toast";
import { processPendingCartItem } from "@/utils/processPendingCartItem";
import { useCartStore } from "@/utils/store/cartStore";
import { ModalProvider } from "@/contexts/ModalContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { setCartData } = useCartStore();

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Global pending cart item processing after login
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const pendingCartItem = sessionStorage.getItem("pendingCartItem");
    
    if (token && pendingCartItem) {
      console.log("🔄 Processing pending cart item after login...");
      processPendingCartItem(setCartData);
    }

    // Listen for custom login event
    const handleUserLogin = () => {
      const pendingCartItem = sessionStorage.getItem("pendingCartItem");
      if (pendingCartItem) {
        console.log("🔄 Processing pending cart item after login (custom event)...");
        // Add a small delay to ensure page navigation completes
        setTimeout(() => {
          processPendingCartItem(setCartData);
        }, 1000);
      }
    };

    // Listen for storage changes (when JWT token is added from different tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "jwtToken" && e.newValue && !e.oldValue) {
        // JWT token was just added (user logged in)
        const pendingCartItem = sessionStorage.getItem("pendingCartItem");
        if (pendingCartItem) {
          console.log("🔄 Processing pending cart item after login (storage event)...");
          processPendingCartItem(setCartData);
        }
      }
    };

    window.addEventListener("userLoggedIn", handleUserLogin);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("userLoggedIn", handleUserLogin);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setCartData]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ModalProvider>
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
        </ModalProvider>
      </body>
    </html>
  );
}

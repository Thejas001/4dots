// PaymentPopUp/index.tsx

import React from "react";
import Link from "next/link";

interface PaymentPopUpProps {
  status: "success" | "failed";
  onClose: () => void;
  product: {
    name: string;
    size: string;
    quantity: number;
    color: string;
    designLink: string;
  };
}

const PaymentPopUp: React.FC<PaymentPopUpProps> = ({ status, onClose, product }) => {
  const isSuccess = status === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[320px] text-center relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg">
          &times;
        </button>

        {/* Status Icon (PURE PATH SVGs) */}
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                   10-4.48 10-10S17.52 2 12 2zm-1.41 14.59L6.7 12.7l1.41-1.41
                   2.48 2.48 5.3-5.3 1.41 1.41-6.71 6.71z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                   10-4.48 10-10S17.52 2 12 2zm4.24 13.66L13.66 12l2.59-2.59L15.24 8
                   12 11.24 8.76 8 7.17 9.41 9.76 12l-2.59 2.59L8.76 16
                   12 12.76 15.24 16l1.41-1.41z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>

        {/* Status Text */}
        <h2 className="text-lg font-medium mb-2">
          {isSuccess ? "Payment Success" : "Payment Failed"}
        </h2>

        {/* Product Info */}
        <div className="text-black text-base font-semibold mb-1">{product.name}</div>
        <div className="text-sm mb-1">
          Selected Size: <span className="font-medium">{product.size}</span>
        </div>
        <div className="text-sm mb-1">
          Quantity: <span className="font-medium">{product.quantity} pcs</span>
        </div>
        <div className="text-sm mb-4">
          Color:{" "}
          <span
            className="inline-block w-4 h-4 rounded-full align-middle mr-1"
            style={{ backgroundColor: product.color }}
          />
          <a href={product.designLink} className="text-blue-600 underline ml-1">
            Uploaded Design
          </a>
        </div>

        {/* Action Buttons */}
        {isSuccess ? (
          <Link href="/orders" className="block w-full bg-black text-white py-2 rounded-full font-semibold">
            View Your Order
          </Link>
        ) : (
          <>
            <button
              className="w-full bg-black text-white py-2 rounded-full font-semibold mb-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
            <Link href="/cart" className="text-sm text-black-600 underline">
              Go to Cart
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPopUp;

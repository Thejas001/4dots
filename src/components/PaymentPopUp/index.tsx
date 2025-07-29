// PaymentPopUp/index.tsx

import React, {useState} from "react";
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
  const [showDesignModal, setShowDesignModal] = useState(false);

  const handleViewDesign = (item: {
    Documents?: { ContentType: string; DocumentUrl: string }[];
    ProductName: string;
  }) => {
    if (item.Documents && item.Documents.length > 0) {
      setShowDesignModal(true);
    } else {
      alert("No uploaded design available for this item.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[320px] text-center relative">
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


        {/* Action Buttons */}
        {isSuccess ? (
          <div className="flex flex-col gap-2">
            <Link href="/Order" className="block w-full bg-black text-white py-2 rounded-full font-semibold">
              View Your Order
            </Link>
            <Link href="/" className="block w-full bg-gray-200 text-black py-2 rounded-full font-semibold">
              Go to Home
            </Link>
          </div>
        ) : (
          <>
            <Link href="/Order" className="block w-full bg-black text-white py-2 rounded-full font-semibold">
              Go to Order
            </Link>
            <Link href="/" className="block w-full bg-gray-200 text-black py-2 rounded-full font-semibold">
              Go to Home
            </Link>
          </>
        )}
        {showDesignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full relative">
              <button
                onClick={() => setShowDesignModal(false)}
                className="absolute top-2 right-2 text-lg"
              >
                &times;
              </button>
              {product.designLink.endsWith(".pdf") ? (
                <embed src={product.designLink} type="application/pdf" width="100%" height="500px" />
              ) : (
                <img src={product.designLink} alt="Uploaded Design" className="max-w-full max-h-[500px] mx-auto" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPopUp;

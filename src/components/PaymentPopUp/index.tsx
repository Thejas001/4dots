// PaymentPopUp/index.tsx

import React, {useState} from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-[340px] sm:w-[420px] text-center relative">
        <div className={`mx-auto mb-4 sm:mb-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-inner ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
          {isSuccess ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10Z" fill="currentColor" opacity="0.15"/>
              <path d="M16.59 8.59 10 15.17l-2.59-2.58L6 14l4 4 8-8-1.41-1.41Z" fill="currentColor"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10Z" fill="currentColor" opacity="0.15"/>
              <path d="M15.54 8.46 12 12l-3.54-3.54L7.04 9.88 10.59 13.41 7.05 16.95 8.46 18.36 12 14.83l3.54 3.53 1.41-1.41-3.53-3.54 3.53-3.53-1.41-1.42Z" fill="currentColor"/>
            </svg>
          )}
        </div>

        <h2 className={`text-xl sm:text-2xl font-extrabold mb-2 ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
          {isSuccess ? 'Payment Successful' : 'Payment Failed'}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {isSuccess ? 'Thank you! Your payment has been processed.' : 'Something went wrong while processing the payment.'}
        </p>

        {isSuccess ? (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
              onClick={() => {
                onClose();
                router.push("/Order");
              }}
              className="flex-1 bg-black text-white py-2.5 rounded-full font-semibold text-sm sm:text-base text-center"
            >
              View Your Order
            </button>
            <button 
              onClick={() => {
                onClose();
                router.push("/");
              }}
              className="flex-1 bg-gray-200 text-black py-2.5 rounded-full font-semibold text-sm sm:text-base text-center"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
              onClick={() => {
                onClose();
                router.push("/Order");
              }}
              className="flex-1 bg-black text-white py-2.5 rounded-full font-semibold text-sm sm:text-base text-center"
            >
              Go to Order
            </button>
            <button 
              onClick={() => {
                onClose();
                router.push("/");
              }}
              className="flex-1 bg-gray-200 text-black py-2.5 rounded-full font-semibold text-sm sm:text-base text-center"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPopUp;

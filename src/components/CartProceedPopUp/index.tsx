// CartProceedPopUp/index.tsx

import React from "react";
import Link from "next/link";

interface CartProceedPopUpProps {
  onClose: () => void;
  onContinueShopping: () => void;
  onProceedToPayment: () => void;
  productInfo: {
    name: string;
    size?: string;
    quantity?: number;
    price?: number;
  };
}

const CartProceedPopUp: React.FC<CartProceedPopUpProps> = ({ 
  onClose, 
  onContinueShopping, 
  onProceedToPayment, 
  productInfo 
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px] text-center relative">
        {/* Close Button */}

                 {/* Cart Icon */}
         <div className="flex justify-center mb-4">
           <svg 
             xmlns="http://www.w3.org/2000/svg" 
             className="w-12 h-12 text-black" 
             viewBox="0 0 24 24" 
             fill="none"
           >
            <path
              d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Item Added to Cart!
        </h2>

        {/* Product Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-gray-900 font-semibold mb-2">{productInfo.name}</div>
          {productInfo.size && (
            <div className="text-sm text-gray-600 mb-1">
              Size: <span className="font-medium">{productInfo.size}</span>
            </div>
          )}
          {productInfo.quantity && (
            <div className="text-sm text-gray-600 mb-1">
              Quantity: <span className="font-medium">{productInfo.quantity}</span>
            </div>
          )}
          {productInfo.price && (
            <div className="text-sm text-gray-600">
              Price: <span className="font-medium">₹{productInfo.price.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Question */}
        <p className="text-gray-700 mb-6">
          What would you like to do next?
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onContinueShopping}
            className="w-full bg-gray-200 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-200"
          >
            Continue Shopping
          </button>
          
                             <button
                     onClick={onProceedToPayment}
                     className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200"
                   >
                     Proceed to Payment
                   </button>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 mt-4">
          You can view your cart anytime from the cart icon in the header
        </p>
      </div>
    </div>
  );
};

export default CartProceedPopUp; 
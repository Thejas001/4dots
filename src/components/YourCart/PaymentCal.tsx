"use client";
import React from "react";
import Link from "next/link";
import { PaymentCalProps } from "@/app/models/CartItems";
import { placeOrder } from "@/utils/api";

  
const PaymentCal: React.FC<PaymentCalProps> = ({ userId, cartItemIds, totalPrice }) => {
    const handlePlaceOrder = async () => {
      const paymentMethod = "UPI"; // Example payment method
  
      try {
        const response = await placeOrder(cartItemIds, userId, paymentMethod);
        console.log("Order placed successfully:", response);
      } catch (error) {
        console.error("Order placement failed:", error);
      }
    };
      
    return(
        <div>
            <div className="flex flex-col rounded-[20px] border border-[#ECECEC] xl:max-w-[468px] pt-5">
            {/* Header */}
            <div className="flex items-center justify-center">
            <span className="text-[#000] text-lg font-medium">Payment Breakdown</span>
            </div>
            
            {/* Total Mrp */}
            <div className="flex justify-between pl-9 pr-[33px] mt-8 text-base font-medium text-[#000]">
                <div><span>Total MRP :</span></div>
                <div className="flex" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                        <path d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z" fill="#242424"/>
                    </svg>
                    <span>{totalPrice}</span></div>
            </div>
            {/* Discount */}
            <div className="flex justify-between pl-9 pr-[33px] mt-7.5 text-base font-medium text-[#000]">
                <div><span>Discounted MRP :</span></div>
                <div className="flex" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" className="">
                        <path d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z" fill="#242424"/>
                    </svg>
                    <span>0</span></div>
            </div>
            {/* Shipping Charges */}
            <div className="flex justify-between pl-9 pr-[33px] mt-7.5 text-base font-medium text-[#000]">
                <div><span>Shipping Fee :</span></div>
                    <div className="flex" >
                        <span>Free</span>
                    </div>
                </div>

            {/* Total Amount */}
            <div className="flex justify-between py-4 pl-9 pr-[33px] mt-4.5 text-lg font-semibold text-[#000] rounded-b-[20px] border border-[#ECECEC] bg-white">
                <div><span>Total Amount :</span></div>
                    <div className="flex items-center justify-center" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" className="mb-1">
                            <path d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z" fill="#242424"/>
                        </svg>
                        <span className="font-medium">{totalPrice}</span>
                    </div>
                </div>
        </div>
        <div onClick={handlePlaceOrder} className="flex-1 flex-col mb-26 mt-5.5 xl:w-[468px] ">
            <Link href="/">
                <div className="flex justify-center p-2.5 bg-[#242424] text-[#fff] rounded-[43px]  items-center cursor-pointer">
                    <span className="text-lg font-semibold ">Place Order</span>
                </div>
            </Link>
          </div>
    </div>
        
)};
export default PaymentCal;
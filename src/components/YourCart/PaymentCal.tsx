"use client";
import React from "react";
import Link from "next/link";
import { PaymentCalProps } from "@/app/models/CartItems";
import { placeOrder } from "@/utils/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCartStore } from "@/utils/store/cartStore";

  
const PaymentCal: React.FC<PaymentCalProps> = ({cartItemIds, totalPrice, deliveryOption ,paymentOption}) => {
    const router = useRouter(); // if you're using Next.js router
  const incrementOrderBadge = useCartStore((state) => state.incrementOrderBadge);

const handlePlaceOrder = async () => {

  const paymentMethod = paymentOption === "CashOnDelivery" ? "cash" : "razorpay";

  try {
    const response = await placeOrder(cartItemIds ,deliveryOption, paymentOption);


    
    if (paymentMethod === "cash") {
      // ✅ Skip Razorpay, redirect or show success
      incrementOrderBadge(); // Increment order badge count
      toast.success(" Cash on Delivery selected! Your order will be processed.");
      router.push("/"); // or your desired confirmation page
      return;
    }

    if (!response || !response.RazorpayOrderId) {
      return;
    }

    const options = {
      key: response.RazorpayKey,
      amount: response.Amount,
      currency: response.Currency,
      name: "PrintDot",
      description: "Order Payment",
      order_id: response.RazorpayOrderId,
      handler: async function (razorpayResponse: any) {

        // ✅ Optional: send to backend to verify signature
        // await fetch("/api/payment/verify", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(razorpayResponse),
        // });

        // ✅ Redirect after success
        toast.success("✅ Payment successful! Thank you for your order.");
        incrementOrderBadge(); // Increment order badge count
        router.push("/"); // or use window.location.href = "/thank-you";
        console.log("✅ Payment successful:", razorpayResponse);

      },
      prefill: {
        name: "Thejas V Panicker",
        email: "your@email.com",
        contact: "9744003284",
      },
      theme: {
        color: "black",
      },
      modal: {
        ondismiss: function () {
          console.log("❌ Payment popup closed by user.");
          router.push("/Order");  // Redirect to orders page
        }
      }
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Order placement or Razorpay failed:", error);
  }
};

      return (
        <div>
          <div className="flex flex-col rounded-[20px] w-full max-w-[468px] border border-[#ECECEC] pt-5 px-2 sm:px-4">
            {/* Header */}
            <div className="flex items-center justify-center">
              <span className="text-[#000] text-lg font-medium">Payment Breakdown</span>
            </div>
      
            {/* Total MRP */}
            <div className="flex justify-between items-center py-3 text-lg font-medium text-[#000] border-b border-gray-200">
              <div className="flex items-center">
                <span className="min-w-[120px]">Total MRP</span>
                <span className="mx-1">:</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z"
                    fill="#242424"
                  />
                </svg>
                <span>{totalPrice}</span>
              </div>
            </div>
      
            {/* Total Amount */}
            <div className="flex justify-between items-center py-4 text-lg font-medium text-[#000]">
              <div className="flex items-center">
                <span className="min-w-[120px]">Total Amount</span>
                <span className="mx-1">:</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  className="mb-1"
                >
                  <path
                    d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z"
                    fill="#242424"
                  />
                </svg>
                <span>{totalPrice}</span>
              </div>
            </div>
          </div>
      
          {/* Place Order Button */}
          <div
            onClick={handlePlaceOrder}
            className="flex-1 flex-col mb-26 mt-5.5 w-full max-w-[468px] cursor-pointer"
          >
            <div className="flex justify-center p-2.5 bg-[#242424] text-[#fff] rounded-[43px] items-center w-full">
              <span className="text-lg font-semibold">Place Order</span>
            </div>
          </div>
        </div>
      );
      };
export default PaymentCal;
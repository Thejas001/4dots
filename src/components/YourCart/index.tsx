"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import DeliveryOption from "./DeliveryOption";
import AddressOption from "./AddressOption";
import PaymentCal from "./PaymentCal";
import PaymentMethod from "./PaymentMethod";
import { fetchCartItems , deleteCartItem } from "@/utils/cart"; //api
import { getUserDetails } from "@/utils/api"; //api
import { useCartStore } from "@/utils/store/cartStore";
import Loader from "../common/Loader";
import { CartData } from "@/app/models/CartItems"; //model
import { processPendingCartItem } from "@/utils/processPendingCartItem";
import PopupModal from "../PopUpModal";
import DesignPreviewModal from './DesignPreviewModal';

const Cart = () => {
  const [deliveryOption, setDeliveryOption] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [cartData, setCartData] = useState<CartData>({ Items: [], TotalPrice: 0 });
  const userId = 3; // Replace with actual user ID
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const clearCartCount = useCartStore((state) => state.clearCartCount);
  const [isLoading, setIsLoading] = useState(true);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<{
    url: string;
    isPdf: boolean;
    productName: string;
  } | null>(null);

  useEffect(() => {
    clearCartCount();
  }, [clearCartCount]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await getUserDetails();
        setUser(userDetails);

        if (!userDetails.Name || userDetails.Name.trim() === "") {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Could not fetch user details", error);
        setShowModal(true);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      processPendingCartItem(setCartData);
    }
  }, []);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const data = await fetchCartItems();
        setCartData(data);
      } catch (error) {
        console.error("Error loading cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, []);

  useEffect(() => {
    console.log("Updated Cart Data in State:", cartData);
  }, [cartData]);

  const handleDelete = async (cartItemId: number) => {
    const success = await deleteCartItem(cartItemId);
    if (success) {
      setCartData(prevCart => ({
        ...prevCart,
        Items: prevCart.Items.filter(item => item.CartItemId !== cartItemId),
      }));

      setTimeout(async () => {
        const updatedCart = await fetchCartItems();
        setCartData(updatedCart);
      }, 200);
    }
  };

  const handleViewDesign = (item: {
    Documents?: { ContentType: string; DocumentUrl: string }[];
    ProductName: string;
  }) => {
    const document = item.Documents?.[0];
    if (document) {
      setSelectedDesign({
        url: document.DocumentUrl,
        isPdf: document.ContentType === 'application/pdf',
        productName: item.ProductName,
      });
      setIsDesignModalOpen(true);
    } else {
      alert('No uploaded design available for this item.');
    }
  };

  const cartItemIds = cartData.Items.map(item => item.CartItemId);

  return (
    <div className="h-auto bg-white px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-4">
      {showModal && <PopupModal />}
      {selectedDesign && (
        <DesignPreviewModal
          isOpen={isDesignModalOpen}
          onClose={() => setIsDesignModalOpen(false)}
          documentUrl={selectedDesign.url}
          isPdf={selectedDesign.isPdf}
          productName={selectedDesign.productName}
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-[33.5px]">
        <div className="border rounded border-[#242424] p-1">
          <Link href="/">
            <div className="text-gray-600 hover:text-gray-900 cursor-pointer">
              <img src="/images/icon/Arrow-icon.svg" alt="Back" className="w-4 h-4" />
            </div>
          </Link>
        </div>
        <span className="text-black text-lg sm:text-[22px] font-normal leading-[26px]">
          Your Cart
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-9">
        {isLoading ? (
          <Loader />
        ) : cartData.Items.length > 0 ? (
          <>
            <div className="flex flex-col gap-4 w-full">
              {cartData.Items.map((item) => (
                <div key={item.CartItemId} className="flex flex-col sm:flex-row rounded-[10px] border border-[#ECECEC] p-4 gap-4 relative">
                  <img src="/images/product/pdf.png" alt="PDF Icon" className="w-full sm:w-[120px] h-[120px] object-contain" />
                  <div className="flex flex-col flex-1">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <span className="text-sm sm:text-lg font-normal leading-7 text-black">
                        {item.ProductName}
                      </span>
                      <div
                        onClick={() => handleDelete(item.CartItemId)}
                        className="ml-auto mt-[-150px] xl:mt-0 mb-[120px] xl:mb-0 p-2 rounded-full bg-[#f4f4f4] hover:bg-[#ddd] transition duration-200 cursor-pointer flex items-center justify-center w-8 h-8"
                        title="Remove"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 12" fill="none">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.2075 5.99758L11.7475 1.45758C12.0775 1.12758 12.0775 0.577578 11.7475 0.247578C11.5861 0.0889116 11.3688 0 11.1425 0C10.9162 0 10.6989 0.0889116 10.5375 0.247578L5.9975 4.78758L1.4575 0.247578C1.2961 0.0889116 1.07883 0 0.8525 0C0.626171 0 0.4089 0.0889116 0.2475 0.247578C-0.0825 0.577578 -0.0825 1.12758 0.2475 1.45758L4.7875 5.99758L0.2475 10.5376C-0.0825 10.8676 -0.0825 11.4176 0.2475 11.7476C0.5775 12.0776 1.1275 12.0776 1.4575 11.7476L5.9975 7.20758L10.5375 11.7476C10.8675 12.0776 11.4175 12.0776 11.7475 11.7476C12.0775 11.4176 12.0775 10.8676 11.7475 10.5376L7.2075 5.99758Z"
                            fill="#242424"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4 text-sm sm:text-base text-[#242424]">
                      {item.Attributes.map((attr) => (
                        <div key={attr.AttributeName} className="flex items-center">
                          <span>{attr.AttributeName}:</span>
                          <span className="pl-2">{attr.AttributeValue}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4 text-sm sm:text-base text-[#242424]">
                      {item.DynamicAttributes.map((attr) => (
                        <div key={attr.AttributeName} className="flex items-center">
                          <span>{attr.AttributeName}:</span>
                          <span className="pl-2">{attr.AttributeValue}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center mt-4">
                      <span onClick={() => handleViewDesign(item)} className="text-[#0075FF] italic underline text-sm sm:text-base cursor-pointer">
                        Uploaded Design
                      </span>
                    </div>
                    <div className="flex items-center text-[#242424] mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                           <path d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z" fill="#242424"/>
                    </svg>
                      <span className="ml-2 text-lg font-semibold">{item.ItemPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full xl:w-auto">
              <DeliveryOption selectedOption={deliveryOption} setSelectedOption={setDeliveryOption} />
              {deliveryOption === "Delivery" && <AddressOption />}
              <PaymentMethod selectedPaymentOption={paymentOption} setSelectedPaymentOption={setPaymentOption} />
              <PaymentCal totalPrice={cartData.TotalPrice} userId={userId} cartItemIds={cartItemIds} deliveryOption={deliveryOption} paymentOption={paymentOption} />
            </div>
          </>
        ) : (
          <div className="col-span-12 text-center">
            <p className="text-gray-500 text-lg font-medium">Your cart is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Add this import for the Image component
import DeliveryOption from "./DeliveryOption";
import AddressOption from "./AddressOption";
import PaymentCal from "./PaymentCal";
import PaymentMethod from "./PaymentMethod";
import { fetchCartItems, deleteCartItem } from "@/utils/cart"; //api
import { getUserDetails } from "@/utils/api"; //api
import { useCartStore } from "@/utils/store/cartStore";
import Loader from "../common/Loader";
import { CartData } from "@/app/models/CartItems"; //model
import { processPendingCartItem } from "@/utils/processPendingCartItem";
import PopupModal from "../PopUpModal";
import DesignPreviewModal from './DesignPreviewModal';

// Define the EmptyCartState component within the same file or import it
const EmptyCartState = () => (
  <div className="w-full flex flex-col items-center justify-center py-12 lg:py-24">
    <div className="relative w-64 h-64 mb-6">
      <Image
        src="/images/errorimages/empty-cart.png"
        alt="Empty Cart"
        fill
        className="object-contain"
      />
    </div>
    <h1 className="text-2xl font-bold text-black mb-2">Your Cart is Empty</h1>
    <p className="text-gray-600 text-center max-w-md px-4">
      Looks like you haven&apos;t added anything to your cart yet
    </p>
  </div>
);

const Cart = () => {
  const [deliveryOption, setDeliveryOption] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [cartData, setCartData] = useState<CartData>({ Items: [], TotalPrice: 0 });
  const userId = 3; // Replace with actual user ID
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const { refreshCart } = useCartStore();
  const [selectedDesigns, setSelectedDesigns] = useState<
    { url: string; isPdf: boolean; productName: string }[]
  >([]);

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
      await refreshCart();
      // ✅ Wait 200ms before refetching the cart from the backend
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
    if (item.Documents && item.Documents.length > 0) {
      setSelectedDesigns(
        item.Documents.map((doc) => ({
          url: doc.DocumentUrl,
          isPdf: doc.ContentType === "application/pdf",
          productName: item.ProductName,
        }))
      );
      setIsDesignModalOpen(true);
    } else {
      alert("No uploaded design available for this item.");
    }
  };

  const cartItemIds = cartData.Items.map(item => item.CartItemId);

  return (
    <div className="h-auto min-h-screen bg-[#fff] flex flex-col">
      {showModal && <PopupModal />}
      {/* Design Preview Modal */}
      {selectedDesigns.length > 0 && (
        <DesignPreviewModal
          isOpen={isDesignModalOpen}
          onClose={() => setIsDesignModalOpen(false)}
          designs={selectedDesigns}
        />
      )}
      {/* Top Section */} 
      <div className="flex items-center mt-4 gap-4 px-4 sm:gap-8 md:gap-[33.5px] sm:px-8 md:px-20">
        {/* Back Button */}
        <div className="border rounded-[4px] border-[#242424] p-1">
          <Link href="/">
            <div className="text-gray-600 hover:text-gray-900 cursor-pointer">
              <img
                src="/images/icon/Arrow-icon.svg"
                alt="Back"
                className="w-4 h-4"
              />
            </div>
          </Link>
        </div>
  
        {/* Your Cart Text */}
        <span className="text-[#000] text-lg sm:text-xl md:text-[22px] font-normal leading-[26px]">
          Your Cart
        </span>
      </div>
  
      {/* Bottom Section */}
      <div className="flex flex-col xl:flex-row w-full mt-6 xl:mt-9 px-2 sm:px-6 md:px-12 xl:px-36 gap-6">
        {isLoading ? (
          <Loader />
        ) : cartData.Items.length > 0 ? (
          <>
            <div className="flex flex-col w-full xl:w-1/2">
              {cartData.Items.map((item) => {
                const documents = item.Documents || [];
                const hasMultiple = documents.length > 1;
                const isPdf = documents[0]?.ContentType === "application/pdf";
                const imageUrl = isPdf ? "/images/product/pdf.png" : documents[0]?.DocumentUrl;
                return (
                  <div 
                    key={item.CartItemId}
                    className="flex flex-col sm:flex-row rounded-[10px] border border-[#ECECEC] pr-2.5 mb-4 w-full"
                  >
                    {/* Mobile: Product name and cross at the top */}
                    <div className="flex flex-row items-center justify-between sm:hidden mb-2 px-2 pt-2">
                      <span className="text-base font-semibold text-[#000] truncate max-w-[70%]">{item.ProductName}</span>
                      <div onClick={() => handleDelete(item.CartItemId)} className="flex-shrinkECCEBCBE shrink-0 rounded-[33px] p-1.5 bg-[#ECECEC] cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.2075 5.99758L11.7475 1.45758C12.0775 1.12758 12.0775 0.577578 11.7475 0.247578C11.5861 0.0889116 11.3688 0 11.1425 0C10.9162 0 10.6989 0.0889116 10.5375 0.247578L5.9975 4.78758L1.4575 0.247578C1.2961 0.0889116 1.07883 0 0.8525 0C0.626171 0 0.4089 0.0889116 0.2475 0.247578C-0.0825 0.577578 -0.0825 1.12758 0.2475 1.45758L4.7875 5.99758L0.2475 10.5376C-0.0825 10.8676 -0.0825 11.4176 0.2475 11.7476C0.5775 12.0776 1.1275 12.0776 1.4575 11.7476L5.9975 7.20758L10.5375 11.7476C10.8675 12.0776 11.4175 12.0776 11.7475 11.7476C12.0775 11.4176 12.0775 10.5376 11.7475 10.5376L7.2075 5.99758Z"
                            fill="#242424"
                          />
                        </svg>
                      </div>
                    </div>
                    {/* Mobile: Product image below product name */}
                    <div className="flex justify-center items-center sm:items-start sm:mt-5 sm:ml-2 mb-2 sm:mb-0 flex-shrink-0 relative">
                      {documents.length > 0 ? (
                        <div className="relative">
                          {(() => {
                            const firstDoc = documents[0];
                            const remainingCount = documents.length - 1;

                            const isPdf =
                              firstDoc.ContentType?.toLowerCase().includes("pdf") ||
                              firstDoc.DocumentUrl?.toLowerCase().endsWith(".pdf");

                            if (isPdf) {
                              return (
                                <div className="relative">
                                  <img
                                    src="/images/product/pdf.png"
                                    alt="PDF Icon"
                                    className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
                                  />
                                  {remainingCount > 0 && (
                                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs sm:text-sm px-2 py-0.5 rounded">
                                      +{remainingCount}
                                    </div>
                                  )}
                                </div>
                              );
                            }

                            if (firstDoc.DocumentUrl) {
                              return (
                                <div className="relative">
                                  <img
                                    src={firstDoc.DocumentUrl}
                                    alt="Product Image"
                                    className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded"
                                  />
                                  {remainingCount > 0 && (
                                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs sm:text-sm px-2 py-0.5 rounded">
                                      +{remainingCount}
                                    </div>
                                  )}
                                </div>
                              );
                            }

                            // Optional fallback if neither PDF nor URL:
                            return (
                              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center bg-gray-200 text-gray-500 rounded">
                                No Preview
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center bg-gray-200 text-gray-500 rounded">
                          No Document
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden px-2 py-2">
                      {/* Desktop: Product name and cross in row as before */}
                      <div className="hidden sm:flex flex-row sm:items-center mt-2.5 xl:w-[448px] overflow-x-hidden">
                        <span className="text-sm text-[#000] xl:text-lg font-normal leading-7 flex-grow truncate max-w-[60%]">
                          {item.ProductName}
                        </span>
                        <div onClick={() => handleDelete(item.CartItemId)} className="flex-shrink-0 ml-8 rounded-[33px] p-1.5 bg-[#ECECEC] cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.2075 5.99758L11.7475 1.45758C12.0775 1.12758 12.0775 0.577578 11.7475 0.247578C11.5861 0.0889116 11.3688 0 11.1425 0C10.9162 0 10.6989 0.0889116 10.5375 0.247578L5.9975 4.78758L1.4575 0.247578C1.2961 0.0889116 1.07883 0 0.8525 0C0.626171 0 0.4089 0.0889116 0.2475 0.247578C-0.0825 0.577578 -0.0825 1.12758 0.2475 1.45758L4.7875 5.99758L0.2475 10.5376C-0.0825 10.8676 -0.0825 11.4176 0.2475 11.7476C0.5775 12.0776 1.1275 12.0776 1.4575 11.7476L5.9975 7.20758L10.5375 11.7476C10.8675 12.0776 11.4175 12.0776 11.7475 11.7476C12.0775 11.4176 12.0775 10.5376 11.7475 10.5376L7.2075 5.99758Z"
                              fill="#242424"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-row text-[#242424] mt-4 gap-3 flex-wrap">
                        {/* Selected Attributes */}
                        {item.Attributes.map((attr) => (
                          <div key={attr.AttributeName} className="text-base font-medium leading-6 tracking-[-0.2px] flex items-center">
                            <span>{attr.AttributeName}:</span>
                            <span className="pl-[9px]">{attr.AttributeValue}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-row text-[#242424] mt-2 gap-3 flex-wrap">
                        {/* Selected Attributes */}
                        {item.DynamicAttributes.map((attr) => (
                          <div key={attr.AttributeName} className="text-base font-medium leading-6 tracking-[-0.2px] flex items-center">
                            <span>{attr.AttributeName}:</span>
                            <span className="pl-[9px]">{attr.AttributeValue}</span>
                          </div>
                        ))}
                      </div>
                      {/* Only keep the new mobile/desktop blocks for upload, edit, and price */}
                      <div className="flex flex-row items-center mt-2 sm:hidden">
                        <span
                          onClick={() => handleViewDesign(item)}
                          className="text-[#0075FF] italic underline text-base font-medium leading-6 tracking-[-0.2px] cursor-pointer"
                        >
                          Uploaded Design
                        </span>
                        <button className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded">Edit</button>
                        <span className="ml-auto text-lg text-[#242424] font-semibold leading-6 tracking-tighter-[-0.2px]">₹ {item.ItemPrice}</span>
                      </div>
                      <div className="hidden sm:flex flex-row justify-start mt-4 items-center">
                        <span
                          onClick={() => handleViewDesign(item)}
                          className="text-[#0075FF] italic underline text-base font-medium leading-6 tracking-[-0.2px] cursor-pointer"
                        >
                          Uploaded Design
                        </span>
                        {/**   <button className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded">Edit</button>*/}  
                        <span className="ml-auto text-lg text-[#242424] font-semibold leading-6 tracking-tighter-[-0.2px]">₹ {item.ItemPrice}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-full xl:w-1/2 xl:ml-6 xl:mr-20">
              <DeliveryOption selectedOption={deliveryOption} setSelectedOption={setDeliveryOption} />
              {deliveryOption === "Delivery" && <AddressOption />}
              <PaymentMethod selectedPaymentOption={paymentOption} setSelectedPaymentOption={setPaymentOption} />
              <PaymentCal totalPrice={cartData.TotalPrice} userId={userId} cartItemIds={cartItemIds} deliveryOption={deliveryOption} paymentOption={paymentOption}/>
            </div>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <EmptyCartState /> {/* Replace the simple <p> with EmptyCartState */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
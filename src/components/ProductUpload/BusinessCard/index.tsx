"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DropDown from "./DropDown";
import { BusinessCardPricingRule, Product } from "@/app/models/products";
import { fetchProductDetails } from "@/utils/api";
import { findBusinessCardPricingRule } from "@/utils/priceFinder";
import { addToCartBusinessCard } from "@/utils/cart";
import { useRouter } from "next/navigation";
import FileUploader from "./Fileuploader";
import toast from "react-hot-toast";
import { useCartStore } from "@/utils/store/cartStore";
import Loader from "@/components/common/Loader";
import CartProceedPopUp from "@/components/CartProceedPopUp";

const showErrorToast = (message: string) => {
  toast.custom((t) => (
    <div
      style={{
        background: "#e53935",
        color: "#fff",
        borderRadius: "10px",
        padding: "20px 32px",
        fontSize: "1.25rem",
        minWidth: "320px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <span>{message}</span>
      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "1.5rem",
          marginLeft: "16px",
          cursor: "pointer",
        }}
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  ));
};

const ProductUpload = ({ product }: { product: any }) => {
  const dataId = product.id;
  const productDetails = product;//stores state from dropdown and passed to princingfrle finder
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [selectedSurface, setSelectedSurface] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [selectedPricingRule, setSelectedPricingRule] = useState<BusinessCardPricingRule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCartPopUp, setShowCartPopUp] = useState(false);
  const isAddToCartDisabled = !selectedCard || !selectedSurface || !uploadedDocumentId || isLoading;
  const router = useRouter();
  const incrementCart = useCartStore((state) => state.incrementCart);
  
  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem("jwtToken");
    return !!token;
  };

  const handleUploadSuccess = (documentId: number) => {
    console.log("Received Document ID from child:", documentId);
    setUploadedDocumentId(documentId);
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    setShowCartPopUp(false);
    router.push("/");
  };

  // Handle proceed to payment
  const handleProceedToPayment = () => {
    setShowCartPopUp(false);
    router.push("/Cart");
  };

  // Handle close popup
  const handleClosePopUp = () => {
    setShowCartPopUp(false);
  };

  useEffect(() => {
    if (!productDetails || !selectedCard || !selectedSurface) return;

    if (errorMessage) {
      console.warn("Pricing rule not fetched due to validation error.");
      return;
    }

    console.log(
      "Checking Pricing Rules:",
      productDetails.BusinessCardPricingRules,
    );
    console.log("Selected Card:", selectedCard);
    console.log("Selected Surface:", selectedSurface);

    const pricingrule = findBusinessCardPricingRule(
      productDetails.BusinessCardPricingRules,
      selectedCard,
      selectedSurface,
    );

    setSelectedPricingRule(pricingrule);
    console.log("Matched Pricing Rule:", pricingrule);

    if (pricingrule) {
      setPrice(pricingrule.Price); // Store the price in state
    } else {
      console.warn("No matching pricing rule found.");
      setPrice(null);
    }
  }, [productDetails, selectedCard, selectedSurface, errorMessage]);

  // Process stored cart item after login
  const processPendingCartItem = async () => {
    const pendingCartItem = sessionStorage.getItem("pendingCartItem");
    if (!pendingCartItem) return;

    const { dataId: pendingDataId, selectedPricingRule: pendingPricingRule,  uploadedDocumentId: pendingDocumentId, } =
      JSON.parse(pendingCartItem);

    try {
      await addToCartBusinessCard(pendingDataId, pendingPricingRule, pendingDocumentId);
      sessionStorage.removeItem("pendingCartItem");
      router.push("/Cart");
    } catch (error) {
      setErrorMessage("Failed to process pending cart item. Please try again.");
    }
  };

  const handleProceedToCart = async () => {
    setIsLoading(true);
    const missing = [];
    if (!selectedCard) missing.push("card type");
    if (!selectedSurface) missing.push("finish");
    if (!uploadedDocumentId) missing.push("document upload");
    if (missing.length > 0) {
      showErrorToast("Please select: " + missing.join(", "));
      setIsLoading(false);
      return;
    }

    if (!isLoggedIn()) {
      const pendingItem = {
        productType: "bussinesscard",
        dataId,
        selectedPricingRule,
        uploadedDocumentId,
      };
      sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
      router.push(`/auth/signin?redirect=/Cart`); // ✅ Redirect to cart after login
      setIsLoading(false);
      return;
    }

    try {
      await addToCartBusinessCard(dataId, selectedPricingRule!,  uploadedDocumentId ?? undefined);
      toast.success("Product added to cart!");
      router.push("/Cart");
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
    }
    setIsLoading(false);
  };

  
  const handleAddToCart = async () => {
    setIsLoading(true);
    const missing = [];
    if (!selectedCard) missing.push("card type");
    if (!selectedSurface) missing.push("finish");
    if (!uploadedDocumentId) missing.push("document upload");
    if (missing.length > 0) {
      showErrorToast("Please select: " + missing.join(", "));
      setIsLoading(false);
      return;
    }

    if (!isLoggedIn()) {
      const pendingItem = {
        productType: "bussinesscard",
        dataId,
        selectedPricingRule,
        uploadedDocumentId,
      };
      sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
       toast.success("Product added to cart!");
      router.push(`/auth/signin?redirect=/`); // ✅ Redirect to cart after login
      setIsLoading(false);
      return;
    }

    try {
      await addToCartBusinessCard(dataId, selectedPricingRule!,  uploadedDocumentId ?? undefined);
      //incrementCart();
      toast.success("Product added to cart!");
      
      // Show popup for logged-in users instead of directly going to cart
      setShowCartPopUp(true);
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn()) {
      processPendingCartItem();
    }
  }, []);

  return (
    <div className="flex flex-col bg-white px-4 py-20 pb-[79px] pt-[31px] md:px-20">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70">
          <Loader />
        </div>
      )}
      {/* First Row */}
      <div className="flex flex-col md:flex-row">
      <FileUploader onUploadSuccess={handleUploadSuccess} />
        {/* Right Section */}
        <div className="flex flex-1 flex-col justify-between rounded px-4 py-[25px] shadow md:px-7">
          {productDetails && (
            <DropDown
              productDetails={productDetails}
              onCardChange={setSelectedCard}
              onSurfaceChange={setSelectedSurface}
            />
          )}

          <div className="mt-[400px] flex flex-1 flex-col justify-center">
            <button
              onClick={() => {
                const missing = [];
                if (!selectedCard) missing.push("card type");
                if (!selectedSurface) missing.push("surface type");
                if (!uploadedDocumentId) missing.push("document upload");
                if (missing.length > 0) {
                  showErrorToast("Please select: " + missing.join(", "));
                  return;
                }
                handleProceedToCart();
              }}
              className={`relative flex h-[44px] w-full items-center justify-center rounded-[48px] text-lg cursor-pointer bg-[#242424] text-white ${isAddToCartDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="pr-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="white"
                >
                  <path
                    d="M14.1667 5.50016V3.8335H5V5.50016H7.91667C9.00167 5.50016 9.9175 6.1985 10.2625 7.16683H5V8.8335H10.2625C10.0919 9.31979 9.77463 9.74121 9.3545 10.0397C8.93438 10.3382 8.43203 10.4991 7.91667 10.5002H5V12.5118L9.655 17.1668H12.0117L7.01167 12.1668H7.91667C8.87651 12.1651 9.80644 11.8327 10.5499 11.2255C11.2933 10.6184 11.8048 9.77363 11.9983 8.8335H14.1667V7.16683H11.9983C11.8715 6.56003 11.6082 5.99007 11.2283 5.50016H14.1667Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span className="font-bold">{price !== null ? price : "0"}</span>
              <span className="pl-4 font-medium">Proceed To Cart</span>
            </button>
          </div>
        </div>
      </div>
      
      {showCartPopUp && (
        <CartProceedPopUp
          onContinueShopping={handleContinueShopping}
          onProceedToPayment={handleProceedToPayment}
          onClose={handleClosePopUp}
          productInfo={{
            name: "Business Card",
            size: selectedCard,
            quantity: undefined,
            price: price || undefined
          }}
        />
      )}
    </div>
  );
};

export default ProductUpload;

"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DropDown from "./DropDown";
import { fetchProductDetails } from "@/utils/api";
import { Product } from "@/app/models/products";
import { findLetterHeadPricingRule } from "@/utils/priceFinder";
import { addToCart } from "@/utils/cart";
import { LetterHeadPricingRule } from "@/app/models/products";
import { useRouter } from "next/navigation";
import FileUploader from "./FileUploader";
import toast from "react-hot-toast";
import { useCartStore } from "@/utils/store/cartStore";
import Loader from "@/components/common/Loader";


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
  const [selectedOption, setSelectedOption] = useState("");
  const productDetails = product;//stores state from dropdown and passed to princingfrle finder
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPricingRule, setSelectedPricingRule] = useState<LetterHeadPricingRule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isAddToCartDisabled = !selectedPricingRule || !uploadedDocumentId || isLoading;
  const router = useRouter();
  const incrementCart = useCartStore((state) => state.incrementCart);

const isReadyToShowPrice =
    selectedOption !== "" &&
    selectedQuality !== "" &&
    selectedQuantity !== null &&
    selectedSize !== "";



  const isLoggedIn = () => {
    const token = localStorage.getItem("jwtToken");
    return !!token;
  };

  const handleUploadSuccess = (documentId: number) => {
    console.log("Received Document ID from child:", documentId);
    setUploadedDocumentId(documentId);
  };

useEffect(() => {
    if (
      !productDetails ||
      !selectedSize ||
      !selectedQuantity ||
      !selectedQuality ||
      !selectedOption
    ) {
      setSelectedPrice(0); // Display 0 while incomplete
      return;
    }


    // Reset error message first
    setErrorMessage(null);

    // Validate B/W Printing Rule
    if (selectedOption === "B/W" && selectedQuantity < 500) {
      setErrorMessage(
        "B/W printing is only available for quantities of 500 or more.",
      );
      setSelectedPrice(null);
      return;
    }

    // Map selected option to service type in pricing rules
    const mappedService =
      selectedOption === "B/W" ? "Black And White" : "Colour";

    console.log(
      "Extracted LetterHeadPricingRules:",
      productDetails?.LetterHeadPricingRules,
    );

    // Find matching pricing rule
    const pricingRule = findLetterHeadPricingRule(
      productDetails.LetterHeadPricingRules,
      mappedService,
      selectedSize,
      selectedQuantity,
      selectedQuality,
    );
    setSelectedPricingRule(pricingRule);
    console.log("Matched Letterhead Pricing Rule:", pricingRule);

    // Set selected price based on matched pricing rule

    setSelectedPrice(pricingRule ? pricingRule.Price : null);
  }, [
    selectedSize,
    selectedQuantity,
    selectedQuality,
    selectedOption,
    productDetails,
  ]);

  // Process stored cart item after login
  const processPendingCartItem = async () => {
    const pendingCartItem = sessionStorage.getItem("pendingCartItem");
    if (!pendingCartItem) return;

    const { dataId: pendingDataId, selectedPricingRule: pendingPricingRule, uploadedDocumentId: pendingDocumentId, } =
      JSON.parse(pendingCartItem);

    try {
      await addToCart(pendingDataId, pendingPricingRule, pendingDocumentId,);
      sessionStorage.removeItem("pendingCartItem");
      toast.success("✅ Product added to cart!");
      router.push("/Cart");
    } catch (error) {
      setErrorMessage("Failed to process pending cart item. Please try again.");
    }
  };

  const isProceedToCartDisabled = !productDetails || !selectedPricingRule || !selectedSize || !selectedQuantity || !uploadedDocumentId ;


  const handleAddToCart = async () => {
    setIsLoading(true);
    const missing = [];
    if (!selectedPricingRule) missing.push("pricing rule");
    if (!uploadedDocumentId) missing.push("document upload");
    if (missing.length > 0) {
      showErrorToast("Please select: " + missing.join(", "));
      setIsLoading(false);
      return;
    }
    if (!isLoggedIn()) {
      const pendingItem = {
        productType: "letterhead",
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
      await addToCart(dataId, selectedPricingRule!, uploadedDocumentId ?? undefined );
      toast.success("Product added to cart!");
      incrementCart();
      router.push("/");
    } catch (error) {
      alert("Failed to add to cart. Please try again.");
    }
    setIsLoading(false);
  };

  const handleProceedToCart = async () => {
    setIsLoading(true);
    const missing = [];
    if (!selectedPricingRule) missing.push("pricing rule");
    if (!uploadedDocumentId) missing.push("document upload");
    if (missing.length > 0) {
      showErrorToast("Please select: " + missing.join(", "));
      setIsLoading(false);
      return;
    }
    if (!isLoggedIn()) {
      const pendingItem = {
        productType: "letterhead",
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
      await addToCart(dataId, selectedPricingRule!, uploadedDocumentId ?? undefined );
      toast.success("Product added to cart!");
      router.push("/Cart");
    } catch (error) {
      alert("Failed to add to cart. Please try again.");
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
        {/* Left Section */}
        <FileUploader onUploadSuccess={handleUploadSuccess} />
        {/* Right Section */}
        <div className="flex flex-1 flex-col justify-between rounded px-4 py-[25px] shadow md:px-7">
          <div className="mb-10 flex flex-row space-x-10">
            {/* Color Options */}
            <div
              className="flex cursor-pointer items-center gap-4"
              onClick={() => setSelectedOption("B/W")} // Set selected option
            >
              {/* Radio Button */}
              <div
                className={`flex h-7.5 w-7.5 items-center justify-center rounded-full border ${
                  selectedOption === "B/W"
                    ? "border-4 border-[#242424]"
                    : "border-2 border-[#D1D5DB]"
                }`}
              ></div>
              <span className="tracking-tighter-[-0.2px] text-base font-medium leading-6 text-[#242424]">
                B/W print
              </span>
            </div>

            {/* Delivery Option */}
            <div
              className="flex cursor-pointer items-center gap-4"
              onClick={() => setSelectedOption("Color")} // Set selected option
            >
              {/* Radio Button */}
              <div
                className={`flex h-7.5 w-7.5 items-center justify-center rounded-full border ${
                  selectedOption === "Color"
                    ? "border-4 border-[#242424]"
                    : "border-2 border-[#D1D5DB]"
                }`}
              ></div>
              <span className="tracking-tighter-[-0.2px] text-base font-medium leading-6 text-[#242424]">
                Color Print
              </span>
            </div>
          </div>
          {productDetails && (
            <DropDown
              productDetails={productDetails}
              onSizeChange={setSelectedSize}
              onQuantityChange={setSelectedQuantity}
              onQualityChange={setSelectedQuality}
              selectedOption={selectedOption} 
            />
          )}
          <div className="flex w-full flex-col items-center justify-center ">
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
          <div className="mt-[182px] flex flex-1 flex-col md:flex-row justify-center gap-2 md:gap-19">
            {/* First Button */}
            <button 
              onClick={() => {
                const missing = [];
                if (!selectedOption) missing.push("color type");
                if (!selectedSize) missing.push("size");
                if (!selectedQuantity || selectedQuantity <= 0) missing.push("quantity");
                if (!selectedQuality) missing.push("quality");
                if (!uploadedDocumentId) missing.push("document upload");
                if (missing.length > 0) {
                  showErrorToast("Please select: " + missing.join(", "));
                  return;
                }
                handleAddToCart();
              }}
              className={`relative flex h-[44px] w-full md:flex-1 items-center justify-center gap-4 rounded-[48px] text-lg cursor-pointer bg-[#242424] text-white ${isAddToCartDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="pr-1">🛒</span>
              <span className="text-lg font-medium">Add to Cart</span>
            </button>

            {/* Second Button */}
            <button
              onClick={() => {
                const missing = [];
                if (!selectedOption) missing.push("color type");
                if (!selectedSize) missing.push("size");
                if (!selectedQuantity || selectedQuantity <= 0) missing.push("quantity");
                if (!selectedQuality) missing.push("quality");
                if (!uploadedDocumentId) missing.push("document upload");
                if (missing.length > 0) {
                  showErrorToast("Please select: " + missing.join(", "));
                  return;
                }
                handleProceedToCart();
              }}
              className={`relative flex h-[44px] w-full md:flex-1 items-center justify-center rounded-[48px] border-2 text-lg cursor-pointer border-[#242424] bg-white text-[#242424] hover:bg-gray-100 transition ${isAddToCartDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="pr-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="#242424"
                >
                  <path
                    d="M14.1667 5.50016V3.8335H5V5.50016H7.91667C9.00167 5.50016 9.9175 6.1985 10.2625 7.16683H5V8.8335H10.2625C10.0919 9.31979 9.77463 9.74121 9.3545 10.0397C8.93438 10.3382 8.43203 10.4991 7.91667 10.5002H5V12.5118L9.655 17.1668H12.0117L7.01167 12.1668H7.91667C8.87651 12.1651 9.80644 11.8327 10.5499 11.2255C11.2933 10.6184 11.8048 9.77363 11.9983 8.8335H14.1667V7.16683H11.9983C11.8715 6.56003 11.6082 5.99007 11.2283 5.50016H14.1667Z"
                    fill="black"
                  />
                </svg>
              </span>
              <span className="font-bold">{selectedPrice !== null ? selectedPrice : "0"}</span>
              <span className="pl-4 font-medium">Proceed To Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpload;

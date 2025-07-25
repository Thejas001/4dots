"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DropDown from "./DropDown";
import { fetchProductDetails } from "@/utils/api";
import { PolaroidCardPricingRule, Product } from "@/app/models/products";
import { findPolaroidCardPricingRule } from "@/utils/priceFinder";
import { addToCartPolaroidCard } from "@/utils/cart";
import { useRouter } from "next/navigation";
import FileUploader from "./FileUploader";
import ImageSection from "./imageSection";
import type { UploadFile } from "antd/es/upload";
import toast from "react-hot-toast";
import { useCartStore } from "@/utils/store/cartStore";
import CartButton from "./CartButton";

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
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [selectedPricingRule, setSelectedPricingRule] = useState<PolaroidCardPricingRule | null>(null);
  const incrementCart = useCartStore((state) => state.incrementCart);
  const [uploadedImages, setUploadedImages] = useState<UploadFile[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  // Update selectedQuantity when fileList changes
  useEffect(() => {
    setSelectedQuantity(fileList.length > 0 ? fileList.length : 1);
  }, [fileList]);

  // Image navigation handlers
  const handleNext = () => {
    if (fileList.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % fileList.length);
    }
  };
  const handlePrevious = () => {
    if (fileList.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? fileList.length - 1 : prevIndex - 1
      );
    }
  };
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [fileList]);

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem("jwtToken");
    return !!token;
  };
  // Function to handle price calculation and set it in the parent
  const handlePriceCalculation = (
    price: number | null,
    error: string | null,
  ) => {
    setPrice(price);
    setError(error);
  };

  const handleUploadSuccess = (documentId: number) => {
    console.log("Received Document ID from child:", documentId);
    setUploadedDocumentId(documentId);
  };

  useEffect(() => {
    // Check if all necessary data is available before proceeding
    if (!productDetails || !selectedSize) return;

    // Reset error message
    setErrorMessage(null);

    console.log(
      "Extracted PolaroidCardPricingRules:",
      productDetails?.PolaroidCardPricingRules,
    );

    // Find the matching pricing rule based on the selected size and quantity
    const pricingRule = findPolaroidCardPricingRule(
      productDetails.PolaroidCardPricingRules,
      selectedSize,
      selectedQuantity
    );
    setSelectedPricingRule(pricingRule);
    console.log("Matched PolaroidCard Pricing Rule:", pricingRule);

    // Set selected price based on the matched pricing rule
    setSelectedPrice(pricingRule ? pricingRule.Price : null);
  }, [selectedSize, productDetails, fileList.length]);

  // Process stored cart item after login
  const processPendingCartItem = async () => {
    const pendingCartItem = sessionStorage.getItem("pendingCartItem");
    if (!pendingCartItem) return;

    const {
      dataId: pendingDataId,
      selectedPricingRule: pendingPricingRule,
      selectedQuantity: pendingQuantity,
      uploadedDocumentIds: pendingDocumentIds,
    } = JSON.parse(pendingCartItem);

    try {
      await addToCartPolaroidCard(
        pendingDataId,
        pendingPricingRule,
        pendingQuantity as number,
        pendingDocumentIds,
      );
      sessionStorage.removeItem("pendingCartItem");
      router.push("/Cart");
    } catch (error) {
      setErrorMessage("Failed to process pending cart item. Please try again.");
    }
  };

  // Process pending cart item when user logs in
  useEffect(() => {
    if (isLoggedIn()) {
      processPendingCartItem();
    }
  }, []);

  // Add a wrapper to allow number|null from file/image components
  const handleSetSelectedQuantity = (quantity: number | null) => {
    // This function is no longer needed as quantity is handled by fileList.length
  };

  return (
    <div className="flex flex-col bg-white px-4 py-20 pb-[79px] pt-[31px] md:px-20">
      {/* First Row */}
      <div className="flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="flex flex-col items-center">

          <FileUploader
            quantity={selectedQuantity}
            uploadedImages={fileList}
            setUploadedImages={setFileList}
            setQuantity={setSelectedQuantity}
            currentImageIndex={currentImageIndex}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        </div>
        {/* Right Section */}
        <div className="flex flex-1 flex-col justify-between rounded px-4 py-[25px] shadow md:px-7">
          {productDetails && (
            <DropDown
              productDetails={productDetails}
              onSizeChange={setSelectedSize}
              onPriceCalculation={handlePriceCalculation}
              quantity={selectedQuantity}
            />
          )}
                    <ImageSection
            uploadedImages={fileList}
            setUploadedImages={setFileList}
            setSelectedQuantity={(q) => setSelectedQuantity(q ?? 1)}
          />

          {/**error message*/}
          <div className="flex w-full flex-col items-center justify-center ">
            {error && <div className="text-red-500">{error}</div>}
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          </div>

<CartButton
  selectedPricingRule={selectedPricingRule}
  dataId={dataId}
  uploadedImages={fileList}
  selectedSize={selectedSize}
  calculatedPrice={price ?? 0}
/>


        </div>
      </div>
    </div>
  );
};

export default ProductUpload;

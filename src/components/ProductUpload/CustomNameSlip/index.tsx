"use client";
import React, { useState, useEffect } from "react";
import DropDown from "./DropDown";
import { NameSlipPricingRule, Product } from "@/app/models/products";
import { findNameSlipPricingRule } from "@/utils/priceFinder";
import { addToCartNameSlip } from "@/utils/cart";
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
  const productDetails = product;//stores state from dropdown and passed to princingfrle finder
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(null);
  const [selectedPricingRule, setSelectedPricingRule] =  useState<NameSlipPricingRule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isAddToCartDisabled = !selectedSize || !selectedQuantity || !uploadedDocumentId || isLoading;
  const router = useRouter();
  const incrementCart = useCartStore((state) => state.incrementCart);
  
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
    if (!productDetails || !selectedSize || !selectedQuantity) return;

    // Reset error message
    setErrorMessage(null);

    console.log(
      "Extracted Name Slip PricingRules:",
      productDetails?.NameSlipPricingRules,
    );

    // Find the matching pricing rule based on the selected size and quantity
    const pricingRule = findNameSlipPricingRule(
      productDetails.NameSlipPricingRules,
      selectedSize,
      Number(selectedQuantity),
    );
    setSelectedPricingRule(pricingRule);
    console.log("Matched Name Slip Pricing Rule:", pricingRule);

    // Set selected price based on the matched pricing rule
    setSelectedPrice(pricingRule ? pricingRule.Price : null);
  }, [selectedSize, selectedQuantity, productDetails]);

  // Process stored cart item after login
  const processPendingCartItem = async () => {
    const pendingCartItem = sessionStorage.getItem("pendingCartItem");
    if (!pendingCartItem) return;

    const {
      dataId: pendingDataId,
      selectedPricingRule: pendingPricingRule,
      selectedQuantity: pendingQuantity,
      uploadedDocumentId: pendingDocumentId,
    } = JSON.parse(pendingCartItem);

    try {
      await addToCartNameSlip(
        pendingDataId,
        pendingPricingRule,
        pendingQuantity as number,
        pendingDocumentId,
      );
      sessionStorage.removeItem("pendingCartItem");
      router.push("/Cart");
    } catch (error) {
      setErrorMessage("Failed to process pending cart item. Please try again.");
    }
  };

  const isProceedToCartDisabled = !productDetails || !selectedPricingRule || !selectedSize || !selectedQuantity || !uploadedDocumentId;

  //add to cart function
  const handleAddToCart = async () => {
    setIsLoading(true);
    const missing = [];
    if (!selectedSize) missing.push("size");
    if (!selectedQuantity || Number(selectedQuantity) <= 0) missing.push("quantity");
    if (!uploadedDocumentId) missing.push("document upload");
    if (missing.length > 0) {
      showErrorToast("Please select: " + missing.join(", "));
      setIsLoading(false);
      return;
    }

    if (!isLoggedIn()) {
      const pendingItem = {
        productType: "nameslip",
        dataId,
        selectedPricingRule,
        selectedQuantity,
        uploadedDocumentId,
      };
      sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
      toast.success("Product added to cart!");
      router.push(`/auth/signin?redirect=/`); // ✅ Redirect to cart after login
      setIsLoading(false);
      return;
    }

    try {
      await addToCartNameSlip(
        dataId,
        selectedPricingRule!,
        Number(selectedQuantity),
        uploadedDocumentId ?? undefined 
      );
      incrementCart();
      toast.success("Product added to cart!");
      router.push("/"); // ✅ Redirect to Cart page after adding
    } catch (error) {
      alert("Failed to add to cart. Please try again.");
    }
    setIsLoading(false);
  };

  const handleProceddToCart = async () => {
    setIsLoading(true);
    const missing = [];
    if (!selectedSize) missing.push("size");
    if (!selectedQuantity || Number(selectedQuantity) <= 0) missing.push("quantity");
    if (!uploadedDocumentId) missing.push("document upload");
    if (missing.length > 0) {
      showErrorToast("Please select: " + missing.join(", "));
      setIsLoading(false);
      return;
    }

    if (!isLoggedIn()) {
      const pendingItem = {
        productType: "nameslip",
        dataId,
        selectedPricingRule,
        selectedQuantity,
        uploadedDocumentId,
      };
      sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
      router.push(`/auth/signin?redirect=/Cart`); // ✅ Redirect to cart after login
      setIsLoading(false);
      return;
    }

    try {
      await addToCartNameSlip(
        dataId,
        selectedPricingRule!,
        Number(selectedQuantity),
        uploadedDocumentId ?? undefined 
      );
      toast.success("Product added to cart!");
      router.push("/Cart"); // ✅ Redirect to Cart page after adding
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
    }
    setIsLoading(false);
  };


  

  // Process pending cart item when user logs in
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
          {productDetails && (
            <DropDown
              productDetails={productDetails}
              onSizeChange={setSelectedSize}
              onQuantityChange={setSelectedQuantity}
              onPriceCalculation={handlePriceCalculation}
            />
          )}

          {/**error message*/}
          <div className="flex w-full flex-col items-center justify-center ">
            {error && <div className="text-red-500">{error}</div>}
          </div>
          {/**Cart & Payment Button*/}
          <div className="mt-10 flex w-full max-w-[800px] flex-col md:flex-row justify-center gap-3 md:gap-6 px-4 mx-auto">
  {/* First Button */}
  <button
    onClick={() => {
      const missing = [];
      if (!selectedSize) missing.push("size");
      if (!selectedQuantity) missing.push("quantity");
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
      if (!selectedSize) missing.push("size");
      if (!selectedQuantity) missing.push("quantity");
      if (!uploadedDocumentId) missing.push("document upload");
      if (missing.length > 0) {
        showErrorToast("Please select: " + missing.join(", "));
        return;
      }
      handleProceddToCart();
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
    <span className="font-bold">{price !== null ? price : "0"}</span>
    <span className="pl-4 font-medium">Proceed To Cart</span>
  </button>
</div>



        </div>
      </div>
    </div>
  );
};

export default ProductUpload;

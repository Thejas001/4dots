'use client';
import React, { useState, useEffect, useCallback } from "react";
import DropDown from "./DropDown";
import { fetchProductDetails } from "@/utils/api";
import { findCanvasPricingRule } from "@/utils/priceFinder";
import { Product, CanvasPricingRule } from "@/app/models/products";
import { useRouter } from "next/navigation";
import { addToCartCanvasPrinting } from "@/utils/cart";
import FileUploader from "./FileUploader";
import toast from "react-hot-toast";
import { useCartStore } from "@/utils/store/cartStore";

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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [sqftRange, setSqftRange] = useState<number | null>(null);
    const [selectedPricingRule, setSelectedPricingRule] = useState<CanvasPricingRule | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(null);
    const isAddToCartDisabled = !selectedPricingRule || !uploadedDocumentId;
    const router = useRouter();
    const incrementCart = useCartStore((state) => state.incrementCart);


    
  const handleUploadSuccess = (documentId: number) => {
    console.log("Received Document ID from child:", documentId);
    setUploadedDocumentId(documentId);
  };

    const isLoggedIn = () => {
      const token = localStorage.getItem("jwtToken");
      return !!token;
    };

    useEffect(() => {
        if (!productDetails || sqftRange === null) {
            setSelectedPrice(0);
            setSelectedPricingRule(null);
            return;
        }
        const pricingRule = findCanvasPricingRule(productDetails.CanvasPricingRules, sqftRange);
        setSelectedPricingRule(pricingRule);
        setSelectedPrice(pricingRule ? pricingRule.PricePerSquareFoot  * sqftRange : 0);
    }, [sqftRange, productDetails]);


// Process stored cart item after login
    const processPendingCartItem = async () => {
      const pendingCartItem = sessionStorage.getItem("pendingCartItem");
      if (!pendingCartItem) return;
  
      const { dataId: pendingDataId, selectedPricingRule: pendingPricingRule, selectedQuantity: pendingQuantity, uploadedDocumentId: pendingDocumentId} = 
        JSON.parse(pendingCartItem);
  
      try {
        await addToCartCanvasPrinting(pendingDataId, pendingPricingRule, sqftRange as number, pendingDocumentId);
        sessionStorage.removeItem("pendingCartItem");
        router.push("/Cart");
      } catch (error) {
        setErrorMessage("Failed to process pending cart item. Please try again.");
      }
    };
      //add to cart function
      const handleAddToCart = async () => {
        const missing = [];
        if (!sqftRange) missing.push("height and  width");
        if (!uploadedDocumentId) missing.push("document upload");
        if (missing.length > 0) {
          showErrorToast("Please select: " + missing.join(", "));
          return;
        }

        if (!isLoggedIn()) {
          const pendingItem = { productType: "canvasprinting", dataId, selectedPricingRule, sqftRange ,  uploadedDocumentId,};
          sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
          toast.success("Product added to cart!");
          router.push(`/auth/signin?redirect=/`); // ✅ Redirect to cart after login
          return;
        }

    
        try {
          await addToCartCanvasPrinting(dataId, selectedPricingRule!, Number(sqftRange), uploadedDocumentId ?? undefined);
          incrementCart();
          toast.success("Product added to cart!");
          router.push("/"); // ✅ Redirect to Cart page after adding
        } catch (error) {
          alert("Failed to add to cart. Please try again.");
        }
      };

      const handleProceedToCart = async () => {
        const missing = [];
        if (!sqftRange) missing.push("height and  width");
        if (!uploadedDocumentId) missing.push("document upload");
        if (missing.length > 0) {
          showErrorToast("Please select: " + missing.join(", "));
          return;
        }

        if (!isLoggedIn()) {
          const pendingItem = { productType: "canvasprinting", dataId, selectedPricingRule, sqftRange ,  uploadedDocumentId,};
          sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
          router.push(`/auth/signin?redirect=/Cart`); // ✅ Redirect to cart after login
          return;
        }

    
        try {
          await addToCartCanvasPrinting(dataId, selectedPricingRule!, Number(sqftRange), uploadedDocumentId ?? undefined);
          toast.success("Product added to cart!");
          router.push("/Cart"); // ✅ Redirect to Cart page after adding
        } catch (error) {
          alert("Failed to add to cart. Please try again.");
        }
      };
    // Process pending cart item when user logs in
    useEffect(() => {
      if (isLoggedIn()) {
        processPendingCartItem();
      }
    }, []);

  return (
    <div className="flex flex-col pt-[31px] bg-white px-4 md:px-20 pb-[79px] py-20">
      {/* First Row */}
      <div className="flex flex-col md:flex-row">
        {/* Left Section */}
        <FileUploader onUploadSuccess={handleUploadSuccess} />
        {/* Right Section */}
        <div className="flex flex-1 flex-col justify-between px-4 md:px-7 py-[25px] rounded shadow">
         
          <DropDown onSqftChange={(sqft) => setSqftRange(sqft)}  />

           {/**Note */}
           <div className="mt-10 w-full max-w-[800px] mx-auto px-4 text-base text-[#000]">
            <p className="font-medium">
              Note: <span className="font-normal italic">The rate for Canvas printing is based on square-feet (10sqft : 250rs/sqft)</span>
            </p>
          </div>

           {/**Cart & Payment Button*/}
          <div className="flex-1 flex flex-col md:flex-row justify-center gap-2 md:gap-19 mt-[252px]">
            {/* First Button */}
            <button
              onClick={handleAddToCart}
              className={`relative flex h-[44px] w-full md:flex-1 items-center justify-center gap-4 rounded-[48px] text-lg cursor-pointer bg-[#242424] text-white ${isAddToCartDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="pr-1">🛒</span>
              <span className="text-lg font-medium">Add to Cart</span>
            </button>

            {/* Second Button */}
            <button
              onClick={handleProceedToCart}
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
              <span className="font-bold">{selectedPrice || 0}</span>
              <span className="pl-4 font-medium">Proceed To Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpload;
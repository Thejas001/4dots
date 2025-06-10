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

const ProductUpload = ({ product }: { product: any }) => {
  const dataId = product.id;
  const productDetails = product;//stores state from dropdown and passed to princingfrle finder
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [selectedSurface, setSelectedSurface] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [selectedPricingRule, setSelectedPricingRule] = useState<BusinessCardPricingRule | null>(null);
  const isAddToCartDisabled = !selectedPricingRule || !uploadedDocumentId;
  const router = useRouter();

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem("jwtToken");
    return !!token;
  };

  const handleUploadSuccess = (documentId: number) => {
    console.log("Received Document ID from child:", documentId);
    setUploadedDocumentId(documentId);
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
    if (!productDetails || !selectedPricingRule) {
      setErrorMessage("Please select all options before adding to the cart.");
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
      return;
    }

    try {
      await addToCartBusinessCard(dataId, selectedPricingRule,  uploadedDocumentId ?? undefined);
      router.push("/Cart");
    } catch (error) {
      alert("Failed to add to cart. Please try again.");
    }
  };

  
  const handleAddToCart = async () => {
    if (!productDetails || !selectedPricingRule) {
      setErrorMessage("Please select all options before adding to the cart.");
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
      router.push(`/auth/signin?redirect=/`); // ✅ Redirect to cart after login
      return;
    }

    try {
      await addToCartBusinessCard(dataId, selectedPricingRule,  uploadedDocumentId ?? undefined);
      router.push("/");
    } catch (error) {
      alert("Failed to add to cart. Please try again.");
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      processPendingCartItem();
    }
  }, []);

  return (
    <div className="flex flex-col bg-white px-4 py-20 pb-[79px] pt-[31px] md:px-20">
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

          <div className="mt-[400px] flex flex-1 flex-row justify-center gap-19">
            {/* First Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddToCartDisabled}
              className={`relative flex h-[44px] w-full items-center justify-center gap-4 rounded-[48px] text-lg md:w-[378px]
                ${isAddToCartDisabled
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "cursor-pointer bg-[#242424] text-white"
                }`}               
                >            
              <span className="pr-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                >
                  <path
                    d="M14.5003 5C14.5003 4.46957 14.2896 3.96086 13.9145 3.58579C13.5395 3.21071 13.0308 3 12.5003 3C11.9699 3 11.4612 3.21071 11.0861 3.58579C10.711 3.96086 10.5003 4.46957 10.5003 5M9.49232 15H12.4923M12.4923 15H15.4923M12.4923 15V12M12.4923 15V18M19.7603 9.696L21.1453 18.696C21.1891 18.9808 21.1709 19.2718 21.0917 19.5489C21.0126 19.8261 20.8746 20.0828 20.687 20.3016C20.4995 20.5204 20.2668 20.6961 20.005 20.8167C19.7433 20.9372 19.4585 20.9997 19.1703 21H5.83032C5.54195 21 5.25699 20.9377 4.99496 20.8173C4.73294 20.6969 4.50005 20.5212 4.31226 20.3024C4.12448 20.0836 3.98624 19.8267 3.90702 19.5494C3.82781 19.2721 3.80949 18.981 3.85332 18.696L5.23832 9.696C5.31097 9.22359 5.5504 8.79282 5.91324 8.4817C6.27609 8.17059 6.73835 7.9997 7.21632 8H17.7843C18.2621 7.99994 18.7241 8.17094 19.0868 8.48203C19.4494 8.79312 19.6877 9.22376 19.7603 9.696Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-lg font-medium">Add to Cart</span>
            </button>

            {/* Second Button */}
            <button
              onClick={handleProceedToCart}
              disabled={isAddToCartDisabled}
              className={`relative flex h-[44px] w-full items-center justify-center rounded-[48px] border-2 text-lg md:w-[378px]
                ${isAddToCartDisabled
                  ? "cursor-not-allowed border-gray-400 bg-gray-200 text-gray-500"
                  : "cursor-pointer border-[#242424] bg-white text-[#242424]"
                }`}                
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

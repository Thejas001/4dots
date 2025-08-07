"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
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
  const productDetails = product;
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [selectedSurface, setSelectedSurface] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [selectedPricingRule, setSelectedPricingRule] = useState<BusinessCardPricingRule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCartPopUp, setShowCartPopUp] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  // Progressive display states
  const [showSurfaceSelection, setShowSurfaceSelection] = useState(false);
  const [showCardSelection, setShowCardSelection] = useState(false);
  const [showCardOptions, setShowCardOptions] = useState(false);
  
  const isAddToCartDisabled = !selectedCard || !selectedSurface || !uploadedDocumentId || isLoading;
  const router = useRouter();
  const incrementCart = useCartStore((state) => state.incrementCart);
  
  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem("jwtToken");
    return !!token;
  };

  const handleUploadSuccess = (documentId: number, file?: File, name?: string) => {
    console.log("Received Document ID from child:", documentId);
    setUploadedDocumentId(documentId);
    if (file) {
      // Clean up previous URL if it exists
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      setUploadedFile(file);
      // Create URL only once when file is uploaded
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
    }
    if (name) setFileName(name);
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

  // Handle surface selection
  const handleSurfaceSelection = (surface: string) => {
    setSelectedSurface(surface);
    setShowCardSelection(true);
    // Auto scroll to card selection after a short delay
    setTimeout(() => {
      const cardSection = document.getElementById('card-section');
      if (cardSection) {
        cardSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  // Handle card selection
  const handleCardSelection = (card: string) => {
    setSelectedCard(card);
    setShowCardOptions(false);
  };

  useEffect(() => {
    if (!productDetails || !selectedCard || !selectedSurface) return;

    if (errorMessage) {
      console.warn("Pricing rule not fetched due to validation error.");
      return;
    }

    const pricingRule = findBusinessCardPricingRule(
      productDetails.BusinessCardPricingRules,
      selectedCard,
      selectedSurface,
    );

    setSelectedPricingRule(pricingRule);
    console.log("**********PricingRule**********", pricingRule);

    if (pricingRule) {
      console.log("Matched Pricing Rule:", pricingRule);
      setPrice(pricingRule.Price);
    } else {
      console.warn("No matching pricing rule found.");
      setPrice(null);
    }
  }, [selectedCard, selectedSurface, productDetails, errorMessage]);

  // Cleanup PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Process stored cart item after login
  const processPendingCartItem = async () => {
    const pendingCartItem = sessionStorage.getItem("pendingCartItem");
    if (!pendingCartItem) return;

    const {
      dataId: pendingDataId,
      selectedPricingRule: pendingPricingRule,
      uploadedDocumentId: pendingUploadedDocumentId,
    } = JSON.parse(pendingCartItem);

    try {
      await addToCartBusinessCard(
        pendingDataId,
        pendingPricingRule,
        pendingUploadedDocumentId
      );
      sessionStorage.removeItem("pendingCartItem");
      router.push("/Cart");
    } catch (error) {
      setErrorMessage("Failed to process pending cart item. Please try again.");
    }
  };

  const handleProceedToCart = async () => {
    setIsLoading(true);

    if (!isLoggedIn()) {
      const pendingItem = {
        dataId,
        productType: "businesscard",
        selectedPricingRule,
        uploadedDocumentId,
      };
      sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
      toast.success("Product added to cart!");
      router.push(`/auth/signin?redirect=/`);
      setIsLoading(false);
      return;
    }

    try {
      await addToCartBusinessCard(dataId, selectedPricingRule!, uploadedDocumentId ?? undefined);
      toast.success("Product added to cart!");
      
      // Show popup for logged-in users instead of directly going to cart
      setShowCartPopUp(true);
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
    }
    setIsLoading(false);
  };
  
  const handleAddToCart = async () => {
    setIsLoading(true);

    if (!isLoggedIn()) {
      const pendingItem = {
        dataId,
        productType: "businesscard",
        selectedPricingRule,
        uploadedDocumentId,
      };
      sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
       toast.success("Product added to cart!");
      router.push(`/auth/signin?redirect=/`);
      setIsLoading(false);
      return;
    }

    try {
      await addToCartBusinessCard(dataId, selectedPricingRule!, uploadedDocumentId ?? undefined);
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

  // Show surface selection after file upload
  useEffect(() => {
    if (uploadedFile) {
      setShowSurfaceSelection(true);
    } else {
      setShowSurfaceSelection(false);
      setShowCardSelection(false);
      setShowCardOptions(false);
    }
  }, [uploadedFile]);

  // Memoized card options to prevent unnecessary re-renders
  const memoizedCardOptions = useMemo(() => {
    const cardTypes = productDetails?.cardType || [];
    
    return cardTypes.map((cardType: string, index: number) => {
      const pricingRule = findBusinessCardPricingRule(
        productDetails.BusinessCardPricingRules,
        cardType,
        selectedSurface
      );
      const cardPrice = pricingRule ? pricingRule.Price : 0;
      const isSelected = selectedCard === cardType;

      return (
        <div
          key={index}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            isSelected
              ? "border-black bg-gray-100"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => handleCardSelection(cardType)}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900">
              {cardType}
            </div>
            <div className="text-right">
              {cardPrice > 0 ? (
                <div className="text-sm font-semibold text-gray-900">
                  ₹{cardPrice.toFixed(2)}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Price not available
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });
  }, [productDetails?.cardType, productDetails?.BusinessCardPricingRules, selectedSurface, selectedCard]);

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70">
          <Loader />
        </div>
      )}
      
      <div className="w-[99vw] py-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-5 min-h-[600px]">
            
            {/* Left Section - Document Preview */}
            <div className="bg-gray-100 p-8 flex flex-col sticky top-0 h-screen overflow-y-auto hide-scrollbar xl:col-span-2">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Preview</h2>
                <p className="text-gray-600">Upload your document to see a preview</p>
              </div>
              
              {/* Upload Area */}
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-md ml-4">
      <FileUploader onUploadSuccess={handleUploadSuccess} />
                </div>
              </div>
            </div>

            {/* Right Section - Configuration */}
            <div className="p-8 bg-white overflow-y-auto h-screen hide-scrollbar xl:col-span-3">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Card</h1>
                  <p className="text-gray-600">Configure your print settings</p>
                </div>

                {/* Configuration Steps */}
                <div className="space-y-8">
                  
                  {/* Step 1: Upload Message - Only show when no file is uploaded */}
                  {!uploadedFile && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
                      <p className="text-sm text-gray-600 mb-4">Upload your document for printing</p>
                      
                      <div className="text-center py-8">
                        <p className="text-gray-500">Please upload a document in the left column first</p>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Surface Selection - Only show after upload */}
                  {uploadedFile && showSurfaceSelection && (
                    <div id="surface-section" className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Surface Finish</h3>
                      <p className="text-sm text-gray-600 mb-4">Select your preferred surface finish</p>
                      
                      <div className="space-y-3">
                        <div
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            selectedSurface === "GLOSSY"
                              ? "border-black bg-gray-100"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                          onClick={() => handleSurfaceSelection("GLOSSY")}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">Glossy Finish</div>
                              <div className="text-sm text-gray-600">High shine, professional look</div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedSurface === "GLOSSY"
                                ? "border-black bg-black"
                                : "border-gray-300"
                            }`}>
                              {selectedSurface === "GLOSSY" && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            selectedSurface === "MATT"
                              ? "border-black bg-gray-100"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                          onClick={() => handleSurfaceSelection("MATT")}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">Matte Finish</div>
                              <div className="text-sm text-gray-600">Smooth, elegant appearance</div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedSurface === "MATT"
                                ? "border-black bg-black"
                                : "border-gray-300"
                            }`}>
                              {selectedSurface === "MATT" && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Card Type Selection Button - Only show after surface selection */}
                  {showCardSelection && selectedSurface && (
                    <div id="card-section" className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Type</h3>
                      <p className="text-sm text-gray-600 mb-4">Select your preferred card type</p>
                      
                      {!showCardOptions ? (
                        <button
                          onClick={() => setShowCardOptions(true)}
                          className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
                        >
                          <span className="text-gray-700 font-medium">
                            {selectedCard || "Click to select card type"}
                          </span>
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-base font-semibold text-gray-900">Card Type</h4>
                            <button
                              onClick={() => setShowCardOptions(false)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="space-y-3">
                            {memoizedCardOptions.length > 0 ? (
                              memoizedCardOptions
                            ) : (
                              <div className="text-gray-500 text-center py-4">
                                No card types available for the selected surface finish.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm">{errorMessage}</p>
                    </div>
                  )}

                  {/* Order Summary - Only show after all selections are made */}
                  {selectedCard && selectedSurface && uploadedFile && !showCardOptions && (
                    <div id="order-summary" className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                      
                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="space-y-4">
                          {/* Product Info */}
                          <div className="border-b border-gray-200 pb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Product Details</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Product</span>
                                <span className="font-medium text-gray-900">Business Card</span>
                              </div>
                              {fileName && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">File</span>
                                  <span className="font-medium text-gray-900">{fileName}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Print Specifications */}
                          <div className="border-b border-gray-200 pb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Print Specifications</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Card Type</span>
                                <span className="font-medium text-gray-900">{selectedCard}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Surface Type</span>
                                <span className="font-medium text-gray-900">
                                  {selectedSurface === "GLOSSY" ? "Glossy Finish" : "Matte Finish"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Pricing */}
                          {price && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Pricing</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg px-3">
                                  <span className="text-lg font-semibold text-gray-900">Total Price</span>
                                  <span className="text-lg font-bold text-gray-900">₹{price.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Proceed to Cart Button */}
                  {selectedCard && selectedSurface && uploadedFile && !showCardOptions && (
                    <div className="bg-gray-50 rounded-xl p-6">
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
                        disabled={isAddToCartDisabled}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                          isAddToCartDisabled
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {price ? `Proceed to Cart - ₹${price.toFixed(2)}` : "Proceed to Cart"}
            </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
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

"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import FileUploader from "./FileUploader";
import ImageSection from "./imageSection";
import { fetchProductDetails } from "@/utils/api";
import { Product } from "@/app/models/products";
import { findPolaroidCardPricingRule } from "@/utils/priceFinder";
import { validatePrintSelection } from "@/utils/validatePrint";
import { addToCartPolaroidCard } from "@/utils/cart";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCartStore } from "@/utils/store/cartStore";
import Loader from "@/components/common/Loader";
import CartProceedPopUp from "@/components/CartProceedPopUp";
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

const showWarningToast = (message: string) => {
  toast.custom((t) => (
    <div
      style={{
        background: "#ff9800",
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
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(null);
  const [selectedPricingRule, setSelectedPricingRule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [showImageSection, setShowImageSection] = useState<boolean>(false);
  const [showCartPopUp, setShowCartPopUp] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [price, setPrice] = useState<number | null>(null);

  // Progressive disclosure states
  const [showSizeSelection, setShowSizeSelection] = useState<boolean>(false);
  const [showSizeOptions, setShowSizeOptions] = useState<boolean>(false);

  const router = useRouter();
  const incrementCart = useCartStore((state) => state.incrementCart);

  const isLoggedIn = () => {
    return typeof window !== "undefined" && localStorage.getItem("token");
  };

  const handleContinueShopping = () => {
    setShowCartPopUp(false);
    router.push("/");
  };

  const handleProceedToPayment = () => {
    setShowCartPopUp(false);
    router.push("/Payment");
  };

  const handleClosePopUp = () => {
    setShowCartPopUp(false);
  };

  const handleUploadSuccess = (documentId: number, file?: File, name?: string) => {
    setUploadedDocumentId(documentId);
    if (file) {
      setUploadedFile(file);
      setFileName(name || file.name);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
    }
    // Show size selection after file upload
    setShowSizeSelection(true);
  };

  useEffect(() => {
    if (fileList.length > 0) {
      setShowSizeSelection(true);
      setSelectedQuantity(fileList.length); // keep quantity in sync with uploaded files
    } else {
      setShowSizeSelection(false);
      setSelectedQuantity(0); // or 1, depending on your default
    }
  }, [fileList]);

  const handleNext = () => {
    if (fileList.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % fileList.length);
    }
  };

  const handlePrevious = () => {
    if (fileList.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + fileList.length) % fileList.length);
    }
  };

  useEffect(() => {
    if (fileList.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [fileList]);

  const handlePriceCalculation = (price: number | null, error: string | null) => {
    if (price !== null) {
      setCalculatedPrice(price);
      setPrice(price);
      setErrorMessage("");
    } else if (error) {
      setErrorMessage(error);
      setCalculatedPrice(null);
      setPrice(null);
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      if (!selectedPricingRule) {
        showErrorToast("Please select a size first");
        setIsLoading(false);
        return;
      }

      // Get document IDs from uploaded files
      const documentIds = fileList.map(file => file.documentId).filter(id => id !== null) as number[];

      await addToCartPolaroidCard(
        dataId,
        selectedPricingRule,
        selectedQuantity || 1,
        documentIds
      );

      incrementCart();
      setShowCartPopUp(true);
    } catch (error) {
      showErrorToast("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToCart = async () => {
    await handleAddToCart();
  };

  const validateSelections = () => {
    if (fileList.length === 0) {
      return "Please upload at least one file";
    }
    if (!selectedSize) {
      return "Please select a size";
    }
    return null;
  };

  const handleValidationError = (error: string) => {
    showErrorToast(error);
  };

  const handleProceedToCartWithValidation = async () => {
    const validationError = validateSelections();
    if (validationError) {
      handleValidationError(validationError);
      return;
    }
    await handleProceedToCart();
  };

  const isAddToCartDisabled = () => {
    return fileList.length === 0 || !selectedSize;
  };

  // Memoized size options with pricing
  const memoizedSizeOptions = useMemo(() => {
    if (!productDetails?.sizes || !selectedQuantity || selectedQuantity <= 0) {
      return [];
    }

    return productDetails.sizes.map((size: string, index: number) => {
      const pricingRule = findPolaroidCardPricingRule(
        productDetails.PolaroidCardPricingRules,
        size,
        selectedQuantity.toString()
      );
      
      const totalPrice = pricingRule ? pricingRule.Price * selectedQuantity : 0;
      const isSelected = selectedSize === size;

      return (
        <div
          key={index}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            isSelected
              ? "border-black bg-gray-100"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => {
            setSelectedSize(size);
            setCalculatedPrice(totalPrice);
            setPrice(totalPrice);
            setSelectedPricingRule(pricingRule);
            setShowSizeOptions(false);
          }}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900">
              {size}
            </div>
            <div className="text-right">
              {totalPrice > 0 ? (
                <div className="text-sm font-semibold text-gray-900">
                  ₹{totalPrice.toFixed(2)}
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
  }, [productDetails?.sizes, selectedQuantity, selectedSize]);

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
            
            {/* Left Section - File Preview */}
            <div className="bg-gray-100 p-8 flex flex-col sticky top-0 h-screen overflow-y-auto hide-scrollbar xl:col-span-2">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Preview</h2>
                <p className="text-gray-600">Upload your files to see a preview</p>
              </div>
              
              {/* Upload Area */}
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-md">
                  <FileUploader 
                    onUploadSuccess={handleUploadSuccess}
                    quantity={selectedQuantity}
                    uploadedImages={fileList}
                    setUploadedImages={setFileList}
                    currentImageIndex={currentImageIndex}
                    handleNext={handleNext}
                    handlePrevious={handlePrevious}
                  />
                </div>
              </div>
            </div>

            {/* Right Section - Configuration */}
            <div className="p-8 bg-white overflow-y-auto h-screen hide-scrollbar xl:col-span-3">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Polaroid Card</h1>
                  <p className="text-gray-600">Configure your print settings</p>
                </div>

                {/* Configuration Steps */}
                <div className="space-y-4">
                  
                  {/* Step 1: Upload Message - Always show first */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Images</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload your images for printing</p>
                    
                    {fileList.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Please upload images in the left column first</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h4 className="text-base font-semibold text-gray-900">File Selection</h4>
                        <ImageSection
                          uploadedImages={fileList}
                          setUploadedImages={setFileList}
                          setSelectedQuantity={(quantity) => setSelectedQuantity(quantity || 1)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Step 2: Size Selection - Only show after file upload */}
                  {showSizeSelection && fileList.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Polaroid Size</h3>
                      <p className="text-sm text-gray-600 mb-4">Select your preferred size</p>
                      
                      {!showSizeOptions ? (
                        <button
                          onClick={() => setShowSizeOptions(true)}
                          className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
                        >
                          <span className="text-gray-700 font-medium">
                            {selectedSize || "Click to select size"}
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
                            <h4 className="text-base font-semibold text-gray-900">Polaroid Size</h4>
                            <button
                              onClick={() => setShowSizeOptions(false)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="space-y-3">
                            {memoizedSizeOptions}
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

                  {/* Order Summary - Updated Section for Wider Mobile View with Original Two-Column Grid */}
                  {selectedSize && fileList.length > 0 && (
                    <div id="order-summary" className="bg-gray-50 rounded-xl p-4 sm:p-4 md:p-8 w-full mx-0 sm:mx-0 md:mx-auto md:max-w-6xl">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                      
                      <div className="bg-white rounded-lg p-6 sm:p-6 md:p-8 border border-gray-200">
                        <div className="space-y-10 sm:space-y-10 md:space-y-8">
                          {/* Product Info */}
                          <div className="pb-6 border-b border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h4>
                            <div className="grid grid-cols-2 gap-6 sm:gap-6 md:gap-6">
                              <div className="text-gray-600">Product</div>
                              <div className="font-medium text-gray-900 text-right">Polaroid Card</div>
                              {fileList.length > 0 && (
                                <>
                                  <div className="text-gray-600">Files Uploaded</div>
                                  <div className="font-medium text-gray-900 text-right">{fileList.length} files</div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Print Specifications */}
                          <div className="pb-6 border-b border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Print Specifications</h4>
                            <div className="grid grid-cols-2 gap-6 sm:gap-6 md:gap-6">
                              <div className="text-gray-600">Size</div>
                              <div className="font-medium text-gray-900 text-right">{selectedSize}</div>
                              <div className="text-gray-600">Quantity</div>
                              <div className="font-medium text-gray-900 text-right">{selectedQuantity || 1}</div>
                            </div>
                          </div>

                          {/* Pricing */}
                          {calculatedPrice && (
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h4>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-lg font-semibold text-gray-900">Total Price</span>
                                  <span className="text-lg font-bold text-gray-900">₹{calculatedPrice.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Proceed to Cart Button */}
                  {selectedSize && fileList.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <CartButton
                        selectedPricingRule={selectedPricingRule}
                        dataId={dataId}
                        uploadedImages={fileList}
                        selectedSize={selectedSize}
                        calculatedPrice={calculatedPrice ?? 0}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Popup */}
      {showCartPopUp && (
        <CartProceedPopUp
          onContinueShopping={handleContinueShopping}
          onProceedToPayment={handleProceedToPayment}
          onClose={handleClosePopUp}
          productInfo={{
            name: "Polaroid Card",
            size: selectedSize,
            quantity: selectedQuantity || 1,
            price: calculatedPrice || 0
          }}
        />
      )}
    </div>
  );
};

export default ProductUpload;
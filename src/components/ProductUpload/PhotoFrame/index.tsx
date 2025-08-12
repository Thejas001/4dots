"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import FileUploader from "./FileUploader";
import ImageSection from "./ImageSection";
import { fetchProductDetails } from "@/utils/api";
import { Product } from "@/app/models/products";
import { findPhotoFramePricingRule } from "@/utils/priceFinder";
import { validatePrintSelection } from "@/utils/validatePrint";
import { addToCartPhotoFrame } from "@/utils/cart";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCartStore } from "@/utils/store/cartStore";
import Loader from "@/components/common/Loader";
import CartProceedPopUp from "@/components/CartProceedPopUp";
import CartButton from "./CartButton";
import type { UploadFile } from "antd/es/upload";


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

const showSuccessToast = (message: string) => {
  toast.custom((t) => (
    <div
      style={{
        background: "#000000",
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{ marginRight: "12px" }}
        >
          <path
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            fill="#fff"
          />
        </svg>
        <span>{message}</span>
      </div>
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
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [selectedFrameColor, setSelectedFrameColor] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadFile[]>([]);
  const [selectedPricingRule, setSelectedPricingRule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showCartPopUp, setShowCartPopUp] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [price, setPrice] = useState<number | null>(null);

  // Progressive disclosure states
  const [showSizeSelection, setShowSizeSelection] = useState<boolean>(false);
  const [showFrameColorSelection, setShowFrameColorSelection] = useState<boolean>(false);
  const [showSizeOptions, setShowSizeOptions] = useState<boolean>(false);

  const router = useRouter();
  const incrementCart = useCartStore((state) => state.incrementCart);

  const isLoggedIn = () => {
    const token = localStorage.getItem("jwtToken");
    return !!token;
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
  };

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

  // Automatically open frame size selection when first file is uploaded
  useEffect(() => {
    if (fileList.length > 0) {
      setShowSizeSelection(true);
    }
  }, [fileList.length]);

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
        if (!isLoggedIn()) {
          showErrorToast("Please login to add items to cart");
          return;
        }


    if (!uploadedDocumentId) {
      showErrorToast("Please upload a file first");
      return;
    }

    if (!selectedSize || !selectedQuantity || !selectedFrameColor) {
      showErrorToast("Please complete all selections");
      return;
    }

    setIsLoading(true);

    try {
      // Use the actual selectedPricingRule instead of a mock
      if (!selectedPricingRule) {
        showErrorToast("Please select a valid size and quantity");
        setIsLoading(false);
        return;
      }
      await addToCartPhotoFrame(
        dataId,
        selectedPricingRule,
        selectedQuantity || 0,
        [uploadedDocumentId], // Convert to array as expected by the function
        selectedFrameColor
      );

      incrementCart();
      showSuccessToast("Added to cart successfully!");
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
    if (!selectedQuantity || selectedQuantity <= 0) {
      return "Please enter a valid quantity";
    }
    if (!selectedSize) {
      return "Please select a size";
    }
    if (!selectedFrameColor) {
      return "Please select a frame color";
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
    return !selectedQuantity || selectedQuantity <= 0 || !selectedSize || !selectedFrameColor;
  };

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
            <div className="bg-gray-100 p-8 pl-12 flex flex-col sticky top-0 h-screen overflow-y-auto hide-scrollbar xl:col-span-2">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Preview</h2>
                <p className="text-gray-600">Upload your files to see a preview</p>
              </div>
              {/* Upload Area - Only show if quantity is valid */}
              <div className="flex-1 flex flex-col justify-center w-full">
                <div className="w-full lg:mr-[8px] max-w-md mx-auto">
                  {selectedQuantity && selectedQuantity > 0 ? (
                    <FileUploader
                      quantity={selectedQuantity}
                      uploadedImages={fileList}
                      setUploadedImages={setFileList}
                    />
                  ) : (
                    <div className="w-full text-center text-gray-500 py-20">
                      <span>Please enter quantity to enable file upload.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Right Section - Configuration */}
            <div className="p-8 bg-white overflow-y-auto h-screen hide-scrollbar xl:col-span-3">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Photo Frame</h1>
                  <p className="text-gray-600">Configure your print settings</p>
                </div>
                {/* Configuration Steps */}
                <div className="space-y-4">
                  {/* Step 2: Quantity Selection */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantity</h3>
                    <p className="text-sm text-gray-600 mb-4">Enter the quantity you need</p>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Frames
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={selectedQuantity || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          setSelectedQuantity(value);
                          if (value > 0) {
                            setShowSizeSelection(true);
                            setShowFrameColorSelection(false);
                          } else {
                            setShowSizeSelection(false);
                            setShowFrameColorSelection(false);
                          }
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="Enter number of frames"
                      />
                    </div>
                  </div>
                  {/* Only show the rest of the UI if quantity is valid */}
                  {selectedQuantity && selectedQuantity > 0 && (
                    <>
                      {/* Image Section - Below Quantity */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Images</h3>
                        <p className="text-sm text-gray-600 mb-4">Manage your uploaded files</p>
                        <ImageSection
                          uploadedImages={fileList}
                          setUploadedImages={setFileList}
                          setSelectedQuantity={(q) => setSelectedQuantity(q ?? 1)}
                        />
                      </div>
                      {/* Step 3: Size Selection - Only show after quantity is entered AND at least one file is uploaded */}
                      {fileList.length > 0 && showSizeSelection && selectedQuantity && selectedQuantity > 0 && (
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frame Size</h3>
                          <p className="text-sm text-gray-600 mb-4">Select your preferred frame size</p>
                          {!showSizeOptions ? (
                            <button
                              onClick={() => setShowSizeOptions(true)}
                              className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
                            >
                              <span className="text-gray-700 font-medium">
                                {selectedSize || "Click to select frame size"}
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
                                <h4 className="text-base font-semibold text-gray-900">Frame Size</h4>
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
                                {productDetails?.sizes?.map((size: string, index: number) => {
                                  const pricingRule = findPhotoFramePricingRule(
                                    productDetails.PhotoFramePricingRules,
                                    size,
                                    selectedQuantity.toString()
                                  );
                                  const totalPrice = pricingRule ? pricingRule.Price : 0;
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
                                        setShowFrameColorSelection(true);
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
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Step 4: Frame Color Selection - Only show after size is selected */}
                      {fileList.length > 0 && showFrameColorSelection && selectedSize && (
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frame Color</h3>
                          <p className="text-sm text-gray-600 mb-4">Choose your preferred frame color</p>
                          <div className="space-y-3">
                            {/* Black */}
                            <div
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                selectedFrameColor === "Black"
                                  ? "border-black bg-gray-100"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                              onClick={() => setSelectedFrameColor("Black")}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-black mr-3"></div>
                                  <div>
                                    <div className="font-medium text-gray-900">Black</div>
                                    <div className="text-sm text-gray-600">Classic black frame</div>
                                  </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedFrameColor === "Black"
                                    ? "border-black bg-black"
                                    : "border-gray-300"
                                }`}>
                                  {selectedFrameColor === "Black" && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* White */}
                            <div
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                selectedFrameColor === "White"
                                  ? "border-black bg-gray-100"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                              onClick={() => setSelectedFrameColor("White")}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full border-2 border-gray-400 bg-white mr-3"></div>
                                  <div>
                                    <div className="font-medium text-gray-900">White</div>
                                    <div className="text-sm text-gray-600">Clean white frame</div>
                                  </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedFrameColor === "White"
                                    ? "border-black bg-black"
                                    : "border-gray-300"
                                }`}>
                                  {selectedFrameColor === "White" && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* Brown */}
                            <div
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                selectedFrameColor === "Brown"
                                  ? "border-black bg-gray-100"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                              onClick={() => setSelectedFrameColor("Brown")}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-amber-800 mr-3"></div>
                                  <div>
                                    <div className="font-medium text-gray-900">Brown</div>
                                    <div className="text-sm text-gray-600">Warm brown frame</div>
                                  </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedFrameColor === "Brown"
                                    ? "border-black bg-black"
                                    : "border-gray-300"
                                }`}>
                                  {selectedFrameColor === "Brown" && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Error Message */}
                      {errorMessage && fileList.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-red-800 text-sm">{errorMessage}</p>
                        </div>
                      )}
                      {/* Order Summary - Only show after all selections are made */}
                      {fileList.length > 0 && selectedSize && selectedFrameColor && (
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
                                    <span className="font-medium text-gray-900">Photo Frame</span>
                                  </div>
                                  {fileList.length > 0 && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Files Uploaded</span>
                                      <span className="font-medium text-gray-900">{fileList.length} files</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* Print Specifications */}
                              <div className="border-b border-gray-200 pb-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Print Specifications</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Frame Size</span>
                                    <span className="font-medium text-gray-900">{selectedSize}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Frame Color</span>
                                    <span className="font-medium text-gray-900">{selectedFrameColor}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Quantity</span>
                                    <span className="font-medium text-gray-900">{selectedQuantity || 1}</span>
                                  </div>
                                </div>
                              </div>
                              {/* Pricing */}
                              {calculatedPrice && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Pricing</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg px-3">
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
                      {fileList.length > 0 && selectedSize && selectedFrameColor && (
                        <div className="bg-gray-50 rounded-xl p-6">
                          <CartButton
                            uploadedImages={fileList}
                            dataId={dataId}
                            selectedQuantity={selectedQuantity}
                            calculatedPrice={calculatedPrice ?? 0}
                            selectedPricingRule={selectedPricingRule}
                            selectedFrameColor={selectedFrameColor}
                            selectedSize={selectedSize}
                          />                        
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpload;

'use client'
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { fetchProductDetails } from "@/utils/api";
import { OffsetPrintingPricingRule, Product } from "@/app/models/products";
import { addToCartOffSetPrinting } from "@/utils/cart";
import { findOffsetPrintingPricingRule } from "@/utils/priceFinder";
import { useRouter } from "next/navigation";
import FileUploader from "./FileUploader";
import { findOffsetPrintingPricingRule1, calculateOffsetPrintingPrice} from "./PriceCalculator";
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
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showQuantityInput, setShowQuantityInput] = useState<boolean>(false);
  const [showSizeButton, setShowSizeButton] = useState<boolean>(false);
  const [showSizeOptions, setShowSizeOptions] = useState<boolean>(false);
  const [showQualityButton, setShowQualityButton] = useState<boolean>(false);
  const [showQualityOptions, setShowQualityOptions] = useState<boolean>(false);
  const [showCartPopUp, setShowCartPopUp] = useState(false);

  const [isUploaded, setIsUploaded] = useState(false);


  const router = useRouter();
  const incrementCart = useCartStore((state) => state.incrementCart);

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
  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem("jwtToken");
    return !!token;
  };

  const handleUploadSuccess = (documentId: number, fileURL: string | null) => {
    setUploadedDocumentId(documentId);
    setIsUploaded(true); // Always set to true when document is uploaded
    if (fileURL) {
      setPdfUrl(fileURL);
    } else {
      setUploadedFile({} as File); // Only if no preview URL, to trigger options
    }
  };

  // Memoized pricing calculation
  const getSizePrice = useMemo(() => {
    return (size: string, quality: string, quantity: number) => {
      if (!size || !quality || !quantity) return 0;
      
      const pricingRule = findOffsetPrintingPricingRule(
        productDetails.OffsetPrintingPricingRules || [],
        size,
        quantity,
        quality
      );
      
      if (pricingRule) {
        return pricingRule.Price * quantity;
      }
      return 0;
    };
  }, [productDetails.OffsetPrintingPricingRules]);

  // Handle size selection
  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
    setShowSizeOptions(false);
    setShowQualityButton(true);
  };

  // Handle quality selection
  const handleQualitySelection = (quality: string) => {
    setSelectedQuality(quality);
    setShowQualityOptions(false);
  };

  // Update UI states based on selections
  useEffect(() => {
    if (selectedSize && selectedQuantity && selectedQuality) {
      // All selections made, calculate price
      const price = getSizePrice(selectedSize, selectedQuality, selectedQuantity);
      setCalculatedPrice(price);
    } else {
      setCalculatedPrice(null);
    }
  }, [selectedSize, selectedQuantity, selectedQuality, getSizePrice]);

  // Show quantity input only after document is uploaded
  useEffect(() => {
    if (isUploaded) {
      setShowQuantityInput(true);
      // Set default quantity to 1 unit (1000 copies)
      if (!selectedQuantity) {
        setSelectedQuantity(1);
      }
      
      // Auto scroll to quantity input after a short delay
      setTimeout(() => {
        const quantitySection = document.getElementById('quantity-section');
        if (quantitySection) {
          quantitySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    } else {
      setShowQuantityInput(false);
    }
  }, [isUploaded]);

  // Show size button after quantity input
  useEffect(() => {
    if (selectedQuantity && selectedQuantity > 0) {
      setShowSizeButton(true);
      
      // Auto scroll to size button after a short delay
      setTimeout(() => {
        const sizeSection = document.getElementById('size-section');
        if (sizeSection) {
          sizeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [selectedQuantity]);

  // Show quality button after size selection
  useEffect(() => {
    if (selectedSize) {
      setShowQualityButton(true);
      
      // Auto scroll to quality button after a short delay
      setTimeout(() => {
        const qualitySection = document.getElementById('quality-section');
        if (qualitySection) {
          qualitySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [selectedSize]);

  const isAddToCartDisabled = !uploadedDocumentId || !selectedSize || !selectedQuality || !selectedQuantity || isLoading;

  // Memoized size options
  const memoizedSizeOptions = useMemo(() => {
    const sizeOptions = productDetails.NoticeType || productDetails.sizes || [];
    
    return sizeOptions.map((size: string, index: number) => {
      const totalPrice = getSizePrice(size, selectedQuality, selectedQuantity || 0);
      const isSelected = selectedSize === size;

      return (
        <div
          key={index}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            isSelected
              ? "border-black bg-gray-100"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => handleSizeSelection(size)}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900">
              {size}
            </div>
            <div className="text-right">
              {selectedQuantity && selectedQuality && totalPrice > 0 ? (
                <div className="text-sm font-semibold text-gray-900">
                  ₹{totalPrice.toFixed(2)}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Select quality
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });
  }, [productDetails.NoticeType, productDetails.sizes, getSizePrice, selectedSize, selectedQuantity, selectedQuality]);

  // Memoized quality options
  const memoizedQualityOptions = useMemo(() => {
    const qualityOptions = productDetails.Quality || [];
    const isOffsetPrinting = productDetails.name === "Offset Printing";
    
    let filteredQualities = qualityOptions;
    if (isOffsetPrinting && selectedSize) {
      try {
        const { noticeTypeQualityRules } = require("@/utils/bindingdisable");
        const allowedQualities = noticeTypeQualityRules[selectedSize];
        if (allowedQualities) {
          filteredQualities = qualityOptions.filter((q: string) =>
            allowedQualities.includes(q.toUpperCase())
          );
        }
      } catch (error) {
        console.error("Error loading quality rules:", error);
      }
    }

    return filteredQualities.map((quality: string, index: number) => {
      const totalPrice = getSizePrice(selectedSize, quality, selectedQuantity || 0);
      const isSelected = selectedQuality === quality;

      return (
        <div
          key={index}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            isSelected
              ? "border-black bg-gray-100"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => handleQualitySelection(quality)}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900">
              {quality}
            </div>
            <div className="text-right">
              {selectedSize && selectedQuantity && totalPrice > 0 ? (
                <div className="text-sm font-semibold text-gray-900">
                  ₹{totalPrice.toFixed(2)}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Select size
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });
  }, [productDetails.Quality, selectedSize, selectedQuantity, selectedQuality, getSizePrice]);

  const processPendingCartItem = async () => {
    const pendingItem = sessionStorage.getItem("pendingCartItem");
    if (pendingItem) {
      try {
        const item = JSON.parse(pendingItem);
        if (item.productId === dataId) {
          await addToCartOffSetPrinting(
            item.productId,
            item.selectedPricingRule,
            item.selectedQuantity,
            item.uploadedDocumentId
          );
          sessionStorage.removeItem("pendingCartItem");
          // toast.success("Pending item added to cart!"); // Removed
        }
      } catch (error) {
        console.error("Error processing pending cart item:", error);
      }
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    
    if (!isLoggedIn()) {
      const pendingItem = {
        productId: dataId,
        selectedPricingRule: findOffsetPrintingPricingRule(
          productDetails.OffsetPrintingPricingRules || [],
          selectedSize,
          selectedQuantity || 0,
          selectedQuality
        ),
        selectedQuantity: selectedQuantity || 0,
        uploadedDocumentId,
      };
      sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
      router.push(`/auth/signin?redirect=/Cart`);
      setIsLoading(false);
      return;
    }

    try {
      const pricingRule = findOffsetPrintingPricingRule(
        productDetails.OffsetPrintingPricingRules || [],
        selectedSize,
        selectedQuantity || 0,
        selectedQuality
      );
      
      await addToCartOffSetPrinting(
        dataId,
        pricingRule!,
        selectedQuantity ?? 1,
        uploadedDocumentId ?? undefined
      );
      // toast.success("Product added to cart!"); // Removed
      setShowCartPopUp(true); 
          incrementCart();
          toast.success("Product added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
      setIsLoading(false);
    }
  };

  const handleProceedToCart = async () => {
    handleAddToCart();
    setShowCartPopUp(true);

  };

  useEffect(() => {
    if (isLoggedIn()) {
      processPendingCartItem();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70">
          <Loader />
        </div>
      )}
      
      <div className="max-w-[97vw] mx-auto px-3 py-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-5 min-h-[600px]">
            
            {/* Left Section - Static PDF Preview */}
            <div className="bg-gray-100 p-8 flex flex-col sticky top-0 h-screen overflow-y-auto hide-scrollbar xl:col-span-2">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Preview</h2>
              </div>
              
              {/* Upload Area */}
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                {!uploadedFile ? (
                  <div className="w-full max-w-md">
                    <FileUploader 
                      onUploadSuccess={handleUploadSuccess} 
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-md">
                    {/* File Info */}
                    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm w-full">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{fileName}</h3>
                          <p className="text-sm text-gray-600">Document uploaded successfully</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">Document ID</p>
                          <p className="text-xs text-gray-500">#{uploadedDocumentId}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* PDF Preview */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 w-full">
                      <div className="relative w-[300px] h-[400px] flex items-center justify-center border rounded-md bg-white mx-auto">
                        {pdfUrl ? (
                          <iframe
                            src={`${pdfUrl}#toolbar=0&page=1`}
                            width="100%"
                            height="100%"
                            className="rounded-md border"
                            title="PDF Preview"
                          />
                        ) : (
                          <img src="/images/product/Rectangle970.svg" alt="Placeholder" className="w-full h-full object-cover rounded-md" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Configuration */}
            <div className="xl:col-span-3 p-8 overflow-y-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Offset Print</h1>
                <p className="text-gray-600">Configure your print settings</p>
              </div>

              {/* Configuration Steps */}
              <div className="space-y-8">
                
                {/* Step 1: Upload Message - Only show when no file is uploaded */}
                {!isUploaded  && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload your document for printing</p>
                    
                    <div className="text-center py-8">
                      <p className="text-gray-500">Please upload a document in the left column first</p>
                    </div>
                  </div>
                )}

                {/* Step 2: Quantity Selection - Only show after upload */}
                {isUploaded  && showQuantityInput && (
                   <div id="quantity-section" className="bg-gray-50 rounded-xl p-6">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantity</h3>
                     <p className="text-sm text-gray-600 mb-4">How many copies do you need?</p>
                     
                     <div className="mb-6">
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Number of Copies
                       </label>
                                               <input
                          type="number"
                          min="1000"
                          max="10000"
                          step="1000"
                          value={selectedQuantity ? selectedQuantity * 1000 : 1000}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1000;
                            const units = Math.floor(value / 1000);
                            setSelectedQuantity(units);
                          }}
                          onBlur={(e) => {
                            const value = parseInt(e.target.value) || 1000;
                            const units = Math.floor(value / 1000);
                            setSelectedQuantity(units);
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                          placeholder="1000"
                        />
                       <p className="text-xs text-gray-500 mt-1">
                         Use up/down arrows to adjust. Range: 1000 - 10000 copies (1-10 units).
                       </p>
                     </div>
                   </div>
                 )}

                 {/* Step 3: Size Selection Button */}
                 {isUploaded  && showSizeButton && !showSizeOptions && (
                   <div id="size-section" className="bg-gray-50 rounded-xl p-6">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Paper Size</h3>
                     <p className="text-sm text-gray-600 mb-4">Select your preferred paper size</p>
                     
                     <button
                       onClick={() => setShowSizeOptions(true)}
                       className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
                     >
                       <span className="text-gray-700 font-medium">
                         {selectedSize || "Click to select paper size"}
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
                   </div>
                 )}

                 {/* Step 3: Size Options */}
                 {isUploaded  && showSizeOptions && (
                   <div className="bg-gray-50 rounded-xl p-6">
                     <div className="flex items-center justify-between mb-4">
                       <h3 className="text-lg font-semibold text-gray-900">Paper Size</h3>
                       <button
                         onClick={() => setShowSizeOptions(false)}
                         className="text-gray-500 hover:text-gray-700"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </button>
                     </div>
                     <p className="text-sm text-gray-600 mb-4">Select your preferred paper size</p>
                     
                     <div className="space-y-3">
                       {memoizedSizeOptions.length > 0 ? (
                         memoizedSizeOptions
                       ) : (
                         <div className="text-gray-500 text-center py-4">
                           No size options available. Please check the product configuration.
                         </div>
                       )}
                     </div>
                   </div>
                 )}

                 {/* Step 4: Quality Selection Button */}
                 {isUploaded  && showQualityButton && !showQualityOptions && selectedSize && (
                   <div id="quality-section" className="bg-gray-50 rounded-xl p-6">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Paper Quality</h3>
                     <p className="text-sm text-gray-600 mb-4">Select your preferred paper quality</p>
                     
                     <button
                       onClick={() => setShowQualityOptions(true)}
                       className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
                     >
                       <span className="text-gray-700 font-medium">
                         {selectedQuality || "Click to select paper quality"}
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
                   </div>
                 )}

                 {/* Step 4: Quality Options */}
                 {isUploaded  && showQualityOptions && (
                   <div className="bg-gray-50 rounded-xl p-6">
                     <div className="flex items-center justify-between mb-4">
                       <h3 className="text-lg font-semibold text-gray-900">Paper Quality</h3>
                       <button
                         onClick={() => setShowQualityOptions(false)}
                         className="text-gray-500 hover:text-gray-700"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </button>
                     </div>
                     <p className="text-sm text-gray-600 mb-4">Select your preferred paper quality</p>
                     
                     <div className="space-y-3">
                       {memoizedQualityOptions.length > 0 ? (
                         memoizedQualityOptions
                       ) : (
                         <div className="text-gray-500 text-center py-4">
                           No quality options available for the selected size.
                         </div>
                       )}
                     </div>
                   </div>
                 )}

                

                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{errorMessage}</p>
                  </div>
                )}

                {/* Order Summary - Only show after all selections are made */}
                {selectedSize && selectedQuality && selectedQuantity && !showSizeOptions && !showQualityOptions && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                    
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="space-y-4">
                        {/* Product Info */}
                        <div className="border-b border-gray-200 pb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Product Details</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Product</span>
                              <span className="font-medium text-gray-900">Offset Printing</span>
                            </div>
                            {fileName && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">File Name</span>
                                <span className="font-medium text-gray-900 truncate max-w-[200px]" title={fileName}>{fileName}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Print Specifications */}
                        <div className="border-b border-gray-200 pb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Print Specifications</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Paper Size</span>
                              <span className="font-medium text-gray-900">{selectedSize}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Paper Quality</span>
                              <span className="font-medium text-gray-900">{selectedQuality}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Quantity</span>
                              <span className="font-medium text-gray-900">{selectedQuantity * 1000} copies</span>
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
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">

                <button
                  onClick={() => {
                    const missing = [];
                    if (!uploadedDocumentId) missing.push("document upload");
                    if (!selectedSize) missing.push("paper size");
                    if (!selectedQuality) missing.push("paper quality");
                    if (!selectedQuantity || selectedQuantity <= 0) missing.push("quantity");
                    if (missing.length > 0) {
                      showErrorToast("Please select: " + missing.join(", "));
                      return;
                    }
                    handleProceedToCart();
                  }}
                  disabled={isAddToCartDisabled}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 border-2 ${
                    isAddToCartDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                    }`}
                >
                  {calculatedPrice ? `Proceed to Cart - ₹${calculatedPrice.toFixed(2)}` : "Proceed to Cart"}
                </button>
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
             name: "Letter Head",
             size: selectedSize,
             quantity: selectedQuantity || undefined,
             price: calculatedPrice || undefined
           }}
         />
       )}
    </div>
  );
};

export default ProductUpload;
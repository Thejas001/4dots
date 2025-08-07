"use client";
import React, { useState, useEffect, useMemo } from "react";
import { NameSlipPricingRule, Product } from "@/app/models/products";
import { findNameSlipPricingRule } from "@/utils/priceFinder";
import { addToCartNameSlip } from "@/utils/cart";
import { useRouter } from "next/navigation";
import FileUploader from "./FileUploader";
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

const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 4000,
    style: {
      background: '#10b981',
      color: '#fff',
      fontSize: '1rem',
      padding: '16px 24px',
      borderRadius: '8px',
    },
  });
};

const ProductUpload = ({ product }: { product: any }) => {
  const dataId = product.id;
  const productDetails = product;
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(null);
  const [selectedPricingRule, setSelectedPricingRule] = useState<NameSlipPricingRule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCartPopUp, setShowCartPopUp] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  // Progressive disclosure states
  const [showQuantityInput, setShowQuantityInput] = useState<boolean>(false);
  const [showSizeButton, setShowSizeButton] = useState<boolean>(false);
  const [showSizeOptions, setShowSizeOptions] = useState<boolean>(false);

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
      setUploadedFile(file);
      setFileName(name || file.name);
      setPdfUrl(URL.createObjectURL(file));
    }
    // Show quantity selection after file upload
    setShowQuantityInput(true);
  };

  // Handle size selection
  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
    setShowSizeOptions(false);
  };

  // Get available sizes from product details
  const availableSizes = useMemo(() => {
    if (!productDetails?.sizes) return [];
    return productDetails.sizes;
  }, [productDetails]);

  // Get available quantities
  const availableQuantities = useMemo(() => {
    return [1, 5, 10, 25, 50, 100, 250, 500, 1000];
  }, []);

  // Memoized size options with pricing
  const memoizedSizeOptions = useMemo(() => {
    if (!productDetails?.sizes || !selectedQuantity || selectedQuantity <= 0) {
      return [];
    }

    return productDetails.sizes.map((size: string, index: number) => {
      const pricingRule = findNameSlipPricingRule(
        productDetails.NameSlipPricingRules,
        size,
        selectedQuantity
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
    if (!selectedQuantity || selectedQuantity <= 0) missing.push("quantity");
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
        selectedQuantity!,
        uploadedDocumentId ?? undefined 
      );
      incrementCart();
      toast.success("Product added to cart!");
      setShowCartPopUp(true);
    } catch (error) {
      alert("Failed to add to cart. Please try again.");
    }
    setIsLoading(false);
  };

  const handleProceddToCart = async () => {
    setIsLoading(true);
    const missing = [];
    if (!selectedSize) missing.push("size");
    if (!selectedQuantity || selectedQuantity <= 0) missing.push("quantity");
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
        selectedQuantity!,
        uploadedDocumentId ?? undefined 
      );
      toast.success("Product added to cart!");
      
      // Show popup for logged-in users instead of directly going to cart
      setShowCartPopUp(true);
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
    <div className="min-h-screen bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70">
          <Loader />
        </div>
      )}
      
      <div className="max-w-[97vw] mx-auto px-3 py-4">
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
                <div className="w-full max-w-md">
                  <FileUploader onUploadSuccess={handleUploadSuccess} />
                </div>
              </div>
            </div>

            {/* Right Section - Configuration */}
            <div className="xl:col-span-3 p-8 overflow-y-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Name Slip</h1>
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

                {/* Step 2: Quantity Selection */}
                {showQuantityInput && uploadedFile && (
                  <div id="quantity-section" className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">How many copies do you need?</p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:ring-0 transition-all duration-200"
                          placeholder="Enter number of copies"
                          value={selectedQuantity || ""}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value > 0) {
                              setSelectedQuantity(value);
                              // Automatically navigate to size options
                              setTimeout(() => {
                                setShowSizeOptions(true);
                                // Auto-scroll to size selection section with offset
                                setTimeout(() => {
                                  const sizeSection = document.getElementById('size-options-section');
                                  if (sizeSection) {
                                    const elementRect = sizeSection.getBoundingClientRect();
                                    const absoluteElementTop = elementRect.top + window.pageYOffset;
                                    const offset = 100; // Offset to ensure heading is visible
                                    window.scrollTo({
                                      top: absoluteElementTop - offset,
                                      behavior: 'smooth'
                                    });
                                  }
                                }, 100); // Small delay to ensure DOM is updated
                              }, 300); // Reduced delay for faster navigation
                            } else {
                              setSelectedQuantity(null);
                              setShowSizeButton(false);
                              setShowSizeOptions(false);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                      Enter the number of copies you need for your Custom Name Slip.
                    </p>
                  </div>
                )}

                {/* Step 3: Size Selection Button - Auto-shows after quantity */}
                {showSizeButton && !showSizeOptions && selectedQuantity && (
                  <div id="size-section" className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Selection</h3>
                    <p className="text-sm text-gray-600 mb-4">Select your preferred size</p>
                    
                    <button
                      onClick={() => {
                        if (!selectedQuantity || selectedQuantity <= 0) {
                          showErrorToast("Please select quantity first");
                          return;
                        }
                        setShowSizeOptions(true);
                      }}
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
                  </div>
                )}

                {/* Step 3: Size Options */}
                {showSizeOptions && (
                  <div id="size-options-section" className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Size Selection</h3>
                      <button
                        onClick={() => setShowSizeOptions(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Select your preferred size</p>
                    
                    <div className="space-y-3">
                      {memoizedSizeOptions.length > 0 ? (
                        memoizedSizeOptions
                      ) : (
                        <div className="text-gray-500 text-center py-4">
                          No size options available for the selected configuration.
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
                {selectedSize && selectedQuantity && uploadedDocumentId && !showSizeOptions && (
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
                              <span className="font-medium text-gray-900">Custom Name Slip</span>
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
                              <span className="text-gray-600">Size</span>
                              <span className="font-medium text-gray-900">{selectedSize}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Quantity</span>
                              <span className="font-medium text-gray-900">{selectedQuantity} copies</span>
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

              {/* Action Button */}
              <div className="mt-8">
                <button
                  onClick={handleProceddToCart}
                  disabled={isProceedToCartDisabled}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    isProceedToCartDisabled
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

      {/* Cart Popup */}
      {showCartPopUp && (
        <CartProceedPopUp
          onContinueShopping={handleContinueShopping}
          onProceedToPayment={handleProceedToPayment}
          onClose={handleClosePopUp}
          productInfo={{
            name: "Custom Name Slip",
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

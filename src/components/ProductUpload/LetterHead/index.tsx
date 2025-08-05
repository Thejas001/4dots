'use client'
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { fetchProductDetails } from "@/utils/api";
import { LetterHeadPricingRule, Product } from "@/app/models/products";
import { addToCart } from "@/utils/cart";
import { findLetterHeadPricingRule } from "@/utils/priceFinder";
import { useRouter } from "next/navigation";
import FileUploader from "./FileUploader";
import toast from "react-hot-toast";
import { useCartStore } from "@/utils/store/cartStore";
import Loader from "@/components/common/Loader";
import { letterHeadVariants } from "./letterHeadVariants";
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

const showWarningToast = (message: string) => {
  toast(message, {
    duration: 4000,
    style: {
      background: '#f59e0b',
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
  const [selectedOption, setSelectedOption] = useState<string>("");
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

  const router = useRouter();
  const incrementCart = useCartStore((state) => state.incrementCart);

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem("jwtToken");
    return !!token;
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

  const handleUploadSuccess = (documentId: number, file?: File, name?: string) => {
    setUploadedDocumentId(documentId);
    if (file) {
      setUploadedFile(file);
      setFileName(name || file.name);
      setPdfUrl(URL.createObjectURL(file));
    }
  };

  // Memoized pricing calculation
  const getSizePrice = useMemo(() => {
    return (size: string, quality: string, quantity: number, option: string) => {
      if (!size || !quality || !quantity || !option) return 0;
      
      // Find the matching variant
      const variant = letterHeadVariants.find(v => 
        v.Service === option && 
        v.Quality === quality && 
        v.Quantity === quantity
      );
      
      if (variant && variant.Sizes[size as keyof typeof variant.Sizes]) {
        const price = variant.Sizes[size as keyof typeof variant.Sizes];
        // Handle different price formats
        if (typeof price === 'number') {
          return price;
        } else if (typeof price === 'string') {
          return parseFloat(price);
        } else if (price === null) {
          return 0;
        }
      }
      return 0;
    };
  }, []);

  // Handle size selection
  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
    setShowSizeOptions(false);
  };

  // Handle quality selection
  const handleQualitySelection = (quality: string) => {
    setSelectedQuality(quality);
    setShowQualityOptions(false);
  };

  // Update UI states based on selections
  useEffect(() => {
    if (selectedSize && selectedQuantity && selectedQuality && selectedOption) {
      // All selections made, calculate price
      const price = getSizePrice(selectedSize, selectedQuality, selectedQuantity, selectedOption);
      setCalculatedPrice(price);
    } else {
      setCalculatedPrice(null);
    }
  }, [selectedSize, selectedQuantity, selectedQuality, selectedOption, getSizePrice]);

  // Show quality button after print type selection
  useEffect(() => {
    if (selectedOption) {
      setShowQualityButton(true);
      // Reset other states when print type changes
      setSelectedQuality("");
      setSelectedQuantity(null);
      setSelectedSize("");
      setShowQuantityInput(false);
      setShowSizeButton(false);
      setShowQualityOptions(false);
      setShowSizeOptions(false);
      
      // Auto scroll to quality button after a short delay
      setTimeout(() => {
        const qualitySection = document.getElementById('quality-section');
        if (qualitySection) {
          qualitySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [selectedOption]);

  // Show quantity button after quality selection
  useEffect(() => {
    if (selectedQuality) {
      setShowQuantityInput(true);
      // Reset dependent states when quality changes
      setSelectedQuantity(null);
      setSelectedSize("");
      setShowSizeButton(false);
      setShowSizeOptions(false);
      
      // Auto scroll to quantity input after a short delay
      setTimeout(() => {
        const quantitySection = document.getElementById('quantity-section');
        if (quantitySection) {
          quantitySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [selectedQuality]);

  // Show size button after quantity selection
  useEffect(() => {
    if (selectedQuantity && selectedQuantity > 0) {
      setShowSizeButton(true);
      // Reset dependent states when quantity changes
      setSelectedSize("");
      setShowSizeOptions(false);
      
      // Auto scroll to size button after a short delay
      setTimeout(() => {
        const sizeSection = document.getElementById('size-section');
        if (sizeSection) {
          sizeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [selectedQuantity]);

  const isAddToCartDisabled = !uploadedDocumentId || !selectedSize || !selectedQuality || !selectedQuantity || !selectedOption || isLoading;

  // Get available sizes based on selected options
  const availableSizes = useMemo(() => {
    if (!selectedOption || !selectedQuality || !selectedQuantity) return [];
    
    const variant = letterHeadVariants.find(v => 
      v.Service === selectedOption && 
      v.Quality === selectedQuality && 
      v.Quantity === selectedQuantity
    );
    
    if (!variant) return [];
    
    return Object.entries(variant.Sizes)
      .filter(([_, value]) => value !== null && value !== "NIL")
      .map(([size]) => size);
  }, [selectedOption, selectedQuality, selectedQuantity]);

  // Get available qualities based on selected option
  const availableQualities = useMemo(() => {
    if (!selectedOption) return [];
    
    const qualities = letterHeadVariants
      .filter(v => v.Service === selectedOption)
      .map(v => v.Quality);
    
    return [...new Set(qualities)];
  }, [selectedOption]);

  // Get available quantities based on selected option and quality
  const availableQuantities = useMemo(() => {
    if (!selectedOption || !selectedQuality) return [];
    
    const quantities = letterHeadVariants
      .filter(v => v.Service === selectedOption && v.Quality === selectedQuality)
      .map(v => v.Quantity);
    
    return [...new Set(quantities)].sort((a, b) => a - b);
  }, [selectedOption, selectedQuality]);

  // Memoized size options
  const memoizedSizeOptions = useMemo(() => {
    return availableSizes.map((size: string, index: number) => {
      const totalPrice = getSizePrice(size, selectedQuality, selectedQuantity || 0, selectedOption);
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
              {selectedQuantity && selectedQuality && selectedOption && totalPrice > 0 ? (
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
  }, [availableSizes, getSizePrice, selectedSize, selectedQuantity, selectedQuality, selectedOption]);

  // Memoized quality options
  const memoizedQualityOptions = useMemo(() => {
    return availableQualities.map((quality: string, index: number) => {
      const totalPrice = getSizePrice(selectedSize, quality, selectedQuantity || 0, selectedOption);
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
              {selectedSize && selectedQuantity && selectedOption && totalPrice > 0 ? (
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
  }, [availableQualities, selectedSize, selectedQuantity, selectedQuality, selectedOption, getSizePrice]);

  const processPendingCartItem = async () => {
    const pendingItem = sessionStorage.getItem("pendingCartItem");
    if (pendingItem) {
      try {
        const item = JSON.parse(pendingItem);
        if (item.productId === dataId) {
          await addToCart(
            item.productId,
            item.selectedPricingRule,
            item.uploadedDocumentId
          );
          sessionStorage.removeItem("pendingCartItem");
          showSuccessToast("Pending item added to cart successfully!");
        }
      } catch (error) {
        console.error("Error processing pending cart item:", error);
      }
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    
    if (!isLoggedIn()) {
      // For unauthenticated users, store the basic selection data
      const pendingItem = {
        productId: dataId,
        selectedOptions: {
          Size: selectedSize,
          Quality: selectedQuality,
          Quantity: selectedQuantity,
          Service: selectedOption,
          Price: calculatedPrice
        },
        uploadedDocumentId,
      };
      sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
      router.push(`/auth/signin?redirect=/Cart`);
      setIsLoading(false);
      return;
    }

    try {
      // Use findLetterHeadPricingRule to get the correct pricing rule structure
      const pricingRule = findLetterHeadPricingRule(
        productDetails.LetterHeadPricingRules,
        selectedOption,
        selectedSize,
        selectedQuantity || 0,
        selectedQuality
      );
      
      if (!pricingRule) {
        toast.error("Pricing rule not found. Please check your selections.");
        setIsLoading(false);
        return;
      }
      
      await addToCart(
        dataId,
        pricingRule,
        uploadedDocumentId ?? undefined
      );
      showSuccessToast("Product added to cart successfully!");
      // Don't redirect to cart - let the popup handle navigation
      // router.push("/Cart");
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
      setIsLoading(false);
    }
  };

  const handleProceedToCart = async () => {
    handleAddToCart();
  };

  useEffect(() => {
    if (isLoggedIn()) {
      processPendingCartItem();
    }
  }, []);

  const validateSelections = () => {
    const missing = [];
    
    if (!uploadedDocumentId) {
      missing.push("document upload");
    }
    if (!selectedOption) {
      missing.push("print type");
    }
    if (!selectedQuality) {
      missing.push("paper quality");
    }
    if (!selectedQuantity || selectedQuantity <= 0) {
      missing.push("quantity");
    }
    if (!selectedSize) {
      missing.push("paper size");
    }
    
    return missing;
  };

  const handleValidationError = (missingItems: string[]) => {
    if (missingItems.length === 1) {
      showErrorToast(`Please complete: ${missingItems[0]}`);
    } else if (missingItems.length === 2) {
      showErrorToast(`Please complete: ${missingItems[0]} and ${missingItems[1]}`);
    } else {
      const lastItem = missingItems.pop();
      const itemsList = missingItems.join(", ");
      showErrorToast(`Please complete: ${itemsList}, and ${lastItem}`);
    }
  };

  const handleAddToCartWithValidation = async () => {
    const missingItems = validateSelections();
    
    if (missingItems.length > 0) {
      handleValidationError(missingItems);
      return;
    }

    // Additional validation for specific business rules
    if (selectedOption === "B/W" && selectedQuantity && selectedQuantity < 500) {
      showWarningToast("B/W printing requires a minimum quantity of 500 copies");
      return;
    }

    if (calculatedPrice === 0 || calculatedPrice === null) {
      showErrorToast("Unable to calculate price. Please check your selections and try again.");
      return;
    }

    // Validate file upload
    if (!uploadedFile) {
      showErrorToast("Please upload a document before proceeding");
      return;
    }

    // Validate file type (optional - can be enhanced based on requirements)
    if (uploadedFile && !uploadedFile.name.toLowerCase().endsWith('.pdf')) {
      showWarningToast("For best results, please upload a PDF file");
    }

    await handleAddToCart();
  };

  const handleProceedToCartWithValidation = async () => {
    const missingItems = validateSelections();
    
    if (missingItems.length > 0) {
      handleValidationError(missingItems);
      return;
    }

    // Additional validation for specific business rules
    if (selectedOption === "B/W" && selectedQuantity && selectedQuantity < 500) {
      showWarningToast("B/W printing requires a minimum quantity of 500 copies");
      return;
    }

    if (calculatedPrice === 0 || calculatedPrice === null) {
      showErrorToast("Unable to calculate price. Please check your selections and try again.");
      return;
    }

    // Validate file upload
    if (!uploadedFile) {
      showErrorToast("Please upload a document before proceeding");
      return;
    }

    // Validate file type (optional - can be enhanced based on requirements)
    if (uploadedFile && !uploadedFile.name.toLowerCase().endsWith('.pdf')) {
      showWarningToast("For best results, please upload a PDF file");
    }

    // For logged-in users, show popup instead of directly proceeding
    if (isLoggedIn()) {
      await handleAddToCart();
      setShowCartPopUp(true);
    } else {
      await handleProceedToCart();
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Letter Head</h1>
                <p className="text-gray-600">Configure your print settings</p>
              </div>

              {/* Print Type Selection */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Print Type</h3>
                <p className="text-sm text-gray-600 mb-4">Select your preferred print type</p>
                
                <div className="flex space-x-6">
                  {/* B/W Option */}
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedOption === "B/W"
                        ? "border-black bg-gray-100"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedOption("B/W")}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === "B/W" ? "border-black bg-black" : "border-gray-300"
                    }`}>
                      {selectedOption === "B/W" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">B/W Print</span>
                  </div>

                  {/* Color Option */}
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedOption === "Color"
                        ? "border-black bg-gray-100"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedOption("Color")}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === "Color" ? "border-black bg-black" : "border-gray-300"
                    }`}>
                      {selectedOption === "Color" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">Color Print</span>
                  </div>
                </div>
              </div>



              {/* Configuration Steps */}
              <div className="space-y-8">
                
                {/* Step 2: Quality Selection Button */}
                {showQualityButton && !showQualityOptions && selectedOption && (
                  <div id="quality-section" className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Paper Quality</h3>
                    <p className="text-sm text-gray-600 mb-4">Select your preferred paper quality</p>
                    
                                         <button
                       onClick={() => {
                         if (!selectedOption) {
                           showErrorToast("Please select a print type first");
                           return;
                         }
                         setShowQualityOptions(true);
                       }}
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

                {/* Step 2: Quality Options */}
                {showQualityOptions && (
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
                          No quality options available for the selected configuration.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Quantity Selection */}
                {showQuantityInput && selectedQuality && (
                  <div id="quantity-section" className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantity</h3>
                    <p className="text-sm text-gray-600 mb-4">How many copies do you need?</p>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Copies
                      </label>
                      <select
                        value={selectedQuantity || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setSelectedQuantity(value);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                      >
                        <option value="">Select quantity</option>
                        {availableQuantities.map((quantity) => (
                          <option key={quantity} value={quantity}>
                            {quantity} copies
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Available quantities based on your print type and quality selection.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Size Selection Button */}
                {showSizeButton && !showSizeOptions && selectedQuantity && (
                  <div id="size-section" className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Paper Size</h3>
                    <p className="text-sm text-gray-600 mb-4">Select your preferred paper size</p>
                    
                                         <button
                       onClick={() => {
                         if (!selectedQuality) {
                           showErrorToast("Please select paper quality first");
                           return;
                         }
                         if (!selectedQuantity || selectedQuantity <= 0) {
                           showErrorToast("Please select quantity first");
                           return;
                         }
                         setShowSizeOptions(true);
                       }}
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

                {/* Step 4: Size Options */}
                {showSizeOptions && (
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
                {selectedSize && selectedQuality && selectedQuantity && selectedOption && !showSizeOptions && !showQualityOptions && (
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
                              <span className="font-medium text-gray-900">Letter Head</span>
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
                              <span className="text-gray-600">Print Type</span>
                              <span className="font-medium text-gray-900">{selectedOption}</span>
                            </div>
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
                   onClick={handleProceedToCartWithValidation}
                   disabled={isAddToCartDisabled}
                   className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
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

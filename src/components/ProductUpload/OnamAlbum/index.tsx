
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import NewFileUploader from "./NewFileUploader";
import FileUploader from "./FileUploader";
import ImageSection from "./imageSection";
import { fetchProductDetails } from "@/utils/api";
import { Product } from "@/app/models/products";
import { findOnamAlbumPricingRule } from "@/utils/priceFinder";
import { validatePrintSelection } from "@/utils/validatePrint";
import { addToCartOnamAlbum } from "@/utils/cart";
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
  const [showCartPopUp, setShowCartPopUp] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [price, setPrice] = useState<number | null>(null);

  // New flow states
  const [pageCountSelected, setPageCountSelected] = useState<boolean>(false);
  const [showPageCountSelection, setShowPageCountSelection] = useState<boolean>(true);
  const [imageUploadEnabled, setImageUploadEnabled] = useState<boolean>(false);
  const [imageCountValidation, setImageCountValidation] = useState<{
    isValid: boolean;
    message: string;
    minRequired: number;
    maxAllowed: number;
  }>({
    isValid: false,
    message: "",
    minRequired: 0,
    maxAllowed: 0,
  });

  // Progressive disclosure states
  const [showSizeSelection, setShowSizeSelection] = useState<boolean>(false);
  const [showSizeOptions, setShowSizeOptions] = useState<boolean>(false);

  const router = useRouter();
  const incrementCart = useCartStore((state) => state.incrementCart);

  // Debug: Log product details when component mounts
  useEffect(() => {
    if (productDetails?.PricingRules) {
      productDetails.PricingRules.forEach((rule: any, index: number) => {
        console.log(`Pricing Rule ${index}:`, {
          size: rule.Size,
          quantityRange: rule.QuantityRange,
          price: rule.Price,
          fullRule: rule,
        });
      });
    }
    if (productDetails?.OnamAlbumPricingRules) {
      productDetails.OnamAlbumPricingRules.forEach((rule: any, index: number) => {
        console.log(`OnamAlbum Pricing Rule ${index}:`, {
          size: rule.Size,
          quantityRange: rule.QuantityRange,
          price: rule.Price,
          fullRule: rule,
        });
      });
    }
    console.log("=== END DEBUG ===");
  }, [product, productDetails]);

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

  // Validate image count based on selected page count
  const validateImageCount = useCallback(
    (imageCount: number, pageCount: string) => {
      let minRequired = 0;
      let maxAllowed = 0;
      let message = "";

      if (pageCount === "4") {
        minRequired = 8;
        maxAllowed = 16;
      } else if (pageCount === "8") {
        minRequired = 16;
        maxAllowed = 34;
      }

      if (imageCount < minRequired) {
        message = `For ${pageCount}-page album, you need at least ${minRequired} images. You have uploaded ${imageCount} images.`;
        return { isValid: false, message, minRequired, maxAllowed };
      } else if (imageCount > maxAllowed) {
        message = `For ${pageCount}-page album, you can upload maximum ${maxAllowed} images. You have uploaded ${imageCount} images.`;
        return { isValid: false, message, minRequired, maxAllowed };
      } else {
        message = `Perfect! ${imageCount} images for ${pageCount}-page album (${minRequired}-${maxAllowed} images required).`;
        return { isValid: true, message, minRequired, maxAllowed };
      }
    },
    []
  );

  // Handle page count selection
  const handlePageCountSelection = (pageCount: string) => {
    console.log("Product Details:", productDetails);
    console.log("Pricing Rules:", productDetails?.PricingRules);

    setSelectedSize(pageCount);
    setPageCountSelected(true);
    setShowPageCountSelection(false);
    setImageUploadEnabled(true);

    // Reset file list when page count changes
    setFileList([]);
    setSelectedQuantity(1);

    // Calculate initial price for the selected page count with minimum required images
    const minImages = pageCount === "4" ? 8 : 16;
    const sizeToSearch = pageCount === "4" ? "4 Pages" : "8 Pages";

    const pricingRules =
      productDetails?.PricingRules ||
      productDetails?.OnamAlbumPricingRules ||
      productDetails?.pricingRules ||
      productDetails?.onamAlbumPricingRules;

    if (!pricingRules) {
      console.log("No pricing rules available yet");
      setCalculatedPrice(null);
      setSelectedPricingRule(null);
    } else {
      pricingRules.forEach((rule: any, index: number) => {
        console.log(`Rule ${index}:`, {
          size: rule.Size?.ValueName || rule.Size,
          quantityRange: rule.QuantityRange?.ValueName || rule.QuantityRange,
          price: rule.Price,
        });
      });

      const pricingRule = findOnamAlbumPricingRule(pricingRules, sizeToSearch, minImages);


      if (pricingRule) {
        setCalculatedPrice(pricingRule.Price);
        setSelectedPricingRule(pricingRule);
      } else {
        setCalculatedPrice(null);
        setSelectedPricingRule(null);
      }
    }

    setImageCountValidation({
      isValid: false,
      message: "",
      minRequired: pageCount === "4" ? 8 : 16,
      maxAllowed: pageCount === "4" ? 16 : 34,
    });
  };

  // Update image count validation when fileList changes
  useEffect(() => {
    if (pageCountSelected && selectedSize && fileList.length > 0) {
      const validation = validateImageCount(fileList.length, selectedSize);
      setImageCountValidation(validation);

      // Update quantity to match file count
      const newQuantity = fileList.length;
      setSelectedQuantity(newQuantity);

      // Recalculate price based on new quantity
      const sizeToSearch = selectedSize === "4" ? "4 Pages" : "8 Pages";
      const pricingRules =
        productDetails?.PricingRules ||
        productDetails?.OnamAlbumPricingRules ||
        productDetails?.pricingRules ||
        productDetails?.onamAlbumPricingRules;

      const pricingRule = findOnamAlbumPricingRule(pricingRules, sizeToSearch, newQuantity);

      if (pricingRule) {
        setCalculatedPrice(pricingRule.Price);
        setSelectedPricingRule(pricingRule);
      }
    } else if (fileList.length === 0) {
      setImageCountValidation({
        isValid: false,
        message: "",
        minRequired: selectedSize === "4" ? 8 : 16,
        maxAllowed: selectedSize === "4" ? 16 : 34,
      });

      // Reset to initial price for minimum required images
      const minImages = selectedSize === "4" ? 8 : 16;
      const sizeToSearch = selectedSize === "4" ? "4 Pages" : "8 Pages";
      const pricingRules =
        productDetails?.PricingRules ||
        productDetails?.OnamAlbumPricingRules ||
        productDetails?.pricingRules ||
        productDetails?.onamAlbumPricingRules;

      const pricingRule = findOnamAlbumPricingRule(pricingRules, sizeToSearch, minImages);

      if (pricingRule) {
        setCalculatedPrice(pricingRule.Price);
        setSelectedPricingRule(pricingRule);
      }
    }
  }, [fileList.length, selectedSize, pageCountSelected, validateImageCount, productDetails]);

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

      if (!imageCountValidation.isValid) {
        showErrorToast(imageCountValidation.message);
        setIsLoading(false);
        return;
      }

      // Get document IDs from uploaded files
      const documentIds = fileList
        .map((file) => file.documentId)
        .filter((id) => id !== null) as number[];

      await addToCartOnamAlbum(dataId, selectedPricingRule, selectedQuantity || 1, documentIds);

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
    if (!pageCountSelected) {
      return "Please select a page count first";
    }
    if (fileList.length === 0) {
      return "Please upload at least one file";
    }
    if (!imageCountValidation.isValid) {
      return imageCountValidation.message;
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

  // Handle file upload for both mobile and desktop
  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      // Convert files to the format expected by the component
      const newFiles = files.map((file, index) => ({
        file,
        documentId: Date.now() + index, // Temporary ID
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }));

      // Update the file list
      setFileList((prev) => [...prev, ...newFiles]);

      // Update quantity to match file count
      const totalFiles = fileList.length + newFiles.length;
      setSelectedQuantity(totalFiles);
    }
  };

  const isAddToCartDisabled = () => {
    return !pageCountSelected || fileList.length === 0 || !imageCountValidation.isValid || !selectedSize;
  };

  // Memoized size options with pricing
  const memoizedSizeOptions = useMemo(() => {
    if (!productDetails?.sizes || !selectedQuantity || selectedQuantity <= 0) {
      return [];
    }

    const pricingRules =
      productDetails?.PricingRules ||
      productDetails?.OnamAlbumPricingRules ||
      productDetails?.pricingRules ||
      productDetails?.onamAlbumPricingRules;

    return productDetails.sizes.map((size: string, index: number) => {
      const pricingRule = findOnamAlbumPricingRule(pricingRules, size, selectedQuantity);

      const totalPrice = pricingRule ? pricingRule.Price : 0;
      const isSelected = selectedSize === size;

      return (
        <div
          key={index}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            isSelected ? "border-black bg-gray-100" : "border-gray-200 bg-white hover:border-gray-300"
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
            <div className="font-medium text-gray-900">{size}</div>
            <div className="text-right">
              {totalPrice > 0 ? (
                <div className="text-sm font-semibold text-gray-900">₹{totalPrice.toFixed(2)}</div>
              ) : (
                <div className="text-sm text-gray-500">Price not available</div>
              )}
            </div>
          </div>
        </div>
      );
    });
  }, [productDetails?.sizes, selectedQuantity, selectedSize, productDetails]);

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
            {/* Left Section - File Preview - Hidden on mobile, shown on xl+ */}
            <div className="hidden xl:flex bg-gray-100 p-8 flex-col sticky top-0 h-screen overflow-y-auto hide-scrollbar xl:col-span-2">
              {/* Upload Area */}
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <FileUploader fileList={fileList} />
              </div>
            </div>

            {/* Right Section - Configuration and Mobile Slideshow */}
            <div className="p-4 md:p-8 bg-white overflow-y-auto h-screen hide-scrollbar xl:col-span-3">
              {/* Mobile Slideshow - Always shown in mobile view */}
              <div className="xl:hidden">
                <div className="w-full h-64">
                  <FileUploader fileList={fileList} />
                </div>
              </div>

              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Onam Memories Album</h1>
                  <p className="text-gray-600">Configure your album settings</p>
                </div>

                {/* Configuration Steps */}
                <div className="space-y-4">
                  {/* Step 1: Page Count Selection - Always show first */}
                  {showPageCountSelection && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Select Album Page Count</h3>
                        {pageCountSelected && (
                          <button
                            onClick={() => {
                              setShowPageCountSelection(false);
                              setImageUploadEnabled(true);
                            }}
                            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-300 rounded-lg hover:bg-blue-50 transition-all duration-200"
                          >
                            Continue to Upload →
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-6">Choose how many pages you want in your album</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 relative ${
                            selectedSize === "4"
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                          onClick={() => handlePageCountSelection("4")}
                        >
                          <div className="text-center">
                            {selectedSize === "4" && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                            <div className="text-2xl font-bold text-gray-900 mb-2">4 Pages</div>
                            <div className="text-sm text-gray-600 mb-3">Perfect for small collections</div>
                            <div className="text-xs text-gray-500 mb-2">Requires 8-16 images</div>
                            {selectedSize === "4" && (
                              <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                                <p className="text-xs font-medium text-blue-800">✓ Selected</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 relative ${
                            selectedSize === "8"
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                          onClick={() => handlePageCountSelection("8")}
                        >
                          <div className="text-center">
                            {selectedSize === "8" && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                            <div className="text-2xl font-bold text-gray-900 mb-2">8 Pages</div>
                            <div className="text-sm text-gray-600 mb-3">Great for larger collections</div>
                            <div className="text-xs text-gray-500 mb-2">Requires 16-34 images</div>
                            {selectedSize === "8" && (
                              <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                                <p className="text-xs font-medium text-blue-800">✓ Selected</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Mobile Selection Status */}
                      {pageCountSelected && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-800">{selectedSize}-Page Album Selected</p>
                              <p className="text-xs text-green-600 mt-1">
                                Ready to upload {selectedSize === "4" ? "8-16" : "16-34"} images
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 2: Image Upload Status - Only show after page count selection */}
                  {imageUploadEnabled && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Uploaded Images</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowPageCountSelection(true);
                              setImageUploadEnabled(false);
                              setPageCountSelected(false);
                              setSelectedSize("");
                              setFileList([]);
                              setCalculatedPrice(null);
                              setSelectedPricingRule(null);
                              setImageCountValidation({
                                isValid: false,
                                message: "",
                                minRequired: 0,
                                maxAllowed: 0,
                              });
                            }}
                            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-300 rounded-lg hover:bg-blue-50 transition-all duration-200"
                          >
                            ← Change Page Count
                          </button>
                          <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                            Selected: {selectedSize} Pages
                          </div>
                        </div>
                      </div>

                      {/* Current Selection Summary */}
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-center">
                          <p className="text-sm font-medium text-blue-900">{selectedSize}-Page Album Selected</p>
                          <p className="text-xs text-blue-700">
                            Requires {selectedSize === "4" ? "8-16" : "16-34"} images
                          </p>
                        </div>
                      </div>

                      {/* Image Count Validation - Only show on desktop (xl screens) */}
                      <div className="hidden xl:block">
                        {fileList.length > 0 && (
                          <div
                            className={`mb-4 p-4 rounded-lg ${
                              imageCountValidation.isValid
                                ? "bg-green-50 border border-green-200"
                                : "bg-yellow-50 border border-yellow-200"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-4 h-4 rounded-full mr-3 ${
                                  imageCountValidation.isValid ? "bg-green-500" : "bg-yellow-500"
                                }`}
                              ></div>
                              <div>
                                <p
                                  className={`text-sm font-medium ${
                                    imageCountValidation.isValid ? "text-green-800" : "text-yellow-800"
                                  }`}
                                >
                                  {imageCountValidation.message}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  Uploaded: {fileList.length} images | Required: {imageCountValidation.minRequired}-
                                  {imageCountValidation.maxAllowed} images
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mobile Image Count Validation - Show in mobile view */}
                      <div className="xl:hidden">
                        <div
                          className={`mt-4 p-3 rounded-lg ${
                            fileList.length === 0
                              ? "bg-blue-50 border border-blue-200"
                              : imageCountValidation.isValid
                              ? "bg-green-50 border border-green-200"
                              : "bg-yellow-50 border border-yellow-200"
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-2 ${
                                fileList.length === 0
                                  ? "bg-blue-500"
                                  : imageCountValidation.isValid
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }`}
                            ></div>
                            <div>
                              {fileList.length === 0 ? (
                                <p className="text-xs font-medium text-blue-800">Ready to upload images</p>
                              ) : (
                                <p
                                  className={`text-xs font-medium ${
                                    imageCountValidation.isValid ? "text-green-800" : "text-yellow-800"
                                  }`}
                                >
                                  {imageCountValidation.message}
                                </p>
                              )}
                              <p className="text-xs text-gray-600 mt-1">
                                {fileList.length === 0
                                  ? `Required: ${imageCountValidation.minRequired}-${imageCountValidation.maxAllowed} images`
                                  : `Uploaded: ${fileList.length} images | Required: ${imageCountValidation.minRequired}-${imageCountValidation.maxAllowed} images`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {selectedSize && (
                          <div className="space-y-4">
                            <h4 className="text-base font-semibold text-gray-900">File Selection</h4>
                            <ImageSection
                              uploadedImages={fileList}
                              setUploadedImages={setFileList}
                              selectedSize={selectedSize === "4" ? "8-16" : "16-34"}
                              setSelectedSize={setSelectedSize}
                              maxAllowed={imageCountValidation.maxAllowed}
                              showUploadButton={true}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Size Selection - Only show after file upload */}
                  {showSizeSelection && fileList.length > 0 && imageCountValidation.isValid && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Album Specifications</h3>
                      <p className="text-sm text-gray-600 mb-4">Confirm your album specifications</p>

                      {!showSizeOptions ? (
                        <button
                          onClick={() => setShowSizeOptions(true)}
                          className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
                        >
                          <span className="text-gray-700 font-medium">{selectedSize || "Click to select size"}</span>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-base font-semibold text-gray-900">Album Page Count</h4>
                            <button
                              onClick={() => setShowSizeOptions(false)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="space-y-3">{memoizedSizeOptions}</div>
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
                  {selectedSize && fileList.length > 0 && imageCountValidation.isValid && (
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
                                <span className="font-medium text-gray-900">Onam Memories Album</span>
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
                                <span className="text-gray-600">Page Count</span>
                                <span className="font-medium text-gray-900">{selectedSize} pages</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Quantity</span>
                                <span className="font-medium text-gray-900">{selectedQuantity || 1}</span>
                              </div>
                            </div>
                          </div>

                          {/* Pricing */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Pricing</h4>
                            <div className="space-y-2">
                              {calculatedPrice ? (
                                <>
                                  <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg px-3">
                                    <span className="text-lg font-semibold text-gray-900">Total Price</span>
                                    <span className="text-lg font-bold text-gray-900">₹{calculatedPrice.toFixed(2)}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 text-center">
                                    Price for {selectedQuantity} images in {selectedSize}-page album
                                  </div>
                                </>
                              ) : (
                                <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg px-3">
                                  <span className="text-lg font-semibold text-gray-900">Total Price</span>
                                  <span className="text-lg font-bold text-gray-900 ">Price not available</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Proceed to Cart Button */}
                  {selectedSize && fileList.length > 0 && imageCountValidation.isValid && (
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
            name: "Onam Memories Album",
            size: selectedSize,
            quantity: selectedQuantity || 1,
            price: calculatedPrice || 0,
          }}
        />
      )}
    </div>
  );
};

export default ProductUpload;

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
import CartProceedPopUp from "@/components/CartProceedPopUp";
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
    const productDetails = product;
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [sqftRange, setSqftRange] = useState<number | null>(null);
    const [selectedPricingRule, setSelectedPricingRule] = useState<CanvasPricingRule | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(null);
    const [showCartPopUp, setShowCartPopUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const isAddToCartDisabled = !selectedPricingRule || !uploadedDocumentId;
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
    router.push("/Cart");
  };

  const handleClosePopUp = () => {
    setShowCartPopUp(false);
  };

    const handleUploadSuccess = (documentId: number, file?: File, name?: string) => {
      setUploadedDocumentId(documentId);
      if (file) {
        setUploadedFile(file);
        setFileName(name || file.name);
        const fileUrl = URL.createObjectURL(file);
        setPdfUrl(fileUrl);
      }
    };

    useEffect(() => {
        if (!productDetails || sqftRange === null) {
            setSelectedPrice(0);
            setSelectedPricingRule(null);
            return;
        }
        const pricingRule = findCanvasPricingRule(productDetails.CanvasPricingRules, sqftRange);
        setSelectedPricingRule(pricingRule);
        setSelectedPrice(pricingRule ? pricingRule.PricePerSquareFoot * sqftRange : 0);
    }, [sqftRange, productDetails]);

    const processPendingCartItem = async () => {
      try {
        const pendingItem = sessionStorage.getItem("pendingCartItem");
        if (pendingItem) {
          const item = JSON.parse(pendingItem);
          await addToCartCanvasPrinting(
            item.productId,
            item.pricingRule,
            item.sqftRange,
            item.documentId
          );
          sessionStorage.removeItem("pendingCartItem");
          incrementCart();
        }
      } catch (error) {
        showErrorToast("Failed to add item to cart");
      }
    };

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
      if (!uploadedDocumentId || !selectedPricingRule) {
        showErrorToast("Please upload a file and select size first");
        return;
      }

      setIsLoading(true);
      try {
        const cartItem = {
          productId: dataId,
          documentId: uploadedDocumentId,
          sqftRange: sqftRange,
          price: selectedPrice,
          pricingRule: selectedPricingRule,
        };

        if (isLoggedIn()) {
          await addToCartCanvasPrinting(
            dataId,
            selectedPricingRule,
            sqftRange || 0,
            uploadedDocumentId
          );
          incrementCart();
          toast.success("Product added to cart successfully!");
          router.push("/Cart");
        } else {
          sessionStorage.setItem("pendingCartItem", JSON.stringify(cartItem));
          router.push("/Cart");
        }
      } catch (error) {
        showErrorToast("Failed to proceed to cart");
      } finally {
        setIsLoading(false);
      }
    };

    const validateSelections = () => {
      const missingItems = [];
      
      if (!uploadedFile) {
        missingItems.push("File upload");
      }
      
      if (!sqftRange) {
        missingItems.push("Size selection");
      }
      
      return missingItems;
    };

    const handleValidationError = (missingItems: string[]) => {
      const message = `Please complete the following: ${missingItems.join(", ")}`;
      showErrorToast(message);
    };

    const handleProceedToCartWithValidation = async () => {
      const missingItems = validateSelections();
      
      if (missingItems.length > 0) {
        handleValidationError(missingItems);
          return;
        }

      if (selectedPrice === 0 || selectedPrice === null) {
        showErrorToast("Unable to calculate price. Please check your selections and try again.");
          return;
        }

      if (!uploadedFile) {
        showErrorToast("Please upload a document before proceeding");
        return;
      }

      if (isLoggedIn()) {
        await handleAddToCart();
        setShowCartPopUp(true);
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
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Canvas Printing</h1>
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

                  {/* Step 2: Size Selection - Only show after upload */}
                  {uploadedFile && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Canvas Size</h3>
                      <p className="text-sm text-gray-600 mb-4">Select your preferred canvas size</p>
                      
                      <DropDown
                        onSqftChange={setSqftRange}
                      />
                    </div>
                  )}

                {/* Error Message */}
                {uploadedFile && errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{errorMessage}</p>
                  </div>
                )}

                {/* Order Summary - Only show after all selections are made */}
                {uploadedFile && selectedPricingRule && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                    
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="space-y-4">
                        {/* Product Info */}
                        <div className="border-b border-gray-200 pb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Product Details</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Product</span>
                              <span className="font-medium text-gray-900">Canvas Printing</span>
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
                              <span className="text-gray-600">Canvas Size</span>
                              <span className="font-medium text-gray-900">{sqftRange} sq ft</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Price per sq ft</span>
                              <span className="font-medium text-gray-900">₹{selectedPricingRule?.PricePerSquareFoot}</span>
                            </div>
                          </div>
                        </div>

                        {/* Pricing */}
                        {selectedPrice && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Pricing</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg px-3">
                                <span className="text-lg font-semibold text-gray-900">Total Price</span>
                                <span className="text-lg font-bold text-gray-900">₹{selectedPrice.toFixed(2)}</span>
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
                    onClick={handleAddToCart}
                    disabled={isAddToCartDisabled}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                     isAddToCartDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {selectedPrice ? `Proceed to Cart - ₹${selectedPrice.toFixed(2)}` : "Proceed to Cart"}
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
            name: "Canvas Printing",
              size: `${sqftRange} sq ft`,
            price: selectedPrice || undefined
          }}
        />
      )}
    </div>
  );
};

export default ProductUpload;
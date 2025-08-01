"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DropDown from "./DropDoun";
import AddOnService from "./AddOnService";
import FileUploader from "./fileupload";
import { fetchProductDetails } from "@/utils/api";
import {
  Addon,
  PaperPrintingPricingRule,
  Product,
} from "@/app/models/products";
import { findPricingRule, findAddonPrice } from "@/utils/priceFinder";
import { validatePrintSelection } from "@/utils/validatePrint";
import PriceCalculator from "./PriceCalculator";
import { addToCartPaperPrint } from "@/utils/cart";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCartStore } from "@/utils/store/cartStore";
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
const [selectedOption, setSelectedOption] = useState<"" | "B/W" | "Color">("");
  const productDetails = product;
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [noOfCopies, setNoOfCopies] = useState<number>(0);
  const [pageCount, setPageCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(null);
  const [selectedBindingType, setSelectedBindingType] = useState("");
  const [selectedBinderColor, setSelectedBinderColor] = useState("");
  const [copySelection, setCopySelection] = useState<string>("");
  const [customCopies, setCustomCopies] = useState<number>(0);
  const [selectedPricingRule, setSelectedPricingRule] = useState<PaperPrintingPricingRule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddonRule, setSelectedAddonRule] = useState<Addon | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState<boolean>(false);
  const [showCopiesInput, setShowCopiesInput] = useState<boolean>(false);
  const [showSizeButton, setShowSizeButton] = useState<boolean>(false);
  const [showSizeOptions, setShowSizeOptions] = useState<boolean>(false);
  const [showBindingQuestion, setShowBindingQuestion] = useState<boolean>(false);
  const [bindingChoice, setBindingChoice] = useState<"yes" | "no" | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const router = useRouter();
  const incrementCart = useCartStore((state) => state.incrementCart);

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem("jwtToken");
    return !!token;
  };

  const handleCopySelectionChange = (value: string) => {
    setCopySelection(value);
    // Automatically set binding choice to "yes" when copy selection is made
    if (value === "all" || (value === "custom" && customCopies > 0)) {
      setBindingChoice("yes");
      // Auto scroll to addon section after a short delay
      setTimeout(() => {
        const addonSection = document.getElementById('addon-section');
        if (addonSection) {
          addonSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  const handleCustomCopiesChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    setCustomCopies(isNaN(parsedValue) ? 0 : parsedValue);
    // Automatically set binding choice to "yes" when custom copies are entered
    if (parsedValue > 0) {
      setBindingChoice("yes");
      // Auto scroll to addon section after a short delay
      setTimeout(() => {
        const addonSection = document.getElementById('addon-section');
        if (addonSection) {
          addonSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  const handleBindingTypeChange = (bindingType: string) => {
    console.log("Selected Binding Type:", bindingType);
    setSelectedBindingType(bindingType);
  };

  const handleBinderColorChange = (binderColor: string) => {
    setSelectedBinderColor(binderColor);
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

  // Validate Printing Rules
  useEffect(() => {
    const error = validatePrintSelection(
      selectedSize,
      selectedOption,
      pageCount,
    );
    setErrorMessage(error);
  }, [selectedSize, selectedOption, pageCount]);

  // Function to get the correct pricing rule
  useEffect(() => {
    console.log("useEffect triggered");
    if (!productDetails || !selectedSize || !selectedOption || !pageCount)
      return;

    if (errorMessage) {
      console.warn("Pricing rule not fetched due to validation error.");
      return;
    }

    const mappedColor = selectedOption === "B/W" ? "BlackAndWhite" : "Color";

    const pricingRule = findPricingRule(
      productDetails.PaperPrintingPricingRules,
      selectedSize,
      mappedColor,
      pageCount,
    );

    setSelectedPricingRule(pricingRule);
    console.log("**********PricingRule**********", pricingRule);

    if (pricingRule) {
      console.log("Matched Pricing Rule:", pricingRule);
    } else {
      console.warn("No matching pricing rule found.");
    }

    const addonRule = selectedBindingType
      ? findAddonPrice(
          productDetails.Addons,
          selectedBindingType,
          selectedSize,
          mappedColor,
          pageCount,
        )
      : null;

    setSelectedAddonRule(addonRule);
    console.log("Addon Rule:", addonRule);
  }, [selectedSize, selectedOption, productDetails, pageCount, errorMessage, selectedBindingType]);

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
      pageCount: pendingPageCount,
      selectedBindingType: pendingBindingType,
      selectedAddonRule: pendingAddonRule,
      addonBookCount: pendingAddonBookCount,
      noOfCopies: pendingNoOfCopies,
      uploadedDocumentId: pendingUploadedDocumentId,
    } = JSON.parse(pendingCartItem);

    try {
      await addToCartPaperPrint(
        pendingDataId,
        pendingPricingRule,
        pendingPageCount,
        pendingNoOfCopies,
        pendingBindingType,
        pendingAddonRule,
        pendingAddonBookCount,
        pendingUploadedDocumentId
      );
      sessionStorage.removeItem("pendingCartItem");
      router.push("/Cart");
    } catch (error) {
      setErrorMessage("Failed to process pending cart item. Please try again.");
    }
  };

  const getApiPageCount = () => {
    if (selectedSize && selectedSize.toUpperCase().includes("DOUBLE SIDE")) {
      return Math.ceil(pageCount / 2);
    }
    return pageCount;
  };

  const handleAddToCart = async () => {
    setIsLoading(true);

    const apiPageCount = getApiPageCount();

    if (!isLoggedIn()) {
      const pendingItem = {
        dataId,
        productType: "paperprinting",
        selectedPricingRule,
        pageCount: apiPageCount,
        selectedBindingType,
        selectedAddonRule,
        addonBookCount:
          copySelection === "all" ? noOfCopies : customCopies || 0,
        uploadedDocumentId,
      };
      sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
      toast.success("Product added to cart!");
      router.push(`/auth/signin?redirect=/`);
      setIsLoading(false);
      return;
    }

    const addonBookCount =
      copySelection === "all" ? noOfCopies : customCopies || 0;
    const addonDetails = {
      addons: productDetails?.Addons || [],
      selectedBindingType,
      selectedSize,
      selectedColor: selectedOption,
      pageCount: apiPageCount,
      addonBookCount,
    };

    try {
      await addToCartPaperPrint(
        dataId,
        selectedPricingRule!,
        apiPageCount,
        noOfCopies,
        selectedBindingType,
        selectedAddonRule,
        addonBookCount,
        uploadedDocumentId ?? undefined
      );
      toast.success("Product added to cart!");
      incrementCart();
      router.push("/");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
    setIsLoading(false);
  };

  const handleProceedToCart = async () => {
    setIsLoading(true);

    const apiPageCount = getApiPageCount();

    if (!isLoggedIn()) {
      const pendingItem = {
        dataId,
        productType: "paperprinting",
        selectedPricingRule,
        pageCount: apiPageCount,
        selectedBindingType,
        selectedAddonRule,
        noOfCopies,
        addonBookCount:
          copySelection === "all" ? noOfCopies : customCopies || 0,
        uploadedDocumentId,
      };
      sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
      router.push(`/auth/signin?redirect=/Cart`);
      setIsLoading(false);
      return;
    }

    const addonBookCount =
      copySelection === "all" ? noOfCopies : customCopies || 0;
   
      const addonDetails = {
      addons: productDetails?.Addons || [],
      selectedBindingType,
      selectedSize,
      selectedColor: selectedOption,
      pageCount: apiPageCount,
      addonBookCount,
    };

    try {
      await addToCartPaperPrint(
        dataId,
        selectedPricingRule!,
        apiPageCount,
        noOfCopies,
        selectedBindingType,
        selectedAddonRule,
        addonBookCount,
        uploadedDocumentId ?? undefined
      );
      toast.success("Product added to cart!");
      router.push("/Cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn()) {
      processPendingCartItem();
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.size-dropdown')) {
        setIsSizeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle progressive display
  useEffect(() => {
    if (selectedOption) {
      setShowCopiesInput(true);
      // Auto scroll to copies input after a short delay
      setTimeout(() => {
        const copiesSection = document.getElementById('copies-section');
        if (copiesSection) {
          copiesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    } else {
      setShowCopiesInput(false);
      setShowSizeButton(false);
      setShowSizeOptions(false);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (noOfCopies > 0) {
      setShowSizeButton(true);
      // Auto scroll to size button after a short delay
      setTimeout(() => {
        const sizeSection = document.getElementById('size-section');
        if (sizeSection) {
          sizeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    } else {
      setShowSizeButton(false);
      setShowSizeOptions(false);
      setShowBindingQuestion(false);
      setBindingChoice(null);
    }
  }, [noOfCopies]);

  // Show binding question after size selection (only if no copy selection has been made)
  useEffect(() => {
    if (selectedSize && noOfCopies > 0 && !showSizeOptions && !copySelection && customCopies === 0) {
      setShowBindingQuestion(true);
      // Auto scroll to binding question after a short delay
      setTimeout(() => {
        const bindingSection = document.getElementById('binding-section');
        if (bindingSection) {
          bindingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    } else {
      setShowBindingQuestion(false);
    }
  }, [selectedSize, noOfCopies, showSizeOptions, copySelection, customCopies]);

  const isAddToCartDisabled = !uploadedDocumentId || !selectedSize || !selectedOption || !noOfCopies || isLoading;

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
                 <p className="text-gray-600">Upload your PDF to see a preview</p>
               </div>
               
               {/* Upload Area */}
               <div className="flex-1 flex flex-col items-center justify-center w-full">
                 {!uploadedFile ? (
                   <div className="w-full max-w-md">
                     <FileUploader 
                       onUploadSuccess={handleUploadSuccess} 
                       pageCount={pageCount} 
                       setPageCount={setPageCount} 
                     />
                   </div>
                 ) : (
                   <div className="w-full max-w-md">
                     {/* File Info */}
                     <div className="bg-white rounded-lg p-4 mb-4 shadow-sm w-full">
                       <div className="flex items-center justify-between">
                         <div>
                           <h3 className="font-semibold text-gray-900">{fileName}</h3>
                           <p className="text-sm text-gray-600">{pageCount} pages</p>
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

                     {/* Selected Details */}
                     {(selectedOption || selectedSize || noOfCopies > 0 || bindingChoice) && (
                       <div className="bg-white rounded-lg p-4 shadow-sm mt-4 w-full">
                         <h3 className="font-semibold text-gray-900 mb-3">Selected Details</h3>
                         <div className="space-y-2 text-sm">
                           {selectedOption && (
                             <div className="flex justify-between">
                               <span className="text-gray-600">Print Type:</span>
                               <span className="font-medium text-gray-900">{selectedOption}</span>
                             </div>
                           )}
                           {noOfCopies > 0 && (
                             <div className="flex justify-between">
                               <span className="text-gray-600">Copies:</span>
                               <span className="font-medium text-gray-900">{noOfCopies}</span>
                             </div>
                           )}
                           {selectedSize && (
                             <div className="flex justify-between">
                               <span className="text-gray-600">Paper Size:</span>
                               <span className="font-medium text-gray-900">{selectedSize}</span>
                             </div>
                           )}
                           {bindingChoice && (
                             <div className="flex justify-between">
                               <span className="text-gray-600">Binding:</span>
                               <span className="font-medium text-gray-900">
                                 {bindingChoice === "yes" ? "Yes" : "No"}
                               </span>
                             </div>
                           )}
                           {bindingChoice === "yes" && selectedBindingType && (
                             <div className="flex justify-between">
                               <span className="text-gray-600">Binding Type:</span>
                               <span className="font-medium text-gray-900">{selectedBindingType}</span>
                             </div>
                           )}
                           {bindingChoice === "yes" && selectedBindingType === "Hard Binding" && selectedBinderColor && (
                             <div className="flex justify-between">
                               <span className="text-gray-600">Binder Color:</span>
                               <span className="font-medium text-gray-900">{selectedBinderColor}</span>
                             </div>
                           )}
                           {bindingChoice === "yes" && copySelection && (
                             <div className="flex justify-between">
                               <span className="text-gray-600">Binding Copies:</span>
                               <span className="font-medium text-gray-900">
                                 {copySelection === "all" ? "All Copies" : `Custom (${customCopies})`}
                               </span>
                             </div>
                           )}
                           {calculatedPrice && (
                             <div className="flex justify-between border-t pt-2">
                               <span className="text-gray-600 font-semibold">Total Price:</span>
                               <span className="font-bold text-black">₹{calculatedPrice.toFixed(2)}</span>
                             </div>
                           )}
                         </div>
                       </div>
                     )}
                   </div>
                 )}
               </div>
             </div>

                         {/* Right Section - Dynamic Configuration */}
             <div className="p-8 bg-white overflow-y-auto h-screen hide-scrollbar xl:col-span-3">
               <div className="max-w-5xl mx-auto">
                 <div className="text-center mb-8">
                   <h1 className="text-3xl font-bold text-gray-900 mb-2">Paper Print</h1>
                   <p className="text-gray-600">Configure your print settings</p>
                 </div>

                 {/* Configuration Steps */}
                 <div className="space-y-8">
                   
                   {/* Step 1: Color Selection */}
                   <div className="bg-gray-50 rounded-xl p-6">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Print Type</h3>
                     <p className="text-sm text-gray-600 mb-4">Which print type is right for you?</p>
                     
                     <div className="space-y-3">
                       <div
                         className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                           selectedOption === "B/W"
                             ? "border-black bg-gray-100"
                             : "border-gray-200 bg-white hover:border-gray-300"
                         }`}
                         onClick={() => setSelectedOption("B/W")}
                       >
                         <div className="flex items-center justify-between">
                           <div>
                             <div className="font-medium text-gray-900">Black & White</div>
                             <div className="text-sm text-gray-600">Standard printing</div>
                           </div>
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                             selectedOption === "B/W"
                               ? "border-black bg-black"
                               : "border-gray-300"
                           }`}>
                             {selectedOption === "B/W" && (
                               <div className="w-2 h-2 bg-white rounded-full"></div>
                             )}
                           </div>
                         </div>
                       </div>

                       <div
                         className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedOption === "Color"
                             ? "border-black bg-gray-100"
                             : "border-gray-200 bg-white hover:border-gray-300"
                         }`}
                         onClick={() => setSelectedOption("Color")}
                       >
                         <div className="flex items-center justify-between">
                           <div>
                             <div className="font-medium text-gray-900">Color</div>
                             <div className="text-sm text-gray-600">Full color printing</div>
                           </div>
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                             selectedOption === "Color"
                               ? "border-black bg-black"
                               : "border-gray-300"
                           }`}>
                             {selectedOption === "Color" && (
                               <div className="w-2 h-2 bg-white rounded-full"></div>
                             )}
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Step 2: Number of Copies - Only show after color selection */}
                   {showCopiesInput && (
                     <div id="copies-section" className="bg-gray-50 rounded-xl p-6">
                       <h3 className="text-lg font-semibold text-gray-900 mb-4">Number of Copies</h3>
                       <p className="text-sm text-gray-600 mb-4">How many copies do you need?</p>
                       
                       <div className="mb-6">
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Number of Copies
                         </label>
                         <input
                           type="number"
                           min="1"
                           value={noOfCopies || ""}
                           onChange={(e) => setNoOfCopies(parseInt(e.target.value) || 0)}
                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                           placeholder="Enter number of copies"
                         />
                       </div>
                     </div>
                   )}

                   {/* Step 3: Size Selection Button - Only show after copies are entered */}
                   {showSizeButton && !showSizeOptions && (
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

                   {/* Step 3: Size Options - Show when button is clicked */}
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
                         {(productDetails.sizes || []).map((size: string, index: number) => {
                           // Calculate price for this size
                           const mappedColor = selectedOption === "B/W" ? "BlackAndWhite" : "Color";
                           const isDoubleSided = size.toUpperCase().includes("DOUBLE SIDE");
                           const totalSheets = isDoubleSided
                             ? Math.ceil(pageCount / 2) * (noOfCopies || 1)
                             : pageCount * (noOfCopies || 1);
                           
                           const pricingRule = findPricingRule(
                             productDetails.PaperPrintingPricingRules || [],
                             size,
                             mappedColor,
                             totalSheets
                           );
                           
                           const pricePerPage = pricingRule?.PricePerPage || 0;
                           const totalPrice = pricePerPage * totalSheets;
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
                                 setShowSizeOptions(false);
                               }}
                             >
                               <div className="flex items-center justify-between">
                                 <div className="font-medium text-gray-900">
                                   {size}
                                 </div>
                                 <div className="text-right">
                                   {pageCount > 0 && noOfCopies > 0 && pricingRule ? (
                                     <div className="text-sm font-semibold text-gray-900">
                                       ₹{totalPrice.toFixed(2)}
                                     </div>
                                   ) : (
                                     <div className="text-sm text-gray-500">
                                       Select copies
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

                   {/* Step 4: Binding Question - Only show after size selection */}
                   {showBindingQuestion && bindingChoice === null && (
                     <div id="binding-section" className="bg-gray-50 rounded-xl p-6">
                       <h3 className="text-lg font-semibold text-gray-900 mb-4">Binding Feature</h3>
                       <p className="text-sm text-gray-600 mb-6">Do you want binding feature in your printing?</p>
                       
                       <div className="space-y-3">
                         <button
                           onClick={() => {
                             setBindingChoice("yes");
                             // Auto scroll to addon section after a short delay
                             setTimeout(() => {
                               const addonSection = document.getElementById('addon-section');
                               if (addonSection) {
                                 addonSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                               }
                             }, 300);
                           }}
                           className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 text-left"
                         >
                           <div className="flex items-center justify-between">
                             <div>
                               <div className="font-medium text-gray-900">Yes, I want binding</div>
                               <div className="text-sm text-gray-600">Add professional binding to your documents</div>
                             </div>
                             <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                               <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                             </div>
                           </div>
                         </button>

                         <button
                           onClick={() => setBindingChoice("no")}
                           className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-black hover:bg-gray-50 transition-all duration-200 text-left"
                         >
                           <div className="flex items-center justify-between">
                             <div>
                               <div className="font-medium text-gray-900">No, skip binding</div>
                               <div className="text-sm text-gray-600">Proceed directly to cart</div>
                             </div>
                             <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                               <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                             </div>
                           </div>
                         </button>
                       </div>
                     </div>
                   )}

                   {/* Step 5: Add-on Services - Only show after user chooses "Yes" for binding */}
                   {selectedOption && selectedSize && noOfCopies > 0 && !showSizeOptions && bindingChoice === "yes" && (
                     <div id="addon-section" className="bg-gray-50 rounded-xl p-6">
                       <div className="flex items-center justify-between mb-4">
                         <h3 className="text-lg font-semibold text-gray-900">Add-on Services</h3>
                         <button
                                                       onClick={() => {
                              setBindingChoice(null);
                              setSelectedBindingType("");
                              setSelectedBinderColor("");
                              setCopySelection("");
                              setCustomCopies(0);
                            }}
                           className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                           title="Close add-on services"
                         >
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                         </button>
                       </div>
                       <p className="text-sm text-gray-600 mb-4">Optional binding and finishing options</p>
                       
              <AddOnService
                productDetails={productDetails}
                onBindingTypeChange={handleBindingTypeChange}
                onBinderColorChange={handleBinderColorChange}
                onCopySelectionChange={handleCopySelectionChange}
                onCustomCopiesChange={handleCustomCopiesChange}
                pageCount={pageCount}
                paperSize={selectedSize}
                colorType={selectedOption}
                         noOfCopies={noOfCopies}
              />
            </div>
                   )}

                   {/* Error Message */}
                   {errorMessage && (
                     <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                       <p className="text-red-800 text-sm">{errorMessage}</p>
                     </div>
                   )}

                   {/* Price Calculator - Only show after binding choice is made */}
                   {selectedOption && selectedSize && noOfCopies > 0 && !showSizeOptions && bindingChoice !== null && (
                     <div className="bg-gray-50 rounded-xl p-6">
                       <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
            <PriceCalculator
              pricingRules={productDetails.PaperPrintingPricingRules || []}
              addons={productDetails.Addons || []}
              selectedSize={selectedSize}
                         selectedColor={selectedOption || "B/W"}
              pageCount={pageCount}
              noOfCopies={noOfCopies}
              copySelection={copySelection}
                         customCopies={customCopies}
              selectedBindingType={selectedBindingType}
              onPriceUpdate={(price) => setCalculatedPrice(price)}
            />
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
                  if (!selectedOption) missing.push("color type");
                  if (!noOfCopies || noOfCopies <= 0) missing.push("number of copies");
                  if (missing.length > 0) {
                    showErrorToast("Please select: " + missing.join(", "));
                    return;
                  }
                  handleAddToCart();
                }}
                    disabled={isAddToCartDisabled}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                      isAddToCartDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    Add to Cart
              </button>

              <button
                onClick={() => {
                  const missing = [];
                  if (!uploadedDocumentId) missing.push("document upload");
                  if (!selectedSize) missing.push("paper size");
                  if (!selectedOption) missing.push("color type");
                  if (!noOfCopies || noOfCopies <= 0) missing.push("number of copies");
                  if (missing.length > 0) {
                    showErrorToast("Please select: " + missing.join(", "));
                    return;
                  }
                  handleProceedToCart();
                }}
                    disabled={isAddToCartDisabled}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 border-2 ${
                      isAddToCartDisabled
                        ? "border-gray-300 text-gray-500 cursor-not-allowed"
                        : "border-black text-black hover:bg-gray-50"
                    }`}
                  >
                    {calculatedPrice ? `Proceed to Cart - ₹${calculatedPrice.toFixed(2)}` : "Proceed to Cart"}
              </button>
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

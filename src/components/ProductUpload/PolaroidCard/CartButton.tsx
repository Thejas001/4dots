import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loader from "@/components/common/Loader";
import { addToCartPolaroidCard } from "@/utils/cart";
import toast from "react-hot-toast";
import { useCartStore } from "@/utils/store/cartStore";
import CartProceedPopUp from "@/components/CartProceedPopUp";

interface CartButtonProps {
  selectedPricingRule: any;
  dataId: number;
  uploadedImages: any[];
  selectedSize: string;
  calculatedPrice?: number;
}

const CartButton: React.FC<CartButtonProps> = ({
  selectedPricingRule,
  dataId,
  uploadedImages,
  selectedSize,
  calculatedPrice,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCartPopUp, setShowCartPopUp] = useState(false);
  const incrementCart = useCartStore((state) => state.incrementCart);

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

  const isAddToCartDisabled =
    !selectedPricingRule ||
    !uploadedImages ||
    uploadedImages.length === 0 ||
    isLoading; // disable while loading

  // Process pending cart item
  const processPendingCartItem = async () => {
    const pendingCartItem = sessionStorage.getItem("pendingCartItem");
    if (!pendingCartItem) return;

    const {
      dataId: pendingDataId,
      selectedPricingRule: pendingPricingRule,
      selectedQuantity: pendingQuantity,
      uploadedDocumentIds: pendingDocumentIds,
    } = JSON.parse(pendingCartItem);

    try {
      setIsLoading(true);
      await addToCartPolaroidCard(
        pendingDataId,
        pendingPricingRule,
        Number(pendingQuantity),
        pendingDocumentIds
      );
      sessionStorage.removeItem("pendingCartItem");
      incrementCart();
      toast.success("Product added to cart!");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/Cart");
    } catch (error) {
      setErrorMessage("Failed to process pending cart item. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      const pendingCartItem = sessionStorage.getItem("pendingCartItem");
      if (pendingCartItem) {
        processPendingCartItem();
      }
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      const currentPath = pathname;
      const interval = setInterval(() => {
        if (window.location.pathname !== currentPath) {
          setIsLoading(false);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading, pathname]);

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

  // Add a function to check missing options
  const getMissingOptions = () => {
    const missing = [];
    if (!selectedSize) missing.push("size");
    if (!uploadedImages || uploadedImages.length === 0) missing.push("image upload");
    return missing;
  };

  const handleAddToCart = async () => {
    if (!selectedPricingRule) {
      showErrorToast("Please select all required options before continuing.");
      return;
    }
    try {
      setIsLoading(true);
      let documentIds: number[] = [];
      for (const image of uploadedImages) {
        if (!image.originFileObj) continue;
        const formData = new FormData();
        formData.append("document", image.originFileObj);
        const response = await fetch(
          "https://fourdotsapp.azurewebsites.net/api/document/upload",
          { method: "POST", body: formData }
        );
        if (!response.ok) throw new Error("Image upload failed");
        const result = await response.json();
        if (result?.Data?.Id) {
          documentIds.push(result.Data.Id);
        } else {
          console.error("❌ No document ID found in API response:", result);
        }
      }
      if (!isLoggedIn()) {
        const pendingItem = {
          productType: "polaroidCard",
          dataId,
          selectedPricingRule,
          selectedQuantity: uploadedImages.length,
          uploadedDocumentIds: documentIds,
        };
        sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
        router.push(`/auth/signin?redirect=/`);
        toast.success("Product added to cart!");
        return;
      }
      await addToCartPolaroidCard(
        dataId,
        selectedPricingRule,
        uploadedImages.length,
        documentIds
      );
      sessionStorage.removeItem("pendingCartItem");
      incrementCart();
      toast.success("Product added to cart!");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/");
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
      setIsLoading(false);
    }
  };

  const handleProceedToCart = async () => {
    if (!selectedPricingRule) {
      showErrorToast("Please select all required options before continuing.");
      return;
    }
    try {
      setIsLoading(true);
      const uploadPromises = uploadedImages.map(async (image) => {
        if (!image.originFileObj) return null;
        const formData = new FormData();
        formData.append("document", image.originFileObj);
        const response = await fetch(
          "https://fourdotsapp.azurewebsites.net/api/document/upload",
          { method: "POST", body: formData }
        );
        if (!response.ok) throw new Error("Image upload failed");
        const result = await response.json();
        return result?.Data?.Id ?? null;
      });
      const documentIds = (await Promise.all(uploadPromises)).filter(
        (id) => id !== null
      );
      if (!isLoggedIn()) {
        const pendingItem = {
          productType: "polaroidCard",
          dataId,
          selectedPricingRule,
          selectedQuantity: uploadedImages.length,
          uploadedDocumentIds: documentIds,
        };
        sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
        router.push(`/auth/signin?redirect=/Cart`);
        return;
      }
      await addToCartPolaroidCard(
        dataId,
        selectedPricingRule,
        uploadedImages.length,
        documentIds
      );
      sessionStorage.removeItem("pendingCartItem");
      toast.success("Product added to cart!");
      
      // Show popup for logged-in users instead of directly going to cart
      setShowCartPopUp(true);
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70">
          <Loader />
        </div>
      )}
      <div className="mt-4 flex flex-1 flex-col justify-center">
        <button
          onClick={() => {
            const missing = getMissingOptions();
            if (missing.length > 0) {
              showErrorToast("Please select: " + missing.join(", "));
              return;
            }
            handleProceedToCart();
          }}
          className={`relative flex h-[44px] w-full items-center justify-center rounded-[48px] text-lg cursor-pointer bg-[#242424] text-white ${isAddToCartDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="pr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="white"
            >
              <path
                d="M14.1667 5.50016V3.8335H5V5.50016H7.91667C9.00167 5.50016 9.9175 6.1985 10.2625 7.16683H5V8.8335H10.2625C10.0919 9.31979 9.77463 9.74121 9.3545 10.0397C8.93438 10.3382 8.43203 10.4991 7.91667 10.5002H5V12.5118L9.655 17.1668H12.0117L7.01167 12.1668H7.91667C8.87651 12.1651 9.80644 11.8327 10.5499 11.2255C11.2933 10.6184 11.8048 9.77363 11.9983 8.8335H14.1667V7.16683H11.9983C11.8715 6.56003 11.6082 5.99007 11.2283 5.50016H14.1667Z"
                fill="white"
              />
            </svg>
          </span>
          <span className="font-bold">{calculatedPrice}</span>
          <span className="pl-4 font-medium">Proceed To Cart</span>
        </button>

        {errorMessage && (
          <div className="mt-2 text-sm text-red-500">{errorMessage}</div>
        )}
      </div>
      
      {showCartPopUp && (
        <CartProceedPopUp
          onContinueShopping={handleContinueShopping}
          onProceedToPayment={handleProceedToPayment}
          onClose={handleClosePopUp}
          productInfo={{
            name: "Polaroid Card",
            size: selectedSize,
            quantity: uploadedImages.length || undefined,
            price: calculatedPrice || undefined
          }}
        />
      )}
    </>
  );
};

export default CartButton;

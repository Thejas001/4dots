import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loader from "@/components/common/Loader";
import { addToCartPhotoFrame } from "@/utils/cart";
import toast from "react-hot-toast";
import { useCartStore } from "@/utils/store/cartStore";
import CartProceedPopUp from "@/components/CartProceedPopUp";

interface CartButtonProps {
  selectedQuantity: number | null;
  calculatedPrice: number | null;
  selectedPricingRule: any;
  dataId: number;
  uploadedImages: any[];
  selectedFrameColor: string;
  selectedSize: string;
}

const CartButton: React.FC<CartButtonProps> = ({
  selectedQuantity,
  calculatedPrice,
  selectedPricingRule,
  dataId,
  uploadedImages,
  selectedFrameColor,
  selectedSize,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const incrementCart = useCartStore((state) => state.incrementCart);
  const [showCartPopUp, setShowCartPopUp] = useState(false);

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

  const isAddToCartDisabled =
    !selectedPricingRule ||
    !uploadedImages ||
    uploadedImages.length === 0 ||
    !selectedFrameColor ||
    isLoading;

  const processPendingCartItem = async () => {
    const pendingCartItem = sessionStorage.getItem("pendingCartItem");
    if (!pendingCartItem) return;

    const {
      dataId: pendingDataId,
      selectedPricingRule: pendingPricingRule,
      selectedQuantity: pendingQuantity,
      documentIds: pendingDocumentIds,
      selectedFrameColor: pendingFrameColor,
    } = JSON.parse(pendingCartItem);

    try {
      setIsLoading(true);
      await addToCartPhotoFrame(
        pendingDataId,
        pendingPricingRule,
        Number(pendingQuantity),
        pendingDocumentIds,
        pendingFrameColor
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

  const getMissingOptions = () => {
    const missing = [];
    if (!selectedSize) missing.push("size");
    if (!selectedQuantity || selectedQuantity <= 0) missing.push("quantity");
    if (!selectedFrameColor) missing.push("frame color");
    if (!uploadedImages || uploadedImages.length === 0) missing.push("image upload");
    return missing;
  };

  const handleAddToCart = async () => {
    if (!selectedPricingRule || !selectedQuantity) {
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
          "https://fourdotsapp-prod.azurewebsites.net/api/document/upload",
          { method: "POST", body: formData }
        );

        if (!response.ok) throw new Error("Image upload failed");

        const result = await response.json();
        if (result?.Data?.Id) {
          documentIds.push(result.Data.Id);
        } else {
        }
      }

      if (!isLoggedIn()) {
        const pendingItem = {
          productType: "photoFrame",
          dataId,
          selectedPricingRule,
          selectedQuantity,
          documentIds,
          selectedFrameColor,
        };
        sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
        router.push(`/auth/signin?redirect=/`);
        toast.success("Product added to cart!");
        return;
      }

      await addToCartPhotoFrame(
        dataId,
        selectedPricingRule,
        Number(selectedQuantity),
        documentIds,
        selectedFrameColor
      );

      sessionStorage.removeItem("pendingCartItem");
      incrementCart();
      toast.success("Product added to cart!");
      await new Promise((resolve) => setTimeout(resolve, 1000));
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

      <div className="mt-4 flex flex-1 flex-col md:flex-row justify-center gap-2 md:gap-4">
        <button
          onClick={() => {
            const missing = getMissingOptions();
            if (missing.length > 0) {
              showErrorToast("Please select: " + missing.join(", "));
              return;
            }
            handleAddToCart();
          }}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
            isAddToCartDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
          }`}
        >
          {calculatedPrice ? `Proceed to Cart - ₹${calculatedPrice.toFixed(2)}` : "Proceed to Cart"}
        </button>

        {errorMessage && <div className="mt-2 text-sm text-red-500">{errorMessage}</div>}
      </div>

      {showCartPopUp && (
        <CartProceedPopUp
          onContinueShopping={handleContinueShopping}
          onProceedToPayment={handleProceedToPayment}
          onClose={handleClosePopUp}
          productInfo={{
            name: "Paper Printing",
            size: selectedSize,
            quantity: selectedQuantity ?? undefined,
            price: calculatedPrice ?? undefined,
          }}
        />
      )}
    </>
  );
};

export default CartButton;

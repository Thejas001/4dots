import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loader from "@/components/common/Loader";
import { addToCartPolaroidCard } from "@/utils/cart";
import toast from "react-hot-toast";
import { useCartStore } from "@/utils/store/cartStore";
import CartProceedPopUp from "@/components/CartProceedPopUp";
import UploadProgress from "@/components/UploadToast";

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

  const [showUploadToast, setShowUploadToast] = useState(false);
const [uploadedCount, setUploadedCount] = useState(0);
const [totalCount, setTotalCount] = useState(0);

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
    isLoading;

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

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      if (!selectedPricingRule || !selectedSize) {
        showErrorToast("Please select a size");
        setIsLoading(false);
        return;
      }

      if (!uploadedImages || uploadedImages.length === 0) {
        showErrorToast("Please upload at least one image");
        setIsLoading(false);
        return;
      }

const uploadedFileList = await Promise.all(
  uploadedImages.map(async (file, index) => {
    if (!file.documentId && file.originFileObj) {
      if (!showUploadToast) setShowUploadToast(true);
      setTotalCount(uploadedImages.length);

      const formData = new FormData();
      formData.append("document", file.originFileObj);

      const response = await fetch(
        "https://fourdotsapp-prod.azurewebsites.net/api/document/upload",
        { method: "POST", body: formData }
      );
      if (!response.ok) throw new Error("Image upload failed");

      const result = await response.json();

      // increment uploaded count
      setUploadedCount((prev) => prev + 1);

      return { ...file, documentId: result?.Data?.Id ?? null };
    }

    // If already uploaded, count it as done
    setUploadedCount((prev) => prev + 1);
    return file;
  })
);

// hide toast once all uploads are done
setShowUploadToast(false);
setUploadedCount(0);
setTotalCount(0);


      const documentIds = uploadedFileList
        .map((f) => f.documentId)
        .filter((id) => id != null);

      if (documentIds.length === 0) {
        showErrorToast("File upload failed, please try again");
        setIsLoading(false);
        return;
      }

      const quantity = uploadedFileList.length;

      if (!isLoggedIn()) {
        sessionStorage.setItem(
          "pendingCartItem",
          JSON.stringify({
            productType: "polaroidCard",
            dataId,
            selectedPricingRule,
            selectedQuantity: quantity,
            uploadedDocumentIds: documentIds,
          })
        );
        router.push(`/auth/signin?redirect=/Cart`);
        return;
      }

      await addToCartPolaroidCard(dataId, selectedPricingRule, quantity, documentIds);

      incrementCart();
      toast.success("Product added to cart!");
      setShowCartPopUp(true);
    } catch (error) {
      showErrorToast("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mt-4 flex flex-1 flex-col justify-center">
        <button
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            isAddToCartDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {calculatedPrice
            ? `Proceed to Cart - ₹${calculatedPrice.toFixed(2)}`
            : "Proceed to Cart"}
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
            price: calculatedPrice || undefined,
          }}
        />
      )}
<UploadProgress
  isOpen={showUploadToast}
  uploadedCount={uploadedCount}
  totalCount={totalCount}
/>


    </>
  );
};

export default CartButton;
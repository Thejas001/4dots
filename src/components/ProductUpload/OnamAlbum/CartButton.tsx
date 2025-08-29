import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useCartStore } from "@/utils/store/cartStore";
import CartProceedPopUp from "@/components/CartProceedPopUp";
import { addToCartOnamAlbum } from "@/utils/cart";
import UploadProgress from "@/components/UploadToast"; // 👈 import progress bar

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
  const [uploadedCount, setUploadedCount] = useState(0); // 👈 track uploaded files
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

  const isAddToCartDisabled =
    !selectedPricingRule ||
    !uploadedImages ||
    uploadedImages.length === 0 ||
    isLoading;

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
    setUploadedCount(0); // reset count

    try {
      if (!selectedPricingRule) {
        showErrorToast("Please select a size first");
        setIsLoading(false);
        return;
      }

      if (!uploadedImages || uploadedImages.length === 0) {
        showErrorToast("Please upload at least one file");
        setIsLoading(false);
        return;
      }

      // Step 1: Upload images one by one and update progress
      const uploadedFileList = [];
      for (let i = 0; i < uploadedImages.length; i++) {
        const file = uploadedImages[i];
        if (!file.documentId && file.originFileObj) {
          const formData = new FormData();
          formData.append("document", file.originFileObj);
          const response = await fetch(
            "https://fourdotsapp.azurewebsites.net/api/document/upload",
            { method: "POST", body: formData }
          );
          if (!response.ok) throw new Error("Image upload failed");
          const result = await response.json();
          uploadedFileList.push({
            ...file,
            documentId: result?.Data?.Id ?? null,
          });
        } else {
          uploadedFileList.push(file);
        }

        // ✅ update progress as each file finishes
        setUploadedCount(i + 1);
      }

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

      await addToCartOnamAlbum(
        dataId,
        selectedPricingRule,
        quantity,
        documentIds
      );

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
      {/* ✅ Show circular upload progress instead of Loader */}
      {isLoading && (
        <UploadProgress
          isOpen={isLoading}
          uploadedCount={uploadedCount}
          totalCount={uploadedImages.length}
        />
      )}

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
            name: "Onam Memories Album",
            size: selectedSize,
            quantity: uploadedImages.length || undefined,
            price: calculatedPrice || undefined,
          }}
        />
      )}
    </>
  );
};

export default CartButton;

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CartButtonProps } from "@/app/models/CartItems";
import { addToCartPhotoFrame } from "@/utils/cart";

const CartButton: React.FC<CartButtonProps> = ({
  selectedQuantity,
  calculatedPrice,
  selectedPricingRule,
  dataId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem("jwtToken");
    return !!token;
  };

  // Process stored cart item after login
  const processPendingCartItem = async () => {
    const pendingCartItem = sessionStorage.getItem("pendingCartItem");
    if (!pendingCartItem) return;

    const {
      dataId: pendingDataId,
      selectedPricingRule: pendingPricingRule,
      selectedQuantity: pendingQuantity,
    } = JSON.parse(pendingCartItem);

    try {
      await addToCartPhotoFrame(
        pendingDataId,
        pendingPricingRule,
        pendingQuantity as number,
      );
      sessionStorage.removeItem("pendingCartItem");
      router.push("/Cart");
    } catch (error) {
      setErrorMessage("Failed to process pending cart item. Please try again.");
    }
  };

  // Handle adding an item to the cart
  const handleAddToCart = async () => {
    if (!selectedPricingRule) {
      setErrorMessage("Please select all options before adding to the cart.");
      return;
    }

    if (!isLoggedIn()) {
      const pendingItem = {
        productType: "photoFrame",
        dataId,
        selectedPricingRule,
        selectedQuantity,
      };
      sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
      router.push(`/auth/signin?redirect=/Cart`); // ✅ Redirect to cart after login
      return;
    }

    try {
      await addToCartPhotoFrame(
        dataId,
        selectedPricingRule,
        Number(selectedQuantity),
      );
      sessionStorage.removeItem("pendingCartItem");
      router.push("/Cart"); // ✅ Navigate after successful addition
    } catch (error) {
      setErrorMessage("Failed to add to cart. Please try again.");
    }
  };

  // Process pending cart item when user logs in
  useEffect(() => {
    if (isLoggedIn()) {
      processPendingCartItem();
    }
  }, []);

  return (
    <div className="mt-4 flex flex-1 flex-row justify-center gap-4">
      <button
        onClick={handleAddToCart}
        className="flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[48px] bg-[#242424] text-lg text-[#fff] md:w-[378px]"
      >
        <span className="pr-1">🛒</span>
        <span className="text-lg font-medium">Add to Cart</span>
      </button>

      <button
        onClick={handleAddToCart}
        disabled={!selectedQuantity}
        className={`flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[48px] text-lg md:w-[378px] 
          ${selectedQuantity ? "border-2 border-[#242424] bg-[#fff] text-[#242424]" : "cursor-not-allowed bg-gray-300 text-gray-500"}`}
      >
        <span className="pr-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="#242424"
          >
            <path
              d="M14.1667 5.50016V3.8335H5V5.50016H7.91667C9.00167 5.50016 9.9175 6.1985 10.2625 7.16683H5V8.8335H10.2625C10.0919 9.31979 9.77463 9.74121 9.3545 10.0397C8.93438 10.3382 8.43203 10.4991 7.91667 10.5002H5V12.5118L9.655 17.1668H12.0117L7.01167 12.1668H7.91667C8.87651 12.1651 9.80644 11.8327 10.5499 11.2255C11.2933 10.6184 11.8048 9.77363 11.9983 8.8335H14.1667V7.16683H11.9983C11.8715 6.56003 11.6082 5.99007 11.2283 5.50016H14.1667Z"
              fill="black"
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
  );
};

export default CartButton;

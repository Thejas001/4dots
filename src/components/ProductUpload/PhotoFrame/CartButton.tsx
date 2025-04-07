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

    const { dataId: pendingDataId, selectedPricingRule: pendingPricingRule, selectedQuantity: pendingQuantity } = 
      JSON.parse(pendingCartItem);

    try {
      await addToCartPhotoFrame(pendingDataId, pendingPricingRule, pendingQuantity as number);
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
      const pendingItem = {productType: "photoFrame", dataId, selectedPricingRule, selectedQuantity };
      sessionStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
      router.push(`/auth/signin?redirect=/Cart`); // ✅ Redirect to cart after login
      return;
    }
  
    try {
      await addToCartPhotoFrame(dataId, selectedPricingRule, Number(selectedQuantity));
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
    <div className="flex-1 flex flex-row justify-center gap-4 mt-4">
      <button
        onClick={handleAddToCart}
        className="flex justify-center bg-[#242424] text-[#fff] w-full md:w-[378px] h-[44px] rounded-[48px] text-lg items-center cursor-pointer"
      >
        <span className="pr-1">
          🛒
        </span>
        <span className="font-medium text-lg">Add to Cart</span>
      </button>

      <button
        onClick={handleAddToCart}
        disabled={!selectedQuantity}
        className={`flex justify-center w-full md:w-[378px] h-[44px] rounded-[48px] text-lg items-center cursor-pointer 
          ${selectedQuantity ? "bg-[#fff] text-[#242424] border-2 border-[#242424]" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
      >
        <span className="font-bold">{calculatedPrice}</span>
        <span className="font-medium pl-4">Proceed To Cart</span>
      </button>

      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default CartButton;

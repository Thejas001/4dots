import { 
  addToCartPhotoFrame, 
  addToCartPolaroidCard, 
  addToCartOffSetPrinting, 
  addToCartNameSlip, 
  addToCartCanvasPrinting,
  addToCartBusinessCard,
  addToCartPaperPrint,
  addToCart,
  fetchCartItems 
} from "@/utils/cart";
import toast from "react-hot-toast";

export const processPendingCartItem = async (setCartData: (cart: any) => void) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return; // Exit if not logged in

  const pendingCartItem = sessionStorage.getItem("pendingCartItem");
  if (!pendingCartItem) return; // Exit if no pending item

  try {
    console.log("🔍 Raw pendingCartItem:", pendingCartItem);
    const parsedItem = JSON.parse(pendingCartItem);
    let { 
      productType, 
      dataId, 
      productId, // Add support for productId
      selectedPricingRule, 
      selectedQuantity, 
      sqftRange, 
      pageCount, 
      selectedBindingType, 
      selectedAddonRule, 
      addonBookCount,
      uploadedDocumentId,
      noOfCopies
    } = parsedItem;

    // Handle both dataId and productId for backward compatibility
    const finalDataId = dataId || productId;

    // Ensure uploadedDocumentId is properly extracted
    if (parsedItem.uploadedDocumentId !== undefined) {
      uploadedDocumentId = parsedItem.uploadedDocumentId;
    }

    // Ensure numeric values
    selectedQuantity = selectedQuantity ? Number(selectedQuantity) : null;
    sqftRange = sqftRange ? Number(sqftRange) : null;
    pageCount = pageCount ? Number(pageCount) : null;
    addonBookCount = addonBookCount ? Number(addonBookCount) : 0;


    console.log("Processing pending item:", parsedItem);
    console.log("📄 Uploaded Document ID:", uploadedDocumentId);
    
    if (productType === "photoFrame") {
      console.log("PhotoFrame extra fields:", {
        documentIds: parsedItem.documentIds,
        selectedFrameColor: parsedItem.selectedFrameColor,
      });
    }

    // Remove from sessionStorage BEFORE API call to prevent duplicate processing
    sessionStorage.removeItem("pendingCartItem");

    // ✅ Improved Validation Based on Product Type
    const isCanvas = productType === "canvasprinting";
    const isOffset = productType === "offsetPrinting";
    const isBusinessCard = productType === "bussinesscard";
    const isLetterhead = productType === "letterhead";
    const isPaperPrinting = productType === "paperprinting";

    const needsSqft = isCanvas && (sqftRange == null || isNaN(sqftRange));
    const needsQuantity = !isCanvas && !isOffset && !isBusinessCard && !isLetterhead &&  !isPaperPrinting &&
                           (selectedQuantity == null || isNaN(selectedQuantity));

    const needsSquareFeetRange = selectedPricingRule?.SquareFeetRange?.ValueID == null && isCanvas;

    if (!productType || !finalDataId || !selectedPricingRule || needsSquareFeetRange || needsSqft || needsQuantity) {
      console.error("❌ Invalid pending cart item data", parsedItem);
      return;
    }

    // ✅ Fetch current cart to check for duplicate items
    const currentCart = await fetchCartItems();
    const alreadyInCart = currentCart.Items.some(item =>
      item.ProductId === finalDataId &&
      item.Attributes.some(attr => attr.AttributeValueId === selectedPricingRule.SquareFeetRange?.ValueID) &&
      (isCanvas || item.Attributes.some(attr => attr.AttributeValueId === sqftRange))
    );

    if (alreadyInCart) {
      console.log("✅ Product already in cart. Skipping addition.");
      return;
    }

    // ✅ Call the correct function based on product type
    switch (productType) {
      case "photoFrame":
        await addToCartPhotoFrame(
          finalDataId,
          selectedPricingRule,
          selectedQuantity,
          parsedItem.documentIds || parsedItem.uploadedDocumentIds || (uploadedDocumentId ? [uploadedDocumentId] : undefined),
          parsedItem.selectedFrameColor
        );
        break;
      case "offsetPrinting":
        await addToCartOffSetPrinting(finalDataId, selectedPricingRule, selectedQuantity || 1, uploadedDocumentId);
        break;
      case "polaroidCard":
        await addToCartPolaroidCard(
          finalDataId,
          selectedPricingRule,
          selectedQuantity,
          parsedItem.uploadedDocumentIds || parsedItem.documentIds || (uploadedDocumentId ? [uploadedDocumentId] : undefined)
        );
        break;
      case "nameslip":
        await addToCartNameSlip(finalDataId, selectedPricingRule, selectedQuantity, uploadedDocumentId);
        break;
      case "canvasprinting":
        await addToCartCanvasPrinting(finalDataId, selectedPricingRule, sqftRange, uploadedDocumentId);
        break;
      case "letterhead":
        await addToCart(finalDataId, selectedPricingRule, uploadedDocumentId);
        break;
      case "bussinesscard":
        await addToCartBusinessCard(finalDataId, selectedPricingRule, uploadedDocumentId);
        break;
      case "paperprinting": // ✅ NEW CASE FOR PAPER PRINTING
        await addToCartPaperPrint(
          finalDataId,
          selectedPricingRule,
          pageCount,
          noOfCopies,
          selectedBindingType,
          undefined,
          selectedAddonRule,
          addonBookCount,
          uploadedDocumentId
        );
        break;
      default:
        console.error("❌ Unknown product type:", productType);
        return;
    }

    // ✅ Fetch updated cart after API call
    const updatedCart = await fetchCartItems();
    setCartData(updatedCart);
    
    // Show success message
    toast.success("Product added to cart after login!");
  } catch (error) {
    console.error("❌ Failed to process pending cart item:", error);
    toast.error("❌ Failed to add product to cart after login");
  }
};


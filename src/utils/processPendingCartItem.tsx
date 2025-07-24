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

    // Ensure numeric values
    selectedQuantity = selectedQuantity ? Number(selectedQuantity) : null;
    sqftRange = sqftRange ? Number(sqftRange) : null;
    pageCount = pageCount ? Number(pageCount) : null;
    addonBookCount = addonBookCount ? Number(addonBookCount) : 0;


    console.log("✅ Processing pending item:", parsedItem);
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

    if (!productType || !dataId || !selectedPricingRule || needsSquareFeetRange || needsSqft || needsQuantity) {
      console.error("❌ Invalid pending cart item data", parsedItem);
      return;
    }

    // ✅ Fetch current cart to check for duplicate items
    const currentCart = await fetchCartItems();
    const alreadyInCart = currentCart.Items.some(item =>
      item.ProductId === dataId &&
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
          dataId,
          selectedPricingRule,
          selectedQuantity,
          parsedItem.documentIds,
          parsedItem.selectedFrameColor
        );
        break;
      case "offsetPrinting":
        await addToCartOffSetPrinting(dataId, selectedPricingRule, 2);
        break;
      case "polaroidCard":
        await addToCartPolaroidCard(dataId, selectedPricingRule, selectedQuantity);
        break;
      case "nameslip":
        await addToCartNameSlip(dataId, selectedPricingRule, selectedQuantity);
        break;
      case "canvasprinting":
        await addToCartCanvasPrinting(dataId, selectedPricingRule, sqftRange);
        break;
      case "letterhead":
        await addToCart(dataId, selectedPricingRule);
        break;
      case "bussinesscard":
        await addToCartBusinessCard(dataId, selectedPricingRule);
        break;
      case "paperprinting": // ✅ NEW CASE FOR PAPER PRINTING
        await addToCartPaperPrint(
          dataId,
          selectedPricingRule,
          pageCount,
          noOfCopies,
          selectedBindingType,
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
  } catch (error) {
    console.error("❌ Failed to process pending cart item:", error);
  }
};


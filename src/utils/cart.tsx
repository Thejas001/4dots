import { CartItems, CartData } from "@/app/models/CartItems";
import { addToCartApi } from "./api";
import { findAddonPrice } from "./priceFinder"; 
import { Select } from "antd";
import { API } from "./api";

export const fetchCartItems = async (): Promise<CartData> => {
  try {
    const response = await API.get(`/cart`);
    console.log("Fetched Cart Data:", response.data); // Debugging output

    return {
      Items: response.data?.data?.Items ?? [],
      TotalPrice: response.data?.data?.TotalPrice ?? 0,
    };
  } catch (error: any) {
    console.error("Error fetching cart items:", error.response?.data || error.message);
    return { Items: [], TotalPrice: 0 }; // ✅ Ensure a valid return type
  }
};


export const deleteCartItem = async (cartItemId: number): Promise<boolean> => {
  try {
    await API.delete(`/cart/items/${cartItemId}`);
    return true; // ✅ No need to check response.ok (Axios throws error on failure)
  } catch (error: any) {
    console.error("Error deleting cart item:", error.response?.data || error.message);
    return false; // ✅ Ensures a valid return type
  }
};

export const addToCart = async (
  productId: number,
  pricingRule: {
    Service: { AttributeID: number; ValueID: number };
    Size: { AttributeID: number; ValueID: number };
    Quality: { AttributeID: number; ValueID: number };
    Quantity: { AttributeID: number; ValueID: number };
    Price: number;
  },
  documentId?: number 
) => {
  const cartItem = {
    ProductID: productId, //Matches `CartItems` type
    Price: pricingRule.Price, // Included missing price
    Attributes: [
      {
        AttributeId: pricingRule.Service.AttributeID,
        AttributeValueId: pricingRule.Service.ValueID,
      },
      {
        AttributeId: pricingRule.Size.AttributeID,
        AttributeValueId: pricingRule.Size.ValueID,
      },
      {
        AttributeId: pricingRule.Quality.AttributeID,
        AttributeValueId: pricingRule.Quality.ValueID,
      },
      {
        AttributeId: pricingRule.Quantity.AttributeID,
        AttributeValueId: pricingRule.Quantity.ValueID,
      },
    ],
    DynamicAttributes: [], //Keeping this empty unless required
    CartItemDocumentIds: documentId !== undefined ? [documentId] : [],
  };

  console.log("Corrected Cart Data:", JSON.stringify(cartItem, null, 2));

  try {
    const response = await addToCartApi(cartItem);
    console.log("Successfully added to cart:", response);
  } catch (error) {
    console.log("Failed to add to cart. Please try again.");
  }
};

export const addToCartPolaroidCard = async (
  productId: number,
  pricingRule: {
    Size: { AttributeID: number; ValueID: number };
    QuantityRange: { AttributeID: number; ValueID: number };
    Price: number;
  },
  selectedQuantity: number, //"NumberOfCards" as a dynamic attribute
  documentId?: number 
) => {
  const cartItem: CartItems = {
    ProductID: productId, //Matches expected key format
    Price: pricingRule.Price, //Price included
    Attributes: [
      {
        AttributeId: pricingRule.Size.AttributeID,
        AttributeValueId: pricingRule.Size.ValueID,
      },
      {
        AttributeId: pricingRule.QuantityRange.AttributeID,
        AttributeValueId: pricingRule.QuantityRange.ValueID,
      },
    ],
    DynamicAttributes: [
      {
        AttributeName: "NumberOfCards", //Matches API requirement
        AttributeValue: selectedQuantity.toString(), // Convert to string as per API format
      },
    ],
    CartItemDocumentIds: documentId !== undefined ? [documentId] : [],

  };

  console.log("Polaroid Card Cart Data:", JSON.stringify(cartItem, null, 2));

  try {
    const response = await addToCartApi(cartItem); // Fixed variable name
    console.log("✅ Successfully added Polaroid Card to cart:", response);
  } catch (error) {
    console.log("Failed to add Polaroid Card to cart. Please try again.");
  }
};

export const addToCartNameSlip = async (
  productId: number,
  pricingRule: {
    Size: { AttributeID: number; ValueID: number };
    QuantityRange: { AttributeID: number; ValueID: number };
    Price: number;
  },
  selectedQuantity: number, //"NumberOfSlips" as a dynamic attribute
  documentId?: number 
) => {
  const cartItem: CartItems = {
    ProductID: productId, //Matches expected key format
    Price: pricingRule.Price, // Price included
    Attributes: [
      {
        AttributeId: pricingRule.Size.AttributeID,
        AttributeValueId: pricingRule.Size.ValueID,
      },
      {
        AttributeId: pricingRule.QuantityRange.AttributeID,
        AttributeValueId: pricingRule.QuantityRange.ValueID,
      },
    ],
    DynamicAttributes: [
      {
        AttributeName: "NumberOfCards", //Matches API requirement
        AttributeValue: selectedQuantity.toString(), // Convert to string as per API format
      },
    ],
    CartItemDocumentIds: documentId !== undefined ? [documentId] : [],
  };

  console.log("🛒 Name Slip Cart Data:", JSON.stringify(cartItem, null, 2));

  try {
    const response = await addToCartApi(cartItem); // Corrected variable name
    console.log("Successfully added Name Slip to cart:", response);
    console.log("Name Slip added to cart!");
  } catch (error) {
    console.log("Failed to add Name Slip to cart. Please try again.");
  }
};

export const addToCartOffSetPrinting = async (
  productId: number,
  pricingRule: {
    NoticeType: { AttributeID: number; ValueID: number };
    Quality: { AttributeID: number; ValueID: number };
    Quantity: { AttributeID: number; ValueID: number };
    Price: number;
  },
  selectedQuantity: number, //"NumberOfSlips" as a dynamic attribute
  documentId?: number 
) => {
  const cartItem: CartItems = {
    ProductID: productId,
    Price: pricingRule.Price,
    Attributes: [
      {
        AttributeId: pricingRule.NoticeType.AttributeID,
        AttributeValueId: pricingRule.NoticeType.ValueID,
      },
      {
        AttributeId: pricingRule.Quality.AttributeID,
        AttributeValueId: pricingRule.Quality.ValueID,
      },
      {
        AttributeId: pricingRule.Quantity.AttributeID,
        AttributeValueId: pricingRule.Quantity.ValueID,
      },
    ],
    DynamicAttributes: [
      {
        AttributeName: "OffSetBundleQuantity",
        AttributeValue: selectedQuantity.toString(),
      },
    ],
    CartItemDocumentIds: documentId !== undefined ? [documentId] : [],
  };
  console .log("selectedQuantity", selectedQuantity);
  console.log("🧾 Document IDs:", cartItem.CartItemDocumentIds);
  console.log("🛒 Offset printing Data:", JSON.stringify(cartItem, null, 2));

  try {
    const response = await addToCartApi(cartItem);
    console.log("✅ Successfully added Offset printing Data to cart:", response);
  } catch (error) {
    console.log("❌ Failed to add Offset printing Data to cart. Please try again.");
  }
};


export const addToCartBusinessCard = async (
  productId: number,
  pricingRule: {
    CardType: { AttributeID: number; ValueID: number };
    Finish: { AttributeID: number; ValueID: number };
    Price: number;
  },
  documentId?: number
) => {
  const cartItem: CartItems = {
    ProductID: productId, //Matches expected key format
    Price: pricingRule.Price, // Price included
    Attributes: [
      {
        AttributeId: pricingRule.CardType.AttributeID,
        AttributeValueId: pricingRule.CardType.ValueID,
      },
      {
        AttributeId: pricingRule.Finish.AttributeID,
        AttributeValueId: pricingRule.Finish.ValueID,
      },
    ],
    DynamicAttributes: [],
    CartItemDocumentIds: documentId !== undefined ? [documentId] : [],
  };

  console.log("🛒 Offset printing Data:", JSON.stringify(cartItem, null, 2));

  try {
    const response = await addToCartApi(cartItem); // Corrected variable name
    console.log("Successfully added Offset printing Data to cart:", response);
    console.log("Offset printing Data added to cart!");
  } catch (error) {
    console.log("Failed to add Offset printing Data to cart. Please try again.");
  }
};

export const addToCartCanvasPrinting = async (
  productId: number,
  pricingRule: {
    SquareFeetRange: { AttributeID: number; ValueID: number };
    PricePerSquareFoot: number;
  },
  sqftRange: number,
  documentId?: number 
) => {
  const cartItem: CartItems = {
    ProductID: productId, //Matches expected key format
    Price: pricingRule.PricePerSquareFoot * sqftRange, // Price included
    Attributes: [
      {
        AttributeId: pricingRule.SquareFeetRange.AttributeID,
        AttributeValueId: pricingRule.SquareFeetRange.ValueID,
      },
    ],
    DynamicAttributes: [
      {
        AttributeName: "SquareFeet", //Matches API requirement
        AttributeValue: sqftRange.toString(), // Convert to string as per API format
      },
    ],
    CartItemDocumentIds: documentId !== undefined ? [documentId] : [],

  };

  console.log("🛒 Canvas Printing Data:", JSON.stringify(cartItem, null, 2));

  try {
    const response = await addToCartApi(cartItem); // Corrected variable name
    console.log("Successfully added Canvas Printing Data to cart:", response);
    console.log("Canvas Printing Data added to cart!");
  } catch (error) {
    console.log("Failed to add Canvas Printing Data to cart. Please try again.");
  }
};

export const addToCartPhotoFrame = async (
  productId: number,
  pricingRule: {
    Size: { AttributeID: number; ValueID: number };
    Quantity: { AttributeID: number; ValueID: number };
    Price: number;
  },
  selectedQuantity: number, // Pass the actual quantity chosen by the user
  documentId?: number[],
  selectedFrameColor?: string
) => {
    if (!selectedFrameColor) {
    throw new Error("Frame color is required.");
  }
  // API expects Quantity 8 attributes if selectedQuantity > 8
  const quantityToSend = selectedQuantity > 8 ? 8 : selectedQuantity;

  const cartItem: CartItems = {
    ProductID: productId,
    Price: pricingRule.Price, // Price adjusted in findPhotoFramePricingRule()
    Attributes: [
      {
        AttributeId: pricingRule.Size.AttributeID,
        AttributeValueId: pricingRule.Size.ValueID,
      },
      {
        AttributeId: pricingRule.Quantity.AttributeID, // Always Quantity 8 if >8
        AttributeValueId: pricingRule.Quantity.ValueID,
      },
    ],
    DynamicAttributes: [
        {
          "AttributeName": "Color",
          "AttributeValue": selectedFrameColor // Use the selected frame color
        },
      {
        AttributeName: "PhotoFrameQuantity",
        AttributeValue: selectedQuantity.toString(), // Send actual selected quantity
      },
    ],
    CartItemDocumentIds: documentId ?? [],

  };

  console.log("🛒 PhotoFrame Data Sent to API:", JSON.stringify(cartItem, null, 2));

  try {
    const response = await addToCartApi(cartItem);
    console.log("Successfully added PhotoFrame Data to cart:", response);
    console.log("Photo Frame added to cart!");
  } catch (error) {
    console.error("Failed to add to cart:", error);
    console.log("Failed to add to cart. Please try again.");
  }
};



export const addToCartPaperPrint = async (
  productId: number,
  pricingRule: {
    PaperSize: { AttributeID: number; ValueID: number };
    ColorType: { AttributeID: number; ValueID: number };
   // PageRange: { AttributeID: number; ValueID: number };
    PricePerPage: number;
  },
  pageCount: number,
  selectedBindingType?: string,
  addonRule?: any,
  addonBookCount?: number,
  documentId?: number 
) => {
  const cartItem: CartItems = {
    ProductID: productId,
    Price: pricingRule.PricePerPage,
    Attributes: [
      {
        AttributeId: pricingRule.PaperSize.AttributeID,
        AttributeValueId: pricingRule.PaperSize.ValueID,
      },
      {
        AttributeId: pricingRule.ColorType.AttributeID,
        AttributeValueId: pricingRule.ColorType.ValueID,
      },
    ],
    Addons: addonRule && selectedBindingType
    ? [
        {
          AddonID: selectedBindingType, // Use AddonID from the rule
          IsDeleted: false,
          NumberOfBooks: addonBookCount || 1, // Use user-specified or default to 1
        },
      ]
    : [],
  
    DynamicAttributes: [
      {
        AttributeName: "PageCount",
        AttributeValue: pageCount.toString(),
      },
    ],
    
    CartItemDocumentIds: documentId !== undefined ? [documentId] : [],

  };

  console.log("🛒 Cart Item:", JSON.stringify(cartItem, null, 2));
  
  console.log("Selected Binding Type:", selectedBindingType);
console.log("Addon Rule:", addonRule);


  try {
    const response = await addToCartApi(cartItem);
    console.log("Successfully added to cart:", response);
    console.log("Item added to cart!");
  } catch (error) {
    console.log("Failed to add item to cart. Please try again.");
  }
};

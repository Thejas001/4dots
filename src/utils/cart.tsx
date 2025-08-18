import { CartItems, CartData } from "@/app/models/CartItems";
import { addToCartApi } from "./api";
import { findAddonPrice } from "./priceFinder"; 
import { Select } from "antd";
import { API } from "./api";

export const fetchCartItems = async (): Promise<CartData> => {
  try {
    const response = await API.get(`/cart`);

    return {
      Items: response.data?.data?.Items ?? [],
      TotalPrice: response.data?.data?.TotalPrice ?? 0,
    };
  } catch (error: any) {
    return { Items: [], TotalPrice: 0 }; // ✅ Ensure a valid return type
  }
};


export const deleteCartItem = async (cartItemId: number): Promise<boolean> => {
  try {
    await API.delete(`/cart/items/${cartItemId}`);
    return true; // ✅ No need to check response.ok (Axios throws error on failure)
  } catch (error: any) {
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


  try {
    const response = await addToCartApi(cartItem);
  } catch (error) {
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
  documentIds?: number[]
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
    CartItemDocumentIds: documentIds ?? [],
  };


  try {
    const response = await addToCartApi(cartItem); // Fixed variable name
  } catch (error) {
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


  try {
    const response = await addToCartApi(cartItem); // Corrected variable name

  } catch (error) {
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


  try {
    const response = await addToCartApi(cartItem);
  } catch (error) {
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


  try {
    const response = await addToCartApi(cartItem); // Corrected variable name

  } catch (error) {
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


  try {
    const response = await addToCartApi(cartItem); // Corrected variable name

  } catch (error) {
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


  try {
    const response = await addToCartApi(cartItem);

  } catch (error) {
  }
};



export const addToCartPaperPrint = async (
  productId: number,
  pricingRule: {
    PaperSize: { AttributeID: number; ValueID: number };
    ColorType: { AttributeID: number; ValueID: number };
    PageRange: { AttributeID: number; ValueID: number };
    PricePerPage: number;
  },
  pageCount: number,
  noOfCopies: number,
  selectedBindingType?: string,
  selectedBinderColor?: string,
  selectedLaminationType?: string,
  addonRule?: any,
  addonBookCount?: number,
  
  documentId?: number,
  calculatedPrice?: number,
) => {

  // ✅ Map binding type to AddonID
  const bindingTypeToAddonIdMap: Record<string, number> = {
    "Spiral Binding": 1,
    "Soft Binding": 2,
    "Hard Binding": 3
  };

  // ✅ Map lamination type to AddonID
  const laminationTypeToAddonIdMap: Record<string, number> = {
    "Lamination Matt": 4,
    "Lamination Glossy": 5
  };

const resolvedAddonId = selectedBindingType
  ? bindingTypeToAddonIdMap[selectedBindingType] ?? selectedBindingType
  : null; // explicitly set to null if undefined

const resolvedLaminationAddonId = selectedLaminationType
  ? laminationTypeToAddonIdMap[selectedLaminationType] ?? selectedLaminationType
  : null; // explicitly set to null if undefined


  const dynamicAttributes = [
    {
      AttributeName: "PageCount",
      AttributeValue: pageCount.toString(),
    },
    {
      AttributeName: "NumberOfCopies",
      AttributeValue: noOfCopies.toString(), // Convert to string as per API format
    }
  ];

  // ✅ Include binder color only for Hard Binding when provided
  if (selectedBindingType === "Hard Binding") {
    // If no specific color is selected, default to "Black"
    const binderColor = selectedBinderColor || "Black";
    dynamicAttributes.push({
      AttributeName: "BinderColor",
      AttributeValue: binderColor,
    });
  }

  const cartItem: CartItems = {
    ProductID: productId,
    Price: typeof calculatedPrice === 'number' ? calculatedPrice : pricingRule.PricePerPage,
    Attributes: [
      {
        AttributeId: pricingRule.PaperSize.AttributeID,
        AttributeValueId: pricingRule.PaperSize.ValueID,
      },
      {
        AttributeId: pricingRule.ColorType.AttributeID,
        AttributeValueId: pricingRule.ColorType.ValueID,
      },
      {
        AttributeId: pricingRule.PageRange.AttributeID,
        AttributeValueId: pricingRule.PageRange.ValueID,
      },
    ],
    Addons: (() => {
      const addons = [];
      
      // Add binding addon if selected
      if (addonRule && selectedBindingType && resolvedAddonId !== null) {
        addons.push({
          AddonID: resolvedAddonId,
          IsDeleted: false,
          NumberOfBooks: addonBookCount || 1,
        });
      }
      
             // Add lamination addon if selected
       if (selectedLaminationType && resolvedLaminationAddonId !== null) {
         addons.push({
           AddonID: resolvedLaminationAddonId,
           IsDeleted: false,
           NumberOfBooks: noOfCopies, // Lamination is applied per page × quantity
         });
       }
      
      return addons;
    })(),

    DynamicAttributes: dynamicAttributes,
    CartItemDocumentIds: documentId !== undefined ? [documentId] : [],
  };

  console.log("🛒 Cart Item:", JSON.stringify(cartItem, null, 2));
  
  console.log("Selected Binding Type:", selectedBindingType);
console.log("Addon Rule:", addonRule);

  try {
    const response = await addToCartApi(cartItem);
    console.log("✅ PaperPrint API Response:", response);
    return response;
  } catch (error) {
    console.error("❌ PaperPrint API Error:", error);
    throw error;
  }
};

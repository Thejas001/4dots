import { PhotoFramePricingRule } from "./products";
import type { UploadFile } from "antd/es/upload";

export interface Addon {
  AddonID: string | number; // Matches the cart entry structure
  IsDeleted: boolean;
  NumberOfBooks: number;
}

export interface CartItems {
  ProductID: number; // Fixed to match the cart entry
  Price: number;
  Attributes: {
    AttributeId: number;
    AttributeValueId: number;
  }[];
  Addons?: Addon[]; // Optional in case no addons are added
  DynamicAttributes: {
    AttributeName: string;
    AttributeValue: string;
  }[];
  CartItemDocumentIds?: number[];
}




//for fetech product
export interface FetchCartItem {
  CartItemId: number;
  CartId: number;
  ProductId: number;
  ProductName: string;
  ItemPrice: number;
  Attributes: {
    AttributeId: number;
    AttributeValueId: number;
  }[];
  DynamicAttributes: {
    AttributeName: string;
    AttributeValue: string;
  }[];
  CartItemDocumentIds: number[];
  Addons: any[]; // Define Addon structure if needed
  PageCount: number | null;
  ResourceUrl: string | null;
  AddedAt: string;
  DeletedAt: string | null;
  IsDeleted: boolean;
  Documents?: DocumentItem[];
}

export interface DocumentItem {
  DocumentId: number;
  DocumentUrl: string;
  ContentType: string;
  // Add any other fields your backend sends
}

export interface CartData {
  Items: FetchCartItem[];
  TotalPrice: number;
}

export interface PaymentCalProps {
  userId: number;
  cartItemIds: number[];
  totalPrice: number;
  deliveryOption: string; 
  paymentOption: string; // "Online" or "CashOnDelivery"
}

export interface CartButtonProps {
  dataId: number;
  selectedQuantity: number | null;
  calculatedPrice: number;
  selectedPricingRule: PhotoFramePricingRule | null;
  uploadedImages: UploadFile[];
}


  
import { PhotoFramePricingRule } from "./products";
//for add product

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
  Addons: any[]; // Define Addon structure if needed
  PageCount: number | null;
  ResourceUrl: string | null;
  AddedAt: string;
  DeletedAt: string | null;
  IsDeleted: boolean;
}

export interface CartData {
  Items: FetchCartItem[];
  TotalPrice: number;
}

export interface PaymentCalProps {
  userId: number;
  cartItemIds: number[];
  totalPrice: number;
}

export interface CartButtonProps {
  dataId: number;
  selectedQuantity: number | null;
  calculatedPrice: number;
  selectedPricingRule: PhotoFramePricingRule | null;
}


  
// ✅ Interface for Photo Frame Pricing Rules

export interface AttributeDetail {
  ValueName: string;
  AttributeID: number;
  ValueID: number;
}


export interface PhotoFramePricingRule {
  Size:AttributeDetail;
  Quantity: AttributeDetail;
  Price: number;
}

export interface CanvasPricingRule {
  SquareFeetRange: AttributeDetail;
  PricePerSquareFoot : number;
}

export interface OffsetPrintingPricingRule {
  NoticeType: AttributeDetail;
  Quality: AttributeDetail;
  Quantity: AttributeDetail;  // ✅ Fix: Make it an object with ValueName
  Price: number;
}


export interface LetterHeadPricingRule {
  Service: AttributeDetail;
  Size: AttributeDetail;
  Quality: AttributeDetail;
  Quantity: AttributeDetail;
  Price: number;
}

export interface PolaroidCardPricingRule {
  Size: AttributeDetail;
  QuantityRange: AttributeDetail; 
  Price: number;
}

export interface NameSlipPricingRule {
  Size: AttributeDetail;
  QuantityRange: AttributeDetail; 
  Price: number;
}

export interface OnamAlbumPricingRule {
  Size: AttributeDetail;
  QuantityRange: AttributeDetail; 
  Price: number;
}

export interface PaperPrintingPricingRule {
  PaperSize: AttributeDetail;
  ColorType: AttributeDetail;
  PageRange: AttributeDetail;
  PricePerPage: number;
}


export interface BusinessCardPricingRule {
  CardType: AttributeDetail;
  Finish: AttributeDetail; // ✅ Corrected from SurfaceFinish to Finish
  Price: number;
}



export interface PaperPrintAddonRule {
  AddonName: string;
  Rules: {
    PaperSize: string;
    ColorName: string;
    PageRange: string;
    Price: string; // e.g., "140/book"
  }[];
}

export interface AddonRule {
  PaperSize: string;
  ColorName: string;
  PageRange: string;
  Price: number;
}

export interface Addon {
  Id: number;
  AddonName: string;
  Rules: AddonRule[];
}

// ✅ Define Product Interface
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  sizes: string[];
  ProductDetailsImages: {
    Id: number;
    ImageUrl: string;
  }[];
  colors: string[];
  quantity: number[];
  cardType: string[];
  Finish: string[];
  pricingrule: any;
  Quality: string[];
  QuantityRange: string[];
  NoticeType: string[];
  Addons: Addon[];
  PhotoFramePricingRules?: PhotoFramePricingRule[];
  PaperPrintingPricingRules?: PaperPrintingPricingRule[]; 
  BusinessCardPricingRules?: BusinessCardPricingRule[]; 
  OffsetPrintingPricingRules?: OffsetPrintingPricingRule[];
  LetterHeadPricingRules?: LetterHeadPricingRule[];
  PolaroidCardPricingRules?: PolaroidCardPricingRule[];
  NameSlipPricingRules?: NameSlipPricingRule[];
  CanvasPricingRules?: CanvasPricingRule[];
  PaperPrintAddonRules?: PaperPrintAddonRule[]; // Should match the fixed interface
  OnamAlbumPricingRules?: OnamAlbumPricingRule[];
}

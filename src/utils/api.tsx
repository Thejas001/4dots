import axios from "axios";
import { Product } from "@/app/models/products";
import { extractPhotoFramePricingRules, 
        extractPaperPrintingPricingRules, 
        extractBusinessCardPricingRules,
        extractOffsetPrintingPricingRules,
        extractLetterHeadPricingRules,
        extractPolaroidPricingRules,
        extracNameSlipPricingRules,
        extractCanvasPricingRules,
      } from "@/utils/extractPricingRule";
import { CartItems } from "@/app/models/CartItems";

export const API = axios.create({
  baseURL: "https://fourdotsapi.azurewebsites.net/api", // Change this if calling an external API
  headers: { "Content-Type": "application/json" },
});
// Set Authorization header with JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");  // Get JWT from localStorage
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;  // Add token to Authorization header
  }

  console.log("Authorization Header:", config.headers["Authorization"]);
  return config;
});

// Send OTP to user's phone
 export const sendOtp = async (phoneNumber: string) => {
    const formattedPhoneNumber = `+91${phoneNumber}`; // Assuming the backend needs the country code
    try {
      const response = await API.post("/Account/register-or-login", { phoneNumber: formattedPhoneNumber });
      if (response.status === 200) {
      return response.data;
      }
      else{
        throw new Error(response.data?.message ||"Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error.response ? error.response.data : error.message);
      throw new Error("Failed to send OTP");
    }
  };
  
  
  // Verify OTP for login
  export const verifyOTP = async (phoneNumber: string, otp: string) => {
    try {
      // Add +91 prefix to phone number if not already present
      const formattedPhoneNumber = phoneNumber.startsWith("+91") ? phoneNumber : `+91${phoneNumber}`;
      
      const response = await API.post("/Account/verify-otp", { phoneNumber: formattedPhoneNumber, otp });
      return response.data.token; // API should return auth token
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      throw error.response?.data?.message || "Invalid OTP";
    }
  };
  
  // Fetch products from the server
  export const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

// Fetch product details by ID
export const fetchProductDetails = async (dataId: number): Promise<Product | null> => {
  try {
    const response = await API.get(`/products/details-with-pricing/${dataId}`);
    const Data = response.data;

    console.log("API Response Data:", Data);

    const formatName = (name: string) =>
      name
        ? name
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "";

    const getValues = (attr: any) =>
      attr?.Values?.map((v: any) => (typeof v === "string" ? v : v.ValueName)) || [];

    const extractSize = (attributes: any[]) => {
      const sizeAttribute = attributes?.find((attr: any) =>
        attr.AttributeName.toLowerCase().includes("size")
      );
      return sizeAttribute?.Values?.map((v: any) => (typeof v === "string" ? v : v.ValueName)) || [];
    };

    // ✅ Extract Pricing Rules separately
    const PhotoFramePricingRules = extractPhotoFramePricingRules(Data.PricingRules);
    const PaperPrintingPricingRules = extractPaperPrintingPricingRules(Data.PricingRules, Data.Addons);    
    const BusinessCardPricingRules = extractBusinessCardPricingRules(Data.PricingRules);
    const OffsetPrintingPricingRules = extractOffsetPrintingPricingRules(Data.PricingRules);
    const LetterHeadPricingRules = extractLetterHeadPricingRules(Data.PricingRules);
    const PolaroidCardPricingRules = extractPolaroidPricingRules(Data.PricingRules);
    const NameSlipPricingRules = extracNameSlipPricingRules(Data.PricingRules);
    const CanvasPricingRules = extractCanvasPricingRules(Data.PricingRules);


    console.log(PaperPrintingPricingRules);

    // ✅ Map API response to Product model
    const mappedProduct: Product = {
      id: Data.ProductID,
      pricingrule: Data.PricingRules,
      name: formatName(Data.ProductName),
      description: Data.Description || "",
      sizes: extractSize(Data.Attributes),
      price: Data.Price || 0,
      imageUrl: Data.ImageUrl || "",
      colors: getValues(
        Data.Attributes?.find((attr: any) => attr.AttributeName.toLowerCase() === "color name")
      ),
      quantity: getValues(
        Data.Attributes?.find((attr: any) => attr.AttributeName.toLowerCase() === "quantity")
      ),

      cardType: getValues(
        Data.Attributes?.find((attr: any) => attr.AttributeName.toLowerCase() === "card type")
      ),
      Quality: getValues(
        Data.Attributes?.find((attr: any) => attr.AttributeName.toLowerCase() === "quality")
      ),
      NoticeType: getValues(
        Data.Attributes?.find((attr: any) => attr.AttributeName.toLowerCase() === "notice type")
      ),
      QuantityRange: getValues(
        Data.Attributes?.find((attr: any) => attr.AttributeName.toLowerCase() === "quantity range")
      ),
      Finish: getValues(
        Data.Attributes?.find((attr: any) => attr.AttributeName.toLowerCase() === "finish")
      ),
        // ✅ Add the Addons field
      Addons: Data.Addons || [],
     
      PhotoFramePricingRules, 
      PaperPrintingPricingRules, 
      BusinessCardPricingRules, 
      OffsetPrintingPricingRules,
      LetterHeadPricingRules,
      PolaroidCardPricingRules,
      NameSlipPricingRules,
      CanvasPricingRules,
    };

    console.log("Mapped Product:", mappedProduct);
    return mappedProduct;
  } catch (error) {
    console.error(`Error fetching product details (ID: ${dataId}):`, error);
    return null;
  }
};



//Cart

export const addToCartApi = async (cartItem: CartItems) => {
  try {
    const response = await API.post(`/cart/items`, cartItem);

    console.log("✅ Successfully added to cart:", response.data);
    return response.data; // No need for response.json()
  } catch (error: any) {
    console.error("Error adding to cart:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add item to cart");
  }
};


export const placeOrder = async (
  cartItemIds: number[], 
  userId: number, 
  paymentMethod: string
) => {    
  try {
    const response = await API.post("/order/create", {
      userId, 
      cartItemIds,
      paymentMethod
    });

    return response.data; // Axios automatically handles JSON parsing
  } catch (error: any) {
    console.error("Error placing order:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to place order");
  }
};


export const fetchUserOrder = async (userId: number) => {
  try {
    const response = await API.get(`/order/user`);

    if (response.data?.Success) {
      return response.data.Data; // Extract 'Data' array
    } else {
      throw new Error(response.data?.message || "Failed to fetch orders");
    }
  } catch (error: any) {
    console.error("Error fetching orders:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};





export default API;

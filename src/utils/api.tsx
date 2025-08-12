import axios from "axios";
import https from "https"; 
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
const agent = new https.Agent({  
  rejectUnauthorized: false, // ✅ Allow self-signed certificates
}); 
export const API = axios.create({
  baseURL: "https://fourdotsapp-prod.azurewebsites.net/api", // fourdotsapp.azurewebsites.net
  headers: { "Content-Type": "application/json" },
  httpsAgent: agent, // ✅ Use the custom HTTPS agen
});

// ✅ Check for localStorage only in the browser
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export const getUserDetails = async () => {
  try {
    const response = await API.get("/account/profile");
    return response.data; // Assuming the API returns user details directly
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch user details";
  }
};

export const updateUserName = async (userName: string) => {
  try {
    const response = await API.put("/account/update-name", { name: userName });
    return response.data; // Assuming the API returns updated user details directly
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to update user name";
  }
}
export const getUserAddress = async () => {
  try {
    const response = await API.get("/address");
    return response.data; // Assuming the API returns user address directly
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch user address";
  }
}

export const addUserAddress = async (address: any) => {
  try {
    const response = await API.post("/address", address);
    return response.data; // Assuming the API returns user address directly
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to add user address";
  }
}

export const updateUserDetails = async (userDetails: any) => {
  try {
    const response = await API.put("/account/update-name", userDetails);
    return response.data; // Assuming the API returns updated user details directly
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to update user details";
  }
}
export const updateOrderStatus = async (orderId: number, status: number) => {
  try {
      const response = await API.put(`/order/${orderId}/status`, {
      OrderStatus: 6,
    });
    return response.data; // Adjust as per your API's response structure
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to update order status";
  }
};


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
      throw error.response?.data?.message || "Invalid OTP";
    }
  };
  
  // Fetch products from the server
  export const fetchProducts = async (): Promise<Product[]> => {
    try {
      const response = await API.get("/products");
  
      const transformed = response.data.map((product: any) => ({
        id: product.ProductID,
        name: product.ProductName,
        description: product.Description,
      }));
  
      return transformed;
    } catch (error) {
      return [];
    }
  };
  

// Fetch product details by ID
export const fetchProductDetails = async (dataId: number): Promise<Product | null> => {
  try {
    const response = await API.get(`/products/details-with-pricing/${dataId}`);
    const Data = response.data;


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

    // ✅ Extract Pricing Rules separately - Only extract what's needed based on product type
    const PhotoFramePricingRules = Data.ProductID === 2 ? extractPhotoFramePricingRules(Data.PricingRules) : [];
    const PaperPrintingPricingRules = Data.ProductID === 1 ? extractPaperPrintingPricingRules(Data.PricingRules, Data.Addons) : [];    
    const BusinessCardPricingRules = Data.ProductID === 3 ? extractBusinessCardPricingRules(Data.PricingRules) : [];
    const OffsetPrintingPricingRules = Data.ProductID === 5 ? extractOffsetPrintingPricingRules(Data.PricingRules) : [];
    const LetterHeadPricingRules = Data.ProductID === 4 ? extractLetterHeadPricingRules(Data.PricingRules) : [];
    const PolaroidCardPricingRules = Data.ProductID === 7 ? extractPolaroidPricingRules(Data.PricingRules) : [];
    const NameSlipPricingRules = Data.ProductID === 8 ? extracNameSlipPricingRules(Data.PricingRules) : [];
    const CanvasPricingRules = Data.ProductID === 6 ? extractCanvasPricingRules(Data.PricingRules) : [];



    // ✅ Map API response to Product model
    const mappedProduct: Product = {
      id: Data.ProductID,
      pricingrule: Data.PricingRules,
      name: formatName(Data.ProductName),
      description: Data.Description || "",
      sizes: extractSize(Data.Attributes),
      price: Data.Price || 0,
      imageUrl: Data.ImageUrl || "",
      ProductDetailsImages: Data.ProductDetailsImages || [],
      // ✅ Use the getValues function to extract values from attributes
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

    return mappedProduct;
  } catch (error) {
    return null;
  }
};



//Cart

export const addToCartApi = async (cartItem: CartItems) => {
  try {
    const response = await API.post(`/cart/items`, cartItem);

    return response.data; // No need for response.json()
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add item to cart");
  }
};


export const placeOrder = async (
  cartItemIds: number[], 
  deliveryOption: string,
  paymentOption: string
) => {    
  try {
    const response = await API.post("/order/create", {
      CartItemIds: cartItemIds,
      PaymentMethod: paymentOption,
      DeliveryType: deliveryOption,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to place order");
  }
};



export const fetchUserOrder = async () => {
  try {
    const response = await API.get(`/order/user`);

    if (response.data?.Success) {
      return response.data.Data; // Extract 'Data' array
    } else {
      throw new Error(response.data?.message || "Failed to fetch orders");
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};

export const fetchPaymentRetry = async (orderId: number) => {
  try {
    const response = await API.get(`/order/retry-payment/${orderId}`);
    // Return the actual response data directly
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};


export default API;

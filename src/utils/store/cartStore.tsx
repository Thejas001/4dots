import { create } from 'zustand';
import { fetchCartItems } from "../cart";
import { CartData } from "@/app/models/CartItems";

let cartLoading = false; // Shared flag to prevent duplicate calls

interface CartState {
  cartData: CartData | null;
  cartCount: number;
  cartCountHistory: number[]; // Array to store cart count history
  orderBadgeCount: number;
  setCartCount: (count: number) => void;
  incrementCart: () => void;
  decrementCart: () => void; // Action for decrementing cart count
  clearCartCount: () => void;
  incrementOrderBadge: () => void;
  clearOrderBadge: () => void;
  setCartData: (data: CartData) => void;
  
  refreshCart: () => Promise<void>;

   hasNewCartItem: boolean;
  setHasNewCartItem: (value: boolean) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartData: null,
  cartCount: 0,
  cartCountHistory: [],
  orderBadgeCount: 0,

  setCartCount: (count) =>
    set((state) => ({
      cartCount: count,
      cartCountHistory: [...state.cartCountHistory, count],
    })),

incrementCart: () =>
  set((state) => ({
    cartCount: state.cartCount + 1,
    cartCountHistory: [...state.cartCountHistory, state.cartCount + 1],
    hasNewCartItem: true, // 🔴 trigger badge
  })),


  decrementCart: () =>
    set((state) => {
      const newCount = state.cartCount > 0 ? state.cartCount - 1 : 0;
      return {
        cartCount: newCount,
        cartCountHistory: [...state.cartCountHistory, newCount],
      };
    }),

  clearCartCount: () =>
    set((state) => ({
      cartCount: 0,
      cartCountHistory: [...state.cartCountHistory, 0],
    })),

  incrementOrderBadge: () =>
    set((state) => ({ orderBadgeCount: state.orderBadgeCount + 1 })),

  clearOrderBadge: () => set({ orderBadgeCount: 0 }),

  setCartData: (data) =>
    set((state) => {
      const newCount = data.Items?.length ?? 0;
      return {
        cartData: data,
        cartCount: newCount,
        cartCountHistory: [...state.cartCountHistory, newCount],
      };
    }),

  refreshCart: async () => {
    if (cartLoading) return;
    cartLoading = true;
    try {
      const data = await fetchCartItems();
      set((state) => {
        const newCount = data.Items?.length ?? 0;
        return {
          cartData: data,
          cartCount: newCount,
          cartCountHistory: [...state.cartCountHistory, newCount],
        };
      });
    } finally {
      cartLoading = false;
    }
  },

  // Add these to fix TS errors
  hasNewCartItem: false,
  setHasNewCartItem: (value: boolean) => set({ hasNewCartItem: value }),
}));

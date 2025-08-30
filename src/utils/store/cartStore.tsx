import { create } from 'zustand';
import { fetchCartItems } from "../cart";
import { CartData } from "@/app/models/CartItems";

let cartLoading = false; // Shared flag to prevent duplicate calls

interface CartState {
  cartData: CartData | null;
  cartCount: number;
  cartCountHistory: number[]; // Array to store cart count history
  orderBadgeCount: number;
  hasNewCartItem: boolean; // Track if new item was added
  setCartCount: (count: number) => void;
  incrementCart: () => void;
  decrementCart: () => void; // Action for decrementing cart count
  clearCartCount: () => void;
  incrementOrderBadge: () => void;
  clearOrderBadge: () => void;
  setCartData: (data: CartData) => void;
  setHasNewCartItem: (hasNew: boolean) => void; // Action to set new item flag
  refreshCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cartData: null,
  cartCount: 0,
  cartCountHistory: [], // Initialize empty history array
  orderBadgeCount: 0,
  hasNewCartItem: false, // Initialize new item flag

  setCartCount: (count) =>
    set((state) => ({
      cartCount: count,
      cartCountHistory: [...state.cartCountHistory, count], // Append new count to history
    })),

  incrementCart: () =>
    set((state) => ({
      cartCount: state.cartCount + 1,
      cartCountHistory: [...state.cartCountHistory, state.cartCount + 1], // Append incremented count
      hasNewCartItem: true, // Set new item flag when incrementing
    })),

  decrementCart: () =>
    set((state) => {
      const newCount = state.cartCount > 0 ? state.cartCount - 1 : 0; // Prevent negative count
      return {
        cartCount: newCount,
        cartCountHistory: [...state.cartCountHistory, newCount], // Append decremented count
      };
    }),

  clearCartCount: () =>
    set((state) => ({
      cartCount: 0,
      cartCountHistory: [...state.cartCountHistory, 0], // Append 0 to history
      hasNewCartItem: false, // Clear new item flag when clearing cart
    })),

  incrementOrderBadge: () =>
    set((state) => ({ orderBadgeCount: state.orderBadgeCount + 1 })),

  clearOrderBadge: () => set({ orderBadgeCount: 0 }),

  setCartData: (data) =>
    set((state) => {
      const newCount = data.Items?.length ?? 0;
      const hasNewItem = newCount > state.cartCount; // Set flag if new items added
      return {
        cartData: data,
        cartCount: newCount,
        cartCountHistory: [...state.cartCountHistory, newCount], // Append new count from API
        hasNewCartItem: hasNewItem ? true : state.hasNewCartItem, // Preserve flag if no new items
      };
    }),

  setHasNewCartItem: (hasNew) => set({ hasNewCartItem: hasNew }),

  refreshCart: async () => {
    if (cartLoading) return; // Prevent duplicate calls
    cartLoading = true;
    try {
      const data = await fetchCartItems();
      set((state) => {
        const newCount = data.Items?.length ?? 0;
        const hasNewItem = newCount > state.cartCount; // Set flag if new items added
        return {
          cartData: data,
          cartCount: newCount,
          cartCountHistory: [...state.cartCountHistory, newCount], // Append API-fetched count
          hasNewCartItem: hasNewItem ? true : state.hasNewCartItem, // Preserve flag if no new items
        };
      });
    } finally {
      cartLoading = false;
    }
  },
}));
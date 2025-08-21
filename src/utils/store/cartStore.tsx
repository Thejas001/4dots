// store/cartStore.ts
import { create } from 'zustand';
import { fetchCartItems } from "../cart";
import { CartData } from "@/app/models/CartItems";

let cartLoading = false; // ✅ shared flag to prevent duplicate calls

interface CartState {
  cartData: CartData | null;
  cartCount: number;
  orderBadgeCount: number;
  setCartCount: (count: number) => void;
  incrementCart: () => void;
  clearCartCount: () => void;
  incrementOrderBadge: () => void;
  clearOrderBadge: () => void;
  setCartData: (data: CartData) => void;
  refreshCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cartData: null,
  cartCount: 0,
  orderBadgeCount: 0,

  setCartCount: (count) => set({ cartCount: count }),
  incrementCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  clearCartCount: () => set({ cartCount: 0 }),
  incrementOrderBadge: () => set((state) => ({ orderBadgeCount: state.orderBadgeCount + 1 })),
  clearOrderBadge: () => set({ orderBadgeCount: 0 }),

  setCartData: (data) =>
    set({ cartData: data, cartCount: data.Items?.length ?? 0 }),

  refreshCart: async () => {
    if (cartLoading) return; // ✅ prevent duplicate calls
    cartLoading = true;
    try {
      const data = await fetchCartItems();
      set({
        cartData: data,
        cartCount: data.Items?.length ?? 0,
      });
    } finally {
      cartLoading = false;
    }
  },
}));

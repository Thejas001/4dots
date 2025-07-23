// store/cartStore.ts
import { create } from 'zustand';
import { fetchCartItems } from "../cart";
import { CartData } from "@/app/models/CartItems";

interface CartState {
  cartData: CartData | null;
  cartCount: number;
  orderBadgeCount: number;  // ✅ Add this line
  setCartCount: (count: number) => void;
  incrementCart: () => void;
  clearCartCount: () => void; // ✅ Add this to type
  incrementOrderBadge: () => void;  // ✅ NEW
  clearOrderBadge: () => void;  
  setCartData: (data: CartData) => void;
  refreshCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cartData: null,
  cartCount: 0,
  orderBadgeCount: 0,  // ✅ You need to initialize this
  setCartCount: (count) => set({ cartCount: count }),
  incrementCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  clearCartCount: () => set({ cartCount: 0 }),
  incrementOrderBadge: () => set((state) => ({ orderBadgeCount: state.orderBadgeCount + 1 })),
  clearOrderBadge: () => set({ orderBadgeCount: 0 }),
  setCartData: (data) => set({ cartData: data, cartCount: data.Items.length }),
  refreshCart: async () => {
    const data = await fetchCartItems();
    set({ cartData: data, cartCount: data.Items.length });
  },
}));

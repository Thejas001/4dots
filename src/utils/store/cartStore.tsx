// store/cartStore.ts
import { create } from 'zustand';

interface CartState {
  cartCount: number;
  orderBadgeCount: number;  // ✅ Add this line
  setCartCount: (count: number) => void;
  incrementCart: () => void;
  clearCartCount: () => void; // ✅ Add this to type
  incrementOrderBadge: () => void;  // ✅ NEW
  clearOrderBadge: () => void;  
}

export const useCartStore = create<CartState>((set) => ({
  cartCount: 0,
  orderBadgeCount: 0,  // ✅ You need to initialize this
  setCartCount: (count) => set({ cartCount: count }),
  incrementCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  clearCartCount: () => set({ cartCount: 0 }),
  incrementOrderBadge: () => set((state) => ({ orderBadgeCount: state.orderBadgeCount + 1 })),
  clearOrderBadge: () => set({ orderBadgeCount: 0 }),
}));

import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  maxStock: number;
}

interface CartStore {
  items: CartItem[];
  discount: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setDiscount: (amount: number) => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  discount: 0,
  
  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.maxStock) return state;
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity: 1 }] };
    });
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },

  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(quantity, item.maxStock) } : item
      ),
    }));
  },

  clearCart: () => set({ items: [], discount: 0 }),

  setDiscount: (amount) => set({ discount: amount }),

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    return Math.max(0, subtotal - get().discount);
  },
}));
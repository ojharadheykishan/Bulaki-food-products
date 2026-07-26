import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, IVariant } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant: IVariant, quantity?: number) => void;
  removeItem: (productId: string, weight: string) => void;
  updateQuantity: (productId: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, variant: IVariant, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id && item.variant.weight === variant.weight
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id && item.variant.weight === variant.weight
                  ? { ...item, quantity: Math.min(item.quantity + quantity, variant.stock) }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { product, variant, quantity: Math.min(quantity, variant.stock) }],
          };
        });
      },

      removeItem: (productId: string, weight: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product._id === productId && item.variant.weight === weight)
          ),
        }));
      },

      updateQuantity: (productId: string, weight: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId, weight);
          return;
        }
        const item = get().items.find(
          (i) => i.product._id === productId && i.variant.weight === weight
        );
        const maxStock = item?.variant.stock || quantity;
        const safeQty = Math.min(quantity, maxStock);
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId && item.variant.weight === weight
              ? { ...item, quantity: safeQty }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.variant.price * item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.variant.price * item.quantity, 0);
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 499 ? 0 : 40;
      },
    }),
    {
      name: 'bulaki-cart',
    }
  )
);

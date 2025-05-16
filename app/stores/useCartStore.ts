import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { CartItem } from "../types/product";

interface State {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface Actions {
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, size: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: number, size: string, newQty: number) => void;
}

const INITIAL_STATE: State = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCartStore = create(
  persist<State & Actions>(
    (set, get) => ({
      ...INITIAL_STATE,

      addToCart: (newItem) => {
        const { cart, totalItems, totalPrice } = get();
        const existingItem = cart.find(
          (item) =>
            item.productId === newItem.productId && item.size === newItem.size
        );

        if (existingItem) {
          const availableStock = existingItem.stock;
          const newQty = Math.min(
            existingItem.quantity + newItem.quantity,
            availableStock
          );
          const actualAdded = newQty - existingItem.quantity;

          if (actualAdded === 0) {
            toast.error("已達庫存上限，無法再加入");
            return;
          }

          const updatedCart = cart.map((item) =>
            item.productId === newItem.productId
              ? { ...item, quantity: newQty }
              : item
          );

          set({
            cart: updatedCart,
            totalItems: totalItems + actualAdded,
            totalPrice: totalPrice + newItem.price * actualAdded,
          });
        } else {
          const actualQty = Math.min(newItem.quantity, newItem.stock);
          const newCartItem = { ...newItem, quantity: actualQty };

          set({
            cart: [...cart, newCartItem],
            totalItems: totalItems + actualQty,
            totalPrice: totalPrice + newItem.price * actualQty,
          });
        }
        toast.success("已成功加入購物車！");
      },

      removeFromCart: (productId, size) => {
        const { cart } = get();
        const itemToRemove = cart.find(
          (item) => item.productId === productId && item.size === size
        );
        if (!itemToRemove) return;

        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.productId === productId && item.size === size)
          ),
          totalItems: state.totalItems - itemToRemove.quantity,
          totalPrice:
            state.totalPrice - itemToRemove.price * itemToRemove.quantity,
        }));
      },

      updateQuantity: (productId, size, newQty) =>
        set((state) => {
          const updatedCart = state.cart.map((item) => {
            if (item.productId === productId && item.size === size) {
              return { ...item, quantity: newQty };
            }
            return item;
          });

          const totalItems = updatedCart.reduce(
            (acc, item) => acc + item.quantity,
            0
          );
          const totalPrice = updatedCart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );

          return { cart: updatedCart, totalItems, totalPrice };
        }),

      clearCart: () => {
        set({
          cart: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

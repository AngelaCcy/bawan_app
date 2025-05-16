// stores/useProductStore.ts
import { create } from "zustand";
// import { Product } from "@prisma/client";
import { getProducts, getProductById } from "@/app/utils/actions";
import { ProductWithPrice } from "../types/product";

type Store = {
  allProducts: ProductWithPrice[]; // For lists
  product: ProductWithPrice | null; // For individual product detail
  setAllProducts: (p: ProductWithPrice[]) => void;
  error: unknown;
  isLoading: boolean;
};

interface Actions {
  fetchAllProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
}

export const useProductStore = create<Store & Actions>((set) => ({
  allProducts: [],
  product: null,
  isLoading: false,
  error: null,
  setAllProducts: (p) => set({ allProducts: p }),
  fetchAllProducts: async () => {
    set({ isLoading: true });
    try {
      const data = await getProducts();
      set({ allProducts: data, isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
  fetchProductById: async (id: number) => {
    set({ isLoading: true });
    try {
      const fetched = await getProductById(id);
      set({ product: fetched || null, isLoading: false });
    } catch (error) {
      set({ error, isLoading: false, product: null });
    }
  },
}));

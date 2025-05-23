// stores/useProductStore.ts
import { create } from "zustand";
// import { Product } from "@prisma/client";
import { getProducts, getProductById } from "@/app/utils/actions";
import { ProductWithPrice } from "../app/types/product";

type Store = {
  allProducts: ProductWithPrice[]; // For lists
  product: ProductWithPrice | null; // For individual product detail
  // setAllProducts: (p: ProductWithPrice[]) => void;
  error: unknown;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
};

interface Actions {
  fetchProductsPaginated: (pageSize: number) => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  resetProducts: () => void;
}

export const useProductStore = create<Store & Actions>((set, get) => ({
  allProducts: [],
  product: null,
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,

  // Reset store (Used when leaving/re-entering product page)
  resetProducts: () => set({ allProducts: [], page: 1, hasMore: true }),

  // setAllProducts: (p) => set({ allProducts: p }),
  fetchProductsPaginated: async (pageSize: number) => {
    const { page, allProducts } = get();
    set({ isLoading: true });
    try {
      const newProducts = await getProducts(page, pageSize);
      set({
        allProducts: [...allProducts, ...newProducts],
        page: page + 1,
        hasMore: newProducts.length === pageSize,
        isLoading: false,
      });
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

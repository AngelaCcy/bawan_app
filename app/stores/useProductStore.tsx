// stores/useProductStore.ts
import { create } from "zustand";
import { Product } from "@prisma/client";
import { getProducts } from "@/app/utils/actions";

type Store = {
  allProducts: Product[];
  setAllProducts: (p: Product[]) => void;
  error: unknown;
  isLoading: boolean;
};

interface Actions {
  fetchAllProducts: () => Promise<void>;
}

export const useProductStore = create<Store & Actions>((set) => ({
  allProducts: [],
  isLoading: false,
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
  error: null,
}));

import { getCurrentUser } from "@/app/utils/actions";
import { User } from "@prisma/client";
import { create } from "zustand";

interface State {
  // products: Product[];
  currentUser: User | null;
  error: unknown;
}

interface Actions {
  fetchCurrtUser: () => Promise<void>;
}

const useCurrentUser = create<State & Actions>((set) => ({
  currentUser: null,
  error: null,
  fetchCurrtUser: async () => {
    try {
      const data = await getCurrentUser();
      set({ currentUser: data });
    } catch (error) {
      set({ error });
    }
  },
}));

export default useCurrentUser;

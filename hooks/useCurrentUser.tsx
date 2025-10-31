import { getCurrentUser, updateUserProfileById } from "@/app/utils/actions";
import { User } from "@prisma/client";
import { create } from "zustand";
import { ProfileForm } from "@/app/types/product";

interface State {
  // products: Product[];
  currentUser: User | null;
  error: unknown;
}

interface Actions {
  fetchCurrtUser: () => Promise<void>;
  updateCurrtUser: (data: ProfileForm) => Promise<void>;
}

const useCurrentUser = create<State & Actions>((set, get) => ({
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

  updateCurrtUser: async (data) => {
    try {
      const current = get().currentUser;
      if (!current) throw new Error("No user to update");

      const userData = {
        name: data.name,
        gender: data.gender,
        birth: new Date(data.birth), // convert string → Date
        email: data.email,
        phone: data.phone || null,
        image: data.image || null,
      };

      const updated = await updateUserProfileById(current.id, userData);

      set({ currentUser: updated });
    } catch (error) {
      set({ error });
    }
  },
}));

export default useCurrentUser;

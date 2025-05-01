// import { useRouter } from "next/navigation";
import { useCallback, useMemo, MouseEvent } from "react";
import { toast } from "react-hot-toast";
import { User } from "@prisma/client";
// import useLoginModal from "./useLoginModal";
import { addFavorite, deleteFavorite } from "@/app/utils/actions";
// import { useRouter } from "next/navigation";
// import { sessionUser } from "@/app/utils/fake-data";
// import { log } from "console";

interface IFavorite {
  currentUser?: User | null;
  productId: string;
}

const useFavorite = ({ currentUser, productId }: IFavorite) => {
  // const router = useRouter();
  // const loginModal = useLoginModal();

  const hasFavorite = useMemo(() => {
    return currentUser?.favoriteIds?.includes(productId);
  }, [currentUser, productId]);

  const toggleFavorite = useCallback(
    async (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        // loginModal.onOpen();
        console.log("ERROR! User not found.");
        return;
      }

      try {
        let request;
        if (hasFavorite) {
          request = async () => await deleteFavorite(productId);
        } else {
          request = async () => await addFavorite(productId);
        }

        // await request();
        // router.refresh();
        // router.reload();

        toast.promise(request(), {
          loading: "loading...",
          success: "Successfully update!",
          error: "Error occurs in data!",
        });
        return true;
        // window.location.reload();
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
        return false;
      }
    },
    [currentUser, hasFavorite, productId]
  );

  return {
    hasFavorite,
    toggleFavorite,
  };
};

export default useFavorite;

// import { useRouter } from "next/navigation";
import { useCallback, useMemo, MouseEvent } from "react";
import { toast } from "react-hot-toast";
// import { User } from "@prisma/client";
// import useLoginModal from "./useLoginModal";
import { addFavorite, deleteFavorite } from "@/app/utils/actions";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/navigation";
// import { sessionUser } from "@/app/utils/fake-data";
// import { log } from "console";

interface IFavorite {
  // currentUser?: User | null;
  productId: string;
}

const useFavorite = ({ productId }: IFavorite) => {
  const { currentUser } = useCurrentUser();
  const router = useRouter();
  // const loginModal = useLoginModal();

  const hasFavorite = useMemo(() => {
    return currentUser?.favoriteIds?.includes(productId);
  }, [currentUser, productId]);

  const toggleFavorite = useCallback(
    async (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        // loginModal.onOpen();
        toast("請先都入喔!", {
          icon: "❗️",
        });
        console.log("ERROR! User not found.");
        router.push("/signin");
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
          loading: "請稍候...",
          success: "已更新你的心願清單!",
          error: "發生錯誤!",
        });
        return true;
        // window.location.reload();
      } catch (error) {
        console.log(error);
        toast.error("發生錯誤了！");
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

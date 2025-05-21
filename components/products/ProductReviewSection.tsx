"use client";

import ReviewItem from "../Review";
import ReactStars from "react-stars";
import { useProductReview } from "@/hooks/useProductReview";
import { Button } from "../ui/button";
import ReviewDialog from "../ReviewDialog";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";

export default function ProductReviewSection({
  productId,
}: {
  productId: number;
}) {
  const { reviews, avgRating, reviewCount, refetch } =
    useProductReview(productId);
  const { currentUser } = useCurrentUser();
  const router = useRouter();

  return (
    <>
      {reviews.length > 0 ? (
        <div className="flex justify-center flex-col items-center w-full px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full justify-items-center items-center pt-5 pb-6">
            <p className="text-[45px]">{avgRating} / 5</p>
            <div>
              <ReactStars
                count={5}
                value={avgRating}
                edit={false}
                size={24}
                color1={"white"}
                color2={"black"}
              />
              <p>評價總數: {reviewCount}</p>
            </div>
            {currentUser ? (
              <ReviewDialog productId={productId} onSuccess={refetch} />
            ) : (
              <Button
                variant="custom"
                className="w-60 text-xl"
                onClick={() => router.push("/signin")}
              >
                請先登入以撰寫評論
              </Button>
            )}
          </div>
          <div className="text-center text-base rounded border-2 border-black m-4 w-full">
            {reviews.map((review, index) => (
              <ReviewItem key={review.id} index={index} review={review} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-base m-4">
          <p className="mb-5">目前尚無評論。歡迎成為第一位評論此商品的顧客！</p>
          {currentUser ? (
            <ReviewDialog productId={productId} onSuccess={refetch} />
          ) : (
            <Button
              variant="custom"
              className="w-60 text-xl mt-5"
              onClick={() => router.push("/signin")}
            >
              請先登入以撰寫評論
            </Button>
          )}
        </div>
      )}
    </>
  );
}

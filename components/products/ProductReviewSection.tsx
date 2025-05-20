import { getReviewById } from "@/app/utils/actions";
import { useEffect, useState } from "react";
import { Review } from "@/app/types/product";
import ReviewItem from "../Review";
import ReactStars from "react-stars";

export default function ProductReviewSection({
  productId,
}: {
  productId: number;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getReviewById(productId);
      setReviews(data);
    };
    fetchReviews();
  }, [productId]);

  const avgRating = (): number => {
    const ratings = reviews.map((review) => review.rating);
    const sum = ratings.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    return Math.round((sum / ratings.length) * 10) / 10;
  };

  return (
    <>
      {reviews.length > 0 ? (
        <>
          <div className="flex justify-center space-x-30 pt-5">
            <p className="text-[45px]">{avgRating()} / 5</p>
            <div>
              <ReactStars
                count={5}
                value={avgRating()}
                edit={false}
                size={24}
                color1={"white"}
                color2={"black"}
              />
              <p>評價總數: {reviews.length}</p>
            </div>
          </div>
          <div className="text-center text-base rounded border-2 border-black m-4">
            {reviews.map((review, index) => (
              <ReviewItem key={review.id} index={index} review={review} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-base m-4">
          <p>目前尚無評論。歡迎成為第一位評論此商品的顧客！</p>
        </div>
      )}
    </>
  );
  // <>
  //   <div className="flex justify-center space-x-30 pt-5">
  //     <p className="text-[45px]">{avgRating()} / 5</p>
  //     <div>
  //       <ReactStars
  //         count={5}
  //         value={avgRating()}
  //         edit={false}
  //         size={24}
  //         color1={"white"}
  //         color2={"black"}
  //       ></ReactStars>
  //       <p>評價總數: {reviews.length}</p>
  //     </div>
  //   </div>
  //   <div className="text-center text-base rounded border-2 border-black m-4">
  //     {reviews.length > 0 ? (
  //       reviews.map((review, index) => (
  //         <ReviewItem key={review.id} index={index} review={review} />
  //       ))
  //     ) : (
  //       <p>目前尚無評論。歡迎成為第一位評論此商品的顧客！</p>
  //     )}
  //   </div>
  // </>
}

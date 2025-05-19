import { getReviewById } from "@/app/utils/actions";
import { useEffect, useState } from "react";
import { Review } from "@/app/types/product";

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

  return (
    <div className="text-center text-sm text-gray-500">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id}>
            <p>{review.title}</p>
            <p>{review.content}</p>
          </div>
        ))
      ) : (
        <p>目前尚無評論。歡迎成為第一位評論此商品的顧客！</p>
      )}
    </div>
  );
}

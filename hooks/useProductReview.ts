import { useEffect, useState } from "react";
import { getReviewById } from "@/app/utils/actions";
import { Review } from "@/app/types/product";

export function useProductReview(productId: number) {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    const data = await getReviewById(productId);
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const avgRating = reviews.length
    ? Math.round(
        (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10
      ) / 10
    : 0;

  return {
    reviews,
    avgRating,
    reviewCount: reviews.length,
    refetch: fetchReviews, // Refetch the reviews
  };
}

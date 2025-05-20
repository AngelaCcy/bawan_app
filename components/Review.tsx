import { Review } from "@/app/types/product";
import Image from "next/image";
import { format, toZonedTime } from "date-fns-tz";
import { UserIcon } from "lucide-react";
import ReactStars from "react-stars";

function formatToTaiwanDate(date: string | Date): string {
  const tz = "Asia/Taipei";
  const zoned = toZonedTime(date, tz);
  return format(zoned, "yyyy/MM/dd", { timeZone: tz });
}

export default function ReviewItem({
  index,
  review,
}: {
  index: number;
  review: Review;
}) {
  return (
    <div
      className={`${
        index != 0 ? "border-t-2 border-black" : ""
      } m-4 py-2 px-20 flex items-center space-x-20`}
    >
      {review.user.image ? (
        <Image
          src={review.user?.image}
          alt="User avatar"
          width={50}
          height={50}
          className="w-[80px] rounded-full"
        />
      ) : (
        <div className="w-[80px] h-[80px] rounded-full bg-white flex items-center justify-center border-1 border-black">
          <UserIcon className="w-10 h-10 text-black" />
        </div>
      )}
      <div>
        <p className="pb-2">{review.user.name}</p>
        <p className="text-base text-gray-500">
          {formatToTaiwanDate(review.createdAt)}
        </p>
      </div>
      <div className="flex flex-col items-start">
        <ReactStars
          count={5}
          value={review.rating}
          edit={false}
          size={24}
          color1={"white"}
          color2={"black"}
        ></ReactStars>
        <p className="p-1 font-bold text-lg">{review.title}</p>
        <p className="p-1">{review.content}</p>
      </div>
    </div>
  );
}

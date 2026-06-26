interface Props {
  regularPrice: number;
  salePrice?: number;
}

export default function PriceDisplay({ regularPrice, salePrice }: Props) {
  return (
    <div className=" flex items-center justify-between text-xl">
      {salePrice ? (
        <div className="flex flex-col">
          <span className="text-red-500 font-semibold">NT ${salePrice}</span>
          <span className="text-gray-800 font-semibold text-[16px] line-through">
            NT ${regularPrice}
          </span>
        </div>
      ) : (
        <span className="text-gray-800 font-semibold">NT ${regularPrice}</span>
      )}
    </div>
  );
}

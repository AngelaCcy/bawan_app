interface Props {
  sizes: string[];
  selectedSize: string;
  setSelectedSize: (s: string) => void;
  disabledSizes?: string[]; // optional list of disabled/out-of-stock sizes
}

export default function SizeSelector({
  sizes,
  selectedSize,
  setSelectedSize,
  disabledSizes = [],
}: Props) {
  return (
    <div className="mt-2">
      {sizes.map((size, index) => {
        if (size === "") {
          return (
            <div key={`empty-${index}`} className="p-4 mr-1.5 mb-1.5"></div>
          );
        }

        const isDisabled = disabledSizes.includes(size);
        const isSelected = selectedSize === size;

        return (
          <button
            key={size}
            onClick={(e) => {
              e.preventDefault(); // prevent link navigation if wrapped
              if (!isDisabled) setSelectedSize(size);
            }}
            disabled={isDisabled}
            className={`border-black p-1 mr-1.5 mb-1.5 border rounded-sm text-sm
            ${
              isDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                : isSelected
                ? "bg-[#D6CCC2] border-black hover:text-[#9E7C59]"
                : "bg-[#EDEDE9] border-black hover:text-[#9E7C59] cursor-pointer"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

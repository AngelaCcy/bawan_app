"use client";

const STEPS = [
  { id: "upload", label: "上傳" },
  { id: "mapping", label: "欄位對應" },
  { id: "preview", label: "預覽確認" },
  { id: "result", label: "匯入結果" },
] as const;

export default function StepIndicator({ current }: { current: string }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);
  return (
    <ol className="flex items-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <li key={s.id} className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${
              i <= currentIndex
                ? "bg-[#9E7C59] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {i + 1}
          </span>
          <span
            className={`text-sm ${
              i === currentIndex ? "font-semibold text-[#8A6A4A]" : "text-gray-500"
            }`}
          >
            {s.label}
          </span>
          {i < STEPS.length - 1 && (
            <span className="w-8 h-px bg-gray-300 mx-1" aria-hidden />
          )}
        </li>
      ))}
    </ol>
  );
}

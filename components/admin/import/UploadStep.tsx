"use client";

import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { ParsedSheet } from "@/app/types/product-import";
import { parseWorkbook } from "@/lib/xlsx-import";

export default function UploadStep({
  onParsed,
}: {
  onParsed: (sheets: ParsedSheet[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("請上傳 .xlsx 檔案（廠商報價單）");
      return;
    }
    setParsing(true);
    try {
      const sheets = await parseWorkbook(await file.arrayBuffer());
      if (sheets.length === 0) {
        toast.error("檔案中沒有可匯入的資料");
        return;
      }
      const totalRows = sheets.reduce((sum, s) => sum + s.rows.length, 0);
      toast.success(
        `已讀取 ${sheets.length} 個工作表，共 ${totalRows} 列資料`
      );
      onParsed(sheets);
    } catch {
      toast.error("無法解析檔案，請確認格式是否正確");
    } finally {
      setParsing(false);
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
        dragOver ? "border-[#9E7C59] bg-[#F5EEE0]" : "border-gray-300"
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        data-testid="xlsx-file-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {parsing ? (
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#9E7C59]" />
          <p>解析檔案中…（含圖片的檔案需要一點時間）</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <FileSpreadsheet className="w-10 h-10 text-[#B08866]" />
          <p className="font-medium">拖曳廠商報價單到這裡，或點擊選擇檔案</p>
          <p className="text-sm text-gray-400">
            支援 .xlsx（Excel）格式，內嵌圖片會自動擷取
          </p>
        </div>
      )}
    </div>
  );
}

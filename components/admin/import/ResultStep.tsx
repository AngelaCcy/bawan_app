"use client";

import Link from "next/link";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { ImportResultSummary } from "@/app/types/product-import";
import { Button } from "@/components/ui/button";

export default function ResultStep({
  result,
  imageFailures,
  onReset,
}: {
  result: ImportResultSummary;
  imageFailures: number;
  onReset: () => void;
}) {
  return (
    <div className="space-y-6" data-testid="import-result">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-2xl font-semibold">{result.created}</p>
            <p className="text-sm text-gray-500">已建立</p>
          </div>
        </div>
        <div className="border rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          <div>
            <p className="text-2xl font-semibold">{result.skipped.length}</p>
            <p className="text-sm text-gray-500">已存在（略過）</p>
          </div>
        </div>
        <div className="border rounded-lg p-4 flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-2xl font-semibold">{result.failed.length}</p>
            <p className="text-sm text-gray-500">失敗</p>
          </div>
        </div>
      </div>

      {imageFailures > 0 && (
        <p className="text-sm text-amber-600">
          {imageFailures} 張圖片上傳失敗，該商品已以無圖片方式匯入
        </p>
      )}

      {result.skipped.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">已存在（依品號略過）</h3>
          <ul className="text-sm text-gray-500 space-y-1 max-h-40 overflow-y-auto">
            {result.skipped.map((s, i) => (
              <li key={`${s.sku}-${i}`}>
                {s.sku} — {s.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.failed.length > 0 && (
        <div className="border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2 text-red-600">匯入失敗</h3>
          <ul className="text-sm text-gray-500 space-y-1 max-h-40 overflow-y-auto">
            {result.failed.map((f, i) => (
              <li key={`${f.sku}-${i}`}>
                {f.sku || "（無品號）"} — {f.title}：{f.error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={onReset} variant="custom">
          再匯入一批
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">查看商品清單</Link>
        </Button>
      </div>
    </div>
  );
}

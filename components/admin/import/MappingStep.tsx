"use client";

import { Dispatch, SetStateAction } from "react";
import {
  ColumnMapping,
  ParsedSheet,
  ProductField,
  SheetConfig,
  SheetKind,
} from "@/app/types/product-import";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NONE = "__none__";

const FIELD_LABELS: { field: ProductField; label: string; required?: boolean }[] = [
  { field: "name", label: "品名", required: true },
  { field: "price", label: "售價 (1p)", required: true },
  { field: "sku", label: "品號" },
  { field: "barcode", label: "國際條碼" },
  { field: "image", label: "圖片" },
  { field: "marketPrice", label: "市場價" },
  { field: "bulkPrice", label: "大量價 (20p)" },
  { field: "stock", label: "數量" },
  { field: "arrivalNote", label: "到貨日" },
];

export default function MappingStep({
  sheets,
  configs,
  setConfigs,
  defaultCategory,
  setDefaultCategory,
  onBack,
  onNext,
}: {
  sheets: ParsedSheet[];
  configs: Record<string, SheetConfig>;
  setConfigs: Dispatch<SetStateAction<Record<string, SheetConfig>>>;
  defaultCategory: string;
  setDefaultCategory: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  function updateConfig(sheetName: string, patch: Partial<SheetConfig>) {
    setConfigs((prev) => ({
      ...prev,
      [sheetName]: { ...prev[sheetName], ...patch },
    }));
  }

  function updateMapping(
    sheetName: string,
    field: ProductField,
    letter: string
  ) {
    setConfigs((prev) => {
      const mapping: ColumnMapping = { ...prev[sheetName].mapping };
      if (letter === NONE) delete mapping[field];
      else mapping[field] = letter;
      return { ...prev, [sheetName]: { ...prev[sheetName], mapping } };
    });
  }

  const canProceed = sheets.some((sheet) => {
    const config = configs[sheet.name];
    return config?.include && config.mapping.name && config.mapping.price;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Label htmlFor="default-category" className="shrink-0">
          預設分類
        </Label>
        <Input
          id="default-category"
          value={defaultCategory}
          onChange={(e) => setDefaultCategory(e.target.value)}
          className="max-w-48"
          placeholder="例如：保養"
        />
        <p className="text-xs text-gray-400">套用到這批匯入的所有商品</p>
      </div>

      {sheets.map((sheet) => {
        const config = configs[sheet.name];
        if (!config) return null;
        return (
          <div key={sheet.name} className="border rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Checkbox
                  checked={config.include}
                  onCheckedChange={(v) =>
                    updateConfig(sheet.name, { include: v === true })
                  }
                />
                工作表「{sheet.name}」
                <span className="text-gray-400 font-normal">
                  {sheet.rows.length} 列
                </span>
              </label>
              <Select
                value={config.kind}
                onValueChange={(v) =>
                  updateConfig(sheet.name, { kind: v as SheetKind })
                }
              >
                <SelectTrigger size="sm" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instock">現貨</SelectItem>
                  <SelectItem value="preorder">預購</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.include && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FIELD_LABELS.map(({ field, label, required }) => {
                  if (field === "arrivalNote" && config.kind !== "preorder") {
                    return null;
                  }
                  const missing = required && !config.mapping[field];
                  return (
                    <div key={field} className="flex flex-col gap-1">
                      <span
                        className={`text-xs ${
                          missing ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        {label}
                        {required && " *"}
                      </span>
                      <Select
                        value={config.mapping[field] ?? NONE}
                        onValueChange={(v) =>
                          updateMapping(sheet.name, field, v)
                        }
                      >
                        <SelectTrigger size="sm" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE}>— 不使用 —</SelectItem>
                          {sheet.columns.map((col) => (
                            <SelectItem key={col.letter} value={col.letter}>
                              {col.letter}
                              {col.header ? `：${col.header}` : "（無標題）"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          重新上傳
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-[#9E7C59] hover:bg-[#8A6A4A] text-white"
          data-testid="mapping-next"
        >
          下一步：預覽
        </Button>
      </div>
    </div>
  );
}

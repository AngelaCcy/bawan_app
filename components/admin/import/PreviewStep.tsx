"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { ParsedProduct } from "@/app/types/product-import";
import { findExistingSkus } from "@/app/utils/admin-actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FinalProduct, ImportProgress } from "./ImportWizard";

type RowEdit = {
  brand?: string;
  title?: string;
  size?: string;
  price?: string; // kept as string while typing
};

function effective(p: ParsedProduct, edit: RowEdit | undefined) {
  const priceText = edit?.price;
  const price =
    priceText === undefined
      ? p.price
      : /^\d+$/.test(priceText.trim())
        ? Number(priceText.trim())
        : null;
  return {
    brand: (edit?.brand ?? p.brand).trim(),
    title: (edit?.title ?? p.title).trim(),
    size: (edit?.size ?? p.size).trim(),
    price,
  };
}

function isValid(p: ParsedProduct, edit: RowEdit | undefined) {
  const e = effective(p, edit);
  return (
    p.errors.length === 0 &&
    e.brand.length > 0 &&
    e.title.length > 0 &&
    e.size.length > 0 &&
    e.price !== null &&
    e.price > 0
  );
}

const PreviewRow = memo(function PreviewRow({
  product,
  edit,
  selected,
  duplicate,
  showArrival,
  onToggle,
  onEdit,
}: {
  product: ParsedProduct;
  edit: RowEdit | undefined;
  selected: boolean;
  duplicate: boolean;
  showArrival: boolean;
  onToggle: (key: string) => void;
  onEdit: (key: string, patch: RowEdit) => void;
}) {
  const valid = isValid(product, edit);
  const e = effective(product, edit);

  return (
    <TableRow data-testid="preview-row" className={valid ? "" : "bg-red-50"}>
      <TableCell>
        <Checkbox
          checked={selected}
          disabled={!valid}
          onCheckedChange={() => onToggle(product.key)}
          aria-label="選擇此商品"
        />
      </TableCell>
      <TableCell>
        {product.imageDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- data URL from parsed xlsx; next/image can't optimize these
          <img
            src={product.imageDataUrl}
            alt=""
            loading="lazy"
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-gray-100" />
        )}
      </TableCell>
      <TableCell className="text-xs text-gray-500 whitespace-nowrap">
        {product.sku || "—"}
      </TableCell>
      <TableCell>
        <Input
          value={edit?.brand ?? product.brand}
          onChange={(ev) => onEdit(product.key, { brand: ev.target.value })}
          className="h-8 min-w-24 text-sm"
        />
      </TableCell>
      <TableCell>
        <Input
          value={edit?.title ?? product.title}
          onChange={(ev) => onEdit(product.key, { title: ev.target.value })}
          className="h-8 min-w-52 text-sm"
        />
      </TableCell>
      <TableCell>
        <Input
          value={edit?.size ?? product.size}
          onChange={(ev) => onEdit(product.key, { size: ev.target.value })}
          className="h-8 w-24 text-sm"
        />
      </TableCell>
      <TableCell>
        <Input
          value={edit?.price ?? (product.price !== null ? String(product.price) : "")}
          onChange={(ev) => onEdit(product.key, { price: ev.target.value })}
          inputMode="numeric"
          className={`h-8 w-24 text-sm ${
            e.price === null || e.price <= 0 ? "border-red-400" : ""
          }`}
        />
      </TableCell>
      <TableCell className="text-sm text-gray-400 whitespace-nowrap">
        {product.marketPrice !== null ? product.marketPrice : "—"}
      </TableCell>
      <TableCell className="text-sm whitespace-nowrap">{product.stock}</TableCell>
      {showArrival && (
        <TableCell className="text-sm whitespace-nowrap">
          {product.arrivalNote || "—"}
        </TableCell>
      )}
      <TableCell>
        {!valid ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 whitespace-nowrap">
            錯誤
          </span>
        ) : duplicate ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 whitespace-nowrap">
            已存在
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 whitespace-nowrap">
            可匯入
          </span>
        )}
      </TableCell>
    </TableRow>
  );
});

function PreviewSection({
  title,
  products,
  edits,
  selection,
  duplicates,
  showArrival,
  onToggle,
  onEdit,
}: {
  title: string;
  products: ParsedProduct[];
  edits: Record<string, RowEdit>;
  selection: Set<string>;
  duplicates: Set<string>;
  showArrival: boolean;
  onToggle: (key: string) => void;
  onEdit: (key: string, patch: RowEdit) => void;
}) {
  if (products.length === 0) return null;
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        {title}
        <span className="text-sm font-normal text-gray-400">
          {products.length} 筆
        </span>
      </h2>
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>圖片</TableHead>
              <TableHead>品號</TableHead>
              <TableHead>品牌</TableHead>
              <TableHead>品名</TableHead>
              <TableHead>尺寸</TableHead>
              <TableHead>售價</TableHead>
              <TableHead>市場價</TableHead>
              <TableHead>數量</TableHead>
              {showArrival && <TableHead>到貨日</TableHead>}
              <TableHead>狀態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <PreviewRow
                key={p.key}
                product={p}
                edit={edits[p.key]}
                selected={selection.has(p.key)}
                duplicate={duplicates.has(p.sku)}
                showArrival={showArrival}
                onToggle={onToggle}
                onEdit={onEdit}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function PreviewStep({
  products,
  importing,
  progress,
  onBack,
  onImport,
}: {
  products: ParsedProduct[];
  importing: boolean;
  progress: ImportProgress | null;
  onBack: () => void;
  onImport: (selected: FinalProduct[]) => void;
}) {
  const [edits, setEdits] = useState<Record<string, RowEdit>>({});
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [duplicates, setDuplicates] = useState<Set<string>>(new Set());
  const [dupesLoaded, setDupesLoaded] = useState(false);

  // Initial selection: every valid row; duplicates removed once known
  useEffect(() => {
    setEdits({});
    setSelection(
      new Set(products.filter((p) => isValid(p, undefined)).map((p) => p.key))
    );
    setDupesLoaded(false);
  }, [products]);

  useEffect(() => {
    let cancelled = false;
    async function loadDuplicates() {
      const skus = products.map((p) => p.sku).filter(Boolean);
      if (skus.length === 0) {
        setDupesLoaded(true);
        return;
      }
      try {
        const existing = await findExistingSkus(skus);
        if (cancelled) return;
        const dupes = new Set(existing);
        setDuplicates(dupes);
        setSelection((prev) => {
          const next = new Set(prev);
          for (const p of products) {
            if (dupes.has(p.sku)) next.delete(p.key);
          }
          return next;
        });
        if (dupes.size > 0) {
          toast(`${dupes.size} 筆商品已存在（依品號判斷），預設不匯入`);
        }
      } catch {
        toast.error("無法檢查重複商品");
      } finally {
        if (!cancelled) setDupesLoaded(true);
      }
    }
    loadDuplicates();
    return () => {
      cancelled = true;
    };
  }, [products]);

  const onToggle = useCallback((key: string) => {
    setSelection((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const onEdit = useCallback((key: string, patch: RowEdit) => {
    setEdits((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }, []);

  const instock = useMemo(
    () => products.filter((p) => p.sheetKind === "instock"),
    [products]
  );
  const preorder = useMemo(
    () => products.filter((p) => p.sheetKind === "preorder"),
    [products]
  );

  const invalidCount = products.filter((p) => !isValid(p, edits[p.key])).length;
  const selectedCount = [...selection].filter((key) => {
    const p = products.find((x) => x.key === key);
    return p && isValid(p, edits[p.key]);
  }).length;

  function handleConfirm() {
    const finals: FinalProduct[] = [];
    for (const p of products) {
      if (!selection.has(p.key)) continue;
      const edit = edits[p.key];
      if (!isValid(p, edit)) continue;
      const e = effective(p, edit);
      finals.push({
        ...p,
        brand: e.brand,
        title: e.title,
        size: e.size,
        price: e.price as number,
      });
    }
    if (finals.length === 0) {
      toast.error("請至少選擇一筆商品");
      return;
    }
    onImport(finals);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span>共 {products.length} 筆</span>
        {invalidCount > 0 && (
          <span className="text-red-500">{invalidCount} 筆有錯誤（不可匯入）</span>
        )}
        {duplicates.size > 0 && (
          <span className="text-amber-600">{duplicates.size} 筆已存在</span>
        )}
        {!dupesLoaded && <span>檢查重複商品中…</span>}
      </div>

      <PreviewSection
        title="現貨"
        products={instock}
        edits={edits}
        selection={selection}
        duplicates={duplicates}
        showArrival={false}
        onToggle={onToggle}
        onEdit={onEdit}
      />
      <PreviewSection
        title="預購"
        products={preorder}
        edits={edits}
        selection={selection}
        duplicates={duplicates}
        showArrival
        onToggle={onToggle}
        onEdit={onEdit}
      />

      <div className="sticky bottom-0 bg-[#EDEDE9] py-3 flex items-center justify-between border-t">
        <Button variant="outline" onClick={onBack} disabled={importing}>
          上一步
        </Button>
        <div className="flex items-center gap-4">
          {importing && progress && (
            <span className="text-sm text-gray-500">
              {progress.phase === "images" ? "上傳圖片中" : "建立商品中"}{" "}
              {progress.done}/{progress.total}
            </span>
          )}
          <Button
            onClick={handleConfirm}
            disabled={importing || selectedCount === 0}
            className="bg-[#9E7C59] hover:bg-[#8A6A4A] text-white"
            data-testid="import-confirm"
          >
            {importing ? "匯入中…" : `匯入 ${selectedCount} 筆商品`}
          </Button>
        </div>
      </div>
    </div>
  );
}

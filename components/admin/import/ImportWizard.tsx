"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { upload } from "@vercel/blob/client";
import {
  ImportResultSummary,
  ParsedProduct,
  ParsedSheet,
  SheetConfig,
} from "@/app/types/product-import";
import { applyMapping, dataUrlToBlob } from "@/lib/xlsx-import";
import { findExistingSkus, importProducts } from "@/app/utils/admin-actions";
import {
  ImportProductInput,
  IMPORT_BATCH_SIZE,
} from "@/lib/validations/product-import";
import StepIndicator from "./StepIndicator";
import UploadStep from "./UploadStep";
import MappingStep from "./MappingStep";
import PreviewStep from "./PreviewStep";
import ResultStep from "./ResultStep";

type Step = "upload" | "mapping" | "preview" | "result";

export type ImportProgress = {
  phase: "images" | "products";
  done: number;
  total: number;
};

/** A reviewed, selected product ready to import (preview edits applied). */
export type FinalProduct = ParsedProduct & { price: number };

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker)
  );
  return results;
}

export default function ImportWizard() {
  const [step, setStep] = useState<Step>("upload");
  const [sheets, setSheets] = useState<ParsedSheet[]>([]);
  const [configs, setConfigs] = useState<Record<string, SheetConfig>>({});
  const [defaultCategory, setDefaultCategory] = useState("未分類");
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [result, setResult] = useState<ImportResultSummary | null>(null);
  const [imageFailures, setImageFailures] = useState(0);

  function handleParsed(parsed: ParsedSheet[]) {
    setSheets(parsed);
    setConfigs(
      Object.fromEntries(
        parsed.map((sheet) => [
          sheet.name,
          {
            kind: sheet.suggestedKind,
            mapping: sheet.suggestedMapping,
            include: true,
          } satisfies SheetConfig,
        ])
      )
    );
    setStep("mapping");
  }

  function handleMappingNext() {
    const mapped = sheets.flatMap((sheet) => {
      const config = configs[sheet.name];
      if (!config?.include) return [];
      return applyMapping(sheet, config, defaultCategory);
    });
    if (mapped.length === 0) {
      toast.error("沒有可匯入的資料列");
      return;
    }
    setProducts(mapped);
    setStep("preview");
  }

  async function handleImport(selected: FinalProduct[]) {
    setImporting(true);
    setImageFailures(0);
    const summary: ImportResultSummary = {
      created: 0,
      skipped: [],
      failed: [],
    };
    try {
      // Phase 0: drop rows whose sku already exists before spending Blob
      // uploads on them (the server re-checks at create time regardless)
      let toImport = selected;
      const skus = selected.map((p) => p.sku).filter(Boolean);
      if (skus.length > 0) {
        const existing = new Set(await findExistingSkus(skus));
        toImport = selected.filter((p) => !p.sku || !existing.has(p.sku));
        summary.skipped.push(
          ...selected
            .filter((p) => p.sku && existing.has(p.sku))
            .map((p) => ({ sku: p.sku, title: p.title }))
        );
      }

      // Phase 1: browser -> Vercel Blob (direct upload, small concurrency)
      setProgress({ phase: "images", done: 0, total: toImport.length });
      let done = 0;
      let failures = 0;
      const imageUrls = await mapWithConcurrency(toImport, 4, async (p) => {
        let url: string | null = null;
        if (p.imageDataUrl) {
          try {
            const blob = dataUrlToBlob(p.imageDataUrl);
            const name = (p.sku || p.key).replace(/[^\w-]/g, "_");
            const uploaded = await upload(
              `products/${name}.${p.imageExt ?? "png"}`,
              blob,
              {
                access: "public",
                handleUploadUrl: "/api/admin/blob-upload",
              }
            );
            url = uploaded.url;
          } catch {
            failures++;
          }
        }
        done++;
        // Throttled: a state update per image would re-render the whole
        // preview table hundreds of times during a large import
        if (done % 10 === 0 || done === toImport.length) {
          setProgress({ phase: "images", done, total: toImport.length });
        }
        return url;
      });
      setImageFailures(failures);

      // Phase 2: batched server-action creates
      const inputs: ImportProductInput[] = toImport.map((p, i) => ({
        sku: p.sku || undefined,
        barcode: p.barcode || undefined,
        brand: p.brand,
        title: p.title,
        description: "",
        category: p.category || defaultCategory,
        image: imageUrls[i] ? [imageUrls[i] as string] : [],
        isPreorder: p.sheetKind === "preorder",
        arrivalNote: p.arrivalNote || undefined,
        priceItems: [{ size: p.size, price: p.price, stock: p.stock }],
      }));

      const batches: ImportProductInput[][] = [];
      for (let i = 0; i < inputs.length; i += IMPORT_BATCH_SIZE) {
        batches.push(inputs.slice(i, i + IMPORT_BATCH_SIZE));
      }
      setProgress({ phase: "products", done: 0, total: inputs.length });
      let imported = 0;
      for (const batch of batches) {
        try {
          const batchResult = await importProducts(batch);
          summary.created += batchResult.created;
          summary.skipped.push(...batchResult.skipped);
          summary.failed.push(...batchResult.failed);
        } catch {
          // A failed call must not lose the summary of what was already
          // created — record the batch and keep going
          summary.failed.push(
            ...batch.map((p) => ({
              sku: p.sku ?? "",
              title: p.title,
              error: "連線失敗，此批未匯入",
            }))
          );
        }
        imported += batch.length;
        setProgress({ phase: "products", done: imported, total: inputs.length });
      }

      setResult(summary);
      setStep("result");
      if (summary.created > 0) toast.success(`已匯入 ${summary.created} 筆商品`);
    } catch (error) {
      // Even on unexpected errors, surface whatever partial progress exists
      const message = error instanceof Error ? error.message : "匯入失敗";
      toast.error(message);
      if (summary.created + summary.skipped.length + summary.failed.length > 0) {
        setResult(summary);
        setStep("result");
      }
    } finally {
      setImporting(false);
      setProgress(null);
    }
  }

  function handleReset() {
    setStep("upload");
    setSheets([]);
    setConfigs({});
    setProducts([]);
    setResult(null);
    setImageFailures(0);
  }

  return (
    <div>
      <StepIndicator current={step} />
      {step === "upload" && <UploadStep onParsed={handleParsed} />}
      {step === "mapping" && (
        <MappingStep
          sheets={sheets}
          configs={configs}
          setConfigs={setConfigs}
          defaultCategory={defaultCategory}
          setDefaultCategory={setDefaultCategory}
          onBack={handleReset}
          onNext={handleMappingNext}
        />
      )}
      {step === "preview" && (
        <PreviewStep
          products={products}
          importing={importing}
          progress={progress}
          onBack={() => setStep("mapping")}
          onImport={handleImport}
        />
      )}
      {step === "result" && result && (
        <ResultStep
          result={result}
          imageFailures={imageFailures}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

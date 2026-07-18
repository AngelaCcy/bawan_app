// Pure parsing logic for the admin vendor-xlsx product import.
// Runs in the browser (ExcelJS is dynamically imported so it never enters
// shopper bundles); no React in this file so everything is unit-testable.

import type { Workbook, Worksheet, Cell, Media } from "exceljs";
import {
  ColumnMapping,
  ParsedProduct,
  ParsedSheet,
  RawRow,
  SheetColumn,
  SheetConfig,
} from "@/app/types/product-import";

// ---------- workbook parsing ----------

// ExcelJS types media items without the runtime `index` field that
// worksheet.getImages() imageIds refer to.
type MediaItem = Media & { index?: number };

const IMAGE_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  bmp: "image/bmp",
  webp: "image/webp",
};

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);/)?.[1] ?? "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function columnLetter(col: number): string {
  let letter = "";
  let n = col;
  while (n > 0) {
    const rem = (n - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    n = Math.floor((n - 1) / 26);
  }
  return letter;
}

function cellText(cell: Cell): string {
  const text = cell.text;
  if (text == null) return "";
  return String(text).trim();
}

/** Map of 1-based Excel row number -> embedded image for one worksheet. */
function extractRowImages(
  workbook: Workbook,
  worksheet: Worksheet
): Map<number, { dataUrl: string; ext: string }> {
  const result = new Map<number, { dataUrl: string; ext: string }>();
  const media: MediaItem[] = workbook.model.media ?? [];

  for (const image of worksheet.getImages()) {
    const id = Number(image.imageId);
    const item =
      media.find((m) => m.index === id) ??
      (Number.isInteger(id) ? media[id] : undefined);
    if (!item?.buffer) continue;

    const ext = item.extension?.toLowerCase() ?? "png";
    const mime = IMAGE_MIME[ext] ?? "image/png";
    const rowNumber = Math.floor(image.range.tl.nativeRow) + 1;
    if (!result.has(rowNumber)) {
      // exceljs types buffer as ArrayBuffer but yields Uint8Array at runtime;
      // the Uint8Array constructor handles both
      const bytes = new Uint8Array(item.buffer);
      result.set(rowNumber, {
        dataUrl: `data:${mime};base64,${toBase64(bytes)}`,
        ext,
      });
    }
  }
  return result;
}

export async function parseWorkbook(buffer: ArrayBuffer): Promise<ParsedSheet[]> {
  // exceljs is CJS; depending on bundler interop the namespace may sit on .default
  const mod = await import("exceljs");
  const ExcelJS = mod.default ?? mod;
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheets: ParsedSheet[] = [];
  workbook.eachSheet((worksheet) => {
    const headerRow = worksheet.getRow(1);
    const columns: SheetColumn[] = [];
    for (let c = 1; c <= worksheet.columnCount; c++) {
      columns.push({
        letter: columnLetter(c),
        header: cellText(headerRow.getCell(c)),
      });
    }

    const rowImages = extractRowImages(workbook, worksheet);
    const rows: RawRow[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const cells: Record<string, string> = {};
      let hasData = false;
      for (let c = 1; c <= worksheet.columnCount; c++) {
        const text = cellText(row.getCell(c));
        cells[columnLetter(c)] = text;
        if (text) hasData = true;
      }
      const image = rowImages.get(rowNumber);
      if (!hasData && !image) return;
      rows.push({
        rowNumber,
        cells,
        imageDataUrl: image?.dataUrl,
        imageExt: image?.ext,
      });
    });

    if (rows.length === 0) return;
    sheets.push({
      name: worksheet.name,
      columns,
      rows,
      suggestedMapping: suggestMapping(columns),
      suggestedKind:
        worksheet.name.includes("預購") ||
        (!worksheet.name.includes("現貨") &&
          columns.some((c) => c.header.includes("到貨")))
          ? "preorder"
          : "instock",
    });
  });

  return sheets;
}

// ---------- column mapping ----------

const HEADER_PATTERNS: [RegExp, keyof ColumnMapping][] = [
  [/品號|貨號|型號/, "sku"],
  [/條碼|barcode/i, "barcode"],
  [/品名|商品名|名稱/, "name"],
  [/圖片|圖檔|image/i, "image"],
  [/市場價|市價|建議售價/, "marketPrice"],
  [/^1p$/i, "price"],
  [/^20p$/i, "bulkPrice"],
  [/數量|庫存|qty/i, "stock"],
  [/到貨/, "arrivalNote"],
];

export function suggestMapping(columns: SheetColumn[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  for (const col of columns) {
    if (!col.header) continue;
    for (const [pattern, field] of HEADER_PATTERNS) {
      if (!mapping[field] && pattern.test(col.header)) {
        mapping[field] = col.letter;
        break;
      }
    }
  }
  return mapping;
}

// ---------- 品名 parsing ----------

const COUNTRY_TOKENS = new Set([
  "日本", "韓國", "法國", "美國", "英國", "德國", "義大利",
  "澳洲", "泰國", "台灣", "瑞士", "西班牙", "加拿大", "中國",
  "以色列", "希臘", "紐西蘭", "丹麥", "瑞典", "芬蘭", "荷蘭",
  "比利時", "新加坡", "馬來西亞", "印尼", "越南", "印度",
]);

const KNOWN_CHINESE_BRANDS = new Set([
  "黛珂", "植村秀", "雪肌精", "高絲", "資生堂", "佳麗寶", "蘭蔻",
  "雅詩蘭黛", "曼秀雷敦", "花王", "芳珂", "奧爾濱", "肌研", "專科",
]);

const LATIN_TOKEN = /^[A-Za-z][A-Za-z0-9&.'+-]*$/;
const SIZE_PATTERN =
  /(\d+(?:\.\d+)?\s*(?:ml|mL|ML|cc|g|G|kg|L|枚|片|入|錠|顆|包|組|支|條|瓶))(?![A-Za-z0-9])/g;

/**
 * Splits a combined vendor 品名 like "日本 ALBION 健康化妝水N 330ml" into
 * brand / title / size. Heuristic only — every field stays editable in the
 * preview step, so misses are recoverable.
 */
export function parseProductName(raw: string): {
  brand: string;
  title: string;
  size: string;
} {
  const normalized = raw.replace(/[\s　]+/g, " ").trim();
  if (!normalized) return { brand: "", title: "", size: "標準" };

  let tokens = normalized.split(" ");
  if (tokens.length > 1 && COUNTRY_TOKENS.has(tokens[0])) {
    tokens = tokens.slice(1);
  }

  const brandTokens: string[] = [];
  while (
    tokens.length > 1 &&
    LATIN_TOKEN.test(tokens[0]) &&
    !SIZE_PATTERN.test(tokens[0])
  ) {
    SIZE_PATTERN.lastIndex = 0;
    brandTokens.push(tokens[0]);
    tokens = tokens.slice(1);
  }
  SIZE_PATTERN.lastIndex = 0;

  if (brandTokens.length === 0) {
    if (tokens.length > 1 && KNOWN_CHINESE_BRANDS.has(tokens[0])) {
      brandTokens.push(tokens[0]);
      tokens = tokens.slice(1);
    }
  } else if (tokens.length > 1 && KNOWN_CHINESE_BRANDS.has(tokens[0])) {
    // e.g. "SHU UEMURA 植村秀 ..." — keep both halves as the brand
    brandTokens.push(tokens[0]);
    tokens = tokens.slice(1);
  }

  if (brandTokens.length === 0 && tokens.length > 1) {
    brandTokens.push(tokens[0]);
    tokens = tokens.slice(1);
  }

  let title = tokens.join(" ");
  let size = "標準";
  const matches = [...title.matchAll(SIZE_PATTERN)];
  if (matches.length > 0) {
    const last = matches[matches.length - 1];
    size = last[1].replace(/\s+/g, "");
    title = (
      title.slice(0, last.index) +
      title.slice((last.index ?? 0) + last[0].length)
    )
      .replace(/\s+/g, " ")
      .trim();
  }

  if (!title) title = normalized;
  return { brand: brandTokens.join(" "), title, size };
}

// ---------- value cleaning & row -> product ----------

export function cleanPrice(raw: string): number | null {
  const cleaned = raw.replace(/NT\$|\$|元|,|\s/g, "");
  if (!cleaned) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;
  return Math.round(value);
}

function cleanStock(raw: string): number {
  const value = cleanPrice(raw);
  return value !== null && value >= 0 ? value : 0;
}

export function applyMapping(
  sheet: ParsedSheet,
  config: SheetConfig,
  defaultCategory: string
): ParsedProduct[] {
  const { mapping, kind } = config;
  const get = (row: RawRow, field: keyof ColumnMapping): string => {
    const letter = mapping[field];
    return letter ? (row.cells[letter] ?? "") : "";
  };

  return sheet.rows.map((row) => {
    const errors: string[] = [];
    const rawName = get(row, "name");
    const { brand, title, size } = parseProductName(rawName);
    if (!rawName) errors.push("品名為必填");

    const price = cleanPrice(get(row, "price"));
    if (price === null || price <= 0) errors.push("售價 (1p) 需為正整數");

    return {
      key: `${sheet.name}:${row.rowNumber}`,
      sheetName: sheet.name,
      sheetKind: kind,
      sku: get(row, "sku"),
      barcode: get(row, "barcode"),
      brand: brand || (rawName ? title : ""),
      title,
      size,
      price,
      marketPrice: cleanPrice(get(row, "marketPrice")),
      stock: cleanStock(get(row, "stock")),
      category: defaultCategory,
      arrivalNote: kind === "preorder" ? get(row, "arrivalNote") : "",
      imageDataUrl: row.imageDataUrl,
      imageExt: row.imageExt,
      errors,
    };
  });
}

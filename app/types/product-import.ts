// Types for the admin vendor-xlsx product import wizard.

export type ProductField =
  | "sku" // 品號
  | "barcode" // 國際條碼
  | "name" // 品名 (combined: country + brand + title + size)
  | "image" // 圖片 (embedded picture column)
  | "marketPrice" // 市場價 / 市價 (reference only)
  | "price" // 1p — default selling price
  | "bulkPrice" // 20p (reference only)
  | "stock" // 數量
  | "arrivalNote"; // 到貨日 (pre-order sheets)

export type SheetKind = "instock" | "preorder";

export type SheetColumn = {
  letter: string; // Excel column letter, stable even with empty headers
  header: string; // header text from row 1 (may be empty)
};

/** Maps a product field to an Excel column letter. */
export type ColumnMapping = Partial<Record<ProductField, string>>;

export type RawRow = {
  rowNumber: number; // 1-based Excel row number
  cells: Record<string, string>; // column letter -> cell text
  imageDataUrl?: string; // embedded image anchored to this row
  imageExt?: string;
};

export type ParsedSheet = {
  name: string;
  columns: SheetColumn[];
  rows: RawRow[];
  suggestedMapping: ColumnMapping;
  suggestedKind: SheetKind;
};

export type SheetConfig = {
  kind: SheetKind;
  mapping: ColumnMapping;
  include: boolean;
};

/** One vendor row = one product (rows carry unique SKUs; shades are separate SKUs). */
export type ParsedProduct = {
  key: string; // `${sheetName}:${rowNumber}` — stable row identity in the wizard
  sheetName: string;
  sheetKind: SheetKind;
  sku: string;
  barcode: string;
  brand: string;
  title: string;
  size: string;
  price: number | null; // defaulted from 1p, editable in preview
  marketPrice: number | null;
  stock: number;
  category: string;
  arrivalNote: string;
  imageDataUrl?: string;
  imageExt?: string;
  errors: string[]; // zh-TW messages; non-empty = row not importable
};

export type ImportResultSummary = {
  created: number;
  skipped: { sku: string; title: string }[];
  failed: { sku: string; title: string; error: string }[];
};

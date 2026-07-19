import ImportWizard from "@/components/admin/import/ImportWizard";

export const metadata = {
  title: "商品批次匯入",
};

export default function ProductImportPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-1">商品批次匯入</h1>
      <p className="text-sm text-gray-500 mb-8">
        上傳廠商報價單（.xlsx），確認欄位對應與商品內容後批次加入商品清單
      </p>
      <ImportWizard />
    </div>
  );
}

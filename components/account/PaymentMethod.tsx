"use client";

import { useState, useEffect } from "react";
import { CreditCard, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface Card {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export default function PaymentMethod() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  async function loadCards() {
    try {
      const res = await fetch("/api/stripe/payment-methods");
      const data = await res.json();
      setCards(data.paymentMethods ?? []);
    } catch {
      toast.error("無法載入付款方式");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCards(); }, []);

  async function handleRemove(paymentMethodId: string) {
    try {
      await fetch("/api/stripe/payment-methods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId }),
      });
      toast.success("已移除付款方式");
      loadCards();
    } catch {
      toast.error("移除失敗");
    }
  }

  async function handleManage() {
    setRedirecting(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      toast.error("無法開啟付款管理頁面");
      setRedirecting(false);
    }
  }

  const brandLabel: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "American Express",
    jcb: "JCB",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">付款方式</h2>
        <Button
          variant="custom"
          size="sm"
          onClick={handleManage}
          disabled={redirecting}
        >
          {redirecting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <ExternalLink className="w-4 h-4 mr-1" />
          )}
          管理付款方式
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> 載入中...
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">尚未新增付款方式</p>
          <p className="text-xs mt-1">點選「管理付款方式」以新增信用卡</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((pm) => (
            <div
              key={pm.id}
              className="flex items-center justify-between border rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">
                    {brandLabel[pm.card.brand] ?? pm.card.brand} •••• {pm.card.last4}
                  </p>
                  <p className="text-xs text-gray-400">
                    到期 {String(pm.card.exp_month).padStart(2, "0")}/{pm.card.exp_year}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
                onClick={() => handleRemove(pm.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

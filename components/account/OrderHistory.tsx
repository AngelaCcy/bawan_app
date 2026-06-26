"use client";

import { useEffect, useState } from "react";
import { Order, OrderItem, OrderStatus } from "@prisma/client";
import { getUserOrders } from "@/app/utils/actions";
import { format } from "date-fns";
import { Package } from "lucide-react";
import Image from "next/image";

type OrderWithItems = Order & { items: OrderItem[] };

const statusLabel: Record<OrderStatus, string> = {
  PENDING: "待處理",
  PROCESSING: "處理中",
  SHIPPED: "已出貨",
  DELIVERED: "已送達",
  CANCELLED: "已取消",
};

const statusColor: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOrders().then((data) => {
      setOrders(data as OrderWithItems[]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-400">載入訂單中...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="text-sm">尚無訂單紀錄</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">訂單追蹤</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
              <div className="text-sm">
                <span className="text-gray-400 mr-2">訂單日期</span>
                <span>{format(new Date(order.createdAt), "yyyy-MM-dd")}</span>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[order.status]}`}>
                {statusLabel[order.status]}
              </span>
            </div>
            <div className="p-4 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 object-cover rounded"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.brand} {item.name}</p>
                    <p className="text-xs text-gray-400">{item.size} × {item.qty}</p>
                  </div>
                  <p className="text-sm font-medium">NT$ {Number(item.price).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t bg-gray-50 flex justify-end">
              <p className="text-sm">
                <span className="text-gray-400 mr-2">訂單總計</span>
                <span className="font-semibold">NT$ {Number(order.total).toLocaleString()}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

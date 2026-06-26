"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import UserProfile from "./UserProfile";
import ShippingAddress from "./ShippingAddress";
import PaymentMethod from "./PaymentMethod";
import OrderHistory from "./OrderHistory";
import AdminPanel from "./AdminPanel";
import { Role } from "@prisma/client";

const tabs = [
  { key: "profile", label: "會員中心" },
  { key: "orders", label: "訂單追蹤" },
  { key: "address", label: "送貨資料" },
  { key: "payment", label: "付款方式" },
];

interface Props {
  role: Role;
}

export default function MyAccountTabs({ role }: Props) {
  const [activeTab, setActiveTab] = useState("profile");

  const allTabs =
    role === "ADMIN" ? [...tabs, { key: "admin", label: "管理員" }] : tabs;

  return (
    <div className="flex md:h-screen overflow-hidden flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:sticky top-0 flex mb-10 border-b border-black md:w-64 md:h-screen overflow-hidden md:flex-col gap-5 mt-5 md:justify-start justify-center">
        {allTabs.map((tab) => (
          <Button
            key={tab.key}
            variant="ghost"
            className="text-base font-semibold relative pb-1 transition cursor-pointer"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 h-0.5 w-1/2 bg-[#B08866]" />
            )}
          </Button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "profile" && <UserProfile />}
        {activeTab === "orders" && <OrderHistory />}
        {activeTab === "address" && <ShippingAddress />}
        {activeTab === "payment" && <PaymentMethod />}
        {activeTab === "admin" && role === "ADMIN" && <AdminPanel />}
      </div>
    </div>
  );
}

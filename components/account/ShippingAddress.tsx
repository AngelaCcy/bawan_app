"use client";

import { useState, useEffect } from "react";
import { Address } from "@prisma/client";
import { toast } from "react-hot-toast";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressFormComponent from "@/components/form/address-form";
import { getUserAddresses, deleteAddress, setDefaultAddress } from "@/app/utils/actions";

export default function ShippingAddress() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editing, setEditing] = useState<Address | null>(null);
  const [adding, setAdding] = useState(false);

  async function load() {
    const data = await getUserAddresses();
    setAddresses(data);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    try {
      await deleteAddress(id);
      toast.success("地址已刪除");
      load();
    } catch {
      toast.error("刪除失敗");
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await setDefaultAddress(id);
      toast.success("預設地址已更新");
      load();
    } catch {
      toast.error("操作失敗");
    }
  }

  if (adding || editing) {
    return (
      <div className="max-w-lg">
        <h2 className="text-lg font-semibold mb-4">
          {editing ? "編輯地址" : "新增地址"}
        </h2>
        <AddressFormComponent
          existing={editing ?? undefined}
          onDone={() => { setAdding(false); setEditing(null); load(); }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">送貨地址</h2>
        <Button variant="custom" size="sm" onClick={() => setAdding(true)}>
          <Plus className="w-4 h-4 mr-1" /> 新增地址
        </Button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-gray-500 text-sm">尚未新增任何地址</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="border rounded-lg p-4 relative"
            >
              {addr.isDefault && (
                <span className="absolute top-3 right-3 text-xs bg-[#B08866] text-white px-2 py-0.5 rounded-full">
                  預設
                </span>
              )}
              <p className="font-semibold text-sm mb-1">{addr.label}</p>
              <p className="text-sm">{addr.recipient} · {addr.phone}</p>
              <p className="text-sm text-gray-600">
                {addr.postalCode} {addr.city} {addr.district} {addr.street}
              </p>
              <div className="flex gap-2 mt-3">
                {!addr.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => handleSetDefault(addr.id)}
                  >
                    <Star className="w-3 h-3 mr-1" /> 設為預設
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setEditing(addr)}
                >
                  <Pencil className="w-3 h-3 mr-1" /> 編輯
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(addr.id)}
                >
                  <Trash2 className="w-3 h-3 mr-1" /> 刪除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

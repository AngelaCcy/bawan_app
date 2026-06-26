"use client";

import { useEffect, useState } from "react";
import { Role } from "@prisma/client";
import { getAllUsers, updateUserRole } from "@/app/utils/actions";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { UserIcon, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  image: string | null;
  createdAt: Date;
};

export default function AdminPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await getAllUsers();
      setUsers(data as UserRow[]);
    } catch {
      toast.error("無法載入使用者清單");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleRole(userId: string, current: Role) {
    const next: Role = current === "ADMIN" ? "USER" : "ADMIN";
    try {
      await updateUserRole(userId, next);
      toast.success(`已更新為 ${next}`);
      load();
    } catch {
      toast.error("更新失敗");
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="w-5 h-5 text-[#B08866]" />
        <h2 className="text-2xl font-semibold">管理員面板</h2>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">載入中...</p>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">{users.length} 位使用者</p>
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 border rounded-lg p-3"
            >
              {u.image ? (
                <Image
                  src={u.image}
                  alt={u.name ?? ""}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{u.name ?? "—"}</p>
                <p className="text-xs text-gray-400 truncate">{u.email}</p>
                <p className="text-xs text-gray-300">{format(new Date(u.createdAt), "yyyy-MM-dd")}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    u.role === "ADMIN"
                      ? "bg-[#B08866]/10 text-[#B08866]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {u.role === "ADMIN" ? "管理員" : "使用者"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => toggleRole(u.id, u.role)}
                >
                  {u.role === "ADMIN" ? (
                    <><User className="w-3 h-3 mr-1" /> 降為一般</>
                  ) : (
                    <><ShieldCheck className="w-3 h-3 mr-1" /> 升為管理員</>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

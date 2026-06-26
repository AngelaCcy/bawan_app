"use client";

import { useRef, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import ProfileForm from "../form/profile-form";
import Image from "next/image";
import { UserIcon, Camera, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import { updateUserAvatar } from "@/app/utils/actions";

export default function UserProfile() {
  const { currentUser, fetchCurrtUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("圖片大小不能超過 4MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/avatar", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      await updateUserAvatar(url);
      await fetchCurrtUser();
      toast.success("頭像已更新！");
    } catch {
      toast.error("上傳失敗，請再試一次");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{currentUser?.name} 您好！</h1>
      <div className="flex justify-between mt-5 py-5 border-b-[0.5px] border-black">
        <h1 className="font-semibold text-2xl">會員資料</h1>
        <Button
          className="mr-10"
          variant="custom"
          onClick={() => setIsEditing(true)}
          disabled={isEditing}
        >
          編輯
        </Button>
      </div>
      <section className="space-y-8">
        <div className="pt-5 flex mt-5">
          <h2 className="text-lg font-semibold mb-2 md:w-64 sm:w-58 w-36">
            基本資料
          </h2>
          {!isEditing ? (
            <div className="flex justify-center">
              <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 justify-items-center items-center content-center">
                {/* Avatar with upload */}
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {currentUser?.image ? (
                    <Image
                      src={currentUser.image}
                      alt="User avatar"
                      width={100}
                      height={100}
                      className="w-[100px] h-[100px] rounded-full object-cover row-start-1 row-end-2"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center border border-black">
                      <UserIcon className="w-10 h-10 text-black" />
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className="text-center">
                  <h3 className="font-semibold py-3">姓名</h3>
                  <p>{currentUser?.name}</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold py-3">信箱</h3>
                  <p className="text-base">{currentUser?.email}</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold py-3">性別</h3>
                  <p>{currentUser?.gender ?? "—"}</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold py-3">生日</h3>
                  {currentUser?.birth ? (
                    <p>{format(currentUser.birth, "yyyy-MM-dd")}</p>
                  ) : (
                    <p className="text-gray-400">沒有設置</p>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold py-3">電話</h3>
                  <p>{currentUser?.phone ?? "—"}</p>
                </div>
              </div>
            </div>
          ) : (
            <ProfileForm setIsEditing={setIsEditing} />
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2 border-b-[0.5px] border-black pb-2">
            訂閱通知
          </h2>
          <p className="text-sm text-gray-400 pt-2">
            {currentUser?.promotion ? "已訂閱最新消息" : "未訂閱最新消息"}
          </p>
        </div>
      </section>
    </div>
  );
}

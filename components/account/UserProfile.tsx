import { useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import ProfileForm from "../form/profile-form";
import Image from "next/image";
import { UserIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";

export default function UserProfile() {
  const { currentUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{currentUser?.name} 您好！</h1>
      <div className="flex justify-between mt-5 py-5 border-b-[0.5px] border-black">
        <h1 className="font-semibold text-2xl">會員中心</h1>
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
            會員資料
          </h2>
          {/* <ProfileForm /> */}
          {!isEditing ? (
            <div className="flex justify-center">
              <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 justify-items-center items-center content-center">
                {currentUser?.image ? (
                  // <div className="">
                  <Image
                    src={currentUser?.image}
                    alt="User avatar"
                    width={50}
                    height={50}
                    className="w-[100px] rounded-full grid-cols-1 row-start-1 row-end-2"
                  />
                ) : (
                  /* </div> */
                  <div className="w-[100px] h-[100px] rounded-full bg-white flex align-middle items-center justify-center border-1 border-black">
                    <UserIcon className="w-10 h-10 text-black" />
                  </div>
                )}

                <div className=" text-center">
                  <h3 className="font-semibold py-3">姓名</h3>
                  <p>{currentUser?.name}</p>
                </div>
                <div className=" text-center">
                  <h3 className="font-semibold py-3">信箱</h3>
                  <p className="text-base">{currentUser?.email}</p>
                </div>

                <div className=" text-center">
                  <h3 className="font-semibold py-3">性別</h3>
                  <p>{currentUser?.gender}</p>
                </div>
                <div className=" text-center">
                  <h3 className="font-semibold py-3">生日</h3>
                  {currentUser?.birth ? (
                    <p>{format(currentUser?.birth, "yyyy-MM-dd")}</p>
                  ) : (
                    <p>沒有設置</p>
                  )}
                </div>
                <div className=" text-center">
                  <h3 className="font-semibold py-3">電話</h3>
                  <p>{currentUser?.phone}</p>
                </div>
              </div>
            </div>
          ) : (
            <ProfileForm setIsEditing={setIsEditing} />
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2 border-b-[0.5px] border-black">
            送貨資料
          </h2>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2 border-b-[0.5px] border-black">
            訂閱
          </h2>
        </div>
      </section>
    </div>
  );
}

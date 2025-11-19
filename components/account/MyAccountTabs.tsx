"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import UserProfile from "./UserProfile";

const tabs = [
  { key: "profile", label: "會員中心" },
  { key: "wishlist", label: "心願清單" },
  { key: "orders", label: "訂單追蹤" },
];

export default function MyAccountTabs() {
  const [activeTab, setAvticeTab] = useState("profile");

  return (
    <div className="flex md:h-screen overflow-hidden flex-col md:flex-row">
      {/* <div className="w-full grid grid-cols-12 px-10 gap-20 h-screen"> */}
      {/* SideBar */}
      <div className="md:sticky top-0 flex mb-10 border-b-1 border-black md:w-64 md:h-screen overflow-hidden md:flex-col gap-5 mt-5 md:justify-start justify-center">
        {/* <div className="col-span-3 space-y-4"> */}
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant="ghost"
            className="text-base font-semibold relative pb-1 transition cursor-pointer"
            onClick={() => setAvticeTab(tab.key)}
          >
            {tab.label}

            {activeTab === tab.key && (
              <span className="absolute bottom-0 h-0.5 w-1/2 bg-[#B08866]" />
            )}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {/* <div className=" col-span-9 flex-1 overflow-y-auto p-6"> */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "profile" && <UserProfile />}

        {/* {activeTab === "wishlist" && <Favorites />} */}
        {/* {activeTab === "orders" && <Orders />} */}
      </div>
    </div>
    // </div>
  );
}

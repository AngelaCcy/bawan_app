"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileHeart, UserRound } from "lucide-react";
import { signOut } from "next-auth/react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useEffect } from "react";
import { SearchOverlay } from "@/components/SearchOverlay";
import CartDrawer from "./cart/CartDrawer";

const UserNav = () => {
  const { currentUser, fetchCurrtUser } = useCurrentUser();

  useEffect(() => {
    fetchCurrtUser();
  }, [fetchCurrtUser]);

  const router = useRouter();

  const handleUserIconClick = () => {
    if (!currentUser) {
      router.push("/signin");
    }
  };

  return (
    <div className="flex justify-center">
      <SearchOverlay />
      {/* <Link href="/search">
        <Search className="nav-icon" />
      </Link> */}
      {currentUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <UserRound className="nav-icon" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-32 mt-2 bg-navbar p-2 flex flex-col gap-2 border-none"
          >
            <DropdownMenuItem className="p-0 flex justify-center data-[highlighted]:bg-transparent focus:bg-transparent">
              <Link
                href="/profile"
                className="w-full py-2 flex justify-center items-center text-[var(--icon)] hover:text-[var(--icon-hover)] transition-colors duration-200"
              >
                會員中心
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 flex justify-center data-[highlighted]:bg-transparent focus:bg-transparent">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full py-2 flex justify-center items-center text-[var(--icon)] hover:text-[var(--icon-hover)] transition-colors duration-200"
              >
                登出
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <button onClick={handleUserIconClick}>
          <UserRound className="nav-icon" />
        </button>
      )}
      <Link href="/favorites">
        <FileHeart className="nav-icon" />
      </Link>
      <CartDrawer />
      {/* <Link href="/cart">
        <ShoppingBag className="nav-icon" />
      </Link> */}
    </div>
  );
};

export default UserNav;

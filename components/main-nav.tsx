"use client";

import { useState } from "react";
// navigation 即是去取Browser上方的網址
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { mainNavLinks } from "@/constant";

const MainNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathName = usePathname();

  return (
    <div className="flex items-center lg:space-x-4 mx-4">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="lg:hidden text-white"
      >
        <Menu />
      </button>
      <div
        className={cn(
          "absolute top-full left-0 w-full border dark:bg-gray-900",
          "lg:border-none lg:static lg:flex lg:space-x-5",
          menuOpen ? "block bg-navbar flex flex-col items-center" : "hidden"
        )}
      >
        {mainNavLinks.map((link) => (
          <Link
            key={link.title}
            href={link.url}
            className={cn(
              "block py-2 px-2 text-sm lg:text-lg transition-colors flex items-center gap-1 nav-icon whitespace-nowrap",
              menuOpen ? "justify-center w-full" : "",
              pathName === link.url ? "border-b-2 border-white" : ""
            )}
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainNav;

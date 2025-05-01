"use client";
// import Link from "next/link";
import { House } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function UserBreadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  const segments = pathname.split("/").filter(Boolean); // remove empty strings

  const nameMap: Record<string, string> = {
    products: "全部商品",
    skincare: "保養品",
    essence: "精華液",
  };

  return (
    <Breadcrumb className="mt-25 md:mt-18">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <House className="size-6" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          const label =
            nameMap[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-[18px]">
                {isLast ? (
                  <BreadcrumbPage className="ml-3 border-b-2 border-black">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

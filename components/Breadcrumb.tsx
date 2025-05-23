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
import { useEffect, useState } from "react";
import { getProductById } from "@/app/utils/actions";

export default function UserBreadcrumb() {
  const pathname = usePathname();
  const [productName, setProductName] = useState<string | undefined>("");

  const segments = pathname.split("/").filter(Boolean); // remove empty strings
  // Detect if we're at /products/[id]
  const isProductDetailPage =
    segments.length === 2 && segments[0] === "products";

  useEffect(() => {
    async function fetchProductName() {
      if (isProductDetailPage) {
        try {
          const product = await getProductById(Number(segments[1]));
          setProductName(product?.title);
        } catch (err) {
          console.error("Failed to fetch product name:", err);
        }
      }
    }
    fetchProductName();
  }, [isProductDetailPage, segments]);

  if (
    pathname === "/" ||
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname.startsWith("/search")
  )
    return null;

  const nameMap: Record<string, string> = {
    products: "全部商品",
    skincare: "保養品",
    essence: "精華液",
    favorites: "心願清單",
  };

  return (
    <Breadcrumb className=" pb-3 mt-28">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <House className="size-6" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          let label =
            nameMap[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1);

          if (isProductDetailPage && index === 1 && productName) {
            label = productName;
          }

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-[17px] ml-3">
                {isLast ? (
                  <BreadcrumbPage className="border-b-2 border-black">
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

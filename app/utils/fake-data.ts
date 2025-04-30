import { z } from "zod";
import type { User } from "@prisma/client";

export type sessionUser = Omit<
  User,
  "emailVerified" | "createdAt" | "updatedAt" | "favoriteIds" | "name"
> & { name: string | null | undefined };

export const ProductSchema = z.object({
  id: z.number(),
  brand: z.string().min(1, { message: "Title is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  priceBySize: z.record(z.string(), z.number()),
  salePriceBySize: z.record(z.string(), z.number()).nullable(),
  sizes: z.string().array(),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  images: z.string().array(),
});

export type Product = z.infer<typeof ProductSchema>;

export interface SaleProduct {
  id: number;
  brand: string;
  title: string;
  priceBySize: Record<string, number>;
  salePriceBySize: Record<string, number> | null;
  sizes: string[];
  description: string;
  // discountPercentage: number;
  // rating: number;
  // stock: number;
  category: string;
  // thumbnail: string;
  images: string[];
  // quantity?: number;
}

export const FAKE_PRODUCT_DATA: Product[] = [
  {
    id: 1,
    brand: "SK-II",
    title: "超能精華王者 青春露",
    priceBySize: {
      "250ml": 4235,
    },
    salePriceBySize: {
      "250ml": 3599,
    },
    sizes: ["250ml"],
    description:
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    category: "men's clothing",
    images: ["/img/SKII1.png"],
  },
  {
    id: 2,
    brand: "LE LABO",
    title: "THÉ MATCHA 末茶 26",
    priceBySize: {
      "15ml": 3250,
      "50ml": 7450,
      "100ml": 10650,
    },
    salePriceBySize: null,
    sizes: ["15ml", "50ml", "100ml"],
    description:
      "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
    category: "men's clothing",
    images: ["/img/lelabo2.jpeg"],
  },
  {
    id: 3,
    brand: "AVEDA",
    title: "木質髮梳",
    priceBySize: {
      小款: 1100,
      大款: 1400,
    },
    salePriceBySize: null,
    sizes: ["小款", "大款"],
    description:
      "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
    category: "men's clothing",
    images: ["/img/aveda_hair_brush.jpg"],
  },
];

export type Direction = "ASC" | "DES";

export const FAKE_BANNER_MESSAGES: string[] = [
  "情人節活動開跑！全館滿$2000享9折",
  "BYREDO限量禮盒88折",
  "加入會員並賞受更多折扣吧！",
];

// 這使用到JS 的Array sort() method
export function sortByPrice(direction: Direction, data: Product[]) {
  return data.sort((a, b) => {
    if (direction === "ASC") {
      return a.priceBySize[0] - b.priceBySize[0];
    } else {
      return b.priceBySize[0] - a.priceBySize[0];
    }
  });
}

// // 這使用到JS 的Array find method
// export function getProductById(id: string) {
//     const product = FAKE_PRODUCT_DATA.find((product) => product.id === id);
//     return product || FAKE_PRODUCT_DATA[0];
// }

// 這使用到JS 的Array filter method
//includes為JS string method, 若包含某字串, 會return true
export function filterProductByTitle(query: string, data: Product[]) {
  return data.filter((el) =>
    el.title.toLowerCase().includes(query.toLowerCase())
  );
}

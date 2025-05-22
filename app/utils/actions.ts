"use server";

import prisma from "@/lib/prisma";
// import { Product } from "./fake-data";
// import { SaleProduct } from "@/app/utils/fake-data";
import { auth } from "@/auth";
import { User } from "@/lib/validations/auth";
import { Prisma } from "@prisma/client";

export async function getAllProducts() {
  const data = await prisma.product.findMany({
    include: {
      priceItems: {
        include: {
          salePrices: true,
        },
      },
    },
  });
  return data;
}

export async function getProducts(page: number, pageSize: number) {
  const products = await prisma.product.findMany({
    skip: (page - 1) * pageSize, // determine the starting point of the current page
    take: pageSize, // how many items to fetch from db in one request
    include: {
      priceItems: {
        include: {
          salePrices: true,
        },
      },
    },
  });
  return products;
}

export async function getProductById(id: number) {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
    include: {
      priceItems: {
        include: {
          salePrices: true,
        },
      },
    },
  });
  return product;
}

// export async function updateProductById(id: number, data: Product) {
//   const updatedProduct = await prisma.product.update({
//     where: { id: id },
//     data: {
//       title: data.title,
//       description: data.description,
//       price: data.price,
//       category: data.category,
//       image: data.image,
//     },
//   });
//   return updatedProduct;
// }

export async function deleteProductById(id: number) {
  const deletedProduct = await prisma.product.delete({
    where: { id: id },
  });
  return deletedProduct;
}

export async function searchProductsWithCount(
  keyword: string,
  page: number,
  pageSize: number
) {
  const where: Prisma.ProductWhereInput = {
    OR: [
      { title: { contains: keyword, mode: "insensitive" } },
      { brand: { contains: keyword, mode: "insensitive" } },
    ],
  };
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { id: "desc" },
      include: {
        priceItems: {
          include: {
            salePrices: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, totalCount };
}

// export async function createProduct({
//   title,
//   price,
//   description,
//   category,
//   image,
// }: Product) {
//   const createdProduct = await prisma.product.create({
//     data: {
//       title: title,
//       description: description,
//       price: price,
//       category: category,
//       image: image,
//     },
//   });
//   return createdProduct;
// }

// export async function getFavoriteIds(userId: string | undefined) {
//   if (!userId) return;
//   const user = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });
//   return user?.favoriteIds;
// }

export async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session?.user?.email) return null;

    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id as string,
      },
    });

    if (!currentUser) return null;

    return currentUser;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function checkUserExist(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
}

export async function createUser(userData: User) {
  console.log(userData);
  const createdUser = await prisma.user.create({
    data: {
      name: userData.name,
      gender: userData.gender,
      birth: userData.birth,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      promotion: userData.promotion,
      termAndCon: userData.termAndCon,
    },
  });
  return createdUser;
}

export async function addFavorite(productId: string) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  });
  if (user) {
    const id = user.favoriteIds.find((id: string) => id === productId);
    if (id) {
      return;
    } else {
      const updateFav = user.favoriteIds;
      updateFav.push(productId);
      const updatedFavorite = await prisma.user.update({
        where: { id: session?.user?.id },
        data: {
          favoriteIds: updateFav,
        },
      });
      return updatedFavorite;
    }
  }
}

export async function deleteFavorite(productId: string) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  });
  if (user) {
    const id = user.favoriteIds.find((id: string) => id === productId);
    if (!id) {
      return;
    } else {
      const updateFav = user.favoriteIds.filter(
        (id: string) => id != productId
      );
      const updatedFavorite = await prisma.user.update({
        where: { id: session?.user?.id },
        data: {
          favoriteIds: updateFav,
        },
      });
      return updatedFavorite;
    }
  }
}

// export async function getUserFavorites(
//   currentUser: User | null | undefined,
//   products: SaleProduct[]
// ) {
//   try {
//     // const currentUser = await getCurrentUser();

//     if (!currentUser) return [];
//     // const favorites = await prisma.listing.findMany({
//     //   where: {
//     //     id: {
//     //       in: [...(currentUser.favoriteIds || [])]
//     //     }
//     //   }
//     // })
//     const favorites = products.filter((product) => {
//       return currentUser.favoriteIds.includes(String(product.id));
//     });

//     return favorites;
//   } catch (error: unknown) {
//     console.log(error);
//     return [];
//   }
// }

export async function getReviewById(id: number) {
  const product = await prisma.review.findMany({
    where: {
      productId: id,
    },
    include: {
      user: true,
    },
  });
  return product;
}

export async function createReview({
  productId,
  title,
  content,
  rating,
  userId,
}: {
  productId: number;
  title: string;
  content: string;
  rating: number;
  userId: string;
}) {
  const review = await prisma.review.create({
    data: {
      productId,
      title,
      content,
      rating,
      userId,
    },
  });

  return review;
}

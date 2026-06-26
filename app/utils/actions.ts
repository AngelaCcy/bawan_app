"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { User, AddressForm } from "@/lib/validations/auth";
import { ProfileForm } from "../types/product";
import { Prisma, Role } from "@prisma/client";

export async function getAllProducts() {
  const data = await prisma.product.findMany({
    include: {
      priceItems: {
        include: {
          salePrices: true,
        },
      },
    },
    orderBy: { id: "desc" },
  });
  return data;
}
// export async function getProducts(page: number, pageSize: number) {
//   const products = await prisma.product.findMany({
//     skip: (page - 1) * pageSize, // determine the starting point of the current page
//     take: pageSize, // how many items to fetch from db in one request
//     include: {
//       priceItems: {
//         include: {
//           salePrices: true,
//         },
//       },
//     },
//   });
//   return products;
// }

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
  keyword: string
  // page: number,
  // pageSize: number
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
      // skip: (page - 1) * pageSize,
      // take: pageSize,
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

export async function updateUserProfileById(id: string, data: ProfileForm) {
  const updatedProduct = await prisma.user.update({
    where: { id: id },
    data: {
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      email: data.email,
      phone: data.phone,
      image: data.image,
    },
  });
  return updatedProduct;
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
    data: { productId, title, content, rating, userId },
  });
  return review;
}

// ─── Address actions ────────────────────────────────────────────────────────

export async function getUserAddresses() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });
}

export async function createAddress(data: AddressForm) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: { ...data, userId: session.user.id },
  });
}

export async function updateAddress(id: string, data: AddressForm) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) throw new Error("Not found");

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id, id: { not: id } },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({ where: { id }, data });
}

export async function deleteAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) throw new Error("Not found");

  return prisma.address.delete({ where: { id } });
}

export async function setDefaultAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.address.updateMany({
    where: { userId: session.user.id },
    data: { isDefault: false },
  });
  return prisma.address.update({ where: { id }, data: { isDefault: true } });
}

// ─── Order actions ───────────────────────────────────────────────────────────

export async function getUserOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Admin actions ───────────────────────────────────────────────────────────

export async function getAllUsers() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true, image: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserRole(userId: string, role: Role) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
  return prisma.user.update({ where: { id: userId }, data: { role } });
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

export async function updateUserAvatar(imageUrl: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return prisma.user.update({
    where: { id: session.user.id },
    data: { image: imageUrl },
  });
}

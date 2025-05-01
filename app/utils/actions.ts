"use server";

import prisma from "@/lib/prisma";
import { Product } from "./fake-data";
import { SaleProduct } from "@/app/utils/fake-data";
import { auth } from "@/auth";
import type { User } from "@prisma/client";

export async function getProducts() {
  const data = await prisma.product.findMany();
  return data;
}

export async function getProductById(id: number) {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
  return product;
}

export async function updateProductById(id: number, data: Product) {
  const updatedProduct = await prisma.product.update({
    where: { id: id },
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      image: data.image,
    },
  });
  return updatedProduct;
}

export async function deleteProductById(id: number) {
  const deletedProduct = await prisma.product.delete({
    where: { id: id },
  });
  return deletedProduct;
}

export async function createProduct({
  title,
  price,
  description,
  category,
  image,
}: Product) {
  const createdProduct = await prisma.product.create({
    data: {
      title: title,
      description: description,
      price: price,
      category: category,
      image: image,
    },
  });
  return createdProduct;
}

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

export async function getUserFavorites(
  currentUser: User | null | undefined,
  products: SaleProduct[]
) {
  try {
    // const currentUser = await getCurrentUser();

    if (!currentUser) return [];
    // const favorites = await prisma.listing.findMany({
    //   where: {
    //     id: {
    //       in: [...(currentUser.favoriteIds || [])]
    //     }
    //   }
    // })
    const favorites = products.filter((product) => {
      return currentUser.favoriteIds.includes(String(product.id));
    });

    return favorites;
  } catch (error: unknown) {
    console.log(error);
    return [];
  }
}

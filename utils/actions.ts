"use server";

import prisma from "@/utils/db";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const fetchFeaturedProducts = async () => {
  const products = await prisma.wine.findMany({
    where: {
      featured: true,
    },
    include: {
      images: true,
    },
  });
  
  // If no featured products, get the first 6 wines instead
  if (products.length === 0) {
    return await prisma.wine.findMany({
      take: 6,
      include: {
        images: true,
      },
    });
  }
  
  return products;
};

export const fetchAllProducts = async (searchTerm: string) => {
  if (!searchTerm) {
    return prisma.wine.findMany({
      include: {
        images: true,
        region: true,
      },
    });
  }

  // If we have a search term, use a raw SQL query to ensure case-insensitive search
  return prisma.wine.findMany({
    where: {
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
    include: {
      images: true,
      region: true,
    },
  });
};

// single product code - added June 7
export const fetchSingleProduct = async (productId: string) => {
  const product = await prisma.wine.findUnique({
    where: { id: Number(productId) },
    include: { images: true },
  });
  if (!product) {
    redirect("/products");
  }
  return product;
};

// Favorites actions (from user's original code)
export const fetchFavoriteId = async ({ wineId }: { wineId: number }) => {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  
  const favorite = await prisma.favorite.findFirst({
    where: {
      wineId,
      clerkId: userId,
    },
    select: {
      id: true,
    },
  });
  return favorite?.id || null;
};

export const toggleFavoriteAction = async (prevState: {
  wineId: number;
  favoriteId: string | null;
  pathname: string;
}) => {
  const userId = await getCurrentUserId();
  const { wineId, favoriteId, pathname } = prevState;
  
  if (!userId) {
    throw new Error("Unauthorized");
  }
  
  try {
    if (favoriteId) {
      await prisma.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          wineId,
          clerkId: userId,
        },
      });
    }
    revalidatePath(pathname);
    return { message: favoriteId ? "Removed from Faves" : "Added to Faves" };
  } catch (error) {
    throw new Error("Failed to toggle favorite");
  }
};

export const fetchUserFavorites = async () => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      clerkId: userId,
    },
    include: {
      wine: {
        include: {
          images: true,
        },
      },
    },
  });
  
  return favorites.map(favorite => favorite.wine);
};

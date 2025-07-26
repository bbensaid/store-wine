import prisma from "@/utils/db";
import { redirect } from "next/navigation";

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

export const toggleFavoriteAction = async (
  { wineId, favoriteId, pathname }: { wineId: number; favoriteId: string | null; pathname: string }
) => {
  "use server";
  
  const { getCurrentUserId } = await import("@/lib/auth");
  const userId = await getCurrentUserId();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (favoriteId) {
    // Remove from favorites
    await prisma.favorite.delete({
      where: { id: favoriteId },
    });
  } else {
    // Add to favorites
    await prisma.favorite.create({
      data: {
        wineId,
        clerkId: userId,
      },
    });
  }

  redirect(pathname);
};

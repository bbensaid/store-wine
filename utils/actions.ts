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

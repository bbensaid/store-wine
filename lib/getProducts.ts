import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

interface GetProductsParams {
  filters: Record<string, string>;
  page: number;
  pageSize: number;
}

export async function getProducts({
  filters,
  page,
  pageSize,
}: GetProductsParams) {
  const where: Prisma.WineWhereInput = {};

  // Filtering logic (adapted from your API route)
  if (filters.type && filters.type !== "all" && filters.type !== "") {
    where.type = { equals: filters.type, mode: "insensitive" };
  }
  if (filters.body && filters.body !== "all" && filters.body !== "") {
    where.body = { equals: filters.body, mode: "insensitive" };
  }
  if (filters.acidity && filters.acidity !== "all" && filters.acidity !== "") {
    where.acidity = { equals: filters.acidity, mode: "insensitive" };
  }
  if (filters.country && filters.country !== "all" && filters.country !== "") {
    where.region = {
      country: { equals: filters.country, mode: "insensitive" },
    };
  }
  if (filters.priceMin || filters.priceMax) {
    where.price = {};
    if (filters.priceMin && !isNaN(parseInt(filters.priceMin))) {
      where.price.gte = parseInt(filters.priceMin);
    }
    if (filters.priceMax && !isNaN(parseInt(filters.priceMax))) {
      where.price.lte = parseInt(filters.priceMax);
    }
  }
  if (filters.ratingMin || filters.ratingMax) {
    where.reviews = {
      some: {
        AND: [
          filters.ratingMin
            ? { rating: { gte: parseInt(filters.ratingMin) } }
            : {},
          filters.ratingMax
            ? { rating: { lte: parseInt(filters.ratingMax) } }
            : {},
        ],
      },
    };
  }
  if (filters.featured === "true") {
    where.featured = true;
  }
  if (filters.regionId) {
    where.regionId = parseInt(filters.regionId);
  }
  if (filters.search && filters.search.trim() !== "") {
    where.name = { contains: filters.search, mode: "insensitive" };
  }

  // Get total count for pagination
  const totalCount = await prisma.wine.count({ where });

  // Fetch paginated wines
  const wines = await prisma.wine.findMany({
    where,
    include: {
      region: true,
      images: true,
      reviews: { select: { rating: true } },
    },
    skip: page * pageSize,
    take: pageSize,
  });

  // Calculate average rating for each wine
  const products = wines.map((wine) => {
    const ratings = wine.reviews.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;
    return {
      ...wine,
      averageRating: avgRating,
      reviews: undefined,
    };
  });

  return { products, totalCount };
}

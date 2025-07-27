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
  } catch {
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

// Review and Rating functions
export const fetchProductReviews = async (wineId: number) => {
  const reviews = await prisma.review.findMany({
    where: {
      wineId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return reviews;
};

export const fetchUserReview = async (wineId: number) => {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  
  const review = await prisma.review.findFirst({
    where: {
      wineId,
      clerkId: userId,
    },
  });
  return review;
};

export const createReviewAction = async (prevState: {
  wineId: number;
  rating: number;
  comment: string;
  authorName: string;
  authorImageUrl: string;
  vintage?: string;
  pathname: string;
}) => {
  const userId = await getCurrentUserId();
  const { wineId, rating, comment, authorName, authorImageUrl, vintage, pathname } = prevState;
  
  if (!userId) {
    return { error: "Unauthorized" };
  }
  
  try {
    // Check if user already has a review for this wine
    const existingReview = await prisma.review.findFirst({
      where: {
        wineId,
        clerkId: userId,
      },
    });
    
    if (existingReview) {
      return { error: "You have already reviewed this wine", existingReview };
    }
    
    await prisma.review.create({
      data: {
        wineId,
        clerkId: userId,
        rating,
        comment,
        authorName,
        authorImageUrl,
        vintage,
      },
    });
    revalidatePath(pathname);
    return { success: true, message: "Review submitted successfully" };
  } catch {
    return { error: "Failed to submit review. Please try again." };
  }
};

export const updateReviewAction = async (prevState: {
  reviewId: string;
  rating: number;
  comment: string;
  vintage?: string;
  pathname: string;
}) => {
  const userId = await getCurrentUserId();
  const { reviewId, rating, comment, vintage, pathname } = prevState;
  
  if (!userId) {
    return { error: "Unauthorized" };
  }
  
  try {
    await prisma.review.update({
      where: {
        id: reviewId,
        clerkId: userId, // Ensure user owns the review
      },
      data: {
        rating,
        comment,
        vintage,
        updatedAt: new Date(),
      },
    });
    revalidatePath(pathname);
    return { success: true, message: "Review updated successfully" };
  } catch {
    return { error: "Failed to update review. Please try again." };
  }
};

export const getAverageRating = async (wineId: number) => {
  const reviews = await prisma.review.findMany({
    where: {
      wineId,
    },
    select: {
      rating: true,
    },
  });
  
  if (reviews.length === 0) {
    return { average: 0, count: 0 };
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = totalRating / reviews.length;
  
  return {
    average: Math.round(average * 10) / 10, // Round to 1 decimal place
    count: reviews.length,
  };
};

"use server";

import prisma from "@/utils/db";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be logged in to access this route");
  }
  return user;
};

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

export const fetchProductReviews = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      wineId: parseInt(productId),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return reviews;
};

// Cart functionality
export const fetchCartItems = async () => {
  try {
    const userId = await getCurrentUserId();
    console.log("fetchCartItems - userId:", userId);
    
    if (!userId) {
      console.log("No userId in fetchCartItems");
      return 0;
    }

    const cart = await prisma.cart.findFirst({
      where: {
        clerkId: userId,
      },
      select: {
        numItemsInCart: true,
      },
    });
    
    console.log("fetchCartItems - cart:", cart);
    return cart?.numItemsInCart || 0;
  } catch (error) {
    console.error("Error in fetchCartItems:", error);
    return 0;
  }
};

const fetchWine = async (wineId: string) => {
  const wine = await prisma.wine.findUnique({
    where: {
      id: parseInt(wineId),
    },
  });

  if (!wine) {
    throw new Error("Wine not found");
  }
  return wine;
};

const includeWineClause = {
  cartItems: {
    include: {
      wine: {
        include: {
          images: true,
          region: true,
        },
      },
    },
  },
};

export const fetchOrCreateCart = async ({
  userId,
  errorOnFailure = false,
}: {
  userId: string;
  errorOnFailure?: boolean;
}) => {
  console.log("fetchOrCreateCart called with userId:", userId);
  
  let cart = await prisma.cart.findFirst({
    where: {
      clerkId: userId,
    },
    include: includeWineClause,
  });

  if (!cart && errorOnFailure) {
    throw new Error("Cart not found");
  }

  if (!cart) {
    console.log("Creating new cart for userId:", userId);
    cart = await prisma.cart.create({
      data: {
        clerkId: userId,
      },
      include: includeWineClause,
    });
  }

  return cart;
};

const updateOrCreateCartItem = async ({
  wineId,
  cartId,
  amount,
}: {
  wineId: string;
  cartId: string;
  amount: number;
}) => {
  let cartItem = await prisma.cartItem.findFirst({
    where: {
      wineId: parseInt(wineId),
      cartId,
    },
  });

  if (cartItem) {
    cartItem = await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        amount: cartItem.amount + amount,
      },
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: { amount, wineId: parseInt(wineId), cartId },
    });
  }
};

export const updateCart = async (cart: any) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
      },
      include: {
        wine: {
          include: {
            images: true,
            region: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    let numItemsInCart = 0;
    let cartTotal = 0;

    for (const item of cartItems) {
      numItemsInCart += item.amount;
      cartTotal += item.amount * item.wine.price;
    }
    
    // Use default tax rate if not available
    const taxRate = cart.taxRate || 0.1;
    const tax = taxRate * cartTotal;
    const shipping = cartTotal ? (cart.shipping || 5) : 0;
    const orderTotal = cartTotal + tax + shipping;

    const currentCart = await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        numItemsInCart,
        cartTotal,
        tax,
        orderTotal,
      },
      include: includeWineClause,
    });
    return { currentCart, cartItems };
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

export const addToCartAction = async (prevState: any, formData: FormData) => {
  try {
    const wineId = formData.get("wineId") as string;
    const amount = Number(formData.get("amount"));
    const userId = formData.get("userId") as string;
    
    console.log("addToCartAction called with:", { wineId, amount, userId });
    
    if (!userId) {
      return { message: "Please sign in to add items to cart" };
    }
    
    await fetchWine(wineId);
    const cart = await fetchOrCreateCart({ userId });
    await updateOrCreateCartItem({ wineId: wineId, cartId: cart.id, amount });
    await updateCart(cart);
    
    console.log("Successfully added to cart");
    return { message: "Added to cart successfully!" };
  } catch (error) {
    console.error("Error in addToCartAction:", error);
    return { message: error instanceof Error ? error.message : "Failed to add to cart" };
  }
};

export const removeCartItemAction = async (
  prevState: any,
  formData: FormData
) => {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { error: "Not authenticated" };
  }

  try {
    const cartItemId = formData.get("id") as string;
    const cart = await fetchOrCreateCart({
      userId,
      errorOnFailure: true,
    });
    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    await updateCart(cart);
    revalidatePath("/cart");
    return { message: "Item removed from cart" };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return { error: "Failed to remove item" };
  }
};

export const updateCartItemAction = async ({
  amount,
  cartItemId,
}: {
  amount: number;
  cartItemId: string;
}) => {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { error: "Not authenticated" };
  }

  try {
    const cart = await fetchOrCreateCart({
      userId,
      errorOnFailure: true,
    });
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      data: {
        amount,
      },
    });
    await updateCart(cart);
    revalidatePath("/cart");
    return { message: "cart updated" };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { error: "Failed to update cart" };
  }
};

// Order functionality
export const createOrderAction = async (prevState: any, formData: FormData) => {
  let orderId: null | string = null;
  let cartId: null | string = null;
  
  try {
    console.log("createOrderAction started");
    const user = await getAuthUser();
    console.log("User authenticated:", user.id);
    
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    console.log("Cart found:", cart.id, "Items:", cart.numItemsInCart);
    cartId = cart.id;
    
    // Check if cart has items
    if (cart.numItemsInCart === 0) {
      return { message: "Your cart is empty. Please add items before placing an order." };
    }
    
    // Check if order total is greater than 0
    if (cart.orderTotal <= 0) {
      return { message: "Order total must be greater than $0. Please add items with a price before placing an order." };
    }
    
    await prisma.order.deleteMany({
      where: {
        clerkId: user.id,
        isPaid: false,
      },
    });

    const order = await prisma.order.create({
      data: {
        clerkId: user.id,
        products: cart.numItemsInCart,
        orderTotal: cart.orderTotal,
        tax: cart.tax,
        shipping: cart.shipping,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    orderId = order.id;
    console.log("Order created:", orderId);
  } catch (error) {
    console.error("Error in createOrderAction:", error);
    return renderError(error);
  }
  redirect(`/checkout?orderId=${orderId}&cartId=${cartId}`);
};

export const fetchUserOrders = async () => {
  const user = await getAuthUser();
  const orders = await prisma.order.findMany({
    where: {
      clerkId: user.id,
      isPaid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};

export const fetchAdminOrders = async () => {
  const user = await getAuthUser();

  const orders = await prisma.order.findMany({
    where: {
      isPaid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
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

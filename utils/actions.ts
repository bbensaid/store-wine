/**
 * DATABASE ACTIONS UTILITY - This provides server-side database operations for the wine store
 *
 * WHAT THIS FILE DOES:
 * - Provides server actions for database operations (product fetching, cart management)
 * - Handles user authentication and authorization
 * - Manages shopping cart operations (add, remove, update items)
 * - Fetches products with filtering and search capabilities
 * - Handles user favorites and reviews
 * - Provides error handling and user feedback
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a server-side file (runs on the server, not in the browser)
 * - It uses Prisma ORM for all database operations
 * - It integrates with Clerk for user authentication
 * - It provides the backend logic for the entire application
 * - Changes here affect how data is fetched and manipulated
 *
 * TECHNOLOGIES USED:
 * - Next.js (for server actions and server-side execution)
 * - Prisma (for database queries and type safety)
 * - Clerk (for user authentication and management)
 * - TypeScript (for type safety and error handling)
 * - Server-side caching and revalidation
 */

// This directive tells Next.js these functions run on the server side
// Server actions can be called from client components but execute on the server
"use server";

// Import statements - bringing in all the tools we need
import prisma from "@/utils/db"; // Database client for Prisma ORM
import { redirect } from "next/navigation"; // Next.js navigation utility
import { getCurrentUserId } from "@/lib/auth"; // Authentication utility function
import { revalidatePath } from "next/cache"; // Cache invalidation utility
import { currentUser } from "@clerk/nextjs/server"; // Clerk server-side user utility

/**
 * ERROR RENDERING UTILITY FUNCTION
 *
 * This function provides consistent error handling across all database actions.
 * It converts various error types into user-friendly messages.
 *
 * BEGINNER TIP: Think of this as a "error translator" that takes technical
 * errors and converts them into messages users can understand.
 *
 * Parameters: Any error object or value
 * Returns: Object with user-friendly error message
 * Usage: Called whenever an error occurs in database operations
 */
const renderError = (error: unknown): { message: string } => {
  // Log the error for developers (in production, this might go to a logging service)
  console.log(error);

  // Return user-friendly error message
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

/**
 * GET AUTHENTICATED USER FUNCTION
 *
 * This function retrieves the currently authenticated user from Clerk.
 * It throws an error if no user is logged in, ensuring protected routes.
 *
 * BEGINNER TIP: This is a "security guard" that ensures only logged-in
 * users can access protected functionality.
 *
 * Returns: Current user object from Clerk
 * Throws: Error if user is not authenticated
 * Usage: Called before any protected database operation
 */
export const getAuthUser = async () => {
  // Get current user from Clerk authentication system
  const user = await currentUser();

  // If no user is found, throw an error
  if (!user) {
    throw new Error("You must be logged in to access this route");
  }

  return user;
};

/**
 * FETCH FEATURED PRODUCTS FUNCTION
 *
 * This function retrieves wines marked as featured from the database.
 * If no featured wines exist, it falls back to the first 6 wines.
 *
 * BEGINNER TIP: This is a "smart product fetcher" that always returns
 * something interesting for users to see, even if no wines are marked as featured.
 *
 * Returns: Array of featured wines with images
 * Fallback: First 6 wines if no featured wines exist
 * Usage: Called by the homepage to display featured products
 */
export const fetchFeaturedProducts = async () => {
  //
  // FEATURED WINES QUERY
  //
  // First, try to get wines marked as featured
  const products = await prisma.wine.findMany({
    where: {
      featured: true, // Only get wines marked as featured
    },
    include: {
      images: true, // Include wine images for display
    },
  });

  //
  // FALLBACK QUERY
  //
  // If no featured products exist, get the first 6 wines instead
  // This ensures users always see something interesting
  if (products.length === 0) {
    return await prisma.wine.findMany({
      take: 6, // Limit to 6 wines
      include: {
        images: true, // Include wine images for display
      },
    });
  }

  return products;
};

/**
 * FETCH ALL PRODUCTS FUNCTION
 *
 * This function retrieves all wines from the database with optional search filtering.
 * It supports case-insensitive search by wine name.
 *
 * BEGINNER TIP: This is a "product catalog" function that can either show
 * all wines or filter them based on what users are searching for.
 *
 * Parameters: searchTerm - optional text to filter wines by name
 * Returns: Array of wines with images and region information
 * Search: Case-insensitive partial matching on wine names
 */
export const fetchAllProducts = async (searchTerm: string) => {
  //
  // NO SEARCH TERM - GET ALL PRODUCTS
  //
  // If no search term is provided, return all wines
  if (!searchTerm) {
    return prisma.wine.findMany({
      include: {
        images: true, // Include wine images for display
        region: true, // Include region information (country, name)
      },
    });
  }

  //
  // SEARCH TERM - FILTER PRODUCTS
  //
  // If search term is provided, filter wines by name
  // Uses case-insensitive partial matching
  return prisma.wine.findMany({
    where: {
      name: {
        contains: searchTerm, // Wine name contains the search term
        mode: "insensitive", // Case-insensitive matching
      },
    },
    include: {
      images: true, // Include wine images for display
      region: true, // Include region information (country, name)
    },
  });
};

/**
 * FETCH PRODUCT REVIEWS FUNCTION
 *
 * This function retrieves all reviews for a specific wine product.
 * Reviews are ordered by creation date (newest first).
 *
 * BEGINNER TIP: This is a "customer feedback" function that shows
 * what other users think about a specific wine.
 *
 * Parameters: productId - the wine ID to get reviews for
 * Returns: Array of reviews ordered by date (newest first)
 * Usage: Called by product detail pages to display reviews
 */
export const fetchProductReviews = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      wineId: parseInt(productId), // Convert string ID to integer
    },
    orderBy: {
      createdAt: "desc", // Newest reviews first
    },
  });
  return reviews;
};

//
// CART FUNCTIONALITY SECTION
//
// These functions handle all shopping cart operations

/**
 * FETCH CART ITEMS COUNT FUNCTION
 *
 * This function retrieves the number of items in a user's shopping cart.
 * It's used to display the cart badge in the navigation.
 *
 * BEGINNER TIP: This is a "cart counter" that tells users how many
 * items they have in their shopping cart without loading all the details.
 *
 * Returns: Number of items in cart (0 if no cart or error)
 * Authentication: Requires logged-in user
 * Error Handling: Returns 0 on any error (graceful degradation)
 */
export const fetchCartItems = async () => {
  try {
    //
    // USER AUTHENTICATION
    //
    // Get the current user's ID from Clerk
    const userId = await getCurrentUserId();
    console.log("fetchCartItems - userId:", userId);

    // If no user ID, return 0 items
    if (!userId) {
      console.log("No userId in fetchCartItems");
      return 0;
    }

    //
    // CART QUERY
    //
    // Find the user's cart and get the item count
    const cart = await prisma.cart.findFirst({
      where: {
        clerkId: userId, // Filter by current user's ID
      },
      select: {
        numItemsInCart: true, // Only get the item count, not all cart data
      },
    });

    console.log("fetchCartItems - cart:", cart);
    return cart?.numItemsInCart || 0; // Return count or 0 if no cart
  } catch (error) {
    //
    // ERROR HANDLING
    //
    // If anything goes wrong, log the error and return 0
    // This ensures the cart button always shows something
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
    const shipping = cartTotal ? cart.shipping || 5 : 0;
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

export const updateCartQuantityAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const wineId = formData.get("wineId") as string;
    const amount = Number(formData.get("amount"));
    const userId = formData.get("userId") as string;

    console.log("updateCartQuantityAction called with:", {
      wineId,
      amount,
      userId,
    });

    if (!userId) {
      return { message: "Please sign in to update cart" };
    }

    // Find the user's cart
    const cart = await fetchOrCreateCart({ userId });

    // Find existing cart item for this wine
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        wineId: parseInt(wineId),
      },
    });

    if (!existingItem) {
      return { message: "Item not found in cart" };
    }

    console.log(
      "Before update - Current amount:",
      existingItem.amount,
      "New amount:",
      amount
    );

    // Update the existing item with new quantity
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { amount },
    });

    // Update cart totals
    const updatedCart = await updateCart(cart);

    console.log("After update - Cart totals:", {
      numItemsInCart: updatedCart.currentCart.numItemsInCart,
      cartTotal: updatedCart.currentCart.cartTotal,
    });

    console.log("Successfully updated cart quantity");
    return { message: "Cart updated successfully!" };
  } catch (error) {
    console.error("Error in updateCartQuantityAction:", error);
    return {
      message: error instanceof Error ? error.message : "Failed to update cart",
    };
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
    return {
      message: error instanceof Error ? error.message : "Failed to add to cart",
    };
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
      return {
        message:
          "Your cart is empty. Please add items before placing an order.",
      };
    }

    // Check if order total is greater than 0
    if (cart.orderTotal <= 0) {
      return {
        message:
          "Order total must be greater than $0. Please add items with a price before placing an order.",
      };
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

    // Create order items from cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { wine: true },
    });

    for (const cartItem of cartItems) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          wineId: cartItem.wineId,
          amount: cartItem.amount,
          price: cartItem.wine.price,
        },
      });
    }
  } catch (error) {
    console.error("Error in createOrderAction:", error);
    return renderError(error);
  }
  redirect(`/checkout?orderId=${orderId}&cartId=${cartId}`);
};

export const fetchUserOrders = async () => {
  const user = await getAuthUser();
  console.log("fetchUserOrders - User ID:", user.id);

  const orders = await prisma.order.findMany({
    where: {
      clerkId: user.id,
      isPaid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log("fetchUserOrders - Found orders:", orders.length);
  console.log("fetchUserOrders - Orders:", orders);

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

export const fetchSingleOrder = async (orderId: string) => {
  const user = await getAuthUser();

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      clerkId: user.id,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          wine: {
            include: {
              images: true,
              region: true,
            },
          },
        },
      },
    },
  });

  return order;
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
  try {
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
  } catch (error) {
    console.error("Error in fetchFavoriteId:", error);
    // Return null if there's an error (rate limit, etc.)
    return null;
  }
};

// Optimized version that doesn't make auth calls
export const fetchFavoriteIdWithUserId = async ({
  wineId,
  userId,
}: {
  wineId: number;
  userId: string;
}) => {
  try {
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
  } catch (error) {
    console.error("Error in fetchFavoriteIdWithUserId:", error);
    return null;
  }
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

  return favorites.map((favorite) => favorite.wine);
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
  const {
    wineId,
    rating,
    comment,
    authorName,
    authorImageUrl,
    vintage,
    pathname,
  } = prevState;

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

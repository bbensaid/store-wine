/**
 * CART ITEMS API ROUTE - This handles cart-related API requests for authenticated users
 *
 * WHAT THIS API DOES:
 * - Fetches the number of items in a user's shopping cart
 * - Requires user authentication (must be signed in)
 * - Returns cart item count for display in navigation
 * - Handles unauthenticated users gracefully
 * - Provides error handling for database failures
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a server-side API route (runs on the server, not in the browser)
 * - It requires user authentication to access cart data
 * - It demonstrates secure database access with user identification
 * - It shows how to handle authentication states and errors
 * - It's used by the CartButton component to show item count
 *
 * TECHNOLOGIES USED:
 * - Next.js (for API route handling and server-side execution)
 * - Clerk (for user authentication and identification)
 * - Prisma (for database queries and type safety)
 * - TypeScript (for type definitions)
 * - Error handling (try/catch with graceful fallbacks)
 */

// Import statements - bringing in all the tools we need
import { NextResponse } from "next/server"; // Next.js utility for API responses
import { auth } from "@clerk/nextjs/server"; // Clerk authentication for server-side user identification
import prisma from "@/utils/db"; // Database client for Prisma ORM

/**
 * GET CART ITEMS COUNT API ENDPOINT
 *
 * This function handles GET requests to /api/cart-items and:
 * - Authenticates the user making the request
 * - Fetches the cart item count for the authenticated user
 * - Returns the count for display in the navigation bar
 * - Handles unauthenticated users by returning 0 items
 * - Provides error handling for database failures
 *
 * BEGINNER TIP: Think of this as a "cart counter" that tells users
 * how many items they have in their shopping cart without showing
 * the actual cart contents.
 *
 * Authentication: Required - only signed-in users can access their cart
 * Database: Uses Prisma to query cart information
 * Response: Returns JSON with item count or 0 for errors/unauthenticated users
 */
export async function GET(request: Request) {
  //
  // ERROR HANDLING WRAPPER
  //
  // This try/catch block ensures the API doesn't crash if something goes wrong
  // It provides graceful error handling and fallback responses
  try {
    //
    // USER AUTHENTICATION
    //
    // Verify that the user is signed in and get their unique identifier
    // This is crucial for security - users can only see their own cart data
    const { userId } = await auth();

    //
    // UNAUTHENTICATED USER HANDLING
    //
    // If no user ID is returned, the user is not signed in
    // Return 0 items instead of an error to maintain good user experience
    if (!userId) {
      return NextResponse.json({ numItems: 0 });
    }

    // Check if we're looking for a specific wine in the cart
    const { searchParams } = new URL(request.url);
    const wineId = searchParams.get("wineId");

    if (wineId) {
      // Check if specific wine is in cart
      const cart = await prisma.cart.findFirst({
        where: {
          clerkId: userId,
        },
        include: {
          cartItems: {
            where: {
              wineId: parseInt(wineId),
            },
            select: {
              amount: true,
            },
          },
        },
      });

      const cartItem = cart?.cartItems[0];
      return NextResponse.json({
        inCart: !!cartItem,
        amount: cartItem?.amount || 0,
      });
    }

    //
    // DATABASE QUERY
    //
    // Fetch the cart information for the authenticated user
    // Only get the item count, not the full cart contents (for performance)
    const cart = await prisma.cart.findFirst({
      where: {
        clerkId: userId, // Filter by the authenticated user's Clerk ID
      },
      select: {
        numItemsInCart: true, // Only select the count, not all cart data
      },
    });

    //
    // SUCCESS RESPONSE
    //
    // Return the cart item count or 0 if no cart exists
    // The || 0 ensures we always return a number, even if cart is null
    return NextResponse.json({ numItems: cart?.numItemsInCart || 0 });
  } catch (error) {
    //
    // ERROR HANDLING
    //
    // If anything goes wrong (database error, authentication error, etc.)
    // Log the error for debugging and return a safe fallback response

    // Log the full error for developers (in production, this might go to a logging service)
    console.error("Error fetching cart items:", error);

    // Return safe fallback response - 0 items instead of crashing
    // This ensures the cart button always shows something, even if there's an error
    return NextResponse.json({ numItems: 0 });
  }
}

/**
 * DELETE CART ITEM API ENDPOINT
 *
 * This function handles DELETE requests to /api/cart-items and:
 * - Authenticates the user making the request
 * - Removes a specific wine item from the user's cart
 * - Updates cart totals and item count
 * - Handles unauthenticated users gracefully
 * - Provides error handling for database failures
 *
 * BEGINNER TIP: Think of this as a "remove from cart" function that
 * allows users to delete items they no longer want to purchase.
 *
 * Authentication: Required - only signed-in users can modify their cart
 * Database: Uses Prisma to remove cart items and update cart totals
 * Response: Returns JSON with success/error message
 */
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { wineId } = await request.json();

    if (!wineId) {
      return NextResponse.json(
        { error: "Wine ID is required" },
        { status: 400 }
      );
    }

    // Find the user's cart
    const cart = await prisma.cart.findFirst({
      where: { clerkId: userId },
      include: { cartItems: true },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Find and remove the specific wine item
    const cartItem = cart.cartItems.find(
      (item) => item.wineId === parseInt(wineId)
    );

    if (!cartItem) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    // Remove the cart item
    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    // Update cart totals
    const remainingItems = cart.cartItems.filter(
      (item) => item.id !== cartItem.id
    );

    // Recalculate cart totals based on remaining items
    let newTotal = 0;
    let newItemCount = 0;

    for (const item of remainingItems) {
      // Get wine price from database
      const wine = await prisma.wine.findUnique({
        where: { id: item.wineId },
        select: { price: true },
      });

      if (wine) {
        newTotal += wine.price * item.amount;
        newItemCount += item.amount;
      }
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        numItemsInCart: newItemCount,
        cartTotal: newTotal,
        orderTotal:
          newTotal + cart.shipping + Math.round(newTotal * cart.taxRate),
      },
    });

    return NextResponse.json({
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}

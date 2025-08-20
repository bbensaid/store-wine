/**
 * AUTHENTICATION UTILITIES - This provides authentication and user management functions for the wine store
 *
 * WHAT THIS FILE DOES:
 * - Provides utility functions for user authentication
 * - Handles current user retrieval and validation
 * - Manages user ID extraction and error handling
 * - Ensures authentication for protected routes and operations
 * - Integrates with Clerk authentication system
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a server-side utility file (runs on the server, not in the browser)
 * - It uses Clerk for all authentication operations
 * - It provides a consistent interface for user authentication
 * - It's used throughout the app to protect routes and operations
 * - Changes here affect the entire authentication system
 *
 * TECHNOLOGIES USED:
 * - Clerk (for user authentication and management)
 * - Next.js (for server-side execution)
 * - TypeScript (for type safety and error handling)
 * - Server-side authentication (for secure user validation)
 * - Error handling (for graceful authentication failures)
 */

// Import Clerk's server-side user utility
// This provides access to the currently authenticated user on the server
import { currentUser } from "@clerk/nextjs/server";

/**
 * GET CURRENT USER FUNCTION
 *
 * This function retrieves the currently authenticated user from Clerk.
 * It returns the full user object with all profile information.
 *
 * BEGINNER TIP: This is the "user info" function that gives you
 * access to everything about the currently logged-in user.
 *
 * Returns: Full Clerk user object or null if not authenticated
 * Usage: When you need complete user information (name, email, profile, etc.)
 * Authentication: Works on both client and server side
 */
export async function getCurrentUser() {
  // Get the current user from Clerk authentication system
  const clerkUser = await currentUser();

  // Return the user object (or null if not authenticated)
  return clerkUser;
}

/**
 * GET CURRENT USER ID FUNCTION
 *
 * This function extracts just the user ID from the authenticated user.
 * It includes error handling and returns null on authentication failures.
 *
 * BEGINNER TIP: This is the "user identifier" function that gives you
 * just the unique ID needed for database operations and API calls.
 *
 * Returns: User ID string or null if not authenticated or error occurs
 * Usage: When you only need the user ID (database queries, API calls)
 * Error Handling: Gracefully handles authentication errors
 */
export async function getCurrentUserId() {
  try {
    // Get the current user from Clerk authentication system
    const clerkUser = await currentUser();

    // Return just the user ID (or null if not authenticated)
    return clerkUser?.id;
  } catch (error) {
    //
    // ERROR HANDLING
    //
    // If anything goes wrong during authentication, log the error
    // and return null instead of crashing the application

    // Log the error for developers (in production, this might go to a logging service)
    console.error("Error getting current user ID:", error);

    // Return null to indicate authentication failure
    // This allows the calling code to handle the failure gracefully
    return null;
  }
}

/**
 * ENSURE AUTHENTICATED FUNCTION
 *
 * This function ensures that a user is authenticated before proceeding.
 * It throws an error if no user is logged in, protecting routes and operations.
 *
 * BEGINNER TIP: This is the "security guard" function that ensures
 * only authenticated users can access protected functionality.
 *
 * Returns: Full Clerk user object (never null)
 * Throws: Error if user is not authenticated
 * Usage: At the start of protected routes and operations
 * Security: Prevents unauthorized access to protected resources
 */
export async function ensureAuthenticated() {
  // Get the current user from Clerk authentication system
  const clerkUser = await currentUser();

  //
  // AUTHENTICATION VALIDATION
  //
  // If no user is found, throw an error to prevent access
  // This ensures that protected routes and operations are secure

  if (!clerkUser) {
    // Throw an error that will be caught by error boundaries or try/catch blocks
    // This prevents the function from continuing without proper authentication
    throw new Error("Unauthorized");
  }

  // Return the authenticated user object
  // At this point, we're guaranteed to have a valid user
  return clerkUser;
}

/**
 * MIDDLEWARE CONFIGURATION - This provides authentication middleware and route protection for the wine store
 *
 * WHAT THIS FILE DOES:
 * - Applies Clerk authentication middleware to all routes
 * - Protects API routes and dynamic pages from unauthorized access
 * - Filters which routes and files the middleware processes
 * - Ensures authentication is checked before route execution
 * - Provides security layer for the entire application
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a Next.js middleware file that runs before every request
 * - It's crucial for application security and authentication
 * - The matcher configuration controls which routes are protected
 * - Changes here affect the entire application's security
 * - This file must be in the root directory to work properly
 *
 * TECHNOLOGIES USED:
 * - Next.js (for middleware system and route handling)
 * - Clerk (for authentication middleware and user validation)
 * - Regular expressions (for route pattern matching)
 * - Middleware patterns (for request interception and processing)
 * - Security configuration (for protected route management)
 */

// Import Clerk's authentication middleware
// This provides automatic user authentication for all protected routes
import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * MIDDLEWARE EXPORT
 *
 * This exports the Clerk middleware function that will be applied
 * to all matching routes. The middleware runs before each request
 * and ensures proper authentication.
 *
 * BEGINNER TIP: Think of this as a "security guard" that checks
 * every request to make sure users are properly authenticated.
 *
 * Function: clerkMiddleware() - Clerk's built-in authentication middleware
 * Usage: Automatically applied to all matching routes
 * Security: Ensures only authenticated users can access protected content
 */
export default clerkMiddleware();

/**
 * MIDDLEWARE CONFIGURATION
 *
 * This object configures which routes and files the middleware
 * should process. It uses patterns to include or exclude specific paths.
 *
 * BEGINNER TIP: Think of this as a "filter" that decides which
 * requests get checked by the authentication middleware.
 *
 * Structure: matcher array with regex patterns for route matching
 * Purpose: Control middleware execution scope and performance
 * Security: Ensure all important routes are protected
 */
export const config = {
  matcher: [
    //
    // ROUTE EXCLUSION PATTERN
    //
    // This pattern excludes Next.js internal files and static assets
    // from middleware processing to improve performance
    //
    // Pattern breakdown:
    // - (?!_next|...) - Negative lookahead to exclude Next.js internals
    // - [^?]*\\.(...) - Exclude static file extensions
    // - html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest
    //   - html? - HTML files (optional 'l')
    //   - css - CSS stylesheets
    //   - js(?!on) - JavaScript files (but not JSON files)
    //   - jpe?g - JPEG images (optional 'e')
    //   - webp - WebP images
    //   - png - PNG images
    //   - gif - GIF images
    //   - svg - SVG vector graphics
    //   - ttf - TrueType fonts
    //   - woff2? - Web Open Font Format (optional '2')
    //   - ico - Icon files
    //   - csv - Comma-separated values
    //   - docx? - Word documents (optional 'x')
    //   - xlsx? - Excel spreadsheets (optional 'x')
    //   - zip - Compressed archives
    //   - webmanifest - Web app manifests
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    //
    // API ROUTE INCLUSION PATTERN
    //
    // This pattern ensures that ALL API routes are processed by the middleware
    // This is crucial for protecting backend functionality and data
    //
    // Pattern breakdown:
    // - (api|trpc)(.*) - Match routes starting with 'api' or 'trpc'
    // - (.*) - Include all sub-paths and parameters
    // - Examples: /api/products, /api/cart, /trpc/query, etc.
    "/(api|trpc)(.*)",
  ],
};

/**
 * GET PRODUCTS UTILITY FUNCTION - This provides server-side data fetching for the wine catalog
 *
 * WHAT THIS FUNCTION DOES:
 * - Fetches wine products from the database with comprehensive filtering
 * - Handles pagination for large product catalogs
 * - Applies multiple filter types (type, body, acidity, country, price, rating)
 * - Calculates average ratings for products
 * - Returns structured data with products and total counts
 * - Can be used in server components, API routes, or server actions
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a server-side utility function (runs on the server, not in the browser)
 * - It duplicates some logic from the API route for server component usage
 * - It demonstrates advanced Prisma query building and filtering
 * - It shows how to handle complex database relationships and aggregations
 * - It's a reusable function for any server-side product fetching needs
 *
 * TECHNOLOGIES USED:
 * - Prisma (for database queries and type safety)
 * - TypeScript (for type definitions and Prisma integration)
 * - Server-side execution (for direct database access)
 * - Complex filtering (multiple conditions, nested relationships)
 * - Data aggregation (rating calculations, pagination)
 */

// Import statements - bringing in all the tools we need
import prisma from "@/lib/prisma"; // Database client for Prisma ORM
import type { Prisma } from "@prisma/client"; // TypeScript types for Prisma queries

/**
 * GET PRODUCTS PARAMETERS INTERFACE
 *
 * This defines what data the getProducts function expects to receive.
 * TypeScript uses this to ensure the function is called with correct parameters.
 *
 * filters: Object containing all filter criteria (type, body, price, etc.)
 * page: Current page number (0-based, so page 0 = first page)
 * pageSize: Number of products to return per page
 */
interface GetProductsParams {
  filters: Record<string, string>; // Flexible filter object with string key-value pairs
  page: number; // Page number (0 = first page, 1 = second page, etc.)
  pageSize: number; // Products per page (e.g., 20 products per page)
}

/**
 * GET PRODUCTS FUNCTION
 *
 * This function fetches wine products from the database with:
 * - Comprehensive filtering by multiple criteria
 * - Pagination support for large catalogs
 * - Rating calculations and filtering
 * - Related data loading (regions, images, reviews)
 *
 * BEGINNER TIP: Think of this as a "smart product fetcher" that can find
 * exactly the wines you're looking for and organize them into pages.
 *
 * Parameters: Receives filter criteria, page number, and page size
 * Database: Uses Prisma for efficient, type-safe database queries
 * Return: Object with products array and total count for pagination
 */
export async function getProducts({
  filters, // All filter criteria (type, body, price, etc.)
  page, // Current page number (0-based)
  pageSize, // Products per page
}: GetProductsParams) {
  //
  // FILTER BUILDING
  //
  // This object will contain all the database filter conditions
  // Prisma uses this to build efficient SQL queries
  const where: Prisma.WineWhereInput = {};

  //
  // WINE TYPE FILTER
  //
  // Filter wines by their type (red, white, rosé, etc.)
  // Only applies filter if type is specified and not "all"
  if (filters.type && filters.type !== "all" && filters.type !== "") {
    where.type = { equals: filters.type, mode: "insensitive" }; // Case-insensitive matching
  }

  //
  // WINE BODY FILTER
  //
  // Filter wines by body (light, medium, full)
  // Only applies filter if body is specified and not "all"
  if (filters.body && filters.body !== "all" && filters.body !== "") {
    where.body = { equals: filters.body, mode: "insensitive" }; // Case-insensitive matching
  }

  //
  // WINE ACIDITY FILTER
  //
  // Filter wines by acidity level (low, medium, high)
  // Only applies filter if acidity is specified and not "all"
  if (filters.acidity && filters.acidity !== "all" && filters.acidity !== "") {
    where.acidity = { equals: filters.acidity, mode: "insensitive" }; // Case-insensitive matching
  }

  //
  // COUNTRY FILTER
  //
  // Filter wines by country of origin
  // This uses a nested filter through the region relationship
  if (filters.country && filters.country !== "all" && filters.country !== "") {
    where.region = {
      country: { equals: filters.country, mode: "insensitive" }, // Nested filter
    };
  }

  //
  // PRICE RANGE FILTER
  //
  // Filter wines by minimum and/or maximum price
  // Supports both individual price limits and price ranges
  if (filters.priceMin || filters.priceMax) {
    where.price = {}; // Initialize price filter object
    if (filters.priceMin && !isNaN(parseInt(filters.priceMin))) {
      where.price.gte = parseInt(filters.priceMin); // Greater than or equal to minimum
    }
    if (filters.priceMax && !isNaN(parseInt(filters.priceMax))) {
      where.price.lte = parseInt(filters.priceMax); // Less than or equal to maximum
    }
  }

  //
  // RATING RANGE FILTER
  //
  // Filter wines by minimum and/or maximum average rating
  // This is complex because ratings come from related review records
  if (filters.ratingMin || filters.ratingMax) {
    where.reviews = {
      some: {
        // At least one review must match the criteria
        AND: [
          // All conditions must be true
          filters.ratingMin
            ? { rating: { gte: parseInt(filters.ratingMin) } } // Min rating filter
            : {},
          filters.ratingMax
            ? { rating: { lte: parseInt(filters.ratingMax) } } // Max rating filter
            : {},
        ],
      },
    };
  }

  //
  // FEATURED WINES FILTER
  //
  // Filter to show only featured wines (special selections)
  // Only applies if featured=true is in the filters
  if (filters.featured === "true") {
    where.featured = true; // Boolean filter for featured wines
  }

  //
  // REGION ID FILTER
  //
  // Filter wines by specific region ID
  // Useful for showing wines from a particular wine region
  if (filters.regionId) {
    where.regionId = parseInt(filters.regionId); // Convert string to integer
  }

  //
  // TEXT SEARCH FILTER
  //
  // Search wines by name using partial text matching
  // Case-insensitive search that finds wines containing the search term
  if (filters.search && filters.search.trim() !== "") {
    where.name = { contains: filters.search, mode: "insensitive" }; // Partial match, case-insensitive
  }

  //
  // DATABASE QUERIES
  //
  // Now that we have built the filter object, execute the database queries

  //
  // TOTAL COUNT QUERY
  //
  // Get the total number of wines that match our filters
  // This is needed for pagination to show "showing X of Y results"
  const totalCount = await prisma.wine.count({ where });

  //
  // PRODUCTS QUERY
  //
  // Fetch the actual wine products with related data
  // This includes pagination, filtering, and related data loading
  const wines = await prisma.wine.findMany({
    where, // Apply all the filters we built above
    include: {
      // Load related data in the same query
      region: true, // Wine region information (country, name, etc.)
      images: true, // Product images for display
      reviews: { select: { rating: true } }, // Only get ratings, not full review text
    },
    skip: page * pageSize, // Skip this many records (for pagination)
    take: pageSize, // Take this many records (for pagination)
  });

  //
  // RATING CALCULATION
  //
  // Calculate average rating for each wine
  // This processes the raw review data into usable average ratings
  const products = wines.map((wine) => {
    // Extract all ratings from the wine's reviews
    const ratings = wine.reviews.map((r) => r.rating);

    // Calculate average rating (sum of all ratings divided by count)
    // If no reviews, default to 0 rating
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    // Return wine with calculated average rating
    // Remove the raw reviews array to clean up the response
    return {
      ...wine, // Spread all wine properties
      averageRating: avgRating, // Add calculated average rating
      reviews: undefined, // Remove raw reviews data
    };
  });

  //
  // RETURN STATEMENT
  //
  // Return the processed products and total count
  // This provides everything needed for pagination and display
  return { products, totalCount };
}

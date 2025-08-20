/**
 * PRODUCTS API ROUTE - This handles all product-related API requests with advanced filtering and pagination
 *
 * WHAT THIS API DOES:
 * - Fetches wine products from the database with filtering options
 * - Handles search queries, price ranges, ratings, and geographic filters
 * - Provides pagination for large product catalogs
 * - Calculates average ratings for products
 * - Supports multiple filter combinations (type, body, acidity, country, price, rating)
 * - Returns structured data with total counts for pagination
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a server-side API route (runs on the server, not in the browser)
 * - It uses Prisma ORM for database operations
 * - It demonstrates advanced filtering and search functionality
 * - It shows how to handle URL parameters and query strings
 * - It's a crucial part of the product catalog system
 *
 * TECHNOLOGIES USED:
 * - Next.js (for API route handling and server-side execution)
 * - Prisma (for database queries and type safety)
 * - TypeScript (for type definitions and Prisma integration)
 * - URL SearchParams (for parsing query string parameters)
 * - Error handling (try/catch with proper HTTP status codes)
 */

// Import statements - bringing in all the tools we need
import { NextResponse } from "next/server"; // Next.js utility for API responses
import prisma from "@/lib/prisma"; // Database client for Prisma ORM
import type { Prisma } from "@prisma/client"; // TypeScript types for Prisma queries

/**
 * GET PRODUCTS API ENDPOINT
 *
 * This function handles GET requests to /api/products and:
 * - Parses query parameters for filtering and pagination
 * - Builds database queries with multiple filter conditions
 * - Fetches products with related data (regions, images, reviews)
 * - Calculates average ratings and applies rating filters
 * - Returns paginated results with total counts
 *
 * BEGINNER TIP: Think of this as a "smart product catalog" that can filter
 * wines by any combination of criteria and show results in organized pages.
 *
 * URL Parameters: Supports multiple filter and pagination options
 * Database: Uses Prisma for efficient, type-safe database queries
 * Response: Returns JSON with products array and total count
 */
export async function GET(request: Request) {
  //
  // ERROR HANDLING WRAPPER
  //
  // This try/catch block ensures the API doesn't crash if something goes wrong
  // It provides graceful error handling and proper HTTP status codes
  try {
    //
    // QUERY PARAMETER EXTRACTION
    //
    // Extract and parse all the search and filter parameters from the URL
    // These come from the query string (e.g., ?search=red&type=wine&priceMin=10)
    const { searchParams } = new URL(request.url);

    //
    // PAGINATION PARAMETERS
    //
    // These control how many products to show and which page to display
    const limit = parseInt(searchParams.get("limit") || "20"); // Products per page (default: 20)
    const offset = parseInt(searchParams.get("offset") || "0"); // Starting position (default: 0)

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
    const type = searchParams.get("type");
    if (type && type !== "all" && type !== "") {
      where.type = { equals: type, mode: "insensitive" }; // Case-insensitive matching
    }

    //
    // WINE BODY FILTER
    //
    // Filter wines by body (light, medium, full)
    // Only applies filter if body is specified and not "all"
    const body = searchParams.get("body");
    if (body && body !== "all" && body !== "") {
      where.body = { equals: body, mode: "insensitive" }; // Case-insensitive matching
    }

    //
    // WINE ACIDITY FILTER
    //
    // Filter wines by acidity level (low, medium, high)
    // Only applies filter if acidity is specified and not "all"
    const acidity = searchParams.get("acidity");
    if (acidity && acidity !== "all" && acidity !== "") {
      where.acidity = { equals: acidity, mode: "insensitive" }; // Case-insensitive matching
    }

    //
    // COUNTRY FILTER
    //
    // Filter wines by country of origin
    // This uses a nested filter through the region relationship
    const country = searchParams.get("country");
    if (country && country !== "all" && country !== "") {
      where.region = { country: { equals: country, mode: "insensitive" } }; // Nested filter
    }

    //
    // PRICE RANGE FILTER
    //
    // Filter wines by minimum and/or maximum price
    // Supports both individual price limits and price ranges
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    if (priceMin || priceMax) {
      where.price = {}; // Initialize price filter object
      if (priceMin && !isNaN(parseInt(priceMin))) {
        where.price.gte = parseInt(priceMin); // Greater than or equal to minimum
      }
      if (priceMax && !isNaN(parseInt(priceMax))) {
        where.price.lte = parseInt(priceMax); // Less than or equal to maximum
      }
    }

    //
    // RATING RANGE FILTER
    //
    // Filter wines by minimum and/or maximum average rating
    // This is complex because ratings come from related review records
    const ratingMin = searchParams.get("ratingMin");
    const ratingMax = searchParams.get("ratingMax");
    if (ratingMin || ratingMax) {
      where.reviews = {
        some: {
          // At least one review must match the criteria
          AND: [
            // All conditions must be true
            ratingMin ? { rating: { gte: parseInt(ratingMin) } } : {}, // Min rating filter
            ratingMax ? { rating: { lte: parseInt(ratingMax) } } : {}, // Max rating filter
          ],
        },
      };
    }

    //
    // FEATURED WINES FILTER
    //
    // Filter to show only featured wines (special selections)
    // Only applies if featured=true is in the URL
    if (searchParams.get("featured") === "true") {
      where.featured = true; // Boolean filter for featured wines
    }

    //
    // REGION ID FILTER
    //
    // Filter wines by specific region ID
    // Useful for showing wines from a particular wine region
    const regionId = searchParams.get("regionId");
    if (regionId) {
      where.regionId = parseInt(regionId); // Convert string to integer
    }

    //
    // TEXT SEARCH FILTER
    //
    // Search wines by name using partial text matching
    // Case-insensitive search that finds wines containing the search term
    const search = searchParams.get("search");
    if (search && search.trim() !== "") {
      where.name = { contains: search, mode: "insensitive" }; // Partial match, case-insensitive
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
      skip: offset, // Skip this many records (for pagination)
      take: limit, // Take this many records (for pagination)
    });

    //
    // RATING CALCULATION
    //
    // Calculate average rating for each wine and apply rating filters
    // This processes the raw review data into usable average ratings
    const winesWithAvgRating = wines
      .map((wine) => {
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
      })
      .filter((wine) => {
        //
        // RATING FILTER APPLICATION
        //
        // Apply rating filters to the calculated average ratings
        // This ensures wines meet both the review criteria AND average rating criteria

        // Filter out wines below minimum rating
        if (ratingMin && wine.averageRating < parseInt(ratingMin)) return false;

        // Filter out wines above maximum rating
        if (ratingMax && wine.averageRating > parseInt(ratingMax)) return false;

        // Keep wines that pass all rating filters
        return true;
      });

    //
    // SUCCESS RESPONSE
    //
    // Return the filtered and processed wines with pagination information
    return NextResponse.json({
      wines: winesWithAvgRating, // Array of wines with calculated ratings
      totalCount, // Total number of wines matching filters (for pagination)
    });
  } catch (error) {
    //
    // ERROR HANDLING
    //
    // If anything goes wrong, log the error and return a user-friendly message
    // This prevents the API from crashing and provides useful debugging information

    // Log the full error for developers (in production, this might go to a logging service)
    console.error("Error fetching products:", error);

    // Return error response with appropriate HTTP status code
    return NextResponse.json(
      { error: "Failed to fetch products" }, // User-friendly error message
      { status: 500 } // HTTP 500 = Internal Server Error
    );
  }
}

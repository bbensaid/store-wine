/**
 * CAROUSEL DATA UTILITY - This manages carousel content for the hero section with fallback data and database integration
 *
 * WHAT THIS UTILITY DOES:
 * - Defines the structure for carousel slides (title, subtitle, description, image)
 * - Provides default carousel data as fallback content
 * - Fetches carousel data from API endpoints
 * - Transforms database wine data into carousel slides
 * - Handles errors gracefully with fallback content
 * - Creates rich descriptions from wine properties
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a utility module that can be used in both client and server components
 * - It demonstrates data transformation and API integration
 * - It shows how to handle fallback data when external sources fail
 * - It's used by the HeroCarousel component to display rotating content
 * - It provides a safety net to ensure the carousel always has content
 *
 * TECHNOLOGIES USED:
 * - TypeScript (for type definitions and interfaces)
 * - Fetch API (for HTTP requests to carousel endpoints)
 * - Prisma (for database queries and wine data)
 * - Error handling (try/catch with graceful fallbacks)
 * - Data transformation (converting database records to display format)
 */

/**
 * CAROUSEL SLIDE INTERFACE
 *
 * This defines the structure for each carousel slide.
 * TypeScript uses this to ensure all carousel data follows the same format.
 *
 * id: Unique identifier for the slide
 * title: Main heading for the slide
 * subtitle: Secondary text below the title
 * description: Detailed description of the content
 * imageUrl: Path to the slide image
 * wineId: Optional reference to a database wine record
 */
export interface CarouselSlide {
  id: number; // Unique slide identifier
  title: string; // Main slide heading
  subtitle: string; // Secondary slide text
  description: string; // Detailed slide description
  imageUrl: string; // Path to slide image
  wineId?: number; // Optional reference to database wine (for wine-specific slides)
}

/**
 * DEFAULT CAROUSEL DATA
 *
 * This provides fallback content when the API or database is unavailable.
 * It ensures the carousel always has something to display, even if external
 * data sources fail.
 *
 * BEGINNER TIP: Think of this as a "backup plan" that ensures users
 * always see beautiful content, even if something goes wrong with the data.
 *
 * Content: Four curated slides showcasing different wine categories
 * Images: Uses hero images from the public/images/wines/ directory
 * Purpose: Fallback content for reliability and user experience
 */
export const defaultCarouselData: CarouselSlide[] = [
  {
    id: 1,
    title: "Premium Red Wines",
    subtitle: "Discover our finest collection of aged reds",
    description:
      "From bold Cabernets to elegant Pinot Noirs, experience the depth and complexity of our premium red wine selection.",
    imageUrl: "/images/wines/hero1.jpeg",
  },
  {
    id: 2,
    title: "Exclusive White Wines",
    subtitle: "Crisp and refreshing whites for every occasion",
    description:
      "From buttery Chardonnays to zesty Sauvignon Blancs, find your perfect white wine companion.",
    imageUrl: "/images/wines/hero2.jpeg",
  },
  {
    id: 3,
    title: "Rare Vintage Collection",
    subtitle: "Limited edition wines from exceptional years",
    description:
      "Explore our curated selection of rare vintages, each bottle tells a story of exceptional terroir and craftsmanship.",
    imageUrl: "/images/wines/hero3.jpeg",
  },
  {
    id: 4,
    title: "Artisan Sparkling Wines",
    subtitle: "Celebrate with our handcrafted bubbles",
    description:
      "From traditional méthode champenoise to modern sparkling techniques, raise a glass to life's special moments.",
    imageUrl: "/images/wines/hero4.jpeg",
  },
];

/**
 * GET CAROUSEL DATA FROM API
 *
 * This function fetches carousel data from the /api/carousel endpoint.
 * It's designed for client-side components that need fresh carousel content.
 *
 * BEGINNER TIP: This is the "safe way" to get carousel data - if the API
 * fails, it automatically falls back to default content so users always
 * see something beautiful.
 *
 * API Endpoint: /api/carousel (GET request)
 * Fallback: Returns defaultCarouselData if API fails
 * Usage: Client-side components that need dynamic carousel content
 */
export async function getCarouselData(): Promise<CarouselSlide[]> {
  //
  // ERROR HANDLING WRAPPER
  //
  // This try/catch block ensures the function doesn't crash if the API fails
  // It provides graceful error handling and fallback content
  try {
    //
    // API REQUEST
    //
    // Make a GET request to the carousel API endpoint
    // This fetches fresh carousel data from the server
    const response = await fetch("/api/carousel", {
      method: "GET", // HTTP method for retrieving data
      headers: {
        "Content-Type": "application/json", // Tell server we expect JSON response
      },
    });

    //
    // RESPONSE VALIDATION
    //
    // Check if the API request was successful
    // response.ok is true for status codes 200-299
    if (!response.ok) {
      throw new Error("Failed to fetch carousel data"); // Throw error for non-successful responses
    }

    //
    // DATA EXTRACTION
    //
    // Parse the JSON response from the API
    // This converts the server response into JavaScript objects
    const data = await response.json();
    return data; // Return the fresh carousel data from the API
  } catch (error) {
    //
    // ERROR HANDLING
    //
    // If anything goes wrong (network error, API error, parsing error, etc.)
    // Log the error for debugging and return fallback content

    // Log the full error for developers (in production, this might go to a logging service)
    console.error("Error fetching carousel data:", error);

    // Return default carousel data as fallback
    // This ensures users always see beautiful content, even if the API fails
    return defaultCarouselData;
  }
}

/**
 * GET CAROUSEL DATA FROM DATABASE
 *
 * This function fetches carousel data directly from the database.
 * It's designed for server-side usage (API routes, server components) where
 * we have direct database access and want to avoid additional HTTP requests.
 *
 * BEGINNER TIP: This is the "direct way" to get carousel data - it goes
 * straight to the database to get featured wines and transforms them into
 * beautiful carousel slides.
 *
 * Database: Direct Prisma queries for featured wines
 * Transformation: Converts wine records to carousel slides
 * Fallback: Returns defaultCarouselData if database fails
 * Usage: Server-side components and API routes
 */
export async function getCarouselDataFromDB(): Promise<CarouselSlide[]> {
  //
  // ERROR HANDLING WRAPPER
  //
  // This try/catch block ensures the function doesn't crash if the database fails
  // It provides graceful error handling and fallback content
  try {
    //
    // DYNAMIC PRISMA IMPORT
    //
    // Import Prisma client dynamically to avoid issues in different environments
    // This ensures the function works in both development and production
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    //
    // DATABASE QUERY
    //
    // Fetch featured wines from the database
    // These are wines marked as "featured" in the database
    const featuredWines = await prisma.wine.findMany({
      where: {
        featured: true, // Only get wines marked as featured
      },
      include: {
        // Load related data in the same query
        images: true, // Wine images for carousel display
        region: true, // Wine region information (country, name, etc.)
      },
      take: 8, // Limit to 8 featured wines for carousel (performance optimization)
    });

    //
    // DATA TRANSFORMATION
    //
    // Transform database wine records into carousel slides
    // This converts raw database data into beautiful, user-friendly content
    const carouselSlides: CarouselSlide[] = featuredWines.map((wine, index) => {
      //
      // DESCRIPTION BUILDING
      //
      // Create rich, detailed descriptions based on wine properties
      // Start with the elaborate description if it exists
      let description = wine.elaborate;

      if (!description) {
        //
        // FALLBACK DESCRIPTION CONSTRUCTION
        //
        // If no elaborate description exists, build one from wine properties
        // This ensures every wine has a compelling description

        // Build descriptive text from wine characteristics
        const bodyText = wine.body ? `with a ${wine.body} body` : ""; // Wine body description
        const acidityText = wine.acidity ? `and ${wine.acidity} acidity` : ""; // Acidity description
        const harmonizeText = wine.harmonize
          ? `Perfect for ${wine.harmonize}`
          : ""; // Food pairing
        const regionText = wine.region
          ? `from the renowned ${wine.region.name} region`
          : ""; // Region info

        // Combine all elements into a compelling description
        description = `Experience the exceptional ${wine.name}, a premium ${wine.type} ${regionText} ${bodyText} ${acidityText}. ${harmonizeText}. This carefully curated selection represents the finest in our collection, showcasing exceptional craftsmanship and terroir expression.`;
      }

      //
      // DESCRIPTION ENHANCEMENT
      //
      // Enhance the description with additional details if it's too short
      // This ensures all descriptions are rich and engaging
      const enhancedDescription =
        description.length > 200
          ? description // Keep original if already long enough
          : `${description} Each bottle tells a story of exceptional winemaking tradition, offering a unique tasting experience that captures the essence of its origin.`;

      //
      // SLIDE CREATION
      //
      // Return a complete carousel slide with all necessary information
      return {
        id: wine.id, // Use wine ID as slide ID
        title: wine.name, // Wine name as slide title
        subtitle: `${wine.type} from ${wine.region.name}`, // Type and region as subtitle
        description: enhancedDescription, // Enhanced description for engagement
        imageUrl:
          wine.images[0]?.url ||
          wine.image ||
          `/images/wines/hero${(index % 4) + 1}.jpeg`, // Image with fallback
        wineId: wine.id, // Reference to the original wine record
      };
    });

    //
    // DATABASE CLEANUP
    //
    // Properly disconnect from the database to prevent connection leaks
    // This is important for performance and resource management
    await prisma.$disconnect();

    //
    // FALLBACK HANDLING
    //
    // If no featured wines were found in the database
    // Return default carousel data to ensure users always see content
    if (carouselSlides.length === 0) {
      return defaultCarouselData;
    }

    //
    // SUCCESS RESPONSE
    //
    // Return the transformed carousel slides
    // These are ready to display in the carousel component
    return carouselSlides;
  } catch (error) {
    //
    // ERROR HANDLING
    //
    // If anything goes wrong (database error, connection error, etc.)
    // Log the error for debugging and return fallback content

    // Log the full error for developers (in production, this might go to a logging service)
    console.error("Error fetching carousel data from DB:", error);

    // Return default carousel data as fallback
    // This ensures users always see beautiful content, even if the database fails
    return defaultCarouselData;
  }
}

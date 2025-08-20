/**
 * PRISMA CLIENT CONFIGURATION - This creates and manages the database connection client
 *
 * WHAT THIS FILE DOES:
 * - Creates a singleton Prisma client instance
 * - Prevents multiple database connections in development
 * - Handles different environments (development vs production)
 * - Provides a centralized database client for the entire application
 * - Manages database connection lifecycle and cleanup
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a crucial file that manages database connections
 * - It uses the singleton pattern to prevent connection issues
 * - It's imported by all components that need database access
 * - Changes here affect the entire application's database connectivity
 * - It's automatically generated from your Prisma schema
 *
 * TECHNOLOGIES USED:
 * - Prisma (for database ORM and client generation)
 * - TypeScript (for type safety and type inference)
 * - Node.js (for environment detection and global scope)
 * - Singleton pattern (for connection management)
 * - Environment variables (for production vs development)
 */

// Import the generated Prisma client
// This client provides type-safe database operations based on your schema
import { PrismaClient } from "@prisma/client";

/**
 * PRISMA CLIENT FACTORY FUNCTION
 *
 * This function creates a new Prisma client instance.
 * It's wrapped in a function to allow lazy initialization.
 *
 * BEGINNER TIP: Think of this as a "database connection factory" that
 * creates the tools needed to talk to your database.
 *
 * Returns: A new PrismaClient instance with full database access
 * Usage: Called when the first database connection is needed
 */
const prismaClientSingleton = () => {
  return new PrismaClient(); // Create new Prisma client instance
};

/**
 * PRISMA CLIENT TYPE DEFINITION
 *
 * This creates a TypeScript type for the Prisma client.
 * It ensures type safety when working with the database client.
 *
 * ReturnType<typeof prismaClientSingleton>: Gets the return type of the factory function
 * This gives us the exact type of a PrismaClient instance
 */
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

/**
 * GLOBAL PRISMA CLIENT STORAGE
 *
 * This creates a global storage area for the Prisma client.
 * It allows us to share the same database connection across the application.
 *
 * globalThis: Global scope available in all JavaScript environments
 * unknown: TypeScript safety - we don't know the exact type yet
 * prisma: Optional Prisma client that may or may not exist
 *
 * BEGINNER TIP: This is like a "global storage box" where we keep
 * our database connection so everyone in the app can use it.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined; // Prisma client or undefined
};

/**
 * PRISMA CLIENT INSTANCE
 *
 * This creates or retrieves the Prisma client instance.
 * If one already exists globally, use it; otherwise create a new one.
 *
 * ??: Nullish coalescing operator - use right side if left side is null/undefined
 * This ensures we only create one database connection
 *
 * BEGINNER TIP: This is the "smart connection manager" that reuses
 * existing connections instead of creating new ones every time.
 */
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

/**
 * DEVELOPMENT ENVIRONMENT HANDLING
 *
 * In development, store the Prisma client globally to prevent
 * multiple connections during hot reloads and development server restarts.
 *
 * process.env.NODE_ENV: Environment variable that tells us if we're in production
 * globalForPrisma.prisma: Store the client globally for reuse
 *
 * BEGINNER TIP: This prevents the "too many database connections" error
 * that can happen when developing with hot reloading.
 */
if (process.env.NODE_ENV !== "production") {
  // Store the client globally in development
  globalForPrisma.prisma = prisma;
}

/**
 * EXPORT STATEMENT
 *
 * This makes the Prisma client available to other parts of your app.
 * All components that need database access will import from this file.
 *
 * DON'T CHANGE THIS unless you want to break all database operations!
 *
 * Usage: import prisma from "@/lib/prisma"
 * Then: const wines = await prisma.wine.findMany()
 */
export default prisma;

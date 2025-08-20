/**
 * NEXT.JS CONFIGURATION - This configures the Next.js framework for the wine store
 *
 * WHAT THIS FILE DOES:
 * - Configures Next.js framework settings and behavior
 * - Sets up image optimization and remote image sources
 * - Configures security settings for external resources
 * - Controls build behavior and performance optimizations
 * - Sets up environment-specific configurations
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is the "control center" for Next.js in your app
 * - Changes here affect how the framework behaves
 * - Image configuration controls which external images are allowed
 * - Security settings prevent unauthorized external resource access
 * - This file is processed during the Next.js build process
 *
 * TECHNOLOGIES USED:
 * - Next.js (for React framework and build system)
 * - TypeScript (for type safety and configuration)
 * - Image optimization (for performance and security)
 * - Security policies (for external resource control)
 * - Build configuration (for development and production)
 */

// Import Next.js configuration type for TypeScript support
// This provides type checking and IntelliSense for configuration options
import type { NextConfig } from "next";

/**
 * NEXT.JS CONFIGURATION OBJECT
 *
 * This object contains all the configuration options for Next.js.
 * Each property controls a specific aspect of the framework's behavior.
 *
 * BEGINNER TIP: Think of this as the "settings panel" for your Next.js app
 * where you can control how it works, what it allows, and how it behaves.
 *
 * Type: NextConfig - TypeScript type for Next.js configuration
 * Usage: Processed during build time to configure the framework
 */
const nextConfig: NextConfig = {
  //
  // IMAGE OPTIMIZATION CONFIGURATION
  //
  // This section controls how Next.js handles images, including:
  // - Which external image sources are allowed
  // - Image optimization and performance settings
  // - Security policies for external resources
  images: {
    //
    // REMOTE IMAGE PATTERNS
    //
    // This array defines which external image sources are allowed.
    // Only images from these sources will be processed by Next.js.
    // This is a security feature that prevents unauthorized external resources.
    remotePatterns: [
      //
      // PLACEHOLDER IMAGES
      //
      // Allows images from via.placeholder.com for development and testing
      // This service provides placeholder images when you don't have real images yet
      {
        protocol: "https", // Only allow secure HTTPS connections
        hostname: "via.placeholder.com", // Specific placeholder image service
      },

      //
      // CLERK AUTHENTICATION IMAGES
      //
      // Allows user profile images from Clerk authentication service
      // These are the images users upload for their profiles
      {
        protocol: "https", // Only allow secure HTTPS connections
        hostname: "images.clerk.dev", // Clerk's image hosting service
      },

      //
      // CLERK PROFILE IMAGES (ALTERNATE DOMAIN)
      //
      // Allows user profile images from Clerk's alternate image domain
      // This ensures compatibility with different Clerk image hosting options
      {
        protocol: "https", // Only allow secure HTTPS connections
        hostname: "img.clerk.com", // Clerk's alternate image hosting service
      },
    ],

    //
    // ADDITIONAL IMAGE CONFIGURATION OPTIONS
    //
    // You can add more image-related settings here:
    //
    // domains: ['example.com'], // Alternative to remotePatterns (less secure)
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Custom device sizes
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Custom image sizes
    // formats: ['image/webp'], // Preferred image formats
    // minimumCacheTTL: 60, // Cache time in seconds
    // dangerouslyAllowSVG: false, // Whether to allow SVG images
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Security policy
  },

  //
  // ADDITIONAL NEXT.JS CONFIGURATION OPTIONS
  //
  // You can add more configuration options here:
  //
  // experimental: {
  //   appDir: true, // Enable App Router features
  //   serverComponentsExternalPackages: ['@prisma/client'], // External packages for server components
  // },
  //
  // env: {
  //   CUSTOM_KEY: 'custom-value', // Custom environment variables
  // },
  //
  // async redirects() {
  //   return [
  //     // Custom redirect rules
  //   ];
  // },
  //
  // async headers() {
  //   return [
  //     // Custom HTTP headers
  //   ];
  // },
  //
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   // Custom webpack configuration
  //   return config;
  // },
};

/**
 * EXPORT STATEMENT
 *
 * This makes the configuration available to Next.js during the build process.
 * Next.js automatically reads this file and applies the configuration.
 *
 * DON'T CHANGE THIS unless you want to break your Next.js configuration!
 *
 * Usage: Automatically processed by Next.js build system
 * Location: Must be in the root directory of your project
 */
export default nextConfig;

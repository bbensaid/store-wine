/**
 * ROOT LAYOUT FILE - This is the main template for your entire website
 *
 * WHAT THIS FILE DOES:
 * - Defines the basic HTML structure that wraps every page
 * - Sets up authentication, styling, and navigation
 * - Controls the overall page layout and appearance
 *
 * IMPORTANT: This file affects EVERY page on your website.
 * Beginners should be very careful when modifying this file.
 *
 * TECHNOLOGIES USED:
 * - Next.js 14 App Router (modern Next.js file structure)
 * - React (for building the user interface)
 * - TypeScript (for type safety)
 * - Tailwind CSS (for styling)
 * - Clerk (for user authentication)
 */

// Import statements - these bring in external code we need
import type { Metadata } from "next"; // Next.js metadata type for SEO
import { Inter } from "next/font/google"; // Google Fonts integration
import "./globals.css"; // Global CSS file with Tailwind CSS
import Providers from "./providers"; // Custom provider components (theme, etc.)
import Navbar from "@/components/navbar/Navbar"; // Navigation bar component
import { Suspense } from "react"; // React component for loading states
import { ClerkProvider } from "@clerk/nextjs"; // Authentication provider

/**
 * FONT SETUP
 *
 * This loads the Inter font from Google Fonts and makes it available
 * throughout your website. The font will be automatically optimized
 * by Next.js for performance.
 *
 * WHAT YOU CAN CHANGE:
 * - Font family (e.g., 'Roboto', 'Open Sans')
 * - Font weights (e.g., ['400', '500', '600', '700'])
 * - Font subsets (e.g., ['latin', 'cyrillic'])
 */
const inter = Inter({ subsets: ["latin"] });

/**
 * WEBSITE METADATA
 *
 * This information appears in:
 * - Browser tabs
 * - Search engine results
 * - Social media shares
 *
 * WHAT YOU CAN SAFELY CHANGE:
 * - title: The name that appears in browser tabs
 * - description: Brief description of your website
 *
 * WHAT NOT TO CHANGE:
 * - The structure (keep the Metadata type)
 * - The export statement
 */
export const metadata: Metadata = {
  title: "Wine Store", // Change this to your project name
  description: "BabyFox", // Change this to describe your project
};

/**
 * ROOT LAYOUT COMPONENT
 *
 * This function defines the main layout structure. It receives:
 * - children: The content of whatever page is being displayed
 *
 * The layout wraps every page with:
 * - HTML structure
 * - Authentication
 * - Navigation
 * - Styling
 *
 * BEGINNER TIP: Think of this as the "frame" that holds all your pages.
 * Every page gets wrapped inside this layout automatically.
 */
export default function RootLayout({
  children, // This represents the content of whatever page is being viewed
}: Readonly<{
  children: React.ReactNode; // TypeScript type: this can be any React component
}>) {
  return (
    /**
     * CLERK PROVIDER - Authentication Wrapper
     *
     * This wraps your entire website with authentication capabilities.
     * Users can sign in, sign up, and access protected content.
     *
     * DON'T REMOVE THIS unless you don't want user authentication.
     */
    <ClerkProvider>
      {/* 
        HTML STRUCTURE
        - lang="en": Sets the language for screen readers and SEO
        - suppressHydrationWarning: Prevents Next.js warnings about server/client mismatch
      */}
      <html lang="en" suppressHydrationWarning>
        {/* 
          BODY ELEMENT
          - className={inter.className}: Applies the Inter font to all text
          - This font will be used throughout your website
        */}
        <body className={inter.className}>
          {/* 
            PROVIDERS WRAPPER
            This includes:
            - Theme provider (dark/light mode)
            - Any other global state management
            - Global styling providers
          */}
          <Providers>
            {/* 
              MAIN LAYOUT CONTAINER
              - min-h-screen: Makes the container at least as tall as the screen
              - flex flex-col: Stacks children vertically (navbar on top, content below)
            */}
            <div className="min-h-screen flex flex-col">
              {/* 
                NAVIGATION BAR
                - Suspense: Shows a loading state while the navbar loads
                - This prevents the page from jumping when the navbar appears
              */}
              <Suspense>
                <Navbar />
              </Suspense>

              {/* 
                MAIN CONTENT AREA
                - flex-1: Takes up all remaining space after the navbar
                - pt-0: No top padding (navbar sits flush against content)
              */}
              <main className="flex-1 pt-0">
                {/* 
                  CONTENT CONTAINER
                  - max-w-[2400px]: Maximum width for very large screens
                  - w-full: Takes full width on smaller screens
                  - mx-auto: Centers the content horizontally
                  - p-4 sm:p-6 lg:p-8: Responsive padding (smaller on mobile, larger on desktop)
                  
                  WHAT YOU CAN CHANGE:
                  - max-w-[2400px]: Change the maximum width
                  - p-4 sm:p-6 lg:p-8: Adjust the spacing around content
                */}
                <div className="max-w-[2400px] w-full mx-auto p-4 sm:p-6 lg:p-8">
                  {/* 
                    PAGE CONTENT
                    This is where your individual page content gets inserted.
                    For example, if you're on the home page, the home page content goes here.
                    If you're on the products page, the products content goes here.
                  */}
                  {children}
                </div>
              </main>
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

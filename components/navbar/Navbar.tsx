/**
 * NAVBAR COMPONENT - This is the main navigation bar that appears at the top of every page
 *
 * WHAT THIS COMPONENT DOES:
 * - Provides navigation between different pages (Home, Products, Favorites, etc.)
 * - Shows the website logo and branding (VINEFOX with slogan)
 * - Handles user authentication (sign in/out, user profile)
 * - Includes search functionality for finding wines
 * - Shows shopping cart with item count
 * - Adapts to different screen sizes (responsive design)
 * - Manages navigation state and dropdown menus
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a complex component that combines many features
 * - It uses state management to track user interactions (dropdowns, mobile menu)
 * - It's responsive (looks different on mobile vs desktop)
 * - It integrates with authentication and shopping cart systems
 * - It's a critical component that affects the entire user experience
 *
 * TECHNOLOGIES USED:
 * - React (for the component structure and state management)
 * - Next.js (for routing and navigation)
 * - TypeScript (for type safety)
 * - Tailwind CSS (for styling and responsive design)
 * - Clerk (for user authentication)
 * - React Icons (for the various navigation icons)
 * - Custom UI components (Button, DropdownMenu, Drawer, etc.)
 * - Google Fonts (Cinzel, Cormorant Garamond for typography)
 *
 * COMPONENT STRUCTURE:
 * 1. Desktop Logo Section - Company branding and logo
 * 2. Desktop Center Section - Search bar and Home button
 * 3. Desktop Right Section - Navigation dropdowns and user actions
 * 4. Mobile Section - Hamburger menu and mobile navigation
 *
 * RESPONSIVE BEHAVIOR:
 * - Desktop: Full horizontal layout with all features visible
 * - Mobile: Collapsed into hamburger menu with slide-out drawer
 * - Tablet: Hybrid approach with some features hidden
 *
 * STATE MANAGEMENT:
 * - winesOpen: Controls the Wines dropdown menu
 * - pathname: Tracks current page for active state highlighting
 *
 * WHAT YOU CAN SAFELY CHANGE:
 * - Logo image and company name
 * - Color schemes and styling
 * - Navigation menu items and order
 * - Responsive breakpoints
 * - Button text and labels
 *
 * WHAT NOT TO CHANGE:
 * - The component structure and JSX layout
 * - The authentication integration (Clerk)
 * - The routing logic (Next.js Link components)
 * - The state management hooks
 * - The responsive design classes
 */

// This directive tells Next.js this component runs on the client (browser) side
// We need this because we use state, interactive features, and browser APIs
"use client";

//
// IMPORT STATEMENTS - These bring in all the tools and components we need
//

// Next.js components for navigation and image optimization
import Link from "next/link"; // Component for navigation between pages
import Image from "next/image"; // Optimized image component with automatic optimization

// Custom UI components for consistent styling
import { Button } from "../ui/button"; // Reusable button component with consistent design
import NavSearch from "./NavSearch"; // Custom search input component

// Shopping cart icon from React Icons
import { HiOutlineShoppingBag } from "react-icons/hi";

// Navigation and utility icons from Lucide React
// These provide consistent icon styling and accessibility
import {
  LuMenu, // Hamburger menu icon for mobile navigation
  LuUser, // User profile icon for authentication
  LuHouse, // Home icon for navigation
  LuPhone, // Phone icon for customer service
  LuCircleHelp, // Help/About Us icon
  LuShield, // Privacy/security icon
  LuMail, // Email icon for contact
  LuMessageCircle, // Message/contact icon
  LuWine, // Wine bottle icon for wine-related navigation
  LuHeart, // Heart icon for favorites
  LuFileQuestion, // Question mark icon for help
  LuStar, // Star icon for reviews
} from "react-icons/lu";

// Dropdown menu components for navigation items
// These create the popup menus when you click on navigation items
import {
  DropdownMenu, // The main dropdown container
  DropdownMenuContent, // The content inside the dropdown
  DropdownMenuItem, // Individual items in the dropdown
  DropdownMenuTrigger, // What you click to open the dropdown
} from "@/components/ui/dropdown-menu";

// Google Fonts for typography
// These fonts are loaded and optimized by Next.js for performance
import { Cinzel, Cormorant_Garamond } from "next/font/google";

// Drawer component for mobile navigation
// This creates the slide-out menu on mobile devices
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";

// Next.js hook to get the current page path
// This helps us highlight the current page in navigation
import { usePathname } from "next/navigation";

// React hooks for state management
import React, { useState, useEffect } from "react";

// Clerk authentication components
// These handle user sign in, sign out, and user state management
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

// Custom components for user management and shopping cart
import UserButtonWrapper from "../auth/UserButtonWrapper"; // User profile dropdown and management
import CartButton from "./CartButton"; // Shopping cart button with item count

//
// FONT CONFIGURATION - Google Fonts setup for typography
//

/**
 * CINZEL FONT CONFIGURATION
 *
 * This font is used for the main company name (VINEFOX) and headings.
 * It's an elegant serif font that gives a sophisticated, premium feel.
 *
 * WHAT YOU CAN CHANGE:
 * - Font weights: ['400', '500', '600', '700'] (normal, medium, semibold, bold)
 * - Subsets: ['latin'] (you could add 'cyrillic' for Russian text)
 * - Display: 'swap' (keeps this for performance)
 *
 * WHAT NOT TO CHANGE:
 * - The font object name (cinzel)
 * - The subsets (keep 'latin' for English text)
 * - The display property (keep 'swap' for performance)
 */
const cinzel = Cinzel({
  subsets: ["latin"], // Only load Latin characters (English)
  display: "swap", // Show fallback font while loading (better performance)
  weight: ["400", "500", "600", "700"], // Available font weights
});

/**
 * CORMORANT GARAMOND FONT CONFIGURATION
 *
 * This font is used for the slogan text below the company name.
 * It's an elegant italic serif that complements the Cinzel font.
 *
 * WHAT YOU CAN CHANGE:
 * - Font weights: ['500', '600'] (medium, semibold)
 * - Font style: ['italic'] (you could add 'normal' for regular text)
 * - Subsets: ['latin'] (you could add other language support)
 *
 * WHAT NOT TO CHANGE:
 * - The font object name (cormorant)
 * - The subsets (keep 'latin' for English text)
 * - The display property (keep 'swap' for performance)
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"], // Only load Latin characters (English)
  display: "swap", // Show fallback font while loading (better performance)
  weight: ["500", "600"], // Available font weights
  style: ["italic"], // Only load italic style
});

/**
 * NAVBAR COMPONENT FUNCTION
 *
 * This is the main navigation component that renders the entire navigation bar.
 * It handles both desktop and mobile layouts with responsive design.
 *
 * BEGINNER TIP: Think of this as the "navigation hub" that connects
 * all the different parts of your website together.
 *
 * State Management:
 * - winesOpen: Controls whether the Wines dropdown menu is open
 * - pathname: Tracks the current page for active state highlighting
 *
 * Responsive Design:
 * - Desktop: Full horizontal layout with all features visible
 * - Mobile: Collapsed into hamburger menu with slide-out drawer
 * - Tablet: Hybrid approach with some features hidden
 */
function Navbar() {
  //
  // STATE MANAGEMENT
  //

  // Get the current page path for navigation highlighting
  // This helps users know which page they're currently on
  const pathname = usePathname();

  // Control the Wines dropdown menu state
  // false = closed, true = open
  const [winesOpen, setWinesOpen] = useState(false);

  // State to prevent hydration mismatches
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    //
    // MAIN NAVIGATION CONTAINER
    //
    // This is the root navigation element that wraps everything
    //
    // CSS Classes Explained:
    // - sticky top-0: Sticks to the top of the page when scrolling
    // - z-50: High z-index to ensure it appears above other content
    // - bg-white: White background
    // - border-b border-primary/20: Bottom border with primary color at 20% opacity
    // - h-16: Fixed height of 4rem (64px)
    // - flex items-center: Flexbox layout with centered items
    // - w-full: Full width
    // - justify-between: Space items evenly across the width
    // - px-2 sm:px-4 lg:px-6: Responsive horizontal padding
    <nav className="sticky top-0 z-50 bg-white border-b border-primary/20 h-16 flex items-center w-full justify-between px-2 sm:px-4 lg:px-6">
      {/* Desktop Logo - hidden on mobile */}
      <div className="hidden md:flex items-center">
        <Link
          href="/"
          className="flex items-center px-3 md:px-4 py-2 transition-all duration-200 border border-transparent hover:bg-gray-100 hover:border-primary rounded-lg"
        >
          <Image
            src="/images/logo_transparent.png"
            alt="Wine Store Logo"
            width={40}
            height={40}
            className="h-8 md:h-10 w-auto flex-shrink-0"
          />
          <div className="ml-2 flex flex-col items-center">
            <span
              className={`${cinzel.className} text-sm md:text-lg font-bold tracking-widest text-primary whitespace-nowrap`}
            >
              VINEFOX
            </span>
            {/* Slogan - only in carousel mode */}
            <h2
              className={`${cormorant.className} text-xs sm:text-sm md:text-base lg:text-lg text-primary tracking-wide transition-all duration-200 -mt-1 sm:-mt-2`}
            >
              Discover. Share. Savor the rare.
            </h2>
          </div>
        </Link>
      </div>

      {/* Desktop Center content */}
      <div className="hidden md:flex items-center justify-evenly gap-x-2 sm:gap-x-4 lg:gap-x-6 flex-1 px-2 sm:px-4 lg:px-6">
        {/* Search */}
        <div className="bg-white flex-auto min-w-0 max-w-md lg:max-w-lg">
          <NavSearch className="w-full h-8 sm:h-10 rounded-md border border-primary/20 pl-3 sm:pl-4 text-sm sm:text-base" />
        </div>

        {/* Home button */}
        <Button
          className={
            "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
            (pathname === "/" || pathname === ""
              ? "bg-gray-200 text-primary border-gray-400"
              : "")
          }
          onClick={() =>
            import("../../components/home/Hero").then((module) =>
              module.triggerHideAboutUs()
            )
          }
          asChild
        >
          <Link href="/">
            <LuHouse className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-primary" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </Button>

        {/* Nav buttons */}
        <DropdownMenu open={winesOpen} onOpenChange={setWinesOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className={
                "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
                (winesOpen ||
                pathname.startsWith("/products") ||
                pathname.startsWith("/favorites")
                  ? "bg-gray-200 text-primary border-gray-400"
                  : "")
              }
            >
              <LuWine className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="hidden sm:inline">Wines</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 bg-white border border-primary/20 text-primary"
          >
            <DropdownMenuItem
              asChild
              className="capitalize w-full text-primary"
            >
              <Link
                href="/products"
                onClick={() =>
                  import("../../components/home/Hero").then((module) =>
                    module.triggerHideAboutUs()
                  )
                }
                className="flex items-center gap-2 text-primary"
              >
                <LuWine className="w-5 h-5 text-primary" />
                All Wines
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="capitalize w-full text-primary"
            >
              <Link
                href="/favorites"
                onClick={() =>
                  import("../../components/home/Hero").then((module) =>
                    module.triggerHideAboutUs()
                  )
                }
                className="flex items-center gap-2 text-primary"
              >
                <LuHeart className="w-5 h-5 text-primary" />
                Favorites
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="capitalize w-full text-primary"
            >
              <Link
                href="/reviews"
                onClick={() =>
                  import("../../components/home/Hero").then((module) =>
                    module.triggerHideAboutUs()
                  )
                }
                className="flex items-center gap-2 text-primary"
              >
                <LuStar className="w-5 h-5 text-primary" />
                Reviews
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          className={
            "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
            (pathname.startsWith("/orders")
              ? "bg-gray-200 text-primary border-gray-400"
              : "")
          }
          onClick={() =>
            import("../../components/home/Hero").then((module) =>
              module.triggerHideAboutUs()
            )
          }
          asChild
        >
          <Link href="/orders">
            <HiOutlineShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-primary" />
            <span className="hidden sm:inline">Orders</span>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-1 sm:gap-2 text-primary hidden lg:flex hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base border border-primary/20 bg-white font-normal">
              <LuPhone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="hidden xl:inline">Customer Service</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 bg-white border border-primary/20 text-primary"
          >
            <DropdownMenuItem
              className="capitalize w-full text-primary"
              onClick={() =>
                import("../../components/home/Hero").then((module) =>
                  module.triggerShowAboutUs()
                )
              }
            >
              <LuCircleHelp className="w-5 h-5 mr-2 text-primary" />
              About Us
            </DropdownMenuItem>
            <DropdownMenuItem className="capitalize w-full text-primary">
              <LuMail className="w-5 h-5 mr-2 text-primary" />
              Email Support
            </DropdownMenuItem>
            <DropdownMenuItem className="capitalize w-full text-primary">
              <LuMessageCircle className="w-5 h-5 mr-2 text-primary" />
              Live Chat
            </DropdownMenuItem>
            <DropdownMenuItem className="capitalize w-full text-primary">
              <LuFileQuestion className="w-5 h-5 mr-2 text-primary" />
              FAQ
            </DropdownMenuItem>
            <DropdownMenuItem className="capitalize w-full text-primary">
              <LuShield className="w-5 h-5 mr-2 text-primary" />
              Privacy Policy
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <CartButton />
      </div>

      {/* Desktop Authentication */}
      <div className="hidden md:flex items-center">
        {mounted && (
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="flex items-center gap-1 sm:gap-2 text-primary hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base border border-primary/20 bg-white font-normal">
                <LuUser className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-primary" />
                <span className="hidden sm:inline">Sign in</span>
              </Button>
            </SignInButton>
          </SignedOut>
        )}
        {mounted && (
          <SignedIn>
            <UserButtonWrapper />
          </SignedIn>
        )}
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center w-full h-16 gap-x-2 px-2">
        <div className="flex items-center border border-primary/60 shadow-lg bg-white px-2 py-1 rounded-xl">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Wine Store Logo"
              width={28}
              height={28}
              className="h-6 w-auto flex-shrink-0"
            />
            <span
              className={`${cinzel.className} text-sm font-bold tracking-widest text-primary ml-1 whitespace-nowrap`}
            >
              VINEFOX
            </span>
          </Link>
        </div>
        <div className="flex-grow" />
        <CartButton />
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary"
              size="icon"
              aria-label="Open menu"
            >
              <LuMenu className="w-6 h-6 text-primary" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-6 flex flex-col gap-4 w-full max-w-xs">
            <NavSearch className="mb-2" />
            <Button
              className={
                "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
                (pathname === "/"
                  ? "bg-gray-200 text-primary border-gray-400"
                  : "")
              }
              onClick={() =>
                import("../../components/home/Hero").then((module) =>
                  module.triggerHideAboutUs()
                )
              }
              asChild
            >
              <Link href="/">
                <LuHouse className="w-5 h-5 mr-1 text-primary" />
                Home
              </Link>
            </Button>
            <Button
              className={
                "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
                (pathname.startsWith("/products")
                  ? "bg-gray-200 text-primary border-gray-400"
                  : "")
              }
              onClick={() =>
                import("../../components/home/Hero").then((module) =>
                  module.triggerHideAboutUs()
                )
              }
              asChild
            >
              <Link href="/products">
                <LuWine className="w-5 h-5 mr-1 text-primary" />
                Products
              </Link>
            </Button>
            <Button
              className={
                "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
                (pathname.startsWith("/favorites")
                  ? "bg-gray-200 text-primary border-gray-400"
                  : "")
              }
              onClick={() =>
                import("../../components/home/Hero").then((module) =>
                  module.triggerHideAboutUs()
                )
              }
              asChild
            >
              <Link href="/favorites">
                <LuHeart className="w-5 h-5 mr-1 text-primary" />
                Favorites
              </Link>
            </Button>
            <Button
              className={
                "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
                (pathname.startsWith("/reviews")
                  ? "bg-gray-200 text-primary border-gray-400"
                  : "")
              }
              onClick={() =>
                import("../../components/home/Hero").then((module) =>
                  module.triggerHideAboutUs()
                )
              }
              asChild
            >
              <Link href="/reviews">
                <LuStar className="w-5 h-5 mr-1 text-primary" />
                Reviews
              </Link>
            </Button>
            <Button
              className={
                "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
                (pathname.startsWith("/orders")
                  ? "bg-gray-200 text-primary border-gray-400"
                  : "")
              }
              onClick={() =>
                import("../../components/home/Hero").then((module) =>
                  module.triggerHideAboutUs()
                )
              }
              asChild
            >
              <Link href="/orders">
                <HiOutlineShoppingBag className="w-5 h-5 mr-1 text-primary" />
                Orders
              </Link>
            </Button>
            <Button className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary">
              <LuPhone className="w-5 h-5 text-primary" />
              Customer Service
            </Button>
            <Button
              className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary"
              onClick={() =>
                import("../../components/home/Hero").then((module) =>
                  module.triggerShowAboutUs()
                )
              }
            >
              <LuCircleHelp className="w-5 h-5 text-primary" />
              About Us
            </Button>
            <Button className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary">
              <LuShield className="w-5 h-5 text-primary" />
              Privacy Policy
            </Button>

            {mounted && (
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary">
                    <LuUser className="w-5 h-5 mr-1 text-primary" />
                    Sign in
                  </Button>
                </SignInButton>
              </SignedOut>
            )}
            {mounted && (
              <SignedIn>
                <UserButtonWrapper />
              </SignedIn>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}

export default Navbar;

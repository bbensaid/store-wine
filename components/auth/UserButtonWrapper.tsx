/**
 * USER BUTTON WRAPPER COMPONENT - This wraps the Clerk UserButton with custom styling and mounting logic
 *
 * WHAT THIS COMPONENT DOES:
 * - Wraps the Clerk authentication UserButton component
 * - Applies custom styling to match the app's design system
 * - Handles client-side mounting to prevent hydration errors
 * - Provides user profile access, sign-out, and account management
 * - Integrates with Clerk authentication system
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a client-side component (runs in the browser)
 * - It prevents server-side rendering mismatches with Clerk components
 * - It demonstrates component wrapping and customization
 * - It's a crucial part of the authentication system
 * - It shows how to customize third-party components
 *
 * TECHNOLOGIES USED:
 * - React (for state management and component lifecycle)
 * - Next.js (for client-side rendering)
 * - TypeScript (for type safety)
 * - Clerk (for authentication and user management)
 * - Tailwind CSS (for custom styling)
 */

// This directive tells Next.js this component runs on the client (browser) side
// We need this because we use state, effects, and Clerk components that require browser APIs
"use client";

// Import statements - bringing in all the tools we need
import { UserButton } from "@clerk/nextjs"; // Clerk's user profile and account management component
import { useEffect, useState } from "react"; // React hooks for state and effects

/**
 * USER BUTTON WRAPPER COMPONENT FUNCTION
 *
 * This component wraps the Clerk UserButton to:
 * - Prevent hydration errors between server and client
 * - Apply custom styling that matches the app's design
 * - Ensure the authentication component works properly
 *
 * BEGINNER TIP: Think of this as a "bridge" between Clerk's authentication
 * system and your app's design. It makes Clerk components look like they
 * belong in your app.
 *
 * Hydration: This prevents errors when the server renders one thing and
 * the client renders something different
 * Styling: It customizes the appearance to match your brand
 */
export default function UserButtonWrapper() {
  // React hooks for managing component state

  /**
   * MOUNTED STATE
   *
   * This tracks whether the component has finished loading in the browser.
   * - false = component is still loading (server-side)
   * - true = component is ready to display (client-side)
   *
   * This prevents hydration mismatches between server and client rendering.
   * Clerk components need to run in the browser, not on the server.
   */
  const [mounted, setMounted] = useState(false);

  /**
   * COMPONENT MOUNTING EFFECT
   *
   * This runs when the component first loads in the browser.
   * It sets the mounted state to true, indicating the component is ready.
   *
   * The empty dependency array [] means this only runs once when the component mounts.
   * This ensures the component only shows after it's fully loaded in the browser.
   */
  useEffect(() => {
    setMounted(true); // Mark component as ready for client-side rendering
  }, []);

  //
  // EARLY RETURN FOR SERVER-SIDE RENDERING
  //
  // Don't show anything until the component is mounted in the browser
  // This prevents hydration errors and ensures Clerk components work properly
  if (!mounted) {
    return null; // Return nothing while still loading
  }

  //
  // MAIN COMPONENT RENDER
  //
  // This is what gets displayed - the customized Clerk UserButton
  return (
    /* 
      CLERK USER BUTTON COMPONENT
      - UserButton: Clerk's built-in user profile and account management component
      - This provides access to user profile, settings, and sign-out functionality
      - It's automatically connected to Clerk's authentication system
      
      The UserButton shows:
      - User avatar/profile picture
      - Dropdown menu with account options
      - Sign-out functionality
      - Account settings access
      
      WHAT YOU CAN CHANGE:
      - Styling and appearance through the appearance prop
      - Colors, sizes, and visual elements
      - Button behavior and interactions
      
      WHAT NOT TO CHANGE:
      - The UserButton component name (this is Clerk's component)
      - The basic functionality (authentication, profile management)
      - The mounting logic (prevents hydration errors)
    */
    <UserButton
      /* 
        CUSTOM STYLING CONFIGURATION
        - appearance: Clerk prop for customizing the component's look
        - elements: Object containing specific element styling
        - This allows you to make Clerk components match your app's design
        
        Each element can be styled with Tailwind CSS classes to maintain
        consistency with your app's visual design.
      */
      appearance={{
        elements: {
          /* 
            USER AVATAR BOX
            - avatarBox: Styles the container that holds the user's profile picture
            - w-8 h-8: Width and height of 32px on mobile (2rem)
            - sm:w-10 sm:h-10: Width and height of 40px on small screens and up (2.5rem)
            - This makes the avatar responsive and appropriately sized
            
            WHAT YOU CAN CHANGE:
            - Avatar size (w-6 h-6, w-8 h-8, w-10 h-10, w-12 h-12)
            - Responsive breakpoints (sm:, md:, lg:)
            - Avatar shape and styling
            
            WHAT NOT TO CHANGE:
            - The element name (avatarBox)
            - The responsive structure
          */
          avatarBox: "w-8 h-8 sm:w-10 sm:h-10",

          /* 
            USER BUTTON POPOVER CARD
            - userButtonPopoverCard: Styles the dropdown menu that appears when clicking the avatar
            - bg-white: White background
            - border border-primary/20: Border with primary color at 20% opacity
            - text-primary: Text color using primary brand color
            - This makes the dropdown match your app's color scheme
            
            WHAT YOU CAN CHANGE:
            - Background color (bg-white, bg-gray-50, bg-primary)
            - Border styling (border, border-2, border-dashed)
            - Text colors and typography
            
            WHAT NOT TO CHANGE:
            - The element name (userButtonPopoverCard)
            - The basic structure
          */
          userButtonPopoverCard:
            "bg-white border border-primary/20 text-primary",

          /* 
            USER BUTTON POPOVER ACTION BUTTON
            - userButtonPopoverActionButton: Styles the buttons inside the dropdown menu
            - text-primary: Text color using primary brand color
            - hover:bg-gray-100: Light gray background on hover
            - This includes buttons like "Sign out", "Account", etc.
            
            WHAT YOU CAN CHANGE:
            - Button colors and hover effects
            - Button sizing and spacing
            - Button typography and borders
            
            WHAT NOT TO CHANGE:
            - The element name (userButtonPopoverActionButton)
            - The hover functionality
          */
          userButtonPopoverActionButton: "text-primary hover:bg-gray-100",

          /* 
            USER BUTTON POPOVER ACTION BUTTON TEXT
            - userButtonPopoverActionButtonText: Styles the text inside the action buttons
            - text-primary: Text color using primary brand color
            - This ensures button text matches your app's color scheme
            
            WHAT YOU CAN CHANGE:
            - Text colors and typography
            - Font weights and sizes
            - Text spacing and alignment
            
            WHAT NOT TO CHANGE:
            - The element name (userButtonPopoverActionButtonText)
            - The text content (this comes from Clerk)
          */
          userButtonPopoverActionButtonText: "text-primary",
        },
      }}
    />
  );
}

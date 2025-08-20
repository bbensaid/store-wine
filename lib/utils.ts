/**
 * UTILITY FUNCTIONS - This provides utility functions for CSS class management and consistent UI styling
 *
 * WHAT THIS FILE DOES:
 * - Provides the `cn` function for combining CSS classes
 * - Defines consistent UI styling patterns across the application
 * - Manages design system tokens and component styles
 * - Integrates clsx and tailwind-merge for class management
 * - Ensures consistent visual appearance across components
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a utility file that provides helper functions
 * - The `cn` function is used throughout the app for class management
 * - UI styles define the visual design system
 * - Changes here affect the entire application's appearance
 * - This file helps maintain design consistency
 *
 * TECHNOLOGIES USED:
 * - clsx (for conditional CSS class management)
 * - tailwind-merge (for Tailwind CSS class deduplication)
 * - TypeScript (for type safety and const assertions)
 * - Design system (for consistent visual patterns)
 * - CSS class utilities (for dynamic styling)
 */

// Import utilities for CSS class management
import { type ClassValue, clsx } from "clsx"; // For conditional class management
import { twMerge } from "tailwind-merge"; // For Tailwind CSS class deduplication

/**
 * CN UTILITY FUNCTION
 *
 * This function combines multiple CSS classes intelligently.
 * It handles conditional classes, deduplicates Tailwind classes,
 * and provides a clean interface for dynamic styling.
 *
 * BEGINNER TIP: Think of this as a "smart class combiner" that
 * takes multiple class inputs and creates the perfect final class string.
 *
 * Parameters: ...inputs - Variable number of class values (strings, objects, arrays)
 * Returns: Optimized CSS class string
 * Usage: cn("base-class", condition && "conditional-class", ["array", "of", "classes"])
 *
 * Examples:
 * - cn("text-red-500", isActive && "bg-blue-500") // Conditional classes
 * - cn("p-4", className) // Combine with custom classes
 * - cn("flex", "items-center", "gap-2") // Multiple base classes
 */
export function cn(...inputs: ClassValue[]) {
  //
  // CLASS COMBINATION PROCESS
  //
  // 1. clsx() - Combines classes and handles conditionals
  // 2. twMerge() - Deduplicates and optimizes Tailwind classes
  // 3. Returns the final optimized class string

  return twMerge(clsx(inputs));
}

/**
 * UI STYLES DESIGN SYSTEM
 *
 * This object defines consistent styling patterns for UI components.
 * It ensures visual consistency across the entire application.
 *
 * BEGINNER TIP: Think of this as a "style guide" that defines
 * how different UI elements should look throughout your app.
 *
 * Structure: Organized by component type with consistent patterns
 * Usage: Import and use these styles in your components
 * Maintenance: Update here to change styles across the entire app
 */
export const uiStyles = {
  //
  // DROPDOWN/SELECT COMPONENTS
  //
  // Consistent styling for dropdown menus and select components
  // These styles ensure all dropdowns look and feel the same
  dropdown: {
    trigger: "text-primary border border-primary/20", // Dropdown trigger button styling
    content: "text-primary border border-primary/20", // Dropdown content container styling
    item: "text-primary", // Individual dropdown item styling
    icon: "text-primary", // Dropdown icon styling
  },

  //
  // BUTTON COMPONENTS
  //
  // Consistent button styling patterns across the application
  // Reference: "Wines" button in Navbar uses these styles
  button: {
    //
    // PRIMARY BUTTON STYLE
    //
    // The main button style used throughout the app
    // Includes hover, active, and responsive states
    primary:
      "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary",

    //
    // ACTIVE BUTTON STATE
    //
    // Styling for buttons in their active/pressed state
    active: "bg-gray-200 text-primary border-gray-400",

    //
    // DISABLED BUTTON STATE
    //
    // Styling for buttons that are disabled
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",

    //
    // BUTTON ICON STYLING
    //
    // Consistent icon styling within buttons
    icon: "text-primary", // All icons should use primary color
  },

  //
  // INPUT COMPONENTS
  //
  // Consistent styling for form input elements
  input: {
    base: "text-primary placeholder:text-primary border border-primary/20", // Base input styling
  },

  //
  // LABEL COMPONENTS
  //
  // Consistent styling for form labels
  label: {
    base: "text-primary", // Base label styling
  },
} as const; // TypeScript const assertion for better type inference

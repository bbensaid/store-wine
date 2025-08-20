/**
 * NAV SEARCH COMPONENT - This creates a search input with debounced search functionality
 *
 * WHAT THIS COMPONENT DOES:
 * - Provides a search input field in the navigation bar
 * - Automatically searches as users type (with debouncing)
 * - Updates URL parameters to maintain search state
 * - Navigates to products page with search results
 * - Maintains search term across page refreshes
 * - Integrates with Next.js routing and URL management
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a client-side component (runs in the browser)
 * - It uses debouncing to prevent excessive API calls while typing
 * - It demonstrates URL parameter management and navigation
 * - It shows how to maintain state in the URL for better UX
 * - It's a key part of the search and navigation system
 *
 * TECHNOLOGIES USED:
 * - React (for component structure and state management)
 * - Next.js (for routing, URL parameters, and navigation)
 * - TypeScript (for type safety)
 * - use-debounce (for preventing excessive search calls)
 * - clsx (for conditional CSS class combination)
 * - Tailwind CSS (for styling and responsive design)
 */

// This directive tells Next.js this component runs on the client (browser) side
// We need this because we use state, effects, and interactive features
"use client";

// Import statements - bringing in all the tools we need
import { Input } from "../ui/input"; // Reusable input component for consistent styling
import { useSearchParams, useRouter } from "next/navigation"; // Next.js hooks for URL management
import { useDebouncedCallback } from "use-debounce"; // Hook for debouncing function calls
import { useState } from "react"; // Hook for managing component state
import clsx from "clsx"; // Utility for combining CSS classes conditionally

/**
 * NAV SEARCH COMPONENT FUNCTION
 *
 * This component creates a search input that:
 * - Shows a search field in the navigation bar
 * - Automatically searches as users type (with 300ms delay)
 * - Updates the URL to include search parameters
 * - Navigates to the products page with search results
 * - Maintains search state across page refreshes
 *
 * BEGINNER TIP: Think of this as a "smart search box" that knows what
 * you're looking for and automatically takes you to the right place.
 *
 * Props: Receives optional CSS classes for customization
 * State: Manages the current search term and URL parameters
 * Navigation: Automatically redirects to search results
 */
function NavSearch({ className = "" }: { className?: string }) {
  //
  // NEXT.JS ROUTING HOOKS
  //
  // These hooks provide access to URL parameters and navigation functions

  /**
   * SEARCH PARAMS HOOK
   *
   * This hook gives access to the current URL search parameters.
   * It allows us to read and modify the URL query string.
   *
   * Example: If URL is "/products?search=red+wine", this gives access to "search=red+wine"
   */
  const searchParams = useSearchParams();

  /**
   * ROUTER HOOK
   *
   * This hook provides navigation functions like replace().
   * We use replace() to update the URL without adding to browser history.
   *
   * replace(): Updates the current URL (doesn't add to back button history)
   * push(): Adds new URL to history (shows in back button)
   */
  const { replace } = useRouter();

  //
  // COMPONENT STATE
  //
  // This manages the current search term and keeps it in sync with URL parameters

  /**
   * SEARCH STATE
   *
   * This tracks the current search term that the user is typing.
   * It's initialized from URL parameters to maintain state across page refreshes.
   *
   * searchParams.get("search"): Gets the current search term from the URL
   * || "": Defaults to empty string if no search term exists
   *
   * This ensures the search input shows the current search term even after page refresh.
   */
  const [search, setSearch] = useState(searchParams.get("search") || "");

  //
  /* SEARCH HANDLING FUNCTION
   *
   * This function handles the actual search operation when users type.
   * It's debounced to prevent excessive API calls while users are still typing.
   *
   * useDebouncedCallback: Wraps the function to delay execution by 300ms
   * This means the search only happens 300ms after the user stops typing.
   *
   * BEGINNER TIP: Debouncing is like "waiting for someone to finish talking
   * before responding" - it prevents the search from running too many times.
   */
  const handleSearch = useDebouncedCallback((term: string) => {
    //
    // URL PARAMETER MANAGEMENT
    //
    // This section updates the URL to include the search term

    // Create a new URLSearchParams object from current parameters
    // This allows us to modify the URL without affecting other parameters
    const params = new URLSearchParams(searchParams);

    if (term) {
      // If there's a search term, add it to the URL parameters
      params.set("search", term);
    } else {
      // If search term is empty, remove it from URL parameters
      params.delete("search");
    }

    // Navigate to the products page with updated search parameters
    // This triggers a search on the products page
    replace(`/products?${params.toString()}`);
  }, 300); // 300ms delay before executing the search

  //
  // COMPONENT RENDER
  //
  // This is what gets displayed - the search input field
  return (
    /* 
      SEARCH INPUT FIELD
      - Input: Reusable UI component for consistent styling
      - type="search": HTML input type for search functionality
      - placeholder: Text shown when input is empty
      - className: Combines default styles with optional custom classes
      - value: Controlled input value from component state
      - onChange: Handles user input and triggers search
      
      The input automatically updates the search state and triggers searches as users type.
    */
    <Input
      type="search"
      placeholder="Search wines..."
      className={clsx(
        // Default search input styling
        "w-full dark:bg-muted focus-visible:ring-accent focus-visible:border-accent text-primary placeholder:text-primary",
        className // Additional classes passed from parent component
      )}
      value={search}
      onChange={(e) => {
        //
        // INPUT CHANGE HANDLER
        //
        // This function runs every time the user types in the search field

        // Get the current value from the input field
        const value = e.target.value;

        // Update the local search state immediately
        // This makes the input field responsive to user typing
        setSearch(value);

        // Trigger the debounced search function
        // This will execute 300ms after the user stops typing
        handleSearch(value);
      }}
    />
  );
}

/**
 * EXPORT STATEMENT
 *
 * This makes the NavSearch component available to other parts of your app.
 * The Navbar component imports and uses this component.
 *
 * DON'T CHANGE THIS unless you want to break the search functionality in the navbar!
 */
export default NavSearch;

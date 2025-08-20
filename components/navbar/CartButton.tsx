/**
 * CART BUTTON COMPONENT - This displays the shopping cart with item count in the navigation bar
 *
 * WHAT THIS COMPONENT DOES:
 * - Shows a shopping cart button in the navigation bar
 * - Displays the current number of items in the cart
 * - Fetches cart data from the API when the component loads
 * - Provides navigation to the cart page when clicked
 * - Shows a badge with item count when there are items in the cart
 * - Handles loading states and errors gracefully
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a client-side component (runs in the browser)
 * - It fetches data from an API endpoint when it loads
 * - It manages state for the cart item count
 * - It demonstrates API integration and error handling
 * - It's a reusable component used in the navbar
 *
 * TECHNOLOGIES USED:
 * - React (for state management and component lifecycle)
 * - Next.js (for client-side rendering and API integration)
 * - TypeScript (for type safety)
 * - Tailwind CSS (for styling and responsive design)
 * - Lucide React (for shopping cart icon)
 * - Fetch API (for getting cart data from server)
 */

// This directive tells Next.js this component runs on the client (browser) side
// We need this because we use state, effects, and API calls
"use client";

// Import statements - bringing in all the tools we need
import { useEffect, useState } from "react"; // React hooks for state and effects
import { Button } from "@/components/ui/button"; // Reusable button component
import { ShoppingCart } from "lucide-react"; // Shopping cart icon
import Link from "next/link"; // Next.js component for navigation

/**
 * CART BUTTON COMPONENT FUNCTION
 *
 * This component creates a shopping cart button that:
 * - Shows the current number of items in the cart
 * - Fetches cart data from the server when it loads
 * - Navigates to the cart page when clicked
 * - Displays a badge with item count when there are items
 *
 * BEGINNER TIP: Think of this as a "mini cart summary" that shows users
 * how many items they have in their cart without leaving the current page.
 *
 * State: It manages the cart item count internally
 * API: It fetches data from the server when the component loads
 * Navigation: It provides a link to the full cart page
 */
function CartButton() {
  // React hooks for managing component state

  /**
   * CART ITEM COUNT STATE
   *
   * This tracks how many items are currently in the user's shopping cart.
   * - 0 = empty cart (no badge shown)
   * - 1+ = items in cart (badge shows the number)
   *
   * This state is updated when the component fetches cart data from the server.
   */
  const [numItemsInCart, setNumItemsInCart] = useState(0);

  /**
   * CART DATA FETCHING EFFECT
   *
   * This runs when the component first loads in the browser.
   * It fetches the current cart data from the server to display the item count.
   *
   * The empty dependency array [] means this only runs once when the component mounts.
   * This prevents unnecessary API calls on every render.
   */
  useEffect(() => {
    /**
     * FETCH CART ITEMS FUNCTION
     *
     * This function makes an API call to get the current cart information.
     * It handles the response and updates the cart item count state.
     *
     * async/await: Modern way to handle asynchronous operations (like API calls)
     * try/catch: Error handling to prevent crashes if the API call fails
     */
    const fetchCartItems = async () => {
      try {
        // Make API call to get cart data
        // This endpoint should return information about items in the cart
        const response = await fetch("/api/cart-items");

        // Parse the JSON response from the server
        const data = await response.json();

        // Update the cart item count state
        // data.numItems contains the number of items, or default to 0
        setNumItemsInCart(data.numItems || 0);
      } catch (error) {
        // If something goes wrong (network error, server error, etc.)
        // Log the error for debugging and reset the cart count to 0
        console.error("Error fetching cart items:", error);
        setNumItemsInCart(0);
      }
    };

    // Call the function to fetch cart data when the component loads
    fetchCartItems();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      fetchCartItems();
    };

    // Add event listener for cart updates
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Cleanup event listener when component unmounts
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  //
  // COMPONENT RENDER
  //
  // This is what gets displayed - the shopping cart button with optional item count badge
  return (
    /* 
      CART BUTTON CONTAINER
      - Button: Reusable UI component for consistent styling
      - asChild: Makes the Button component behave like its child (the Link)
      - This allows the Button styling to be applied to the Link component
      
      The button will look like a button but behave like a link.
    */
    <Button
      className="flex items-center gap-1 sm:gap-2 text-primary hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base border border-primary/20 bg-white font-normal relative"
      asChild
    >
      {/* 
        CART PAGE LINK
        - Link: Next.js component for navigation between pages
        - href="/cart": Links to the shopping cart page
        - This makes the entire button clickable and navigable
        
        When users click the cart button, they go to the cart page.
      */}
      <Link href="/cart">
        {/* 
          SHOPPING CART ICON
          - ShoppingCart: Icon from Lucide React library
          - Responsive sizing: w-4 h-4 on mobile, w-5 h-5 on small screens and up
          - mr-1: Right margin of 4px (0.25rem) for spacing
          - text-primary: Uses primary brand color
          
          This icon represents the shopping cart visually.
        */}
        <ShoppingCart className="w-4 h-4 sm:w-5 sm:w-5 mr-1 text-primary" />

        {/* 
          CART TEXT LABEL
          - hidden sm:inline: Hidden on mobile, visible on small screens and up
          - This saves space on mobile devices while keeping the button functional
          
          WHAT YOU CAN CHANGE:
          - Text content ("Cart", "Shopping Cart", "Basket")
          - Responsive breakpoint (sm:, md:, lg:)
          - Text styling and appearance
          
          WHAT NOT TO CHANGE:
          - The responsive classes (hidden sm:inline)
          - The text content structure
        */}
        <span className="hidden sm:inline">Cart</span>

        {/* 
          CART ITEM COUNT BADGE
          - Only shows when numItemsInCart > 0 (there are items in cart)
          - absolute -top-2 -right-2: Positioned above and to the right of the button
          - bg-primary: Uses primary brand color for background
          - text-primary-foreground: Uses contrasting text color
          - text-xs: Small text size for the number
          - rounded-full: Makes the badge circular
          - h-5 w-5: Fixed dimensions (20px x 20px)
          - flex items-center justify-center: Centers the number in the badge
          
          This badge shows users how many items they have in their cart.
          
          WHAT YOU CAN CHANGE:
          - Badge positioning (-top-2, -right-2)
          - Badge size (h-5 w-5, h-6 w-6)
          - Badge colors and styling
          - Badge shape (rounded-full, rounded-md)
          
          WHAT NOT TO CHANGE:
          - The conditional rendering (numItemsInCart > 0)
          - The badge positioning classes
          - The flex centering classes
        */}
        {numItemsInCart > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {numItemsInCart}
          </span>
        )}
      </Link>
    </Button>
  );
}

/**
 * EXPORT STATEMENT
 *
 * This makes the CartButton component available to other parts of your app.
 * The Navbar component imports and uses this component.
 *
 * DON'T CHANGE THIS unless you want to break the cart button in the navbar!
 */
export default CartButton;

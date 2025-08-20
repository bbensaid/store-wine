/**
 * PRODUCTS GRID WITH AUTHENTICATION COMPONENT - This displays products in a responsive grid with user-specific features
 *
 * WHAT THIS COMPONENT DOES:
 * - Renders products in a responsive grid layout
 * - Handles authentication to show different features for logged-in vs. anonymous users
 * - Displays product images, names, types, and prices
 * - Integrates favorite toggle functionality for authenticated users
 * - Provides sign-in prompts for anonymous users
 * - Creates clickable product cards that link to individual product pages
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is an async component (can check user authentication)
 * - It handles different user states (logged in vs. anonymous)
 * - It uses a map function to render multiple products
 * - It has complex responsive grid layout
 * - It integrates with multiple other components and utilities
 *
 * TECHNOLOGIES USED:
 * - Next.js (for async components and routing)
 * - React (for component structure and rendering)
 * - TypeScript (for type safety with Prisma types)
 * - Tailwind CSS (for responsive grid and styling)
 * - Prisma (for database types and data)
 * - Clerk (for user authentication)
 * - Custom utilities (for currency formatting)
 */

// Import statements - bringing in all the tools we need
import { Card } from "@/components/ui/card"; // Reusable card component for product display
import Link from "next/link"; // Next.js component for navigation between pages
import Image from "next/image"; // Next.js optimized image component
import { Wine, Image as PrismaImage } from "@prisma/client"; // Database types for products and images
import { formatCurrency } from "@/utils/format"; // Utility function to format prices nicely
import { currentUser } from "@clerk/nextjs/server"; // Clerk function to get current logged-in user
import FavoriteToggleButtonOptimized from "./FavoriteToggleButtonOptimized"; // Component for adding/removing favorites
import { CardSignInButton } from "../form/Buttons"; // Button component for prompting sign-in
import AddToCart from "../single-product/AddToCart"; // Existing Add to Cart component

/**
 * PRODUCTS GRID WITH AUTHENTICATION COMPONENT FUNCTION
 *
 * This is an async function component that:
 * - Receives an array of products as props
 * - Checks if a user is currently logged in
 * - Renders each product in a responsive grid
 * - Shows different features based on authentication status
 *
 * BEGINNER TIP: Think of this as a "product catalog" that adapts to whether
 * the user is logged in or not. Logged-in users can save favorites, anonymous
 * users see sign-in prompts.
 *
 * async: This function can wait for authentication checks to complete
 * Props: This component receives data from its parent component
 */
async function ProductsGridWithAuth({
  products, // Array of products with their images and details
}: {
  products: (Wine & { images: PrismaImage[] })[]; // TypeScript type: products with wine data and associated images
}) {
  //
  // AUTHENTICATION CHECK
  //
  // Check if a user is currently logged in
  // This single check is used for all products in the grid
  // await: Wait for the authentication check to complete
  const user = await currentUser();

  //
  // MAIN COMPONENT RENDER
  //
  // This is what gets displayed - a responsive grid of product cards
  return (
    /* 
      PRODUCTS GRID CONTAINER
      - pt-4: Top padding of 16px (1rem)
      - grid: CSS Grid layout system
      - gap-4: 16px gap between grid items
      - Responsive grid columns:
        * md:grid-cols-2: 2 columns on medium screens (768px+)
        * lg:grid-cols-3: 3 columns on large screens (1024px+)
        * xl:grid-cols-4: 4 columns on extra large screens (1280px+)
        * 2xl:grid-cols-5: 5 columns on 2xl screens (1536px+)
      
      WHAT YOU CAN CHANGE:
      - Top padding (pt-4, pt-8, pt-12)
      - Gap between items (gap-4, gap-6, gap-8)
      - Number of columns on different screen sizes
      
      WHAT NOT TO CHANGE:
      - The grid class (keeps the layout system working)
      - The responsive breakpoints (md:, lg:, xl:, 2xl:)
    */
    <div className="pt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {/* 
        PRODUCT MAPPING
        - products.map(): Creates a product card for each product in the array
        - Each product gets its own card with image, name, type, and price
        - The map function transforms data into UI components
        
        BEGINNER TIP: Think of this as a "loop" that goes through each product
        and creates a card for it. If you have 10 products, you get 10 cards.
      */}
      {products.map((product) => {
        // Extract commonly used properties from the product object
        const { name, images } = product; // Product name and array of images
        const productId = product.id; // Unique identifier for the product

        //
        // IMAGE VALIDATION
        //
        // Check if the product has valid images before rendering
        // This prevents errors when trying to display missing images
        if (!images || !images.length || !images[0]?.url) return null;

        // Get the first image URL for display
        const imageUrl = images[0].url;

        //
        // INDIVIDUAL PRODUCT CARD
        //
        // Each product gets its own card with all the product information
        return (
          /* 
            PRODUCT ARTICLE CONTAINER
            - article: Semantic HTML element for product content
            - key={productId}: Unique identifier for React's list rendering
            - group: CSS class for group hover effects
            - relative: Enables positioning of child elements
            - max-w-xs: Maximum width of 320px (20rem)
          */
          <article key={productId} className="group relative max-w-xs">
            {/* 
              PRODUCT CARD
              - Card: Reusable UI component for consistent styling
              - h-auto: Height adjusts to content
              - bg-white: White background
              - flex flex-col: Stack children vertically
              - justify-between: Space content evenly
              - relative: Enables positioning of favorites button
              - overflow-visible: Allows favorites button to extend outside
              - border border-primary/20: Border with primary color at 20% opacity
              - p-2: Padding of 8px (0.5rem)
              - rounded-md: Rounded corners
            */}
            <Card className="h-auto bg-white flex flex-col justify-between relative overflow-visible border border-primary/20 p-2 rounded-md">
              {/* 
                FAVORITES BUTTON SECTION
                - absolute top-10 right-10: Positioned 40px from top and right
                - z-10: High z-index to appear above other content
                - Shows different content based on authentication status
                
                WHAT YOU CAN CHANGE:
                - Button positioning (top-10, right-10)
                - Button appearance and styling
                
                WHAT NOT TO CHANGE:
                - The conditional logic (user ? ... : ...)
                - The component names (FavoriteToggleButtonOptimized, CardSignInButton)
              */}
              <div className="absolute top-10 right-10 z-10">
                {/* 
                  CONDITIONAL FAVORITES BUTTON
                  - If user is logged in: Show favorite toggle button
                  - If user is anonymous: Show sign-in prompt button
                  
                  This creates different experiences for different user types.
                */}
                {user ? (
                  /* 
                    AUTHENTICATED USER: FAVORITE TOGGLE
                    - Shows button to add/remove product from favorites
                    - wineId: Which wine to toggle (from product.id)
                    - userId: Which user is doing the action (from user.id)
                  */
                  <FavoriteToggleButtonOptimized
                    wineId={productId}
                    userId={user.id}
                  />
                ) : (
                  /* 
                    ANONYMOUS USER: SIGN-IN PROMPT
                    - Shows button encouraging user to sign in
                    - This helps convert visitors to registered users
                  */
                  <CardSignInButton />
                )}
              </div>

              {/* 
                PRODUCT LINK WRAPPER
                - Link: Makes the entire card clickable
                - href: Links to individual product page
                - h-full: Takes full height of the card
                
                This allows users to click anywhere on the card to view product details.
              */}
              <Link href={`/products/${productId}`} className="h-full">
                {/* 
                  PRODUCT IMAGE CONTAINER
                  - relative: Enables positioning of the Image component
                  - aspect-[3/4]: Maintains 3:4 aspect ratio (portrait orientation)
                  - mt-6 mx-6: Top margin 24px, left/right margin 24px
                  - overflow-hidden: Hides any image overflow
                  
                  The aspect ratio ensures all product images look consistent.
                */}
                <div className="relative aspect-[3/4] mt-6 mx-6 overflow-hidden">
                  {/* 
                    PRODUCT IMAGE
                    - src: Image URL from the database
                    - alt: Text description for screen readers (product name)
                    - fill: Image fills its container
                    - object-cover: Maintains aspect ratio while covering container
                    - object-bottom: Aligns image to bottom (good for wine bottles)
                    - rounded-md: Rounded corners
                    - priority: High priority for loading (important for homepage)
                  */}
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover object-bottom rounded-md"
                    priority
                  />
                </div>

                {/* 
                  PRODUCT INFORMATION SECTION
                  - flex flex-col: Stack information vertically
                  - items-center: Center text horizontally
                  - px-2: Left/right padding of 8px
                  - pt-4: Top padding of 16px
                  - flex-1: Take up remaining space
                  - gap-y-1: Small vertical gaps between elements
                  
                  This section displays the product details below the image.
                */}
                <div className="flex flex-col items-center px-2 pt-4 flex-1 gap-y-1">
                  {/* 
                    PRODUCT NAME
                    - text-sm md:text-base: Responsive text sizing
                    - font-medium: Medium font weight
                    - capitalize: Capitalizes first letter of each word
                    - text-center: Centers text
                    - truncate: Cuts off long names with "..."
                    - w-full: Full width
                    - leading-tight: Tighter line height
                    - mb-0 mt-0: No top or bottom margin
                    - text-primary: Uses primary brand color
                  */}
                  <h2 className="text-sm md:text-base font-medium capitalize text-center truncate w-full leading-tight mb-0 mt-0 text-primary">
                    {name}
                  </h2>

                  {/* 
                    PRODUCT TYPE
                    - text-xs md:text-sm: Smaller, responsive text
                    - text-primary: Uses primary brand color
                    - text-center: Centers text
                    - mt-0 mb-0: No top or bottom margin
                    
                    Shows wine type (e.g., "Red Wine", "White Wine", "Sparkling")
                  */}
                  <p className="text-xs md:text-sm text-primary text-center mt-0 mb-0">
                    {product.type}
                  </p>

                  {/* 
                    PRODUCT PRICE
                    - text-sm md:text-base: Responsive text sizing
                    - font-bold: Bold font weight for emphasis
                    - text-center: Centers text
                    - mt-0 mb-1: No top margin, small bottom margin
                    - text-primary: Uses primary brand color
                    
                    Uses formatCurrency utility to display price nicely (e.g., "$25.99")
                  */}
                  <p className="text-sm md:text-base font-bold text-center mt-0 mb-1 text-primary">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </Link>
              {/* Add to Cart Button */}
              <div className="px-2 pb-3">
                <AddToCart wineId={productId.toString()} />
              </div>
            </Card>
          </article>
        );
      })}
    </div>
  );
}

/**
 * EXPORT STATEMENT
 *
 * This makes the ProductsGridWithAuth component available to other parts of your app.
 * The FeaturedProducts component imports and uses this component.
 *
 * DON'T CHANGE THIS unless you want to break the product grid!
 */
export default ProductsGridWithAuth;

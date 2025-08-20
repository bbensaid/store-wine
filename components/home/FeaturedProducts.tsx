/**
 * FEATURED PRODUCTS COMPONENT - This displays a curated selection of featured wines on the homepage
 *
 * WHAT THIS COMPONENT DOES:
 * - Fetches featured products from the database
 * - Displays them in a grid layout below the hero section
 * - Handles empty states (when no products are available)
 * - Integrates with authentication for user-specific features
 * - Uses a section title and product grid layout
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is an async component (can fetch data from databases)
 * - It handles empty states gracefully
 * - It's composed of smaller, reusable components
 * - It's positioned below the hero with negative margin for spacing
 *
 * TECHNOLOGIES USED:
 * - Next.js (for async components and data fetching)
 * - React (for component structure)
 * - TypeScript (for type safety)
 * - Tailwind CSS (for styling and spacing)
 * - Custom utilities (for data fetching)
 * - Reusable components (SectionTitle, ProductsGridWithAuth, EmptyList)
 */

// Import statements - bringing in all the tools we need
import { fetchFeaturedProducts } from "@/utils/actions"; // Function to get featured products from database
import EmptyList from "../global/EmptyList"; // Component to show when no products are available
import SectionTitle from "../global/SectionTitle"; // Component for section headings
import ProductsGridWithAuth from "../products/ProductsGridWithAuth"; // Grid component with authentication

/**
 * FEATURED PRODUCTS COMPONENT FUNCTION
 *
 * This is an async function component that:
 * - Fetches featured products from the database
 * - Renders them in a structured layout
 * - Handles the case when no products are available
 *
 * BEGINNER TIP: Think of this as the "showcase" section of your homepage.
 * It displays the best or most important products to attract visitors.
 *
 * async: This function can wait for data to load (like from a database)
 * It's different from regular functions that run immediately.
 */
async function FeaturedProducts() {
  //
  // DATA FETCHING
  //
  // This line waits for the database to return featured products
  // The await keyword means "wait until this is done before continuing"
  // This is necessary because database operations take time
  const products = await fetchFeaturedProducts();

  //
  // EMPTY STATE HANDLING
  //
  // If no products are found, show a friendly message instead of an empty grid
  // This prevents the page from looking broken when there's no data
  if (products.length === 0) return <EmptyList />;

  //
  // MAIN COMPONENT RENDER
  //
  // This is what gets displayed when products are available
  return (
    /* 
      FEATURED PRODUCTS SECTION CONTAINER
      - section: Semantic HTML element for content sections
      - -mt-20: Negative top margin to reduce space above this section
      - This positioning helps control spacing between Hero and Featured Products
      
      WHAT YOU CAN CHANGE:
      - Top margin (-mt-16, -mt-20, -mt-24) to adjust spacing
        - -mt-16 = 4rem gap (current)
        - -mt-20 = 5rem gap (closer - what we're using now)
        - -mt-24 = 6rem gap (even closer)
        - -mt-28 = 7rem gap (very close)
      - Section styling and layout
      - Overall positioning
      
      WHAT NOT TO CHANGE:
      - The section element (important for SEO and accessibility)
      - The component structure
    */
    <section className="-mt-32">
      {/* 
        SECTION TITLE COMPONENT
        - This displays "FEATURED WINES" as a heading
        - It includes styling and a separator line
        - It's a reusable component used throughout the app
        
        WHAT YOU CAN CHANGE:
        - The text ("Featured Wines")
        - The styling (in the SectionTitle component)
        
        WHAT NOT TO CHANGE:
        - The component name (SectionTitle)
        - The text prop structure
      */}
      <SectionTitle text="Featured Wines" />

      {/* 
        PRODUCTS GRID COMPONENT
        - This displays the actual products in a responsive grid
        - It handles authentication (shows different features for logged-in users)
        - It receives the products data as a prop
        
        WHAT YOU CAN CHANGE:
        - Grid layout and styling (in the ProductsGridWithAuth component)
        - Product display format
        - Authentication behavior
        
        WHAT NOT TO CHANGE:
        - The component name (ProductsGridWithAuth)
        - The products prop structure
        - The authentication integration
      */}
      <ProductsGridWithAuth products={products} />
    </section>
  );
}

/**
 * EXPORT STATEMENT
 *
 * This makes the FeaturedProducts component available to other parts of your app.
 * The homepage imports and uses this component.
 *
 * DON'T CHANGE THIS unless you want to break the homepage!
 */
export default FeaturedProducts;

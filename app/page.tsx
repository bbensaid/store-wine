/**
 * HOMEPAGE COMPONENT - This is what users see when they visit your website's main page
 *
 * WHAT THIS FILE DOES:
 * - Defines the structure of your homepage
 * - Combines different components to create the complete page
 * - Handles loading states for better user experience
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a React component (a function that returns JSX)
 * - It imports and uses other components (like building blocks)
 * - The page is built by combining smaller, reusable pieces
 *
 * TECHNOLOGIES USED:
 * - React (for building the user interface)
 * - Next.js (for routing and page structure)
 * - TypeScript (for type safety)
 * - Suspense (for loading states)
 */

// Import statements - bringing in the components we need for this page
import FeaturedProducts from "@/components/home/FeaturedProducts"; // Shows the wine products grid
import LoadingContainer from "@/components/global/LoadingContainer"; // Shows while content is loading
import Container from "@/components/global/Container"; // Wraps content with consistent spacing
import { Suspense } from "react"; // React component for handling loading states
import HeroTransition from "@/components/home/HeroTransition"; // The main hero section at the top

/**
 * HOMEPAGE COMPONENT FUNCTION
 *
 * This function defines what your homepage looks like. It returns JSX (HTML-like code)
 * that describes the structure of the page.
 *
 * BEGINNER TIP: Think of this as a blueprint for your homepage. You're telling
 * the computer: "Put the hero section at the top, then show the featured products below."
 */
function HomePage() {
  return (
    /**
     * CONTAINER COMPONENT
     *
     * This wraps your entire homepage content and provides:
     * - Consistent margins and padding
     * - Responsive behavior (looks good on all screen sizes)
     * - Maximum width constraints
     *
     * WHAT YOU CAN CHANGE:
     * - The Container component itself (in components/global/Container.tsx)
     * - The spacing and layout it provides
     */
    <Container>
      {/* 
        HERO SECTION
        This is the main banner/hero area at the top of your homepage.
        It usually contains:
        - Your main message or slogan
        - Call-to-action buttons
        - Eye-catching images or carousels
        
        WHAT YOU CAN CHANGE:
        - The content inside HeroTransition component
        - The styling and layout
        - The images and text
        
        WHAT NOT TO CHANGE:
        - The component name (unless you rename the file)
        - The import statement (unless you move the file)
      */}
      <HeroTransition />

      {/* 
        FEATURED PRODUCTS SECTION
        This shows a grid of your main products (wines in this case).
        
        SUSPENSE WRAPPER:
        - Suspense shows a loading state while the products are being fetched
        - This prevents the page from looking broken while data loads
        - Users see a nice loading animation instead of a blank space
        
        WHAT YOU CAN CHANGE:
        - The products that are displayed
        - The layout of the product grid
        - The loading animation
        
        WHAT NOT TO CHANGE:
        - The Suspense wrapper (unless you want broken loading behavior)
        - The fallback prop (this controls what shows while loading)
      */}
      <Suspense fallback={<LoadingContainer />}>
        <FeaturedProducts />
      </Suspense>
    </Container>
  );
}

/**
 * EXPORT STATEMENT
 *
 * This makes the HomePage component available to other parts of your app.
 * Next.js automatically finds this file and uses it as your homepage.
 *
 * DON'T CHANGE THIS unless you want to break your homepage!
 */
export default HomePage;

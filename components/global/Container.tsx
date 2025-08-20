/**
 * CONTAINER COMPONENT - This is a layout wrapper that provides consistent spacing and structure
 *
 * WHAT THIS COMPONENT DOES:
 * - Wraps page content with consistent margins and padding
 * - Creates a responsive layout that works on all screen sizes
 * - Provides a grid-based layout system for better content organization
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a "layout component" - it doesn't show content itself
 * - It's like a picture frame that holds your content
 * - It ensures all pages look consistent and professional
 *
 * TECHNOLOGIES USED:
 * - React (for the component structure)
 * - TypeScript (for type safety)
 * - Tailwind CSS (for styling and responsive design)
 * - CSS Grid (for the layout system)
 */

// Import utility function for combining CSS classes
import { cn } from "@/lib/utils"; // This function helps combine multiple CSS classes safely

/**
 * CONTAINER COMPONENT FUNCTION
 *
 * This function creates a wrapper that provides consistent layout for your content.
 * It receives:
 * - children: The content you want to display inside the container
 * - className: Optional additional CSS classes you want to add
 *
 * BEGINNER TIP: Think of this as a "box" that holds your content and makes
 * it look good on all screen sizes.
 */
function Container({
  children, // This is whatever content you put inside the Container
  className, // Optional: additional CSS classes (the ? means it's not required)
}: {
  children: React.ReactNode; // TypeScript: this can be any React content
  className?: string; // TypeScript: this is an optional string
}) {
  return (
    /**
     * MAIN CONTAINER DIV
     *
     * This div creates the layout structure using CSS Grid.
     * The className uses the cn() utility to combine multiple CSS classes.
     */
    <div
      className={cn(
        // Base layout classes - these create the grid structure
        "w-full grid grid-cols-1 md:grid-cols-[15%_70%_15%]", // Responsive grid layout
        className // Additional classes passed from parent components
      )}
    >
      {/* 
        LEFT SIDEBAR/SPACE
        - hidden md:block: Hidden on mobile, visible on medium screens and up
        - This creates empty space on the left side of your content
        - On mobile, content takes full width. On desktop, it's centered with side margins.
        
        WHAT YOU CAN CHANGE:
        - The width (currently 15%)
        - What's displayed here (could be a sidebar, navigation, etc.)
        - When it appears (currently md: breakpoint)
        
        BEGINNER TIP: This is like the left margin of a book page.
      */}
      <div className="hidden md:block" />

      {/* 
        MAIN CONTENT AREA
        - w-full: Takes the full width available in its grid column
        - This is where your actual page content goes
        - On mobile: full width. On desktop: 70% width, centered.
        
        WHAT YOU CAN CHANGE:
        - The width (currently 70%)
        - The padding and margins
        - The background color or styling
        
        BEGINNER TIP: This is like the main text area of a book page.
      */}
      <div className="w-full">{children}</div>

      {/* 
        RIGHT SIDEBAR/SPACE
        - hidden md:block: Hidden on mobile, visible on medium screens and up
        - This creates empty space on the right side of your content
        - Mirrors the left side for balanced layout
        
        WHAT YOU CAN CHANGE:
        - The width (currently 15%)
        - What's displayed here (could be ads, additional navigation, etc.)
        - When it appears (currently md: breakpoint)
        
        BEGINNER TIP: This is like the right margin of a book page.
      */}
      <div className="hidden md:block" />
    </div>
  );
}

/**
 * EXPORT STATEMENT
 *
 * This makes the Container component available to other parts of your app.
 * Other components can import and use this Container.
 *
 * DON'T CHANGE THIS unless you want to break all pages that use this component!
 */
export default Container;

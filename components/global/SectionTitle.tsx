/**
 * SECTION TITLE COMPONENT - This creates consistent section headings with separator lines
 *
 * WHAT THIS COMPONENT DOES:
 * - Displays section titles in a consistent format across the application
 * - Adds a separator line below each title for visual organization
 * - Uses the Cinzel font for elegant typography
 * - Provides a reusable way to style section headings
 * - Maintains visual consistency throughout the website
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a simple, reusable component
 * - It receives text as a prop and displays it consistently
 * - It's used throughout the app for section organization
 * - It demonstrates component props and reusability
 *
 * TECHNOLOGIES USED:
 * - React (for component structure)
 * - TypeScript (for type safety with props)
 * - Tailwind CSS (for styling and responsive design)
 * - Next.js Google Fonts (Cinzel for typography)
 * - Radix UI (Separator component)
 */

// Import statements - bringing in all the tools we need
import { Separator } from "@/components/ui/separator"; // Horizontal line component for visual separation
import { Cinzel } from "next/font/google"; // Google Font for elegant typography

/**
 * FONT SETUP
 *
 * This loads the Cinzel font from Google Fonts and optimizes it for performance.
 * Cinzel is an elegant serif font that gives a sophisticated look to headings.
 *
 * WHAT YOU CAN CHANGE:
 * - Font family (e.g., 'Roboto', 'Open Sans', 'Playfair Display')
 * - Font weights (e.g., ['400', '500', '600', '700', '800', '900'])
 * - Font styles (e.g., ['normal', 'italic'])
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
 * SECTION TITLE COMPONENT FUNCTION
 *
 * This component creates a consistent section heading that includes:
 * - A title in the Cinzel font
 * - A separator line below the title
 * - Consistent spacing and styling
 *
 * BEGINNER TIP: Think of this as a "stamp" that you can use anywhere
 * you need a section heading. It ensures all headings look the same.
 *
 * Props: This component receives text as a parameter
 * Reusability: You can use this component multiple times with different text
 */
function SectionTitle({ text }: { text: string }) {
  //
  // COMPONENT RENDER
  //
  // This is what gets displayed - a title with a separator line below
  return (
    /* 
      SECTION TITLE CONTAINER
      - div: Basic container element
      - No specific styling - just holds the title and separator
      
      This container groups the title and separator together.
    */
    <div>
      {/* 
        SECTION TITLE HEADING
        - h2: Semantic HTML element for section headings (good for SEO)
        - ${cinzel.className}: Applies the Cinzel font
        - text-xl sm:text-2xl: Responsive text sizing
          * text-xl: 20px on mobile (1.25rem)
          * sm:text-2xl: 24px on small screens and up (1.5rem)
        - text-primary: Uses the main brand color
        - tracking-[.1em]: Increases letter spacing for elegant look
        - font-bold: Makes text bold for emphasis
        - mb-2: Bottom margin of 8px (0.5rem) for spacing above separator
        
        WHAT YOU CAN CHANGE:
        - Text size (text-lg, text-xl, text-2xl, text-3xl)
        - Font weight (font-normal, font-medium, font-bold, font-black)
        - Letter spacing (tracking-wide, tracking-wider, tracking-[.05em])
        - Bottom margin (mb-1, mb-2, mb-3, mb-4)
        - Text color (text-primary, text-gray-800, text-black)
        
        WHAT NOT TO CHANGE:
        - The h2 element (important for SEO and accessibility)
        - The cinzel.className (keeps the font consistent)
        - The text prop usage ({text})
      */}
      <h2
        className={`${cinzel.className} text-xl sm:text-2xl text-primary tracking-[.1em] font-bold mb-2`}
      >
        {text}
      </h2>

      {/* 
        SECTION SEPARATOR LINE
        - Separator: Horizontal line component for visual separation
        - mb-0 mt-0: No top or bottom margin
        - This creates a clean line below the title
        
        The separator helps visually separate the section title from the content below.
        It's a subtle but important design element for page organization.
        
        WHAT YOU CAN CHANGE:
        - Separator styling (in the Separator component)
        - Separator color and thickness
        - Separator margins (mb-2, mt-2, etc.)
        
        WHAT NOT TO CHANGE:
        - The Separator component name
        - The component structure
      */}
      <Separator className="mb-0 mt-0" />
    </div>
  );
}

/**
 * EXPORT STATEMENT
 *
 * This makes the SectionTitle component available to other parts of your app.
 * Other components can import and use this for consistent section headings.
 *
 * DON'T CHANGE THIS unless you want to break all section titles!
 */
export default SectionTitle;

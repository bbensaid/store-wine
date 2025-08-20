"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import HeroCarousel from "./HeroCarousel";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import { CarouselSlide, getCarouselData } from "@/lib/carouselData";

/**
 * FONT SETUP
 *
 * These fonts are loaded from Google Fonts and optimized by Next.js.
 * They provide consistent typography throughout the hero section.
 *
 * WHAT YOU CAN CHANGE:
 * - Font families (e.g., 'Roboto', 'Open Sans')
 * - Font weights (e.g., ['400', '500', '600', '700'])
 * - Font styles (e.g., ['normal', 'italic'])
 *
 * WHAT NOT TO CHANGE:
 * - The font object names (cinzel, cormorant)
 * - The subsets (keep 'latin' for English text)
 * - The display property (keep 'swap' for performance)
 */
const cinzel = Cinzel({
  subsets: ["latin"], // Only load Latin characters (English)
  display: "swap", // Show fallback font while loading (better performance)
  weight: ["400", "500", "600", "700"], // Available font weights
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"], // Only load Latin characters (English)
  display: "swap", // Show fallback font while loading (better performance)
  weight: ["500", "600"], // Available font weights
  style: ["italic"], // Only load italic style
});

/**
 * HERO COMPONENT FUNCTION
 *
 * This is the main hero section that appears at the top of your homepage.
 * It can display either:
 * - A carousel of rotating content (default)
 * - An "About Us" static section
 *
 * BEGINNER TIP: Think of this as the "main banner" of your website.
 * It's the first thing visitors see and should grab their attention.
 */
function Hero() {
  // React hooks for managing component state

  /**
   * ABOUT US TOGGLE STATE
   *
   * This controls whether the hero shows:
   * - false = carousel view (rotating content)
   * - true = About Us view (static content)
   *
   * The navbar can toggle this state to switch between views.
   */
  const [showAboutUs, setShowAboutUs] = useState(false); // Default to carousel view

  /**
   * CAROUSEL SLIDE STATE
   *
   * This tracks which carousel slide is currently visible.
   * - 0 = first slide
   * - 1 = second slide
   * - etc.
   *
   * The carousel automatically rotates through slides.
   */
  const [currentSlide, setCurrentSlide] = useState(0);

  /**
   * CAROUSEL DATA STATE
   *
   * This stores the carousel content (images, titles, descriptions).
   * It's loaded from an external source when the component starts.
   */
  const [carouselData, setCarouselData] = useState<CarouselSlide[]>([]);

  /**
   * CURRENT PAGE PATH
   *
   * This tells us which page the user is currently on.
   * We use this to reset the hero state when returning to the homepage.
   */
  const pathname = usePathname();

  /**
   * SHOW ABOUT US FUNCTION
   *
   * This function switches the hero to show the About Us content.
   * It's called from the navbar when users click "About Us".
   *
   * useCallback: Optimizes performance by preventing unnecessary re-renders
   */
  const showAboutUsContent = useCallback(() => {
    setShowAboutUs(true);
  }, []);

  /**
   * HIDE ABOUT US FUNCTION
   *
   * This function switches the hero back to carousel view.
   * It's called from the navbar when users click "Home" or other navigation.
   *
   * useCallback: Optimizes performance by preventing unnecessary re-renders
   */
  const hideAboutUsContent = useCallback(() => {
    setShowAboutUs(false);
  }, []);

  /**
   * COMPONENT LIFECYCLE EFFECT
   *
   * This runs when the component first loads and when certain values change.
   * It handles:
   * - Loading carousel data
   * - Setting up communication with the navbar
   * - Resetting state when returning to homepage
   * - Cleaning up when component unmounts
   */
  useEffect(() => {
    // Load the carousel content (images, titles, descriptions)
    loadCarouselData();

    // Register these functions so the navbar can call them
    // This creates a communication bridge between navbar and hero
    setShowAboutUsHandler(showAboutUsContent);
    setHideAboutUsHandler(hideAboutUsContent);

    // Reset to carousel view when on homepage
    if (pathname === "/" || pathname === "") {
      setShowAboutUs(false);
    }

    // Cleanup function - runs when component unmounts
    // This prevents memory leaks and errors
    return () => {
      setShowAboutUsHandler(() => {}); // Clear the handler
      setHideAboutUsHandler(() => {}); // Clear the handler
    };
  }, [pathname, showAboutUsContent, hideAboutUsContent]); // Dependencies: re-run when these change

  /**
   * LOAD CAROUSEL DATA FUNCTION
   *
   * This function fetches the carousel content from an external source.
   * It handles loading states and errors gracefully.
   *
   * async/await: Modern way to handle asynchronous operations (like loading data)
   */
  const loadCarouselData = async () => {
    try {
      // Fetch carousel data (images, titles, descriptions)
      const data = await getCarouselData();
      // Store the data in component state
      setCarouselData(data);
    } catch (error) {
      // If something goes wrong, log the error
      console.error("Error loading carousel data:", error);
    }
  };

  /**
   * HANDLE SLIDE CHANGE FUNCTION
   *
   * This function is called when the carousel changes slides.
   * It updates the current slide state and can trigger other actions.
   *
   * The carousel component calls this when users navigate between slides.
   */
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* 
        OUR WINES CALL-TO-ACTION BUTTON
        - This button is positioned outside the main hero content
        - It's only visible when NOT showing About Us content
        - -ml-8: Negative left margin for positioning
        - Uses Cinzel font for elegant typography
        
        WHAT YOU CAN CHANGE:
        - Button text ("Our Wines")
        - Button styling and colors
        - Button positioning (-ml-8)
        - Link destination (/products)
        
        WHAT NOT TO CHANGE:
        - The Button component structure
        - The Link component
        - The conditional rendering (!showAboutUs)
      */}
      {!showAboutUs && (
        <div className="flex justify-start items-center mt-0 mb-0 -ml-8">
          <Button
            asChild
            className={`${cinzel.className} px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base md:text-lg text-white tracking-[.1em] font-medium rounded-xl transition-all duration-200 whitespace-nowrap`}
          >
            <Link href="/products">Our Wines</Link>
          </Button>
        </div>
      )}

      {/* 
        MAIN HERO CONTENT CONTAINER
        - relative: Enables positioning of child elements
        - transform scale-80: Reduces size to 80% (scales down the entire hero)
        - origin-top: Scales from the top edge
        - -mt-12: Negative top margin to move the hero up
        
        WHAT YOU CAN CHANGE:
        - Scale factor (scale-80, scale-90, scale-100)
        - Top margin (-mt-12, -mt-8, -mt-16)
        - Overall positioning
        
        WHAT NOT TO CHANGE:
        - The relative positioning
        - The transform structure
      */}
      <div className="relative transform scale-80 origin-top -mt-12">
        {/* 
          BRAND NAME AND SLOGAN SECTION (COMMENTED OUT)
          - This section is currently inactive but can be enabled
          - It would show the company logo, name, and slogan above the carousel
          - Only visible when NOT showing About Us content
          
          WHAT YOU CAN CHANGE:
          - Uncomment this section to show branding
          - Logo image and company name
          - Slogan text
          - Styling and layout
          
          WHAT NOT TO CHANGE:
          - The conditional rendering (!showAboutUs)
          - The component structure
        */}
        {!showAboutUs && (
          <div className="mb-0 mt-0 relative">
            {/* 
              LOGO AND BRAND NAME (COMMENTED OUT)
              - This section is currently inactive
              - You can uncomment it to show the logo and company name
              - It would appear above the carousel content
            */}
            {/* <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Image
                src="/images/logo.png"
                alt="VineFox Logo"
                width={32}
                height={32}
                className="h-6 sm:h-8 md:h-10 w-auto flex-shrink-0"
              />
              <h1
                className={`${cinzel.className} text-base sm:text-lg md:text-xl lg:text-2xl text-primary tracking-[.1em] font-medium transition-all duration-200 mb-0`}
              >
                VineFox
            </h1>
          </div>
 */}

            {/* 
              SLOGAN (COMMENTED OUT)
              - This section is currently inactive
              - You can uncomment it to show the company slogan
              - Uses Cormorant Garamond font for elegant typography
            */}
            {/*           <h2
              className={`${cormorant.className} text-xs sm:text-sm md:text-base lg:text-lg text-primary tracking-wide transition-all duration-200 -mt-1 sm:-mt-2`}
            >
              Discover. Share. Savor the rare.
            </h2> */}
          </div>
        )}

        {/* 
          MAIN CONTENT GRID SECTION
          - grid grid-cols-1 lg:grid-cols-12: Single column on mobile, 12 columns on large screens
          - gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24: Responsive spacing between grid items
          - items-center: Centers items vertically within each grid cell
          
          This grid layout provides:
          - Left side: Text content (7 columns on large screens)
          - Right side: Image/carousel (5 columns on large screens)
          
          WHAT YOU CAN CHANGE:
          - Grid column spans (lg:col-span-7, lg:col-span-5)
          - Gap spacing between grid items
          - Grid layout (grid-cols-1, grid-cols-2, etc.)
          
          WHAT NOT TO CHANGE:
          - The grid structure
          - The responsive breakpoints
        */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24 items-center">
          {/* 
            LEFT SIDE: CONTENT AREA
            - lg:col-span-7: Takes up 7 out of 12 columns on large screens
            - Always visible, but content changes based on toggle and carousel
            - Contains either About Us content or carousel-focused content
          */}
          <div className="lg:col-span-7">
            {/* 
              CONDITIONAL CONTENT RENDERING
              - This section shows different content based on the showAboutUs state
              - showAboutUs ? AboutUsContent : CarouselContent
              
              The content dynamically changes when users click About Us in the navbar.
            */}
            {showAboutUs ? (
              /* 
                ABOUT US CONTENT SECTION
                - This shows when showAboutUs is true
                - Static content that doesn't change
                - Centered layout with company commitment message
                
                WHAT YOU CAN CHANGE:
                - Text content ("OUR COMMITTMENT")
                - Styling and colors
                - Layout and spacing
                
                WHAT NOT TO CHANGE:
                - The conditional logic (showAboutUs ? ... : ...)
                - The component structure
              */
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                {/* 
                  COMPANY COMMITMENT HEADING
                  - Uses Cinzel font for elegant typography
                  - Responsive text sizing (text-lg to xl:text-4xl)
                  - border border-primary: Border with primary color
                  - px-4 sm:px-6 py-2 sm:py-3: Responsive padding
                  - rounded-xl: Rounded corners
                  - transition-all duration-200: Smooth animation effects
                */}
                <h2
                  className={`${cinzel.className} text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-primary tracking-wide font-black border border-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200`}
                >
                  OUR COMMITTMENT
                </h2>
              </div>
            ) : (
              /* 
                CAROUSEL-FOCUSED CONTENT SECTION
                - This shows when showAboutUs is false (default)
                - Content syncs with the current carousel slide
                - Dynamic title that changes as carousel rotates
                
                WHAT YOU CAN CHANGE:
                - Default title ("Featured Wines")
                - Styling and colors
                - Layout and spacing
                
                WHAT NOT TO CHANGE:
                - The carouselData[currentSlide]?.title logic
                - The conditional rendering
              */
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                {/* 
                  DYNAMIC CAROUSEL TITLE
                  - {carouselData[currentSlide]?.title || "Featured Wines"}
                  - Shows the title from the current carousel slide
                  - Falls back to "Featured Wines" if no carousel data
                  - Uses Cinzel font for elegant typography
                  - Responsive text sizing
                  - transition-all duration-500: Smooth animation effects
                */}
                <h2
                  className={`${cinzel.className} text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary tracking-[.1em] font-medium transition-all duration-500`}
                >
                  {carouselData[currentSlide]?.title || "Featured Wines"}
                </h2>
                <h3
                  className={`${cormorant.className} text-base sm:text-lg md:text-xl lg:text-2xl text-primary tracking-wide transition-all duration-500`}
                >
                  {carouselData[currentSlide]?.subtitle ||
                    "Discover our collection"}
                </h3>
              </div>
            )}
            {/* Body text for hero section - syncs with carousel when in carousel mode */}
            <p
              className={`${cormorant.className} mt-6 sm:mt-8 w-full text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed text-primary transition-all duration-500`}
            >
              {showAboutUs ? (
                <>
                  <span className="block text-center font-black text-base sm:text-lg md:text-xl lg:text-2xl">
                    Best Wine. Best Service. Best Prices.
                  </span>
                  <br />
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Cumque et voluptas saepe in quae voluptate, laborum maiores
                    possimus illum reprehenderit aut delectus veniam cum
                    perferendis unde sint doloremque non nam. Sed ut
                    perspiciatis unde omnis iste natus error sit voluptatem
                    accusantium doloremque laudantium.
                  </span>
                </>
              ) : (
                carouselData[currentSlide]?.description ||
                "Explore our curated selection of exceptional wines."
              )}
            </p>
          </div>
          {/* Right: Hero Carousel - always visible */}
          <div className="lg:col-span-5">
            <HeroCarousel
              onSlideChange={handleSlideChange}
              showAboutUs={showAboutUs}
            />
          </div>
        </section>
      </div>
    </>
  );
}

// Export the component with a method to show About Us content
const HeroComponent = Hero;
export { HeroComponent as default };

// Export a context or function to trigger About Us from navbar
let showAboutUsGlobal: (() => void) | null = null;
let hideAboutUsGlobal: (() => void) | null = null;

export const setShowAboutUsHandler = (handler: () => void) => {
  showAboutUsGlobal = handler;
};

export const setHideAboutUsHandler = (handler: () => void) => {
  hideAboutUsGlobal = handler;
};

export const triggerShowAboutUs = () => {
  if (showAboutUsGlobal) {
    showAboutUsGlobal();
  }
};

export const triggerHideAboutUs = () => {
  if (hideAboutUsGlobal) {
    hideAboutUsGlobal();
  }
};

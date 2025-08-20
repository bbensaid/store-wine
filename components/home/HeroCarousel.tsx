/**
 * HERO CAROUSEL COMPONENT - This creates an interactive image carousel for the hero section
 *
 * WHAT THIS COMPONENT DOES:
 * - Displays rotating images in a carousel format
 * - Auto-scrolls through images every 4 seconds
 * - Provides navigation arrows for manual control
 * - Allows users to pause/play by clicking on images
 * - Handles loading states and data fetching
 * - Integrates with the Hero component for slide synchronization
 * - Shows different content based on About Us toggle
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a client-side component (runs in the browser)
 * - It manages multiple states (current slide, paused, mounted, loading)
 * - It uses useEffect for side effects and timers
 * - It handles user interactions and animations
 * - It demonstrates component communication through props
 *
 * TECHNOLOGIES USED:
 * - React (for state management and component lifecycle)
 * - Next.js (for client-side rendering and image optimization)
 * - TypeScript (for type safety with props and data)
 * - Tailwind CSS (for styling and responsive design)
 * - Lucide React (for navigation icons)
 * - Custom carousel data system
 */

// This directive tells Next.js this component runs on the client (browser) side
// We need this because we use state, effects, timers, and interactive features
"use client";

// Import statements - bringing in all the tools we need
import { Card } from "@/components/ui/card"; // Reusable card component for carousel container
import Image from "next/image"; // Next.js optimized image component
import React, { useEffect, useState } from "react"; // React hooks for state and effects
import { Button } from "@/components/ui/button"; // Reusable button component for navigation
import { CarouselSlide, getCarouselData } from "@/lib/carouselData"; // Carousel data types and fetching
import { ChevronLeft, ChevronRight } from "lucide-react"; // Navigation arrow icons

/**
 * COMPONENT PROPS INTERFACE
 *
 * This defines what data the component expects to receive from its parent.
 * TypeScript uses this to ensure the component is used correctly.
 *
 * onSlideChange?: Optional function called when slides change
 * showAboutUs?: Boolean to control whether to show About Us content or carousel
 */
interface HeroCarouselProps {
  onSlideChange?: (index: number) => void; // Optional callback when slides change
  showAboutUs?: boolean; // Whether to show About Us content instead of carousel
}

/**
 * HERO CAROUSEL COMPONENT FUNCTION
 *
 * This component creates an interactive carousel that:
 * - Automatically rotates through images
 * - Responds to user navigation
 * - Can be paused by clicking on images
 * - Synchronizes with the parent Hero component
 *
 * BEGINNER TIP: Think of this as a "slideshow" that automatically advances
 * but also lets users take control when they want to.
 *
 * Props: This component receives configuration from its parent
 * State: It manages its own internal state for slides, pause, and loading
 */
function HeroCarousel({
  onSlideChange, // Function to notify parent when slides change
  showAboutUs = false, // Default to showing carousel (not About Us)
}: HeroCarouselProps) {
  // React hooks for managing component state

  /**
   * CURRENT SLIDE STATE
   *
   * This tracks which slide is currently visible.
   * - 0 = first slide
   * - 1 = second slide
   * - etc.
   *
   * The carousel automatically advances this value every 4 seconds.
   */
  const [current, setCurrent] = useState(0);

  /**
   * PAUSE STATE
   *
   * This controls whether the carousel is paused or auto-advancing.
   * - false = carousel auto-advances (default)
   * - true = carousel is paused (user clicked on image)
   *
   * Users can click on images to pause the carousel.
   */
  const [paused, setPaused] = useState(false);

  /**
   * MOUNTED STATE
   *
   * This tracks whether the component has finished loading in the browser.
   * - false = component is still loading
   * - true = component is ready to display
   *
   * This prevents server-side rendering mismatches.
   */
  const [mounted, setMounted] = useState(false);

  /**
   * CAROUSEL DATA STATE
   *
   * This stores the carousel content (images, titles, descriptions).
   * It's loaded from an external source when the component starts.
   *
   * The carousel won't work until this data is loaded.
   */
  const [carouselData, setCarouselData] = useState<CarouselSlide[]>([]);

  /**
   * LOADING STATE
   *
   * This tracks whether the carousel data is still being fetched.
   * - true = data is loading
   * - false = data is ready
   *
   * This prevents showing a broken carousel while data loads.
   */
  const [loading, setLoading] = useState(true);

  /**
   * COMPONENT INITIALIZATION EFFECT
   *
   * This runs when the component first loads in the browser.
   * It handles:
   * - Setting the mounted state to true
   * - Loading the carousel data
   *
   * The empty dependency array [] means this only runs once.
   */
  useEffect(() => {
    setMounted(true); // Mark component as ready
    loadCarouselData(); // Start loading carousel data
  }, []);

  /**
   * LOAD CAROUSEL DATA FUNCTION
   *
   * This function fetches the carousel content from an external source.
   * It handles loading states and errors gracefully.
   *
   * async/await: Modern way to handle asynchronous operations (like loading data)
   * try/catch: Error handling to prevent crashes if something goes wrong
   */
  const loadCarouselData = async () => {
    try {
      setLoading(true); // Show loading state
      const data = await getCarouselData(); // Fetch data from external source
      setCarouselData(data); // Store the data in component state
    } catch (error) {
      // If something goes wrong, log the error
      console.error("Error loading carousel data:", error);
    } finally {
      // Always hide loading state, whether success or failure
      setLoading(false);
    }
  };

  /**
   * AUTO-ADVANCE EFFECT
   *
   * This creates a timer that automatically advances the carousel every 4 seconds.
   * It only runs when:
   * - Carousel is not paused
   * - Carousel data is loaded
   * - Not showing About Us content
   *
   * The timer automatically cleans up when the component unmounts.
   */
  useEffect(() => {
    // Don't auto-advance if paused, no data, or showing About Us
    if (paused || carouselData.length === 0 || showAboutUs) return;

    // Create timer that advances every 4000ms (4 seconds)
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselData.length);
    }, 4000);

    // Cleanup function - runs when component unmounts or effect re-runs
    // This prevents memory leaks from multiple timers
    return () => clearInterval(interval);
  }, [paused, carouselData.length, showAboutUs]);

  /**
   * SLIDE CHANGE NOTIFICATION EFFECT
   *
   * This notifies the parent component whenever the current slide changes.
   * It's optional - only runs if onSlideChange prop is provided.
   *
   * This creates communication between the carousel and its parent.
   */
  useEffect(() => {
    // Only call the callback if it exists
    onSlideChange?.(current);
  }, [current, onSlideChange]);

  /**
   * NAVIGATION FUNCTIONS
   *
   * These functions allow users to manually navigate the carousel.
   * They use the modulo operator (%) to wrap around to the beginning/end.
   */

  /**
   * GO TO NEXT SLIDE
   *
   * Advances to the next slide in the carousel.
   * If at the last slide, wraps around to the first slide.
   */
  const goToNext = () => {
    if (carouselData.length === 0) return; // Don't navigate if no data
    setCurrent((prev) => (prev + 1) % carouselData.length);
  };

  /**
   * GO TO PREVIOUS SLIDE
   *
   * Goes back to the previous slide in the carousel.
   * If at the first slide, wraps around to the last slide.
   */
  const goToPrevious = () => {
    if (carouselData.length === 0) return; // Don't navigate if no data
    setCurrent(
      (prev) => (prev - 1 + carouselData.length) % carouselData.length
    );
  };

  //
  // EARLY RETURN FOR LOADING/MOUNTING
  //
  // Don't show anything until the component is ready and data is loaded
  // This prevents server-side rendering mismatches and broken displays
  if (!mounted || loading) return null;

  //
  // MAIN COMPONENT RENDER
  //
  // This is what gets displayed - the interactive carousel
  return (
    /* 
      CAROUSEL CONTAINER
      - block w-full: Takes full width of parent container
      - This is the main wrapper for the entire carousel
    */
    <div className="block w-full">
      {/* 
        CAROUSEL CONTENT WRAPPER
        - flex flex-col: Stack children vertically
        - items-center: Center items horizontally
        - relative: Enables positioning of navigation arrows
      */}
      <div className="flex flex-col items-center relative">
        {/* 
          NAVIGATION ARROWS SECTION
          - absolute inset-0: Covers the entire carousel area
          - flex items-center justify-between: Space arrows apart
          - z-10: High z-index to appear above carousel content
          - pointer-events-none: Don't block clicks on carousel content
          
          The arrows are positioned over the carousel but don't interfere with clicks.
        */}
        <div className="absolute inset-0 flex items-center justify-between z-10 pointer-events-none">
          {/* 
            PREVIOUS SLIDE BUTTON
            - onClick: Calls goToPrevious function when clicked
            - variant="outline": Outline button style
            - size="icon": Makes button square-shaped
            - pointer-events-auto: Re-enables clicks on this button
            - Responsive sizing: w-8 h-8 on mobile, larger on bigger screens
            - Rounded corners and hover effects
            
            WHAT YOU CAN CHANGE:
            - Button size and positioning
            - Colors and styling
            - Icon size and appearance
            
            WHAT NOT TO CHANGE:
            - The onClick function (goToPrevious)
            - The aria-label (important for accessibility)
          */}
          <Button
            onClick={goToPrevious}
            variant="outline"
            size="icon"
            className="pointer-events-auto bg-white/80 hover:bg-white border-primary/20 text-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-200 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </Button>

          {/* 
            NEXT SLIDE BUTTON
            - onClick: Calls goToNext function when clicked
            - Same styling as previous button for consistency
            - Responsive sizing and hover effects
            
            WHAT YOU CAN CHANGE:
            - Button size and positioning
            - Colors and styling
            - Icon size and appearance
            
            WHAT NOT TO CHANGE:
            - The onClick function (goToNext)
            - The aria-label (important for accessibility)
          */}
          <Button
            onClick={goToNext}
            variant="outline"
            size="icon"
            className="pointer-events-auto bg-white/80 hover:bg-white border-primary/20 text-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-200 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </Button>
        </div>

        {/* 
          CAROUSEL CARD CONTAINER
          - Card: Reusable UI component for consistent styling
          - Responsive sizing: max-w-sm on mobile, larger on bigger screens
          - h-auto: Height adjusts to content
          - bg-white: White background
          - flex items-end justify-center: Centers content and aligns to bottom
          - relative: Enables positioning of child elements
          - overflow-hidden: Hides any content that extends outside
          - border border-primary/20: Border with primary color at 20% opacity
          - Responsive padding: p-4 on mobile, larger on bigger screens
          - rounded-md: Rounded corners
          - transition-all duration-200: Smooth animation effects
        */}
        <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl h-auto bg-white flex items-end justify-center relative overflow-hidden border border-primary/20 p-4 sm:p-6 md:p-8 lg:p-12 rounded-md transition-all duration-200">
          {/* 
            IMAGE CONTAINER
            - relative: Enables positioning of the Image component
            - aspect-[3/4]: Maintains 3:4 aspect ratio (portrait orientation)
            - w-full: Takes full width of the card
            - overflow-hidden: Hides any image overflow
            
            The aspect ratio ensures all carousel images look consistent.
          */}
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            {/* 
              CAROUSEL IMAGE
              - src: Dynamic image source based on showAboutUs state
              - showAboutUs ? logo1.png : carouselData[current]?.imageUrl
              - alt: Text description for screen readers
              - fill: Image fills its container
              - object-cover: Maintains aspect ratio while covering container
              - object-bottom: Aligns image to bottom (good for wine bottles)
              - rounded-md: Rounded corners
              - cursor-pointer: Shows pointer cursor on hover
              - onClick: Toggles pause state when image is clicked
              
              WHAT YOU CAN CHANGE:
              - Image sources and fallbacks
              - Click behavior
              - Cursor appearance
              
              WHAT NOT TO CHANGE:
              - The conditional logic for image source
              - The onClick pause functionality
              - The Image component structure
            */}
            <Image
              src={
                showAboutUs
                  ? "/images/logo1.png" // Show logo when About Us is active
                  : carouselData[current]?.imageUrl || // Show carousel image
                    "/images/wines/hero1.jpeg" // Fallback image
              }
              alt={
                showAboutUs
                  ? "About Us" // Alt text for About Us mode
                  : carouselData[current]?.title || // Alt text from carousel data
                    "Wine" // Fallback alt text
              }
              fill
              className="object-cover object-bottom rounded-md cursor-pointer"
              onClick={() => !showAboutUs && setPaused(!paused)} // Toggle pause on click
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
export default HeroCarousel;

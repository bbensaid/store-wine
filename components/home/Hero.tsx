"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroCarousel from "./HeroCarousel";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import { CarouselSlide, getCarouselData } from "@/lib/carouselData";

// Font imports for branding and typography
const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
  style: ["italic"],
});

/**
 * Hero section for homepage.
 * - To change the logo, update the src in <Image>.
 * - To change the main color, update the text color class or theme variable.
 * - To change the slogan, edit the <h2> content.
 * - For layout changes, adjust Tailwind classes on the container divs.
 */
function Hero() {
  const [showAboutUs, setShowAboutUs] = useState(false); // Default to carousel view
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselData, setCarouselData] = useState<CarouselSlide[]>([]);

  useEffect(() => {
    loadCarouselData();
    // Register the function to be called from navbar
    setShowAboutUsHandler(showAboutUsContent);
    
    // Cleanup on unmount
    return () => {
      setShowAboutUsHandler(() => {});
    };
  }, []);

  const loadCarouselData = async () => {
    try {
      const data = await getCarouselData();
      setCarouselData(data);
    } catch (error) {
      console.error('Error loading carousel data:', error);
    }
  };

  const showAboutUsContent = () => {
    setShowAboutUs(true);
  };

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative">
      {/* OUR WINES button */}
      <div className="flex justify-start mb-4 mt-2">
        <Button
          asChild
          className={`${cinzel.className} px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base md:text-lg text-white tracking-[.1em] font-medium rounded-xl transition-all duration-200 whitespace-nowrap`}
        >
          <Link href="/products">Our Wines</Link>
        </Button>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24 items-center">
        {/* Left: Content - always visible, changes based on toggle and carousel */}
        <div className="lg:col-span-7">
          {/* Brand Name and Slogan - only visible in carousel mode */}
          {!showAboutUs && (
            <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* Brand Name */}
              <h1
                className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary tracking-[.1em] font-medium transition-all duration-200`}
              >
                VineFox
              </h1>
              {/* Slogan - only in carousel mode */}
              <h2
                className={`${cormorant.className} text-base sm:text-lg md:text-xl lg:text-2xl text-primary tracking-wide transition-all duration-200`}
              >
                Discover. Share. Savor the rare.
              </h2>
            </div>
          )}

          {showAboutUs ? (
            /* About Us content - static Hero content */
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              {/* Slogan */}
              <h2
                className={`${cinzel.className} text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-primary tracking-wide font-black border border-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200`}
              >
                OUR COMMITTMENT
              </h2>
            </div>
          ) : (
            /* Carousel-focused content - syncs with carousel slides */
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <h2
                className={`${cinzel.className} text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary tracking-[.1em] font-medium transition-all duration-500`}
              >
                {carouselData[currentSlide]?.title || "Featured Wines"}
              </h2>
              <h3
                className={`${cormorant.className} text-base sm:text-lg md:text-xl lg:text-2xl text-primary tracking-wide transition-all duration-500`}
              >
                {carouselData[currentSlide]?.subtitle || "Discover our collection"}
              </h3>
            </div>
          )}
          {/* Body text for hero section - syncs with carousel when in carousel mode */}
          <p
            className={`${cormorant.className} mt-6 sm:mt-8 w-full text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed text-primary transition-all duration-500`}
          >
            {showAboutUs
              ? (
                <>
                  <span className="block text-center font-black text-base sm:text-lg md:text-xl lg:text-2xl">Best Wine. Best Service. Best Prices.</span>
                  <br />
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque et voluptas saepe in quae voluptate, laborum maiores possimus illum reprehenderit aut delectus veniam cum perferendis unde sint doloremque non nam. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</span>
                </>
              )
              : carouselData[currentSlide]?.description || "Explore our curated selection of exceptional wines."
            }
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
  );
}

// Export the component with a method to show About Us content
const HeroComponent = Hero;
export { HeroComponent as default };

// Export a context or function to trigger About Us from navbar
let showAboutUsGlobal: (() => void) | null = null;

export const setShowAboutUsHandler = (handler: () => void) => {
  showAboutUsGlobal = handler;
};

export const triggerShowAboutUs = () => {
  if (showAboutUsGlobal) {
    showAboutUsGlobal();
  }
};

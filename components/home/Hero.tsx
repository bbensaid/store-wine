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
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselData, setCarouselData] = useState<CarouselSlide[]>([]);

  useEffect(() => {
    loadCarouselData();
  }, []);

  const loadCarouselData = async () => {
    try {
      const data = await getCarouselData();
      setCarouselData(data);
    } catch (error) {
      console.error('Error loading carousel data:', error);
    }
  };

  const toggleAboutUs = () => {
    console.log('About Us clicked, setting showAboutUs to true');
    setShowAboutUs(true);
    setAutoScrollEnabled(false);
  };

  const toggleAutoScroll = () => {
    console.log('Auto Scroll clicked, setting showAboutUs to false');
    setAutoScrollEnabled(!autoScrollEnabled);
    setShowAboutUs(false);
  };

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    // Only switch to auto scroll if user explicitly clicks navigation in About Us mode
    // Don't auto-switch on initial load
  };

  const handleNavigationClick = () => {
    // If we're in About Us mode and navigation is clicked, start auto scroll mode
    if (showAboutUs) {
      console.log('Navigation clicked in About Us mode, switching to auto scroll');
      setShowAboutUs(false);
      setAutoScrollEnabled(true);
    }
  };

  console.log('Current state - showAboutUs:', showAboutUs, 'autoScrollEnabled:', autoScrollEnabled);

  return (
    <div className="relative">
      {/* ABOUT US, OUR PRODUCTS, and Auto Scroll buttons at the top */}
      <div className="flex justify-start gap-4 mb-4 mt-2">
        <Button
          onClick={toggleAboutUs}
          className={`${cinzel.className} px-6 py-6 md:px-8 md:py-7 text-xl sm:text-2xl md:text-3xl text-white tracking-[.1em] font-medium rounded-xl`}
        >
          About Us
        </Button>
        <Button
          asChild
          className={`${cinzel.className} px-6 py-6 md:px-8 md:py-7 text-xl sm:text-2xl md:text-3xl text-white tracking-[.1em] font-medium rounded-xl`}
        >
          <Link href="/products">Our Products</Link>
        </Button>
        <Button
          onClick={toggleAutoScroll}
          className={`${cinzel.className} px-6 py-6 md:px-8 md:py-7 text-xl sm:text-2xl md:text-3xl text-white tracking-[.1em] font-medium rounded-xl`}
        >
          Auto Scroll
        </Button>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
        {/* Left: Content - always visible, changes based on toggle and carousel */}
        <div className="lg:col-span-7">
          {/* Logo and Brand Name - only visible in carousel mode */}
          {!showAboutUs && (
            <div className="flex flex-col items-center gap-4 mb-8">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center">
                  <img
                    src="/images/logo.png"
                    alt="Wine Store Logo"
                    className="h-40 w-auto max-h-[10rem]"
                  />
                </Link>
              </div>
              {/* Brand Name */}
              <h1
                className={`${cinzel.className} text-2xl sm:text-3xl md:text-4xl text-primary tracking-[.1em] font-medium`}
              >
                VineFox
              </h1>
              {/* Slogan - only in carousel mode */}
              <h2
                className={`${cormorant.className} text-lg sm:text-xl md:text-2xl text-primary tracking-wide`}
              >
                Discover. Share. Savor the rare.
              </h2>
            </div>
          )}

          {showAboutUs ? (
            /* About Us content - static Hero content */
            <div className="flex flex-col items-center gap-4">
              {/* Slogan */}
              <h2
                className={`${cinzel.className} text-2xl sm:text-3xl md:text-4xl text-primary tracking-wide font-black border border-primary px-6 py-3 rounded-xl`}
              >
                OUR COMMITTMENT
              </h2>
            </div>
          ) : (
            /* Carousel-focused content - syncs with carousel slides */
            <div className="flex flex-col items-center gap-4">
              <h2
                className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl text-primary tracking-[.1em] font-medium transition-all duration-500`}
              >
                {carouselData[currentSlide]?.title || "Featured Wines"}
              </h2>
              <h3
                className={`${cormorant.className} text-lg sm:text-xl md:text-2xl text-primary tracking-wide transition-all duration-500`}
              >
                {carouselData[currentSlide]?.subtitle || "Discover our collection"}
              </h3>
            </div>
          )}
          {/* Body text for hero section - syncs with carousel when in carousel mode */}
          <p
            className={`${cormorant.className} mt-8 w-full text-lg sm:text-xl md:text-2xl leading-relaxed text-primary transition-all duration-500`}
          >
            {showAboutUs
              ? (
                <>
                  <span className="block text-center font-black text-lg sm:text-xl md:text-2xl">Best Wine. Best Service. Best Prices.</span>
                  <br />
                  <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque et voluptas saepe in quae voluptate, laborum maiores possimus illum reprehenderit aut delectus veniam cum perferendis unde sint doloremque non nam. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</span>
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
            autoScrollEnabled={autoScrollEnabled}
            showAboutUs={showAboutUs}
            onNavigationClick={handleNavigationClick}
          />
        </div>
      </section>
    </div>
  );
}

export default Hero;

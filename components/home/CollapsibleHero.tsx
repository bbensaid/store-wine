"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroCarousel from "./HeroCarousel";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import { LuChevronUp, LuChevronDown } from "react-icons/lu";

// Synchronized text content for each carousel slide
const heroTexts = [
  {
    title: "Premium Red Wines",
    subtitle: "Discover our finest collection of aged reds",
    description: "From bold Cabernets to elegant Pinot Noirs, experience the depth and complexity of our premium red wine selection."
  },
  {
    title: "Exclusive White Wines", 
    subtitle: "Crisp and refreshing whites for every occasion",
    description: "From buttery Chardonnays to zesty Sauvignon Blancs, find your perfect white wine companion."
  },
  {
    title: "Rare Vintage Collection",
    subtitle: "Limited edition wines from exceptional years", 
    description: "Explore our curated selection of rare vintages, each bottle tells a story of exceptional terroir and craftsmanship."
  },
  {
    title: "Artisan Sparkling Wines",
    subtitle: "Celebrate with our handcrafted bubbles",
    description: "From traditional méthode champenoise to modern sparkling techniques, raise a glass to life's special moments."
  }
];

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

function CollapsibleHero() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  // Auto-hide after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCollapsed(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const toggleHero = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="relative">
      {/* Toggle Button - appears when hero is collapsed */}
      {isCollapsed && (
        <div className="fixed top-20 right-4 z-50">
          <Button
            onClick={toggleHero}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-primary/20 text-primary hover:bg-white shadow-lg"
          >
            <LuChevronDown className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">Show Hero</span>
          </Button>
        </div>
      )}

      {/* Main Hero Section - collapses to reveal button */}
      <section 
        className={`grid grid-cols-1 lg:grid-cols-12 gap-24 items-center transition-all duration-700 ease-in-out ${
          isCollapsed ? "transform -translate-y-full opacity-0 pointer-events-none h-0 overflow-hidden" : ""
        }`}
      >
        {/* Left: Logo, Brand, Slogan, CTA */}
        <div className="lg:col-span-7">
          <div className="flex flex-col items-center gap-4">
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
              className={`${cinzel.className} text-4xl sm:text-5xl md:text-6xl text-primary tracking-[.1em] font-medium`}
            >
              VineFox
            </h1>
            {/* Synchronized Title */}
            <h2
              className={`${cinzel.className} text-3xl sm:text-4xl md:text-5xl text-primary tracking-[.1em] font-medium transition-all duration-500`}
            >
              {heroTexts[currentSlide].title}
            </h2>
            {/* Synchronized Subtitle */}
            <h3
              className={`${cormorant.className} text-2xl sm:text-3xl md:text-4xl text-primary tracking-wide transition-all duration-500`}
            >
              {heroTexts[currentSlide].subtitle}
            </h3>
          </div>
          {/* Synchronized Description */}
          <p
            className={`${cormorant.className} mt-8 w-full text-xl sm:text-2xl md:text-3xl leading-relaxed text-primary transition-all duration-500`}
          >
            {heroTexts[currentSlide].description}
          </p>
          {/* Call-to-action button - This becomes visible when hero collapses */}
          <Button
            asChild
            className={`${cinzel.className} mt-16 px-6 py-6 md:px-8 md:py-7 text-xl sm:text-2xl md:text-3xl text-white tracking-[.1em] font-medium rounded-xl transition-all duration-500 ${
              isCollapsed ? "fixed top-4 left-1/2 transform -translate-x-1/2 z-40 shadow-2xl scale-110" : ""
            }`}
          >
            <Link href="/products">Our Products</Link>
          </Button>
        </div>
        {/* Right: Hero Carousel */}
        <div className="lg:col-span-5">
          <HeroCarousel onSlideChange={setCurrentSlide} />
        </div>
      </section>

      {/* Quick Hide Button - appears when hero is visible */}
      {!isCollapsed && (
        <div className="fixed top-20 right-4 z-50">
          <Button
            onClick={toggleHero}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-primary/20 text-primary hover:bg-white shadow-lg"
          >
            <LuChevronUp className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">Hide Hero</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export default CollapsibleHero; 
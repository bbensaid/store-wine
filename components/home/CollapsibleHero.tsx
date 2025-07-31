"use client";

import React, { useState } from "react";
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
  weight: ["500", "600", "700"],
  style: ["italic"],
});

function CollapsibleHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleHero = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <div className="flex justify-start mb-4">
        <Button
          onClick={toggleHero}
          variant="outline"
          className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
        >
          {isCollapsed ? (
            <>
              <LuChevronDown className="h-4 w-4" />
              Show Hero
            </>
          ) : (
            <>
              <LuChevronUp className="h-4 w-4" />
              Hide Hero
            </>
          )}
        </Button>
      </div>

      {/* Main Hero Section */}
      <section className={`grid grid-cols-1 lg:grid-cols-12 gap-24 items-center transition-all duration-500 ${
        isCollapsed ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-screen'
      }`}>
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
              className={`${cinzel.className} text-lg sm:text-xl md:text-2xl text-primary tracking-[.1em] font-bold transition-all duration-500`}
            >
              {heroTexts[currentSlide].title}
            </h2>
            {/* Synchronized Subtitle */}
            <h3
              className={`${cormorant.className} text-lg sm:text-xl md:text-2xl text-primary tracking-wide transition-all duration-500 font-medium`}
            >
              {heroTexts[currentSlide].subtitle}
            </h3>
          </div>
          {/* Synchronized Description */}
          <p
            className={`${cormorant.className} mt-8 w-full text-2xl sm:text-3xl md:text-4xl leading-relaxed text-primary transition-all duration-500 font-normal`}
          >
            {heroTexts[currentSlide].description}
          </p>
          {/* Call-to-action button */}
          <Button
            asChild
            className={`${cinzel.className} mt-16 px-6 py-6 md:px-8 md:py-7 text-xl sm:text-2xl md:text-3xl text-white tracking-[.1em] font-medium rounded-xl`}
          >
            <Link href="/products">Our Products</Link>
          </Button>
        </div>
        {/* Right: Hero Carousel */}
        <div className="lg:col-span-5">
          <HeroCarousel onSlideChange={setCurrentSlide} />
        </div>
      </section>
    </div>
  );
}

export default CollapsibleHero; 
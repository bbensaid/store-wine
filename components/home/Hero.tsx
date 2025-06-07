// Hero: Main hero section for the homepage.
// Displays the logo, brand name, slogan, and a call-to-action button.
// Also includes the HeroCarousel on the right for featured images/products.

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroCarousel from "./HeroCarousel";
import { Cinzel, Cormorant_Garamond } from "next/font/google";

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
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
      {/* Left: Logo, Brand, Slogan, CTA */}
      <div className="lg:col-span-8">
        <div className="flex flex-col items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="Wine Store Logo"
                className="h-40 w-auto"
              />
            </Link>
          </div>
          {/* Brand Name */}
          <h1
            className={`${cinzel.className} text-4xl sm:text-5xl text-[#8B0015] tracking-[.1em] font-medium`}
          >
            VineFox
          </h1>
          {/* Slogan */}
          <h2
            className={`${cormorant.className} text-3xl sm:text-4xl text-[#8B0015] tracking-wide`}
          >
            Discover. Share. Savor the rare.
          </h2>
        </div>
        {/* Body text for hero section. Update for marketing or branding changes. */}
        <p
          className={`${cormorant.className} mt-8 w-full text-2xl sm:text-3xl leading-relaxed text-[#2D2D2D]`}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque et
          voluptas saepe in quae voluptate, laborum maiores possimus illum
          reprehenderit aut delectus veniam cum perferendis unde sint doloremque
          non nam.
        </p>
        {/* Call-to-action button */}
        <Button asChild size="lg" className="mt-10">
          <Link href="/products">Our Products</Link>
        </Button>
      </div>
      {/* Right: Hero Carousel */}
      <div className="lg:col-span-4">
        <HeroCarousel />
      </div>
    </section>
  );
}

export default Hero;

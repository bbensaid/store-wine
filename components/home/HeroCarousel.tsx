"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import hero1 from "@/public/images/wines/hero1.jpeg";
import hero2 from "@/public/images/wines/hero2.jpeg";
import hero3 from "@/public/images/wines/hero3.jpeg";
import hero4 from "@/public/images/wines/hero4.jpeg";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const carouselData = [
  {
    image: hero1,
    title: "Premium Red Wines",
    subtitle: "Discover our finest collection of aged reds",
    description: "From bold Cabernets to elegant Pinot Noirs, experience the depth and complexity of our premium red wine selection."
  },
  {
    image: hero2,
    title: "Exclusive White Wines",
    subtitle: "Crisp and refreshing whites for every occasion",
    description: "From buttery Chardonnays to zesty Sauvignon Blancs, find your perfect white wine companion."
  },
  {
    image: hero3,
    title: "Rare Vintage Collection",
    subtitle: "Limited edition wines from exceptional years",
    description: "Explore our curated selection of rare vintages, each bottle tells a story of exceptional terroir and craftsmanship."
  },
  {
    image: hero4,
    title: "Artisan Sparkling Wines",
    subtitle: "Celebrate with our handcrafted bubbles",
    description: "From traditional méthode champenoise to modern sparkling techniques, raise a glass to life's special moments."
  }
];

// SVG icons for play and pause (theme red)
const PlayIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="5,3 17,10 5,17" />
  </svg>
);
const PauseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="3" width="4" height="14" />
    <rect x="12" y="3" width="4" height="14" />
  </svg>
);

function HeroCarousel({ onSlideChange }: { onSlideChange?: (index: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    onSlideChange?.(current);
  }, [current, onSlideChange]);

  if (!mounted) return null; // Prevent SSR mismatch

  return (
    <div className="hidden lg:block">
      <div className="flex flex-col items-center">
        <Card className="w-full max-w-2xl h-auto bg-white flex items-end justify-center relative overflow-hidden border border-primary/20 p-8 md:p-12 rounded-md">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={carouselData[current].image}
              alt={carouselData[current].title}
              fill
              className="object-cover rounded-md"
            />
          </div>
        </Card>
        <div className="flex items-center justify-center gap-3 md:gap-4 mt-4">
          {paused ? (
            <Button
              variant="outline"
              className="border-primary text-primary bg-transparent hover:bg-primary/10 focus:ring-0 focus:ring-offset-0 flex items-center gap-1.5 md:gap-2 text-base md:text-lg px-4 py-2 md:px-6 md:py-3"
              onClick={() => setPaused(false)}
              aria-label="Play carousel"
            >
              <PlayIcon />
              <span>Play</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="border-primary text-primary bg-transparent hover:bg-primary/10 focus:ring-0 focus:ring-offset-0 flex items-center gap-1.5 md:gap-2 text-base md:text-lg px-4 py-2 md:px-6 md:py-3"
              onClick={() => setPaused(true)}
              aria-label="Pause carousel"
            >
              <PauseIcon />
              <span>Pause</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
export default HeroCarousel;

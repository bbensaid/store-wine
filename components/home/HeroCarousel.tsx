"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import hero1 from "@/public/images/wines/hero1.jpeg";
import hero2 from "@/public/images/wines/hero2.jpeg";
import hero3 from "@/public/images/wines/hero3.jpeg";
import hero4 from "@/public/images/wines/hero4.jpeg";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";

const carouselImages = [hero1, hero2, hero3, hero4];

// SVG icons for play and pause (theme red)
const themeRed = "#8B0015";
const PlayIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill={themeRed}
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
    fill={themeRed}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="3" width="4" height="14" />
    <rect x="12" y="3" width="4" height="14" />
  </svg>
);

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [paused]);

  if (!mounted) return null; // Prevent SSR mismatch

  return (
    <div className="hidden lg:block">
      <div className="flex flex-col items-center">
        <Card className="w-full h-auto bg-white flex items-end justify-center relative overflow-hidden border border-gray-300 p-6 md:p-8 rounded-md">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={carouselImages[current]}
              alt="hero"
              fill
              className="object-cover rounded-md"
            />
          </div>
        </Card>
        <div className="flex items-center justify-center gap-3 md:gap-4 mt-4">
          {paused ? (
            <Button
              variant="outline"
              className="border-[#8B0015] text-[#8B0015] bg-transparent hover:bg-[#8B0015]/10 focus:ring-0 focus:ring-offset-0 flex items-center gap-1.5 md:gap-2 text-base md:text-lg px-4 py-2 md:px-6 md:py-3"
              onClick={() => setPaused(false)}
              aria-label="Play carousel"
            >
              <PlayIcon />
              <span>Play</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="border-[#8B0015] text-[#8B0015] bg-transparent hover:bg-[#8B0015]/10 focus:ring-0 focus:ring-offset-0 flex items-center gap-1.5 md:gap-2 text-base md:text-lg px-4 py-2 md:px-6 md:py-3"
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

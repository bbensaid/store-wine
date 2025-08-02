"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CarouselSlide, getCarouselData } from "@/lib/carouselData";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

interface HeroCarouselProps {
  onSlideChange?: (index: number) => void;
  autoScrollEnabled?: boolean;
  showAboutUs?: boolean;
  onNavigationClick?: () => void;
}

function HeroCarousel({ onSlideChange, autoScrollEnabled = false, showAboutUs = false, onNavigationClick }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [carouselData, setCarouselData] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadCarouselData();
  }, []);

  const loadCarouselData = async () => {
    try {
      setLoading(true);
      const data = await getCarouselData();
      setCarouselData(data);
    } catch (error) {
      console.error('Error loading carousel data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only auto-scroll if autoScrollEnabled is true and not paused
    if (!autoScrollEnabled || paused || carouselData.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoScrollEnabled, paused, carouselData.length]);

  useEffect(() => {
    onSlideChange?.(current);
  }, [current, onSlideChange]);

  const goToNext = () => {
    if (carouselData.length === 0) return;
    setCurrent((prev) => (prev + 1) % carouselData.length);
    onNavigationClick?.();
  };

  const goToPrevious = () => {
    if (carouselData.length === 0) return;
    setCurrent((prev) => (prev - 1 + carouselData.length) % carouselData.length);
    onNavigationClick?.();
  };

  if (!mounted || loading) return null; // Prevent SSR mismatch and show loading

  return (
    <div className="hidden lg:block">
      <div className="flex flex-col items-center relative">
        {/* Navigation Arrows - always visible */}
        <div className="absolute inset-0 flex items-center justify-between z-10 pointer-events-none">
          <Button
            onClick={goToPrevious}
            variant="outline"
            size="icon"
            className="pointer-events-auto bg-white/80 hover:bg-white border-primary/20 text-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-200 w-12 h-12 rounded-full"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            onClick={goToNext}
            variant="outline"
            size="icon"
            className="pointer-events-auto bg-white/80 hover:bg-white border-primary/20 text-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-200 w-12 h-12 rounded-full"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <Card className="w-full max-w-2xl h-auto bg-white flex items-end justify-center relative overflow-hidden border border-primary/20 p-8 md:p-12 rounded-md">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={showAboutUs ? "/images/logo1.png" : (carouselData[current]?.imageUrl || "/images/wines/hero1.jpeg")}
              alt={showAboutUs ? "About Us" : (carouselData[current]?.title || "Wine")}
              fill
              className="object-cover rounded-md"
            />
          </div>
        </Card>
        
        {/* Play/Pause button - only show when not in About Us mode */}
        {!showAboutUs && (
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
        )}
      </div>
    </div>
  );
}
export default HeroCarousel;

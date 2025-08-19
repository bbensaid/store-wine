"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CarouselSlide, getCarouselData } from "@/lib/carouselData";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroCarouselProps {
  onSlideChange?: (index: number) => void;
  showAboutUs?: boolean;
}

function HeroCarousel({
  onSlideChange,
  showAboutUs = false,
}: HeroCarouselProps) {
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
      console.error("Error loading carousel data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-scroll through carousel images with 4 second intervals
    if (paused || carouselData.length === 0 || showAboutUs) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [paused, carouselData.length, showAboutUs]);

  useEffect(() => {
    onSlideChange?.(current);
  }, [current, onSlideChange]);

  const goToNext = () => {
    if (carouselData.length === 0) return;
    setCurrent((prev) => (prev + 1) % carouselData.length);
  };

  const goToPrevious = () => {
    if (carouselData.length === 0) return;
    setCurrent(
      (prev) => (prev - 1 + carouselData.length) % carouselData.length
    );
  };

  if (!mounted || loading) return null; // Prevent SSR mismatch and show loading

  return (
    <div className="block w-full">
      <div className="flex flex-col items-center relative">
        {/* Navigation Arrows - always visible */}
        <div className="absolute inset-0 flex items-center justify-between z-10 pointer-events-none">
          <Button
            onClick={goToPrevious}
            variant="outline"
            size="icon"
            className="pointer-events-auto bg-white/80 hover:bg-white border-primary/20 text-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-200 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </Button>
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

        <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl h-auto bg-white flex items-end justify-center relative overflow-hidden border border-primary/20 p-4 sm:p-6 md:p-8 lg:p-12 rounded-md transition-all duration-200">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={
                showAboutUs
                  ? "/images/logo1.png"
                  : carouselData[current]?.imageUrl ||
                    "/images/wines/hero1.jpeg"
              }
              alt={
                showAboutUs
                  ? "About Us"
                  : carouselData[current]?.title || "Wine"
              }
              fill
              className="object-cover rounded-md cursor-pointer"
              onClick={() => !showAboutUs && setPaused(!paused)}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
export default HeroCarousel;

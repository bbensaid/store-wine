"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import hero1 from "@/public/images/wines/hero1.jpeg";
import hero2 from "@/public/images/wines/hero2.jpeg";
import hero3 from "@/public/images/wines/hero3.jpeg";
import hero4 from "@/public/images/wines/hero4.jpeg";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

const carouselImages = [hero1, hero2, hero3, hero4];

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
        <Card className="w-full h-auto flex items-end justify-center relative overflow-hidden p-6 md:p-8">
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
              onClick={() => setPaused(false)}
              aria-label="Play carousel"
            >
              <Play className="w-4 h-4 mr-2" />
              <span>Play</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setPaused(true)}
              aria-label="Pause carousel"
            >
              <Pause className="w-4 h-4 mr-2" />
              <span>Pause</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
export default HeroCarousel;

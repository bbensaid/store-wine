"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import hero1 from "@/public/images/wines/hero1.jpeg";
import hero2 from "@/public/images/wines/hero2.jpeg";
import hero3 from "@/public/images/wines/hero3.jpeg";
import hero4 from "@/public/images/wines/hero4.jpeg";
import React, { useState } from "react";

const carouselImages = [hero1, hero2, hero3, hero4];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const goToPrev = () => {
    setCurrent(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };
  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <div className="hidden lg:block">
      <Card className="w-[16rem] h-[32rem] mx-auto flex flex-col items-center justify-start relative overflow-visible">
        <CardContent className="w-full h-full flex flex-col items-center justify-start p-2 pb-0">
          <div
            className="w-full flex-1 flex items-start justify-center mt-2 mb-2 relative overflow-hidden"
            style={{ height: "75%" }}
          >
            <Image
              key={current}
              src={carouselImages[current]}
              alt="hero"
              className="w-full h-full rounded-md object-cover"
            />
          </div>
          <div className="w-full flex items-center justify-center gap-8 mt-2 mb-2">
            <button
              onClick={goToPrev}
              className="static relative left-0 top-0 translate-y-0 text-[#8B0015] text-2xl rounded-full border border-[#8B0015] w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 transition"
              aria-label="Previous slide"
            >
              &#8592;
            </button>
            <button
              onClick={goToNext}
              className="static relative right-0 top-0 translate-y-0 text-[#8B0015] text-2xl rounded-full border border-[#8B0015] w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 transition"
              aria-label="Next slide"
            >
              &#8594;
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HeroCarousel;

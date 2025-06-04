"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import hero1 from "@/public/images/wines/hero1.jpeg";
import hero2 from "@/public/images/wines/hero2.jpeg";
import hero3 from "@/public/images/wines/hero3.jpeg";
import hero4 from "@/public/images/wines/hero4.jpeg";
import * as React from "react";

const carouselImages = [hero1, hero2, hero3, hero4];

function HeroCarousel() {
  // State to hold the carousel API
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  // Autoplay: scroll to next image every 5 seconds
  React.useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="hidden lg:block h-full">
      <Carousel
        opts={{
          loop: true,
          duration: 40,
        }}
        className="h-full"
        setApi={setApi}
      >
        <CarouselContent className="h-full">
          {carouselImages.map((image, index) => {
            return (
              <CarouselItem key={index} className="h-full">
                <Card className="w-full h-full mx-auto">
                  <CardContent className="px-10 py-2">
                    <Image
                      src={image}
                      alt="hero"
                      className="w-full h-full rounded-md object-cover"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-0" />
        <CarouselNext className="-right-0" />
      </Carousel>
    </div>
  );
}

export default HeroCarousel;

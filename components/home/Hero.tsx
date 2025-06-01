import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroCarousel from "./HeroCarousel";
import Image from "next/image";
import { Cinzel, Cormorant_Garamond, Lora } from "next/font/google";

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

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
      <div className="lg:col-span-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-[180px] h-[180px]">
              <Image
                src="/images/logo.png"
                alt="VineFox Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1
            className={`${cinzel.className} text-4xl sm:text-5xl text-[#8B0015] tracking-[.1em] font-medium`}
          >
            VineFox
          </h1>
          <h2
            className={`${cormorant.className} text-3xl sm:text-4xl text-[#8B0015] tracking-wide`}
          >
            Discover. Share. Savor the rare.
          </h2>
        </div>
        <p
          className={`${cormorant.className} mt-8 w-full text-2xl sm:text-3xl leading-relaxed text-[#2D2D2D]`}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque et
          voluptas saepe in quae voluptate, laborum maiores possimus illum
          reprehenderit aut delectus veniam cum perferendis unde sint doloremque
          non nam.
        </p>
        <Button asChild size="lg" className="mt-10">
          <Link href="/products">Our Products</Link>
        </Button>
      </div>
      <div className="lg:col-span-4">
        <HeroCarousel />
      </div>
    </section>
  );
}

export default Hero;

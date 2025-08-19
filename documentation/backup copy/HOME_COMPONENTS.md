# Home Page Components - Complete Source Code & Documentation

## Table of Contents

1. [Hero Section](#hero-section)
2. [Hero Carousel](#hero-carousel)
3. [Featured Products](#featured-products)
4. [Hero Transition](#hero-transition)

## Hero Section

### components/home/Hero.tsx

**Purpose**: Main banner section with call-to-action and hero image
**Location**: `/components/home/Hero.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, MapPin, Wine } from "lucide-react";
import { cn } from "@/lib/utils";

const heroData = [
  {
    id: 1,
    title: "Premium Wines from Around the World",
    subtitle: "Discover exceptional wines curated by our sommeliers",
    description:
      "From bold reds to crisp whites, explore our collection of handpicked wines from renowned vineyards and emerging regions.",
    cta: "Shop Now",
    ctaLink: "/products",
    badge: "Featured",
    rating: 4.8,
    location: "Global Selection",
    image: "/images/hero-wine-1.jpg",
    bgGradient: "from-purple-900/20 to-pink-900/20",
  },
  {
    id: 2,
    title: "Exclusive Wine Tasting Events",
    subtitle: "Join our virtual and in-person wine experiences",
    description:
      "Learn from expert sommeliers, discover new flavors, and connect with fellow wine enthusiasts in our curated events.",
    cta: "View Events",
    ctaLink: "/events",
    badge: "New",
    rating: 4.9,
    location: "Worldwide",
    image: "/images/hero-wine-2.jpg",
    bgGradient: "from-emerald-900/20 to-blue-900/20",
  },
  {
    id: 3,
    title: "Personalized Wine Recommendations",
    subtitle: "Get curated suggestions based on your taste",
    description:
      "Our AI-powered system learns your preferences and suggests wines you'll love, making every choice a perfect match.",
    cta: "Get Started",
    ctaLink: "/quiz",
    badge: "AI Powered",
    rating: 4.7,
    location: "Personalized",
    image: "/images/hero-wine-3.jpg",
    bgGradient: "from-orange-900/20 to-red-900/20",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSlideChange = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const currentHero = heroData[currentSlide];

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={currentHero.image}
          alt={currentHero.title}
          fill
          className="object-cover transition-transform duration-1000"
          priority
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r",
            currentHero.bgGradient
          )}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
          >
            {currentHero.badge}
          </Badge>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            {currentHero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/90 font-medium">
            {currentHero.subtitle}
          </p>

          {/* Description */}
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {currentHero.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{currentHero.rating} Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{currentHero.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wine className="h-4 w-4" />
              <span>Premium Quality</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={currentHero.ctaLink}>
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-white/90 group"
              >
                {currentHero.cta}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {heroData.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl" />
    </section>
  );
}
```

**Hero Section Features Explained**:

- **Auto-rotating Slides**: 5-second intervals with smooth transitions
- **Multiple Hero Messages**: Different content for various user interests
- **Interactive Controls**: Click indicators to change slides
- **Responsive Design**: Adapts to all screen sizes
- **Visual Effects**: Backdrop blur, gradients, and decorative elements
- **Call-to-Action**: Multiple CTA buttons for different user intents

## Hero Carousel

### components/home/HeroCarousel.tsx

**Purpose**: Rotating carousel showcasing featured wines and promotions
**Location**: `/components/home/HeroCarousel.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { carouselData } from "@/lib/carouselData";

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    const newIndex =
      currentSlide === 0 ? carouselData.length - 1 : currentSlide - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentSlide + 1) % carouselData.length;
    goToSlide(newIndex);
  };

  const currentItem = carouselData[currentSlide];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Wines & Events
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our handpicked selection of exceptional wines and exclusive
            events
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main Carousel */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <div className="relative aspect-[16/9]">
              {/* Background Image */}
              <Image
                src={currentItem.image}
                alt={currentItem.title}
                fill
                className="object-cover transition-transform duration-700"
                priority
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full lg:w-2/3 p-8 lg:p-12 text-white">
                  <div className="space-y-6">
                    {/* Badge */}
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                    >
                      {currentItem.badge}
                    </Badge>

                    {/* Title */}
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                      {currentItem.title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg sm:text-xl text-white/90 max-w-lg leading-relaxed">
                      {currentItem.description}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center gap-6 text-sm text-white/70">
                      {currentItem.rating && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{currentItem.rating}</span>
                        </div>
                      )}
                      {currentItem.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{currentItem.location}</span>
                        </div>
                      )}
                      {currentItem.price && (
                        <div className="text-lg font-semibold text-white">
                          {currentItem.price}
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href={currentItem.ctaLink}>
                        <Button
                          size="lg"
                          className="bg-white text-gray-900 hover:bg-white/90"
                        >
                          {currentItem.ctaText}
                        </Button>
                      </Link>
                      {currentItem.secondaryCta && (
                        <Link href={currentItem.secondaryCta.link}>
                          <Button
                            variant="outline"
                            size="lg"
                            className="border-white/30 text-white hover:bg-white/10"
                          >
                            {currentItem.secondaryCta.text}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {carouselData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    index === currentSlide
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {carouselData.map((item, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "relative flex-shrink-0 transition-all duration-300",
                  index === currentSlide
                    ? "ring-2 ring-primary ring-offset-2"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <div className="w-20 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                {index === currentSlide && (
                  <div className="absolute inset-0 bg-primary/20 rounded-lg" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Hero Carousel Features Explained**:

- **Auto-play with Pause**: Stops auto-play when user interacts
- **Navigation Controls**: Previous/next buttons and thumbnail navigation
- **Smooth Transitions**: 700ms duration for smooth image changes
- **Responsive Layout**: Adapts content for different screen sizes
- **Interactive Elements**: Click indicators and thumbnail navigation
- **Visual Hierarchy**: Clear content structure with proper spacing

## Featured Products

### components/home/FeaturedProducts.tsx

**Purpose**: Showcase of premium wines and featured products
**Location**: `/components/home/FeaturedProducts.tsx`

```tsx
import EmptyList from "@/components/global/EmptyList";
import SectionTitle from "@/components/global/SectionTitle";
import ProductsGrid from "@/components/products/ProductsGrid";
import { fetchFeaturedProducts } from "@/utils/actions";

export default async function FeaturedProducts() {
  const products = await fetchFeaturedProducts();

  if (products.length === 0) return <EmptyList />;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Featured Wines"
          subtitle="Discover our handpicked selection of exceptional wines"
          align="center"
        />

        <div className="mt-12">
          <ProductsGrid products={products} />
        </div>

        <div className="mt-12 text-center">
          <a
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}
```

**Featured Products Features Explained**:

- **Server Component**: Fetches data on the server for better performance
- **Error Handling**: Shows empty state when no products available
- **Section Title**: Consistent styling with other sections
- **Products Grid**: Reusable component for product display
- **Call-to-Action**: Link to full products page

## Hero Transition

### components/home/HeroTransition.tsx

**Purpose**: Smooth transition element between hero sections
**Location**: `/components/home/HeroTransition.tsx`

```tsx
export default function HeroTransition() {
  return (
    <div className="relative h-16 bg-gradient-to-b from-transparent to-background">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
```

**Hero Transition Features Explained**:

- **Visual Separation**: Creates smooth transition between sections
- **Gradient Effects**: Subtle visual elements for modern design
- **Responsive**: Adapts to different screen sizes
- **Minimal**: Lightweight component with focused purpose

---

These home page components create an engaging and interactive landing experience for the Wine Store application. They provide:

- **Visual Impact**: Hero sections with compelling imagery and messaging
- **User Engagement**: Interactive carousels and smooth transitions
- **Product Discovery**: Featured products showcase
- **Performance**: Server-side rendering and optimized images
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Responsiveness**: Mobile-first design approach

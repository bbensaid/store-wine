"use client";

import { useState, useEffect } from "react";
import Hero from "./Hero";
import CollapsibleHero from "./CollapsibleHero";

function HeroTransition() {
  const [showHero, setShowHero] = useState(true);

  // Auto-transition from Hero to CollapsibleHero after 10 seconds OR when user presses any key
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHero(false);
    }, 10000);

    const handleKeyPress = () => {
      setShowHero(false);
    };

    // Add event listener for any key press
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return showHero ? <Hero /> : <CollapsibleHero />;
}

export default HeroTransition; 
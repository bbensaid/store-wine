import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import LoadingContainer from "@/components/global/LoadingContainer";
import Container from "@/components/global/Container";
import { Suspense } from "react";
import HeroTransition from "@/components/home/HeroTransition";

function HomePage() {
  return (
    <Container>
      <HeroTransition />
      <Suspense fallback={<LoadingContainer />}>
        <FeaturedProducts />
      </Suspense>
    </Container>
  );
}

export default HomePage;

import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import LoadingContainer from "@/components/global/LoadingContainer";
import Container from "@/components/global/Container";
import { Suspense } from "react";

function HomePage() {
  return (
    <Container>
      <Hero />
      <Suspense fallback={<LoadingContainer />}>
        <FeaturedProducts />
      </Suspense>
    </Container>
  );
}

export default HomePage;

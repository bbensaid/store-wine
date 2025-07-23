import FeaturedProducts from "@/components/home/FeaturedProducts";
import CollapsibleHero from "@/components/home/CollapsibleHero";
import LoadingContainer from "@/components/global/LoadingContainer";
import Container from "@/components/global/Container";
import { Suspense } from "react";

function HomePage() {
  return (
    <Container>
      <CollapsibleHero />
      <Suspense fallback={<LoadingContainer />}>
        <FeaturedProducts />
      </Suspense>
    </Container>
  );
}

export default HomePage;

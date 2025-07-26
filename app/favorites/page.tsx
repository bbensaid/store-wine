import React from "react";
import Container from "@/components/global/Container";
import { getCurrentUserId } from "@/lib/auth";
import { fetchUserFavorites } from "@/utils/actions";
import ProductsGrid from "@/components/products/ProductsGrid";
import EmptyList from "@/components/global/EmptyList";
import SectionTitle from "@/components/global/SectionTitle";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const favoriteWines = await fetchUserFavorites();

  return (
    <Container>
      <section className="pt-20">
        <SectionTitle text="Your Favorites" />
        {favoriteWines.length === 0 ? (
          <EmptyList />
        ) : (
          <ProductsGrid products={favoriteWines} />
        )}
      </section>
    </Container>
  );
}

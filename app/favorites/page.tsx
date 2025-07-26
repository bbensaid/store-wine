import React from "react";
import Container from "@/components/global/Container";
import { getCurrentUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from "@/lib/prisma";
import ProductsGrid from "@/components/products/ProductsGrid";
import EmptyList from "@/components/global/EmptyList";
import SectionTitle from "@/components/global/SectionTitle";

export default async function FavoritesPage() {
  const userId = await getCurrentUserId()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      clerkId: userId,
    },
    include: {
      wine: {
        include: {
          images: true,
        },
      },
    },
  });

  const favoriteWines = favorites.map(fav => fav.wine);

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

import { Suspense } from "react";
import ProductsLayoutClient from "@/components/products/ProductsLayoutClient";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <ProductsLayoutClient>{children}</ProductsLayoutClient>
    </Suspense>
  );
}

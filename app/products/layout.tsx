import ProductsLayoutClient from "@/components/products/ProductsLayoutClient";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProductsLayoutClient>{children}</ProductsLayoutClient>;
}

import { fetchFeaturedProducts } from "@/utils/actions";
import EmptyList from "../global/EmptyList";
import SectionTitle from "../global/SectionTitle";
import ProductsGridWithAuth from "../products/ProductsGridWithAuth";

async function FeaturedProducts() {
  const products = await fetchFeaturedProducts();
  if (products.length === 0) return <EmptyList />;
  return (
    <section className="pt-20">
      <SectionTitle text="Featured Products" />
      <ProductsGridWithAuth products={products} />
    </section>
  );
}
export default FeaturedProducts;

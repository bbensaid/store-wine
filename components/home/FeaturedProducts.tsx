import { fetchFeaturedProducts } from "@/utils/actions";
import EmptyList from "../global/EmptyList";
import SectionTitle from "../global/SectionTitle";
import ProductsGridWithAuth from "../products/ProductsGridWithAuth";

async function FeaturedProducts() {
  const products = await fetchFeaturedProducts();
  if (products.length === 0) return <EmptyList />;
  return (
    // section with negative margin and may have to be adjusted //
    <section className="-mt-40">
      <SectionTitle text="Featured Wines" />
      <ProductsGridWithAuth products={products} />
    </section>
  );
}
export default FeaturedProducts;

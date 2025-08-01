import ProductsGrid from "./ProductsGrid";
import ProductsList from "./ProductsList";
import { Wine, Image as PrismaImage, Region } from "@prisma/client";

interface ProductsContainerProps {
  layout: string;
  products: (Wine & {
    images: PrismaImage[];
    region: Region;
    averageRating?: number;
  })[];
}

async function ProductsContainer({ layout, products }: ProductsContainerProps) {
  const totalProducts = products.length;
  return (
    <>
      {/* Only the product grid/list, no old header */}
      <div>
        {totalProducts === 0 ? (
          <h5 className="text-2xl mt-16">
            Sorry, no products matched your search...
          </h5>
        ) : layout === "grid" ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsList products={products} />
        )}
      </div>
    </>
  );
}
export default ProductsContainer;

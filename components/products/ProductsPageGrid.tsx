import { formatCurrency } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import FavoriteToggleButton from "./FavoriteToggleButton";

// Copy of ProductsGrid but with Products page specific styling
function ProductsPageGrid({
  products,
}: {
  products: (Wine & { images: PrismaImage[] })[];
}) {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => {
          const { name, price, images, featured } = product;
          const productId = product.id;
          if (!images || !images.length || !images[0]?.url) return null;
          const imageUrl = images[0].url;

          const dollarsAmount = formatCurrency(price);
          return (
            <article key={productId} className="relative">
              <Link href={`/products/${productId}`}>
                <Card className="w-full h-[260px] md:h-[280px] lg:h-[300px] xl:h-[320px]">
                  <CardContent className="h-full flex flex-col items-center gap-[2%] px-[5%]">
                    <div className="relative w-[100%] h-[100%]">
                      <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        style={{ objectFit: "contain" }}
                        className="transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="w-full text-center">
                      <h2 className="text-base capitalize line-clamp-2">
                        {name}
                      </h2>
                      <p className="text-muted-foreground">{dollarsAmount}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              {featured && (
                <div className="absolute top-2 right-2 z-10">
                  <FavoriteToggleButton productId={productId.toString()} />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default ProductsPageGrid;

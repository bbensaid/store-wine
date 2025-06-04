import { formatCurrency } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import FavoriteToggleButton from "./FavoriteToggleButton";
import { Wine, Image as PrismaImage } from "@prisma/client";

function ProductsGrid({
  products,
}: {
  products: (Wine & { images: PrismaImage[] })[];
}) {
  return (
    <div className="pt-2 grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const { name, price, images, featured } = product;
        const productId = product.id;
        if (!images || !images.length || !images[0]?.url) return null;
        const imageUrl = images[0].url;

        const dollarsAmount = formatCurrency(price);
        return (
          <article
            key={productId}
            className="group relative h-[340px] md:h-[370px] lg:h-[400px]"
          >
            <Link href={`/products/${productId}`} className="h-full">
              <Card className="h-full transform group-hover:shadow-xl transition-shadow duration-500 overflow-hidden">
                <CardContent className="h-full flex flex-col items-center p-0">
                  <div className="w-36 md:w-40 lg:w-48 h-[260px] md:h-[280px] lg:h-[320px] relative -mt-6">
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      sizes="(max-width: 768px) 144px, (max-width: 1024px) 160px, 192px"
                      style={{ objectFit: "contain" }}
                      className="transform group-hover:scale-120 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-2 pb-1 flex flex-col items-center">
                    <h2 className="text-base md:text-lg capitalize line-clamp-2 min-h-[2lh] text-center">
                      {name}
                    </h2>
                    <p className="text-muted-foreground text-center">
                      {dollarsAmount}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            {featured && (
              <div className="absolute top-2 right-2 z-10">
                <FavoriteToggleButton />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default ProductsGrid;

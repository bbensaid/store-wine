import { Card } from "@/components/ui/card";
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
    <div className="pt-2 grid gap-y-24 gap-x-12 grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
      {products.map((product) => {
        const { name, images, featured } = product;
        const productId = product.id;
        if (!images || !images.length || !images[0]?.url) return null;
        const imageUrl = images[0].url;
        return (
          <article key={productId} className="group relative">
            <Link href={`/products/${productId}`} className="h-full">
              <Card className="h-auto bg-white flex flex-col justify-between relative overflow-hidden border border-primary/20 p-0 rounded-md">
                {/* Image at the top, with margin from top and sides */}
                <div className="relative aspect-[3/4] mt-12 mx-12 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover object-bottom rounded-md"
                    priority
                  />
                  {featured && (
                    <div className="absolute top-2 right-2 z-10">
                      <FavoriteToggleButton />
                    </div>
                  )}
                </div>
                {/* Info at the bottom */}
                <div className="flex flex-col items-center px-2 py-0 flex-1 gap-y-2">
                  <h2 className="text-base md:text-lg font-medium capitalize text-center truncate w-full leading-tight mb-0 mt-0 text-primary">
                    {name}
                  </h2>
                  <p className="text-xs md:text-sm text-primary text-center mt-0 mb-0">
                    {product.type}
                  </p>
                  <p className="text-sm md:text-base font-bold text-center mt-0 mb-4 text-primary">
                    ${product.price}
                  </p>
                </div>
              </Card>
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export default ProductsGrid;

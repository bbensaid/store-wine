import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Wine, Image as PrismaImage } from "@prisma/client";
import { formatCurrency } from "@/utils/format";
import { currentUser } from "@clerk/nextjs/server";
import FavoriteToggleButtonOptimized from "./FavoriteToggleButtonOptimized";
import { CardSignInButton } from "../form/Buttons";

async function ProductsGridWithAuth({
  products,
}: {
  products: (Wine & { images: PrismaImage[] })[];
}) {
  // Single authentication check for all products
  const user = await currentUser();

  return (
    <div className="pt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {products.map((product) => {
        const { name, images } = product;
        const productId = product.id;
        if (!images || !images.length || !images[0]?.url) return null;
        const imageUrl = images[0].url;
        return (
          <article key={productId} className="group relative max-w-xs">
            <Card className="h-auto bg-white flex flex-col justify-between relative overflow-visible border border-primary/20 p-2 rounded-md">
              {/* Favorites button positioned outside image */}
              <div className="absolute top-10 right-10 z-10">
                {user ? (
                  <FavoriteToggleButtonOptimized
                    wineId={productId}
                    userId={user.id}
                  />
                ) : (
                  <CardSignInButton />
                )}
              </div>
              <Link href={`/products/${productId}`} className="h-full">
                {/* Image at the top, with margin from top and sides */}
                <div className="relative aspect-[3/4] mt-6 mx-6 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover object-bottom rounded-md"
                    priority
                  />
                </div>
                {/* Info at the bottom */}
                <div className="flex flex-col items-center px-2 pt-4 flex-1 gap-y-1">
                  <h2 className="text-sm md:text-base font-medium capitalize text-center truncate w-full leading-tight mb-0 mt-0 text-primary">
                    {name}
                  </h2>
                  <p className="text-xs md:text-sm text-primary text-center mt-0 mb-0">
                    {product.type}
                  </p>
                  <p className="text-sm md:text-base font-bold text-center mt-0 mb-1 text-primary">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </Link>
            </Card>
          </article>
        );
      })}
    </div>
  );
}

export default ProductsGridWithAuth;

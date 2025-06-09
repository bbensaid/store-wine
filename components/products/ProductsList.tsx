import { formatCurrency } from "@/utils/format";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Wine, Image as PrismaImage } from "@prisma/client";
import Image from "next/image";
import FavoriteToggleButton from "./FavoriteToggleButton";

function ProductsList({
  products,
}: {
  products: (Wine & {
    images: PrismaImage[];
    region: { name: string; country: string };
  })[];
}) {
  return (
    <div className="mt-12 grid gap-y-8">
      {products.map((product) => {
        const {
          name,
          price,
          images,
          elaborate,
          grapes,
          harmonize,
          type,
          body,
          acidity,
          abv,
          region,
        } = product;
        if (!images?.[0]?.url) return null;
        const imageUrl = images[0].url;
        const dollarsAmount = formatCurrency(price);
        const productId = product.id;
        return (
          <article key={productId} className="group relative">
            <Link href={`/products/${productId}`}>
              <Card className="transform group-hover:shadow-xl transition-shadow duration-500 p-0 rounded-md">
                <CardContent className="py-2 px-8 grid md:grid-cols-[200px_1fr_1fr] gap-4 md:gap-12">
                  <div className="relative h-[200px] md:h-[240px] w-full md:w-[200px]">
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      sizes="(max-width:768px) 100vw, 200px"
                      priority
                      className="object-cover"
                      style={{ objectFit: "contain" }}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div>
                      <h2 className="text-xl font-semibold capitalize">
                        {name}
                      </h2>
                      <h4 className="text-muted-foreground -mt-1">{type}</h4>
                      <div className="text-sm text-muted-foreground">
                        {region.name}, {region.country}
                      </div>
                    </div>

                    <div className="text-muted-foreground mt-2">
                      {elaborate && <p className="mb-2">{elaborate}</p>}
                      <div className="grid gap-2">
                        {grapes && (
                          <div>
                            <span className="font-medium text-foreground">
                              Grapes:{" "}
                            </span>
                            {grapes}
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-foreground">
                            Body:{" "}
                          </span>
                          {body}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="text-xl font-semibold mb-2">
                      {dollarsAmount}
                    </div>
                    <div className="text-muted-foreground grid gap-2">
                      {harmonize && (
                        <div>
                          <span className="font-medium text-foreground">
                            Pairs well with:{" "}
                          </span>
                          {harmonize}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-foreground">
                          Acidity:{" "}
                        </span>
                        {acidity}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          ABV:{" "}
                        </span>
                        {abv}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <div className="absolute top-2 right-8 z-10">
              <FavoriteToggleButton />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ProductsList;

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
    <div className="mt-8 grid gap-y-8">
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
              <Card className="transform group-hover:shadow-xl transition-shadow duration-500 p-0 rounded-md border border-primary/20">
                <CardContent className="py-2 px-4 grid md:grid-cols-[12rem_1fr_1fr] gap-4 md:gap-8">
                  <div className="relative h-[12rem] md:h-[15rem] w-full md:w-[12rem]">
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
                      <h2 className="text-lg md:text-xl font-semibold capitalize text-primary">
                        {name}
                      </h2>
                      <h4 className="text-primary -mt-1 text-sm md:text-base">
                        {type}
                      </h4>
                      <div className="text-xs md:text-sm text-primary">
                        {region.name}, {region.country}
                      </div>
                    </div>

                    <div className="text-primary mt-2 text-xs md:text-sm">
                      {elaborate && <p className="mb-2">{elaborate}</p>}
                      <div className="grid gap-2">
                        {grapes && (
                          <div>
                            <span className="font-medium text-primary">
                              Grapes:{" "}
                            </span>
                            {grapes}
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-primary">
                            Body:{" "}
                          </span>
                          {body}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="text-xl font-semibold mb-2 text-primary">
                      {dollarsAmount}
                    </div>
                    <div className="text-primary grid gap-2 text-xs md:text-sm">
                      {harmonize && (
                        <div>
                          <span className="font-medium text-primary">
                            Pairs well with:{" "}
                          </span>
                          {harmonize}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-primary">
                          Acidity:{" "}
                        </span>
                        {acidity}
                      </div>
                      <div>
                        <span className="font-medium text-primary">
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

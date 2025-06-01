import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface Image {
  url: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  type: string;
  body: string;
  acidity: string;
  abv: number;
  images: Image[];
  region: {
    name: string;
    country: string;
  };
  averageRating: number;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="pt-2 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <article
          key={product.id}
          className="group relative h-[400px] md:h-[450px] lg:h-[480px]"
        >
          <Link href={`/products/${product.id}`} className="h-full">
            <Card className="h-full transform group-hover:shadow-xl transition-shadow duration-500 overflow-hidden">
              <CardContent className="h-full flex flex-col items-center p-6 md:p-8">
                <div className="flex-1 w-full flex items-center justify-center p-4 bg-white rounded-lg">
                  <div className="relative w-48 md:w-56 lg:w-64 h-[280px] md:h-[300px] lg:h-[340px]">
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                        style={{ objectFit: "contain" }}
                        className="transform group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                </div>
                <div className="w-full mt-4 px-4 flex flex-col items-center">
                  <h2 className="text-base md:text-lg capitalize line-clamp-2 min-h-[2.5rem] text-center font-medium">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-lg font-medium text-gray-900">
                      ${product.price}
                    </p>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {product.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </article>
      ))}
    </div>
  );
}

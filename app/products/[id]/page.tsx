import BreadCrumbs from "@/components/single-product/BreadCrumbs";
import { fetchSingleProduct } from "@/utils/actions";
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import FavoriteToggleButton from "@/components/products/FavoriteToggleButton";
import AddToCart from "@/components/single-product/AddToCart";
import ProductRating from "@/components/single-product/ProductRating";
import { Card } from "@/components/ui/card";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

async function SingleProductPage({ params }: { params: { id: string } }) {
  const product = await fetchSingleProduct(params.id);
  const { name, images, elaborate, price, harmonize, grapes } = product;
  const imageUrl = images?.[0]?.url || "/images/wines/placeholder.png";
  const dollarsAmount = formatCurrency(price);
  return (
    <section>
      <BreadCrumbs name={product.name} />
      <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16 items-start">
        {/* IMAGE FIRST COL */}
        <div>
          <Card className="max-w-[32rem] w-full h-auto flex flex-col justify-between relative overflow-hidden p-0">
            <div className="relative aspect-[2/4] mt-20 mx-20 overflow-hidden">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover object-bottom rounded-md"
                priority
              />
              <div className="absolute top-4 right-4 z-10">
                <FavoriteToggleButton />
              </div>
            </div>
            <div className="flex flex-col items-center px-4 py-0 flex-1 gap-y-4">
              <h2 className={`text-2xl font-semibold capitalize text-center truncate w-full leading-tight mb-0 mt-0 ${cinzel.className}`}>
                {name}
              </h2>
              <p className={`text-lg text-muted-foreground text-center mt-0 mb-0 ${cinzel.className}`}>
                {harmonize || grapes}
              </p>
              <p className={`text-xl font-bold text-center mt-0 mb-8 ${cinzel.className}`}>
                {dollarsAmount}
              </p>
            </div>
          </Card>
        </div>
        {/* PRODUCT INFO SECOND COL */}
        <div>
          <div className="flex gap-x-8 items-center">
            <h1 className={`capitalize text-3xl font-bold ${cinzel.className}`}>{name}</h1>
            <FavoriteToggleButton />
          </div>
          <ProductRating productId={params.id} />
          <h4 className={`text-xl mt-2 ${cinzel.className}`}>{harmonize || grapes}</h4>
          <p className={`text-xl mt-3 font-bold ${cinzel.className}`}>
            {dollarsAmount}
          </p>
          <p className={`mt-6 leading-8 text-muted-foreground ${cinzel.className}`}>{elaborate}</p>
          <AddToCart productId={params.id} />
        </div>
      </div>
    </section>
  );
}
export default SingleProductPage;

import { Button } from "@/components/ui/button";
import { LuShoppingCart } from "react-icons/lu";
import Link from "next/link";
async function CartButton() {
  // temp
  const numItemsInCart = 9;
  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="flex justify-center items-center relative px-3 py-2 md:px-4 md:py-2 text-base md:text-lg"
    >
      <Link href="/cart" className="flex items-center">
        <LuShoppingCart className="mr-1 w-6 h-6" />
        <span className="hidden sm:inline">Cart</span>
        <span className="absolute -top-3 -right-3 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs md:h-7 md:w-7 md:text-sm">
          {numItemsInCart}
        </span>
      </Link>
    </Button>
  );
}
export default CartButton;

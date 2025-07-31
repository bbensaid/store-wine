"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

function CartButton() {
  const [numItemsInCart, setNumItemsInCart] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('/api/cart-items');
        const data = await response.json();
        setNumItemsInCart(data.numItems || 0);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setNumItemsInCart(0);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <Button
      className="flex items-center gap-1 sm:gap-2 text-primary hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base border border-primary/20 bg-white font-normal relative"
      asChild
    >
      <Link href="/cart">
        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-primary" />
        <span className="hidden sm:inline">Cart</span>
        {numItemsInCart > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {numItemsInCart}
          </span>
        )}
      </Link>
    </Button>
  );
}

export default CartButton;

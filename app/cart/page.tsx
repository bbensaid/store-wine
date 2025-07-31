"use client";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import CartItemsList from "@/components/cart/CartItemsList";
import CartTotals from "@/components/cart/CartTotals";
import SectionTitle from "@/components/global/SectionTitle";
import { fetchOrCreateCart, updateCart } from "@/utils/actions";
import { CartItemWithWine } from "@/utils/types";
import { Cart } from "@prisma/client";

type CartData = {
  cartItems: CartItemWithWine[];
  currentCart: Cart;
} | null;

function CartPage() {
  const { userId, isLoaded } = useAuth();
  const [cartData, setCartData] = useState<CartData>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!userId) return;
    
    try {
      const previousCart = await fetchOrCreateCart({ userId });
      const { cartItems, currentCart } = await updateCart(previousCart);
      setCartData({ cartItems, currentCart });
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isLoaded) {
      if (userId) {
        fetchCart();
      } else {
        setLoading(false);
      }
    }
  }, [userId, isLoaded, fetchCart]);

  // Show loading state only after client-side hydration is complete
  if (!isLoaded || loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!userId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p>Please sign in to view your cart.</p>
        <p className="text-sm text-gray-600 mt-2">Debug: User ID is {userId}</p>
        <Link href="/sign-in" className="text-blue-600 hover:underline">
          Go to Sign In
        </Link>
      </div>
    );
  }

  if (!cartData || cartData.cartItems.length === 0) {
    return <SectionTitle text="Empty cart" />;
  }

  return (
    <>
      <SectionTitle text="Shopping Cart" />
      <div className="mt-8 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <CartItemsList cartItems={cartData.cartItems} onCartUpdate={fetchCart} />
        </div>
        <div className="lg:col-span-4 lg:pl-4">
          <CartTotals cart={cartData.currentCart} />
        </div>
      </div>
    </>
  );
}

export default CartPage;



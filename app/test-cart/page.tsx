import { fetchOrCreateCart, updateCart } from "@/utils/actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function TestCartPage() {
  try {
    const { userId } = auth();
    console.log("Test cart page - userId:", userId);
    
    if (!userId) {
      return <div>Please sign in to test cart</div>;
    }
    
    const cart = await fetchOrCreateCart({ userId });
    console.log("Test cart - cart:", cart);
    
    const { cartItems, currentCart } = await updateCart(cart);
    console.log("Test cart - cartItems:", cartItems.length);
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Cart Test Page</h1>
        <div className="space-y-4">
          <p><strong>User ID:</strong> {userId}</p>
          <p><strong>Cart ID:</strong> {cart.id}</p>
          <p><strong>Cart Items:</strong> {cartItems.length}</p>
          <p><strong>Cart Total:</strong> ${currentCart.cartTotal / 100}</p>
          <p><strong>Num Items:</strong> {currentCart.numItemsInCart}</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in test cart page:", error);
    return <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }
}

export default TestCartPage;
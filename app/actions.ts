"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addToCartAction(formData: FormData) {
  try {
    const wineId = formData.get("wineId") as string;
    const amount = Number(formData.get("amount"));
    const userId = formData.get("userId") as string;

    console.log("addToCartAction called with:", { wineId, amount, userId });

    if (!userId) {
      return { message: "Please sign in to add items to cart" };
    }

    // Find or create cart for user
    let cart = await prisma.cart.findFirst({
      where: { clerkId: userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { clerkId: userId },
      });
    }

    // Check if wine is already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        wineId: parseInt(wineId),
      },
    });

    if (existingItem) {
      // Update existing item
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { amount: existingItem.amount + amount },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          wineId: parseInt(wineId),
          amount,
        },
      });
    }

    // Update cart totals
    await updateCartTotals(cart.id);

    console.log("Successfully added to cart");
    revalidatePath("/");
    return { message: "Added to cart successfully!" };
  } catch (error) {
    console.error("Error in addToCartAction:", error);
    return {
      message: error instanceof Error ? error.message : "Failed to add to cart",
    };
  }
}

export async function updateCartQuantityAction(formData: FormData) {
  try {
    const wineId = formData.get("wineId") as string;
    const amount = Number(formData.get("amount"));
    const userId = formData.get("userId") as string;

    console.log("updateCartQuantityAction called with:", {
      wineId,
      amount,
      userId,
    });

    if (!userId) {
      return { message: "Please sign in to update cart" };
    }

    // Find the user's cart
    const cart = await prisma.cart.findFirst({
      where: { clerkId: userId },
    });

    if (!cart) {
      return { message: "Cart not found" };
    }

    // Find existing cart item for this wine
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        wineId: parseInt(wineId),
      },
    });

    if (!existingItem) {
      return { message: "Item not found in cart" };
    }

    console.log(
      "Before update - Current amount:",
      existingItem.amount,
      "New amount:",
      amount
    );

    // Update the existing item with new quantity
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { amount },
    });

    // Update cart totals
    await updateCartTotals(cart.id);

    console.log("Successfully updated cart quantity");
    revalidatePath("/");
    return { message: "Cart updated successfully!" };
  } catch (error) {
    console.error("Error in updateCartQuantityAction:", error);
    return {
      message: error instanceof Error ? error.message : "Failed to update cart",
    };
  }
}

async function updateCartTotals(cartId: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId },
    include: { wine: true },
  });

  let numItemsInCart = 0;
  let cartTotal = 0;

  for (const item of cartItems) {
    numItemsInCart += item.amount;
    cartTotal += item.amount * item.wine.price;
  }

  const taxRate = 0.1;
  const tax = Math.round(cartTotal * taxRate);
  const shipping = cartTotal > 0 ? 500 : 0; // $5.00 in cents
  const orderTotal = cartTotal + tax + shipping;

  await prisma.cart.update({
    where: { id: cartId },
    data: {
      numItemsInCart,
      cartTotal,
      tax,
      orderTotal,
    },
  });
}

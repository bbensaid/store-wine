import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

export const POST = async (req: NextRequest) => {
  const requestHeaders = new Headers(req.headers);
  const origin = requestHeaders.get("origin");

  const { orderId, cartId } = await req.json();

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });
  const cart = await prisma.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      cartItems: {
        include: {
          wine: true,
        },
      },
    },
  });
  if (!order || !cart) {
    return Response.json(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  const line_items = cart.cartItems.map((cartItem) => {
    return {
      quantity: cartItem.amount,
      price_data: {
        currency: "usd",
        product_data: {
          name: cartItem.wine.name,
        },
        unit_amount: cartItem.wine.price * 100, // price in cents
      },
    };
  });
  try {
    console.log("Creating Stripe session with line_items:", line_items);
    console.log("Origin:", origin);
    
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: { orderId, cartId },
      line_items: line_items,
      mode: "payment",
      return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
    });

    console.log("Stripe session created successfully:", session.id);
    return Response.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe error details:", error);

    return Response.json(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}; 
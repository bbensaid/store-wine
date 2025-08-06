import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { redirect } from "next/navigation";

import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id") as string;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Confirm route - Session status:", session.status);
    console.log("Confirm route - Session metadata:", session.metadata);

    const orderId = session.metadata?.orderId;
    const cartId = session.metadata?.cartId;
    console.log("Confirm route - OrderId:", orderId, "CartId:", cartId);
    
    if (session.status === "complete") {
      console.log("Confirm route - Payment complete, updating order");
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
        },
      });
      console.log("Confirm route - Order updated successfully");
      
      await prisma.cart.delete({
        where: {
          id: cartId,
        },
      });
      console.log("Confirm route - Cart deleted successfully");
    } else {
      console.log("Confirm route - Payment not complete, status:", session.status);
    }
  } catch (err) {
    console.log(err);
    return Response.json(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
  redirect("/");
}; 
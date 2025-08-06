import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/utils/db";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ numItems: 0 });
    }

    const cart = await prisma.cart.findFirst({
      where: {
        clerkId: userId,
      },
      select: {
        numItemsInCart: true,
      },
    });
    
    return NextResponse.json({ numItems: cart?.numItemsInCart || 0 });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json({ numItems: 0 });
  }
}
import { NextResponse } from "next/server";
import { getAuthUser } from "@/utils/actions";

export async function GET() {
  try {
    const user = await getAuthUser();
    console.log("API Orders - User ID:", user?.id);
    
    if (!user?.id) {
      console.log("API Orders - No user ID found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Import fetchUserOrders here to avoid circular dependency
    const { fetchUserOrders } = await import("@/utils/actions");
    const orders = await fetchUserOrders();
    console.log("API Orders - Fetched orders:", orders);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
} 
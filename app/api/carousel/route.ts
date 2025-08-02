import { NextResponse } from "next/server";
import { getCarouselDataFromDB } from "@/lib/carouselData";

export async function GET() {
  try {
    const carouselData = await getCarouselDataFromDB();
    return NextResponse.json(carouselData);
  } catch (error) {
    console.error('Error fetching carousel data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch carousel data' },
      { status: 500 }
    );
  }
} 
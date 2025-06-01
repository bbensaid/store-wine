import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log(
      "Received search params:",
      Object.fromEntries(searchParams.entries())
    );

    const where: any = {};

    // Type filter
    const type = searchParams.get("type");
    if (type && type !== "all" && type !== "") {
      where.type = {
        equals: type,
        mode: "insensitive",
      };
    }

    // Body filter - match exact database values
    const body = searchParams.get("body");
    if (body && body !== "all" && body !== "") {
      where.body = {
        equals: body,
        mode: "insensitive",
      };
    }

    // Acidity filter
    const acidity = searchParams.get("acidity");
    if (acidity && acidity !== "all" && acidity !== "") {
      where.acidity = {
        equals: acidity,
        mode: "insensitive",
      };
    }

    // Country filter
    const country = searchParams.get("country");
    if (country && country !== "all" && country !== "") {
      where.region = {
        country: {
          equals: country,
          mode: "insensitive",
        },
      };
    }

    // Price range
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin && !isNaN(parseInt(priceMin))) {
        where.price.gte = parseInt(priceMin);
      }
      if (priceMax && !isNaN(parseInt(priceMax))) {
        where.price.lte = parseInt(priceMax);
      }
    }

    // Rating range
    const ratingMin = searchParams.get("ratingMin");
    const ratingMax = searchParams.get("ratingMax");
    if (ratingMin || ratingMax) {
      where.ratings = {
        some: {
          AND: [
            ratingMin ? { rating: { gte: parseFloat(ratingMin) } } : {},
            ratingMax ? { rating: { lte: parseFloat(ratingMax) } } : {},
          ],
        },
      };
    }

    // Featured
    if (searchParams.get("featured") === "true") {
      where.featured = true;
    }

    // Region ID (Int)
    const regionId = searchParams.get("regionId");
    if (regionId) {
      where.regionId = parseInt(regionId);
    }

    console.log("Final Prisma query:", where);

    // First, let's get a sample of the data to see actual values
    const sampleWine = await prisma.wine.findFirst({
      include: {
        region: true,
      },
    });
    console.log("Sample wine from database:", sampleWine);

    const wines = await prisma.wine.findMany({
      where,
      include: {
        region: true,
        images: true,
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    console.log(`Found ${wines.length} wines with these filters`);
    if (wines.length > 0) {
      console.log("First matching wine:", wines[0]);
    }

    // Calculate average rating and filter based on rating range if specified
    const winesWithAvgRating = wines
      .map((wine) => {
        const ratings = wine.ratings.map((r) => r.rating);
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;

        return {
          ...wine,
          averageRating: avgRating,
          ratings: undefined,
        };
      })
      .filter((wine) => {
        if (ratingMin && wine.averageRating < parseFloat(ratingMin))
          return false;
        if (ratingMax && wine.averageRating > parseFloat(ratingMax))
          return false;
        return true;
      });

    return NextResponse.json(winesWithAvgRating);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

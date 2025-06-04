import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const where: Prisma.WineWhereInput = {};

    // Filtering logic
    const type = searchParams.get("type");
    if (type && type !== "all" && type !== "") {
      where.type = { equals: type, mode: "insensitive" };
    }
    const body = searchParams.get("body");
    if (body && body !== "all" && body !== "") {
      where.body = { equals: body, mode: "insensitive" };
    }
    const acidity = searchParams.get("acidity");
    if (acidity && acidity !== "all" && acidity !== "") {
      where.acidity = { equals: acidity, mode: "insensitive" };
    }
    const country = searchParams.get("country");
    if (country && country !== "all" && country !== "") {
      where.region = { country: { equals: country, mode: "insensitive" } };
    }
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
    if (searchParams.get("featured") === "true") {
      where.featured = true;
    }
    const regionId = searchParams.get("regionId");
    if (regionId) {
      where.regionId = parseInt(regionId);
    }

    // Search by wine name (case-insensitive, contains)
    const search = searchParams.get("search");
    if (search && search.trim() !== "") {
      where.name = { contains: search, mode: "insensitive" };
    }

    // Get total count for pagination
    const totalCount = await prisma.wine.count({ where });

    // Fetch paginated wines
    const wines = await prisma.wine.findMany({
      where,
      include: {
        region: true,
        images: true,
        ratings: { select: { rating: true } },
      },
      skip: offset,
      take: limit,
    });

    // Calculate average rating for each wine
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

    return NextResponse.json({
      wines: winesWithAvgRating,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

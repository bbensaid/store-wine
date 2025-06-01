const { PrismaClient } = require("@prisma/client");
const { parse } = require("csv-parse/sync");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  console.log("Starting seed process...");

  // Clear existing data
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE "Wine" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "Region" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "Rating" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "Image" CASCADE`,
  ]);

  // Reset sequences
  await prisma.$transaction([
    prisma.$executeRaw`ALTER SEQUENCE "Wine_id_seq" RESTART WITH 100000`,
    prisma.$executeRaw`ALTER SEQUENCE "Region_id_seq" RESTART WITH 1000`,
    prisma.$executeRaw`ALTER SEQUENCE "Rating_id_seq" RESTART WITH 1`,
    prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1000000`,
    prisma.$executeRaw`ALTER SEQUENCE "Image_id_seq" RESTART WITH 1`,
  ]);

  // Read CSV files
  const wineFilePath = path.join(__dirname, "wine100.csv");
  const wineData = parse(fs.readFileSync(wineFilePath), {
    columns: true,
    skip_empty_lines: true,
  });

  const ratingFilePath = path.join(__dirname, "rating1000.csv");
  const ratingData = parse(fs.readFileSync(ratingFilePath), {
    columns: true,
    skip_empty_lines: true,
  });

  // Insert regions
  const uniqueRegions = new Map();
  wineData.forEach((wine) => {
    if (!uniqueRegions.has(wine.RegionID)) {
      uniqueRegions.set(wine.RegionID, {
        id: parseInt(wine.RegionID),
        name: wine.RegionName,
        country: wine.Country,
      });
    }
  });
  for (const region of uniqueRegions.values()) {
    await prisma.region.create({
      data: region,
    });
  }

  // Insert wines
  for (const wine of wineData) {
    await prisma.wine.create({
      data: {
        id: parseInt(wine.WineID),
        name: wine.WineName,
        type: wine.Type,
        elaborate: wine.Elaborate || null,
        grapes: wine.Grapes ? wine.Grapes.replace(/[\[\]']/g, "") : "",
        harmonize: wine.Harmonize ? wine.Harmonize.replace(/[\[\]']/g, "") : "",
        abv: wine.ABV ? parseFloat(wine.ABV) : 0,
        body: wine.Body || "",
        acidity: wine.Acidity || "",
        code: wine.Code || "",
        price: 0,
        regionId: parseInt(wine.RegionID),
      },
    });
  }

  // Insert users
  const uniqueUsers = new Set(ratingData.map((r) => parseInt(r.UserID)));
  for (const userId of uniqueUsers) {
    await prisma.user.create({
      data: {
        id: userId,
        email: `user_${userId}@example.com`,
        name: `User ${userId}`,
        password: `password_${userId}`,
        role: "USER",
      },
    });
  }

  // Insert ratings
  for (const rating of ratingData) {
    await prisma.rating.create({
      data: {
        id: parseInt(rating.RatingID),
        wineId: parseInt(rating.WineID),
        userId: parseInt(rating.UserID),
        vintage:
          rating.Vintage && rating.Vintage !== "" ? rating.Vintage : null,
        rating: rating.Rating ? parseFloat(rating.Rating) : 0,
        date: rating.Date ? new Date(rating.Date) : new Date(),
      },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

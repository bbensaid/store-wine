const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  console.log("Starting image seed process...");

  // Clear existing image data
  await prisma.$executeRaw`TRUNCATE TABLE "Image" CASCADE`;
  await prisma.$executeRaw`ALTER SEQUENCE "Image_id_seq" RESTART WITH 1`;

  // Get the directory containing wine images
  const wineImagesDir = path.join(process.cwd(), "public", "images", "wines");

  try {
    // Read all files in the wines directory
    const files = fs.readdirSync(wineImagesDir);

    // Filter for image files matching the pattern dddddd.jpeg
    const imageFiles = files.filter((file) => /^\d{6}\.jpeg$/.test(file));

    console.log(`Found ${imageFiles.length} image files`);

    // Process each image file
    for (const imageFile of imageFiles) {
      // Extract wine ID from filename (6 digits before .jpeg)
      const wineId = parseInt(imageFile.slice(0, 6));

      // Check if wine exists
      const wine = await prisma.wine.findUnique({
        where: { id: wineId },
      });

      if (wine) {
        // Create image record
        await prisma.image.create({
          data: {
            url: `/images/wines/${imageFile}`,
            wineId: wineId,
          },
        });
        console.log(`Created image record for wine ${wineId}: ${imageFile}`);
      } else {
        console.warn(`Wine with ID ${wineId} not found for image ${imageFile}`);
      }
    }

    console.log("Image seed completed successfully!");
  } catch (error) {
    console.error("Error reading wine images directory:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

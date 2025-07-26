/*
  Warnings:

  - The primary key for the `Wine` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Wine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `wineId` on the `CartItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `wineId` on the `Favorite` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `wineId` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `wineId` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_wineId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_wineId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_wineId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_wineId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "wineId",
ADD COLUMN     "wineId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "wineId",
ADD COLUMN     "wineId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "wineId",
ADD COLUMN     "wineId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "wineId",
ADD COLUMN     "wineId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Wine" DROP CONSTRAINT "Wine_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "clerkId" DROP NOT NULL,
ADD CONSTRAINT "Wine_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

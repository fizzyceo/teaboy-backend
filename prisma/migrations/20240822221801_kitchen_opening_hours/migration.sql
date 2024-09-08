/*
  Warnings:

  - Added the required column `name` to the `Kitchen` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "Kitchen" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OpeningHours" (
    "openingHours_id" SERIAL NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "openTime" TIMESTAMP(3) NOT NULL,
    "closeTime" TIMESTAMP(3) NOT NULL,
    "kitchen_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpeningHours_pkey" PRIMARY KEY ("openingHours_id")
);

-- AddForeignKey
ALTER TABLE "OpeningHours" ADD CONSTRAINT "OpeningHours_kitchen_id_fkey" FOREIGN KEY ("kitchen_id") REFERENCES "Kitchen"("kitchen_id") ON DELETE RESTRICT ON UPDATE CASCADE;

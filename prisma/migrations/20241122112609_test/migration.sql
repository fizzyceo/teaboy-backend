/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "allowedOrderDistance" DOUBLE PRECISION DEFAULT 200;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "max_daily_orders" INTEGER DEFAULT 5,
DROP COLUMN "role",
ADD COLUMN     "role" "USER_ROLE" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "QRCode" (
    "key" SERIAL NOT NULL,
    "space_id" INTEGER NOT NULL,
    "sub_space" TEXT NOT NULL,
    "disabled" BOOLEAN DEFAULT false,

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("key")
);

-- AddForeignKey
ALTER TABLE "QRCode" ADD CONSTRAINT "QRCode_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("space_id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `qr_code` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `Order_Item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customer_id_fkey";

-- DropIndex
DROP INDEX "Menu_qr_code_key";

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "qr_code",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customer_id",
ADD COLUMN     "customer_name" TEXT,
ADD COLUMN     "table_number" INTEGER;

-- AlterTable
ALTER TABLE "Order_Item" ADD COLUMN     "status" "OrderStatus" NOT NULL;

-- DropTable
DROP TABLE "Customer";

-- CreateTable
CREATE TABLE "ItemImages" (
    "item_image_id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "menu_item_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemImages_pkey" PRIMARY KEY ("item_image_id")
);

-- AddForeignKey
ALTER TABLE "ItemImages" ADD CONSTRAINT "ItemImages_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "Menu_Item"("menu_item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

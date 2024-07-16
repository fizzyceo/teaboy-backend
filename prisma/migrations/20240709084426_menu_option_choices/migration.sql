/*
  Warnings:

  - You are about to drop the column `quantity` on the `Order_Item` table. All the data in the column will be lost.
  - Added the required column `order_number` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Menu_Item" ALTER COLUMN "available" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "order_number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order_Item" DROP COLUMN "quantity";

-- CreateTable
CREATE TABLE "Menu_Item_Option" (
    "menu_item_option_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "menu_item_id" INTEGER NOT NULL,

    CONSTRAINT "Menu_Item_Option_pkey" PRIMARY KEY ("menu_item_option_id")
);

-- CreateTable
CREATE TABLE "Menu_Item_Option_Choice" (
    "menu_item_option_choice_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "Menu_Item_Option_id" INTEGER NOT NULL,

    CONSTRAINT "Menu_Item_Option_Choice_pkey" PRIMARY KEY ("menu_item_option_choice_id")
);

-- CreateTable
CREATE TABLE "Order_Item_Choice" (
    "order_item_choice_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "menu_item_option_choice_id" INTEGER NOT NULL,

    CONSTRAINT "Order_Item_Choice_pkey" PRIMARY KEY ("order_item_choice_id")
);

-- AddForeignKey
ALTER TABLE "Menu_Item_Option" ADD CONSTRAINT "Menu_Item_Option_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "Menu_Item"("menu_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu_Item_Option_Choice" ADD CONSTRAINT "Menu_Item_Option_Choice_Menu_Item_Option_id_fkey" FOREIGN KEY ("Menu_Item_Option_id") REFERENCES "Menu_Item_Option"("menu_item_option_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item_Choice" ADD CONSTRAINT "Order_Item_Choice_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "Order_Item"("order_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item_Choice" ADD CONSTRAINT "Order_Item_Choice_menu_item_option_choice_id_fkey" FOREIGN KEY ("menu_item_option_choice_id") REFERENCES "Menu_Item_Option_Choice"("menu_item_option_choice_id") ON DELETE CASCADE ON UPDATE CASCADE;

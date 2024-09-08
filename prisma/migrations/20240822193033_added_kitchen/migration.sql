/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryToMenu_Item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToMenu_Item" DROP CONSTRAINT "_CategoryToMenu_Item_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToMenu_Item" DROP CONSTRAINT "_CategoryToMenu_Item_B_fkey";

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "kitchen_id" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kitchen_id" INTEGER;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "_CategoryToMenu_Item";

-- CreateTable
CREATE TABLE "Call" (
    "call_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "space_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("call_id")
);

-- CreateTable
CREATE TABLE "Kitchen" (
    "kitchen_id" SERIAL NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kitchen_pkey" PRIMARY KEY ("kitchen_id")
);

-- CreateTable
CREATE TABLE "_UserSites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserSites_AB_unique" ON "_UserSites"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSites_B_index" ON "_UserSites"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_kitchen_id_fkey" FOREIGN KEY ("kitchen_id") REFERENCES "Kitchen"("kitchen_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_kitchen_id_fkey" FOREIGN KEY ("kitchen_id") REFERENCES "Kitchen"("kitchen_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("space_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSites" ADD CONSTRAINT "_UserSites_A_fkey" FOREIGN KEY ("A") REFERENCES "Site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSites" ADD CONSTRAINT "_UserSites_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `ent_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `Entreprise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Entreprise" DROP CONSTRAINT "Entreprise_ent_id_fkey";

-- DropIndex
DROP INDEX "User_ent_id_key";

-- AlterTable
ALTER TABLE "Entreprise" ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ent_id";

-- AddForeignKey
ALTER TABLE "Entreprise" ADD CONSTRAINT "Entreprise_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

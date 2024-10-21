/*
  Warnings:

  - A unique constraint covering the columns `[ent_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "ent_id" INTEGER,
ADD COLUMN     "owner_id" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ent_id" INTEGER;

-- CreateTable
CREATE TABLE "Entreprise" (
    "ent_id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Entreprise_pkey" PRIMARY KEY ("ent_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_ent_id_key" ON "User"("ent_id");

-- AddForeignKey
ALTER TABLE "Entreprise" ADD CONSTRAINT "Entreprise_ent_id_fkey" FOREIGN KEY ("ent_id") REFERENCES "User"("ent_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_ent_id_fkey" FOREIGN KEY ("ent_id") REFERENCES "Entreprise"("ent_id") ON DELETE CASCADE ON UPDATE CASCADE;

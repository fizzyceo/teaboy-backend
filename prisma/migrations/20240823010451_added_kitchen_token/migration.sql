/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Kitchen` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `Kitchen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kitchen" ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Kitchen_token_key" ON "Kitchen"("token");

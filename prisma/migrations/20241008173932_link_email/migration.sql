/*
  Warnings:

  - You are about to drop the column `user_id` on the `SpaceUserLink` table. All the data in the column will be lost.
  - Added the required column `user_email` to the `SpaceUserLink` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SpaceUserLink" DROP CONSTRAINT "SpaceUserLink_user_id_fkey";

-- AlterTable
ALTER TABLE "SpaceUserLink" DROP COLUMN "user_id",
ADD COLUMN     "user_email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'NORMAL_USER';

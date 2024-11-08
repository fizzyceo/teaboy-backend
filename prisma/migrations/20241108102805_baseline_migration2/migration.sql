/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "USER_ROLE2" AS ENUM ('ADMIN', 'USER', 'ROOT');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "USER_ROLE2" NOT NULL DEFAULT 'USER';

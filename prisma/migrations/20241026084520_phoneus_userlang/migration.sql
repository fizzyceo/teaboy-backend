-- CreateEnum
CREATE TYPE "LANGUAGE" AS ENUM ('EN', 'AR');

-- CreateEnum
CREATE TYPE "OS_TYPE" AS ENUM ('android', 'ios');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneOS" "OS_TYPE" DEFAULT 'android',
ADD COLUMN     "userLanguage" "LANGUAGE" DEFAULT 'EN';

/*
  Warnings:

  - A unique constraint covering the columns `[fcmToken]` on the table `KitchenTablet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "KitchenTablet_fcmToken_key" ON "KitchenTablet"("fcmToken");

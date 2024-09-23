-- AlterTable
ALTER TABLE "OpeningHours" ADD COLUMN     "timezone" TEXT;

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "KitchenTablet" (
    "kitchenTablet_id" SERIAL NOT NULL,
    "kitchen_id" INTEGER NOT NULL,
    "fcmToken" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KitchenTablet_pkey" PRIMARY KEY ("kitchenTablet_id")
);

-- AddForeignKey
ALTER TABLE "KitchenTablet" ADD CONSTRAINT "KitchenTablet_kitchen_id_fkey" FOREIGN KEY ("kitchen_id") REFERENCES "Kitchen"("kitchen_id") ON DELETE RESTRICT ON UPDATE CASCADE;

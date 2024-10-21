-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_space_id_fkey";

-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("space_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "SpaceUserLink" (
    "link_id" SERIAL NOT NULL,
    "space_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "SpaceUserLink_pkey" PRIMARY KEY ("link_id")
);

-- AddForeignKey
ALTER TABLE "SpaceUserLink" ADD CONSTRAINT "SpaceUserLink_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("space_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceUserLink" ADD CONSTRAINT "SpaceUserLink_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

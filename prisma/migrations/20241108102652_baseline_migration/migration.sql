-- CreateEnum
CREATE TYPE "SPACE_TYPE" AS ENUM ('MAJLISS', 'OFFICE', 'DEPARTMENT');

-- CreateEnum
CREATE TYPE "USER_ROLE" AS ENUM ('ADMIN', 'TEABOY', 'NORMAL_USER', 'SUPER_ADMIN', 'USER', 'ROOT');

-- CreateEnum
CREATE TYPE "LANGUAGE" AS ENUM ('EN', 'AR');

-- CreateEnum
CREATE TYPE "OS_TYPE" AS ENUM ('android', 'ios');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CALL_STATUS" AS ENUM ('STARTED', 'ANSWERED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT,
    "role" "USER_ROLE" NOT NULL DEFAULT 'NORMAL_USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "kitchen_id" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationExpires" TIMESTAMP(3),
    "verificationToken" TEXT,
    "image_url" TEXT,
    "resetPasswordExpires" TIMESTAMP(3),
    "resetPasswordToken" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "signedUp" BOOLEAN,
    "canCallTeaboy" BOOLEAN DEFAULT true,
    "phoneOS" "OS_TYPE" DEFAULT 'android',
    "userLanguage" "LANGUAGE" DEFAULT 'EN',

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Entreprise" (
    "ent_id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "Entreprise_pkey" PRIMARY KEY ("ent_id")
);

-- CreateTable
CREATE TABLE "Site" (
    "site_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "phone" TEXT,
    "address" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "name_ar" TEXT,
    "ent_id" INTEGER,
    "owner_id" INTEGER,
    "address_ar" TEXT,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("site_id")
);

-- CreateTable
CREATE TABLE "Space" (
    "space_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "site_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "kitchen_id" INTEGER,
    "type" "SPACE_TYPE" NOT NULL DEFAULT 'DEPARTMENT',
    "name_ar" TEXT,
    "default_lang" TEXT DEFAULT 'EN',

    CONSTRAINT "Space_pkey" PRIMARY KEY ("space_id")
);

-- CreateTable
CREATE TABLE "SpaceUserLink" (
    "link_id" SERIAL NOT NULL,
    "space_id" INTEGER NOT NULL,
    "user_email" TEXT NOT NULL,

    CONSTRAINT "SpaceUserLink_pkey" PRIMARY KEY ("link_id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "menu_id" SERIAL NOT NULL,
    "name" TEXT,
    "ask_for_name" BOOLEAN NOT NULL DEFAULT false,
    "ask_for_table" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name_ar" TEXT,
    "currency" TEXT DEFAULT '$',
    "currency_ar" TEXT,
    "ask" TEXT,
    "VAT" DOUBLE PRECISION DEFAULT 0.0,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("menu_id")
);

-- CreateTable
CREATE TABLE "Menu_Item" (
    "menu_item_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "price" DOUBLE PRECISION NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "menu_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title_ar" TEXT,

    CONSTRAINT "Menu_Item_pkey" PRIMARY KEY ("menu_item_id")
);

-- CreateTable
CREATE TABLE "Menu_Item_Option" (
    "menu_item_option_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "default_choice_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name_ar" TEXT,

    CONSTRAINT "Menu_Item_Option_pkey" PRIMARY KEY ("menu_item_option_id")
);

-- CreateTable
CREATE TABLE "Menu_Item_Option_Choice" (
    "menu_item_option_choice_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "menu_item_option_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name_ar" TEXT,

    CONSTRAINT "Menu_Item_Option_Choice_pkey" PRIMARY KEY ("menu_item_option_choice_id")
);

-- CreateTable
CREATE TABLE "MenuItemOptionConnection" (
    "menu_item_id" INTEGER NOT NULL,
    "menu_item_option_id" INTEGER NOT NULL,

    CONSTRAINT "MenuItemOptionConnection_pkey" PRIMARY KEY ("menu_item_id","menu_item_option_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" SERIAL NOT NULL,
    "order_number" TEXT NOT NULL,
    "customer_name" TEXT,
    "table_number" INTEGER,
    "scheduled_at" TIMESTAMP(3),
    "spaceId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,
    "userId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "answer" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "Order_Item" (
    "order_item_id" SERIAL NOT NULL,
    "note" TEXT,
    "quantity" INTEGER,
    "menu_item_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_Item_pkey" PRIMARY KEY ("order_item_id")
);

-- CreateTable
CREATE TABLE "Order_Item_Choice" (
    "order_item_choice_id" SERIAL NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "menu_item_option_choice_id" INTEGER NOT NULL,

    CONSTRAINT "Order_Item_Choice_pkey" PRIMARY KEY ("order_item_choice_id")
);

-- CreateTable
CREATE TABLE "ItemImages" (
    "item_image_id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "menu_item_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemImages_pkey" PRIMARY KEY ("item_image_id")
);

-- CreateTable
CREATE TABLE "Call" (
    "call_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "space_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "CALL_STATUS" NOT NULL DEFAULT 'STARTED',

    CONSTRAINT "Call_pkey" PRIMARY KEY ("call_id")
);

-- CreateTable
CREATE TABLE "Kitchen" (
    "kitchen_id" SERIAL NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "isWeeklyTimingOn" BOOLEAN NOT NULL DEFAULT false,
    "name_ar" TEXT,
    "site_id" INTEGER,

    CONSTRAINT "Kitchen_pkey" PRIMARY KEY ("kitchen_id")
);

-- CreateTable
CREATE TABLE "OpeningHours" (
    "openingHours_id" SERIAL NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "kitchen_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT,

    CONSTRAINT "OpeningHours_pkey" PRIMARY KEY ("openingHours_id")
);

-- CreateTable
CREATE TABLE "KitchenTablet" (
    "kitchenTablet_id" SERIAL NOT NULL,
    "kitchen_id" INTEGER NOT NULL,
    "fcmToken" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KitchenTablet_pkey" PRIMARY KEY ("kitchenTablet_id")
);

-- CreateTable
CREATE TABLE "_UserSites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserSpaces" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SiteMenus" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SpaceMenus" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_Item_Option_default_choice_id_key" ON "Menu_Item_Option"("default_choice_id");

-- CreateIndex
CREATE UNIQUE INDEX "Kitchen_token_key" ON "Kitchen"("token");

-- CreateIndex
CREATE UNIQUE INDEX "KitchenTablet_fcmToken_key" ON "KitchenTablet"("fcmToken");

-- CreateIndex
CREATE UNIQUE INDEX "_UserSites_AB_unique" ON "_UserSites"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSites_B_index" ON "_UserSites"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserSpaces_AB_unique" ON "_UserSpaces"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSpaces_B_index" ON "_UserSpaces"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SiteMenus_AB_unique" ON "_SiteMenus"("A", "B");

-- CreateIndex
CREATE INDEX "_SiteMenus_B_index" ON "_SiteMenus"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SpaceMenus_AB_unique" ON "_SpaceMenus"("A", "B");

-- CreateIndex
CREATE INDEX "_SpaceMenus_B_index" ON "_SpaceMenus"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_kitchen_id_fkey" FOREIGN KEY ("kitchen_id") REFERENCES "Kitchen"("kitchen_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entreprise" ADD CONSTRAINT "Entreprise_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_ent_id_fkey" FOREIGN KEY ("ent_id") REFERENCES "Entreprise"("ent_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_kitchen_id_fkey" FOREIGN KEY ("kitchen_id") REFERENCES "Kitchen"("kitchen_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceUserLink" ADD CONSTRAINT "SpaceUserLink_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("space_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu_Item" ADD CONSTRAINT "Menu_Item_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu_Item_Option" ADD CONSTRAINT "Menu_Item_Option_default_choice_id_fkey" FOREIGN KEY ("default_choice_id") REFERENCES "Menu_Item_Option_Choice"("menu_item_option_choice_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu_Item_Option_Choice" ADD CONSTRAINT "Menu_Item_Option_Choice_menu_item_option_id_fkey" FOREIGN KEY ("menu_item_option_id") REFERENCES "Menu_Item_Option"("menu_item_option_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemOptionConnection" ADD CONSTRAINT "MenuItemOptionConnection_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "Menu_Item"("menu_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemOptionConnection" ADD CONSTRAINT "MenuItemOptionConnection_menu_item_option_id_fkey" FOREIGN KEY ("menu_item_option_id") REFERENCES "Menu_Item_Option"("menu_item_option_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("space_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item" ADD CONSTRAINT "Order_Item_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "Menu_Item"("menu_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item" ADD CONSTRAINT "Order_Item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item_Choice" ADD CONSTRAINT "Order_Item_Choice_menu_item_option_choice_id_fkey" FOREIGN KEY ("menu_item_option_choice_id") REFERENCES "Menu_Item_Option_Choice"("menu_item_option_choice_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item_Choice" ADD CONSTRAINT "Order_Item_Choice_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "Order_Item"("order_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemImages" ADD CONSTRAINT "ItemImages_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "Menu_Item"("menu_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("space_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kitchen" ADD CONSTRAINT "Kitchen_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningHours" ADD CONSTRAINT "OpeningHours_kitchen_id_fkey" FOREIGN KEY ("kitchen_id") REFERENCES "Kitchen"("kitchen_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitchenTablet" ADD CONSTRAINT "KitchenTablet_kitchen_id_fkey" FOREIGN KEY ("kitchen_id") REFERENCES "Kitchen"("kitchen_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSites" ADD CONSTRAINT "_UserSites_A_fkey" FOREIGN KEY ("A") REFERENCES "Site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSites" ADD CONSTRAINT "_UserSites_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSpaces" ADD CONSTRAINT "_UserSpaces_A_fkey" FOREIGN KEY ("A") REFERENCES "Space"("space_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSpaces" ADD CONSTRAINT "_UserSpaces_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiteMenus" ADD CONSTRAINT "_SiteMenus_A_fkey" FOREIGN KEY ("A") REFERENCES "Menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiteMenus" ADD CONSTRAINT "_SiteMenus_B_fkey" FOREIGN KEY ("B") REFERENCES "Site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpaceMenus" ADD CONSTRAINT "_SpaceMenus_A_fkey" FOREIGN KEY ("A") REFERENCES "Menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpaceMenus" ADD CONSTRAINT "_SpaceMenus_B_fkey" FOREIGN KEY ("B") REFERENCES "Space"("space_id") ON DELETE CASCADE ON UPDATE CASCADE;

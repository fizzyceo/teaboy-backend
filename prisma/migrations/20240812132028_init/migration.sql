-- CreateEnum
CREATE TYPE "USER_ROLE" AS ENUM ('ADMIN', 'TEABOY', 'NORMAL_USER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role" "USER_ROLE" NOT NULL,
    "can_manage_account" BOOLEAN NOT NULL DEFAULT false,
    "can_manage_menu" BOOLEAN NOT NULL DEFAULT false,
    "can_place_order" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Site" (
    "site_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "image_url" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("site_id")
);

-- CreateTable
CREATE TABLE "Space" (
    "space_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "site_id" INTEGER NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("space_id")
);

-- CreateTable
CREATE TABLE "UserSite" (
    "user_id" INTEGER NOT NULL,
    "site_id" INTEGER NOT NULL,

    CONSTRAINT "UserSite_pkey" PRIMARY KEY ("user_id","site_id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "menu_id" SERIAL NOT NULL,
    "name" TEXT,
    "ask_for_name" BOOLEAN NOT NULL DEFAULT false,
    "ask_for_table" BOOLEAN NOT NULL DEFAULT false,
    "space_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("menu_id")
);

-- CreateTable
CREATE TABLE "Menu_Item" (
    "menu_item_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "menu_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_Item_pkey" PRIMARY KEY ("menu_item_id")
);

-- CreateTable
CREATE TABLE "Menu_Item_Option" (
    "menu_item_option_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "menu_item_id" INTEGER NOT NULL,
    "default_choice_id" INTEGER,

    CONSTRAINT "Menu_Item_Option_pkey" PRIMARY KEY ("menu_item_option_id")
);

-- CreateTable
CREATE TABLE "Menu_Item_Option_Choice" (
    "menu_item_option_choice_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "menu_item_option_id" INTEGER NOT NULL,

    CONSTRAINT "Menu_Item_Option_Choice_pkey" PRIMARY KEY ("menu_item_option_choice_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" SERIAL NOT NULL,
    "order_number" TEXT NOT NULL,
    "customer_name" TEXT,
    "table_number" INTEGER,
    "scheduled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "Order_Item" (
    "order_item_id" SERIAL NOT NULL,
    "note" TEXT,
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
CREATE TABLE "Category" (
    "category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
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
CREATE TABLE "_CategoryToMenu_Item" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_Item_Option_default_choice_id_key" ON "Menu_Item_Option"("default_choice_id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToMenu_Item_AB_unique" ON "_CategoryToMenu_Item"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToMenu_Item_B_index" ON "_CategoryToMenu_Item"("B");

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSite" ADD CONSTRAINT "UserSite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSite" ADD CONSTRAINT "UserSite_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("space_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu_Item" ADD CONSTRAINT "Menu_Item_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu_Item_Option" ADD CONSTRAINT "Menu_Item_Option_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "Menu_Item"("menu_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu_Item_Option" ADD CONSTRAINT "Menu_Item_Option_default_choice_id_fkey" FOREIGN KEY ("default_choice_id") REFERENCES "Menu_Item_Option_Choice"("menu_item_option_choice_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu_Item_Option_Choice" ADD CONSTRAINT "Menu_Item_Option_Choice_menu_item_option_id_fkey" FOREIGN KEY ("menu_item_option_id") REFERENCES "Menu_Item_Option"("menu_item_option_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item" ADD CONSTRAINT "Order_Item_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "Menu_Item"("menu_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item" ADD CONSTRAINT "Order_Item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item_Choice" ADD CONSTRAINT "Order_Item_Choice_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "Order_Item"("order_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item_Choice" ADD CONSTRAINT "Order_Item_Choice_menu_item_option_choice_id_fkey" FOREIGN KEY ("menu_item_option_choice_id") REFERENCES "Menu_Item_Option_Choice"("menu_item_option_choice_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemImages" ADD CONSTRAINT "ItemImages_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "Menu_Item"("menu_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMenu_Item" ADD CONSTRAINT "_CategoryToMenu_Item_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMenu_Item" ADD CONSTRAINT "_CategoryToMenu_Item_B_fkey" FOREIGN KEY ("B") REFERENCES "Menu_Item"("menu_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

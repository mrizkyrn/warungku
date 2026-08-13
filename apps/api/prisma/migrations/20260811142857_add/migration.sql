-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('GRAM', 'KILOGRAM', 'MILLILITER', 'LITER');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_options" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT,
    "price" INTEGER NOT NULL,
    "unit" "Unit",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_options_product_id_idx" ON "product_options"("product_id");

-- AddForeignKey
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

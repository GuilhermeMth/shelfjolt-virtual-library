/*
  Warnings:

  - You are about to drop the column `categoryId` on the `books` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_categoryId_fkey";

-- DropIndex
DROP INDEX "books_categoryId_idx";

-- AlterTable
ALTER TABLE "books" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "book_categories" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "book_categories_bookId_idx" ON "book_categories"("bookId");

-- CreateIndex
CREATE INDEX "book_categories_categoryId_idx" ON "book_categories"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "book_categories_bookId_categoryId_key" ON "book_categories"("bookId", "categoryId");

-- AddForeignKey
ALTER TABLE "book_categories" ADD CONSTRAINT "book_categories_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_categories" ADD CONSTRAINT "book_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `stockName` to the `stock_prices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stock_prices" ADD COLUMN     "stockName" TEXT NOT NULL;

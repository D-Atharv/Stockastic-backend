/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `symbol` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reg_num` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `PortfolioStock` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[teamId]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ticker]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamName]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teamId` to the `Portfolio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantStocks` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promoterStocks` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockName` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticker` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamName` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolioId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionType` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regNo` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_userId_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioStock" DROP CONSTRAINT "PortfolioStock_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioStock" DROP CONSTRAINT "PortfolioStock_stockId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropIndex
DROP INDEX "Portfolio_userId_key";

-- DropIndex
DROP INDEX "Stock_symbol_key";

-- DropIndex
DROP INDEX "User_reg_num_key";

-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "teamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "name",
DROP COLUMN "price",
DROP COLUMN "symbol",
DROP COLUMN "updatedAt",
ADD COLUMN     "participantStocks" INTEGER NOT NULL,
ADD COLUMN     "promoterStocks" INTEGER NOT NULL,
ADD COLUMN     "stockName" TEXT NOT NULL,
ADD COLUMN     "ticker" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "teamName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "createdAt",
DROP COLUMN "type",
DROP COLUMN "userId",
ADD COLUMN     "portfolioId" INTEGER NOT NULL,
ADD COLUMN     "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "transactionType" "TransactionType" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "reg_num",
DROP COLUMN "updatedAt",
ADD COLUMN     "regNo" TEXT NOT NULL;

-- DropTable
DROP TABLE "PortfolioStock";

-- CreateTable
CREATE TABLE "stock_prices" (
    "id" SERIAL NOT NULL,
    "stockId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "openingPrice" DOUBLE PRECISION NOT NULL,
    "lowerRange" DOUBLE PRECISION NOT NULL,
    "upperRange" DOUBLE PRECISION NOT NULL,
    "priceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_teamId_key" ON "Portfolio"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_ticker_key" ON "Stock"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "Team_teamName_key" ON "Team"("teamName");

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_prices" ADD CONSTRAINT "stock_prices_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

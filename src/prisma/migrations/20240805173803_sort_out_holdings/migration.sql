/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `transactionDate` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `stock_prices` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lower` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opening` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prevClosing` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prices` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upper` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stock_prices" DROP CONSTRAINT "stock_prices_stockId_fkey";

-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "createdAt",
ADD COLUMN     "lower" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "opening" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "prevClosing" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "prices" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "upper" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "createdAt",
ADD COLUMN     "teamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "transactionDate";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "role",
ALTER COLUMN "phone" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "stock_prices";

-- CreateTable
CREATE TABLE "Holdings" (
    "id" SERIAL NOT NULL,
    "stockId" INTEGER NOT NULL,
    "portfolioId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "avgPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Holdings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Holdings" ADD CONSTRAINT "Holdings_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holdings" ADD CONSTRAINT "Holdings_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

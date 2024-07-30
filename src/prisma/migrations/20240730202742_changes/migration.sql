/*
  Warnings:

  - You are about to drop the column `participantsShare` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `promoterShare` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `sector` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `ticker` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `portfolioId` on the `Team` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_teamId_fkey";

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "participantsShare",
DROP COLUMN "promoterShare",
DROP COLUMN "sector",
DROP COLUMN "ticker";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "portfolioId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "teamId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

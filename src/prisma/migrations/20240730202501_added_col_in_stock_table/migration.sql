/*
  Warnings:

  - Added the required column `participantsShare` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promoterShare` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sector` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticker` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Made the column `teamId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_teamId_fkey";

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "participantsShare" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "promoterShare" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sector" TEXT NOT NULL,
ADD COLUMN     "ticker" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "portfolioId" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "teamId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

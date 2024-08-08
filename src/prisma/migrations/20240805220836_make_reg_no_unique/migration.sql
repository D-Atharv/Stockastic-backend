/*
  Warnings:

  - A unique constraint covering the columns `[regNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_regNo_key" ON "User"("regNo");

/*
  Warnings:

  - A unique constraint covering the columns `[userId,type]` on the table `folders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "folders_userId_type_key" ON "folders"("userId", "type");

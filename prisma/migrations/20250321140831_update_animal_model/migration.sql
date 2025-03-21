/*
  Warnings:

  - A unique constraint covering the columns `[nome,microchip]` on the table `Animal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "microchip" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Animal_nome_microchip_key" ON "Animal"("nome", "microchip");

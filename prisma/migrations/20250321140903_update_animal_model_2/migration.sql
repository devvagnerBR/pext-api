/*
  Warnings:

  - Made the column `microchip` on table `Animal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Animal" ALTER COLUMN "microchip" SET NOT NULL;

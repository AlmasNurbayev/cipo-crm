/*
  Warnings:

  - You are about to drop the column `wish` on the `subscribe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "client" ADD COLUMN     "wish" TEXT;

-- AlterTable
ALTER TABLE "subscribe" DROP COLUMN "wish";

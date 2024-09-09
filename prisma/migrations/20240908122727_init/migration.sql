/*
  Warnings:

  - Added the required column `nameContact` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Chat` ADD COLUMN `nameContact` VARCHAR(191) NOT NULL;

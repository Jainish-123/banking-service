/*
  Warnings:

  - You are about to drop the column `AccountType` on the `account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `account` DROP COLUMN `AccountType`,
    ADD COLUMN `accountType` ENUM('SAVINGS', 'CHECKING', 'CREDIT', 'LOAN') NOT NULL DEFAULT 'SAVINGS';

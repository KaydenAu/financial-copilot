/*
  Warnings:

  - You are about to alter the column `category` on the `support_tickets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `status` on the `support_tickets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `support_tickets` MODIFY `category` ENUM('ACCOUNT', 'TRANSACTIONS', 'BILLING', 'SECURITY', 'TECHNICAL', 'FEATURE') NOT NULL,
    MODIFY `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN';

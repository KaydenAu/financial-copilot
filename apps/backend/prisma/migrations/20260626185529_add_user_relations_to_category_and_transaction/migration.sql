/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,parentId]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `categories_name_parentId_key` ON `categories`;

-- AlterTable
ALTER TABLE `categories` ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `categories_userId_idx` ON `categories`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `categories_userId_name_parentId_key` ON `categories`(`userId`, `name`, `parentId`);

-- CreateIndex
CREATE INDEX `transactions_userId_idx` ON `transactions`(`userId`);

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `custom_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `custom_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

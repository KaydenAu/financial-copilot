-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_subcategoryId_fkey`;

-- AlterTable
ALTER TABLE `transactions` MODIFY `subcategoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

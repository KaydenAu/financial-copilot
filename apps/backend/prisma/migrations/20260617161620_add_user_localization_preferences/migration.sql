-- AlterTable
ALTER TABLE `user_profiles` ADD COLUMN `date_format` VARCHAR(191) NOT NULL DEFAULT 'MM/DD/YYYY',
    ADD COLUMN `first_name` VARCHAR(191) NULL,
    ADD COLUMN `last_name` VARCHAR(191) NULL,
    ADD COLUMN `number_format` VARCHAR(191) NOT NULL DEFAULT 'comma-dot',
    ADD COLUMN `timezone` VARCHAR(191) NOT NULL DEFAULT 'UTC';

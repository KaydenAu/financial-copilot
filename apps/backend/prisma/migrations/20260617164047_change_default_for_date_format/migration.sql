-- AlterTable
ALTER TABLE `user_profiles` MODIFY `date_format` VARCHAR(191) NOT NULL DEFAULT 'DD/MM/YYYY',
    MODIFY `timezone` VARCHAR(191) NOT NULL DEFAULT 'Asia/Kuala_Lumpur';

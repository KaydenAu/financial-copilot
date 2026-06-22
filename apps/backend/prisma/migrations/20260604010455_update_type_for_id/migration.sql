/*
  Warnings:

  - The primary key for the `custom_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `custom_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `user_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `first_name` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `user_profiles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `user_id` on the `user_profiles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `user_name` to the `user_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_profiles` DROP FOREIGN KEY `user_profiles_user_id_fkey`;

-- AlterTable
ALTER TABLE `custom_users` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `is_user` BOOLEAN NOT NULL DEFAULT true,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user_profiles` DROP PRIMARY KEY,
    DROP COLUMN `first_name`,
    ADD COLUMN `user_name` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `custom_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

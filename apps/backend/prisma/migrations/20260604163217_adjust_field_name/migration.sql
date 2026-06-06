/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `user_password_resets` table. All the data in the column will be lost.
  - Added the required column `expired_at` to the `user_password_resets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_password_resets` DROP COLUMN `expiresAt`,
    ADD COLUMN `expired_at` DATETIME(3) NOT NULL;

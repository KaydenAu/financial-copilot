-- CreateTable
CREATE TABLE `user_password_resets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `user_password_resets_token_key`(`token`),
    UNIQUE INDEX `user_password_resets_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_password_resets` ADD CONSTRAINT `user_password_resets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `custom_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

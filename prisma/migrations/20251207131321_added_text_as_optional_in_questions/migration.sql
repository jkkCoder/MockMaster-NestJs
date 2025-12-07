-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `hashed_password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `mail` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_mail_key`(`mail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mocks` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `duration` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mock_sections` (
    `id` VARCHAR(191) NOT NULL,
    `mock_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `sort_order` INTEGER NOT NULL,

    UNIQUE INDEX `mock_sections_mock_id_sort_order_key`(`mock_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `id` VARCHAR(191) NOT NULL,
    `mock_id` VARCHAR(191) NOT NULL,
    `mock_section_id` VARCHAR(191) NULL,
    `text` TEXT NULL,
    `image_url` VARCHAR(500) NULL,
    `marks` DOUBLE NOT NULL DEFAULT 1,
    `negative_mark` DOUBLE NOT NULL DEFAULT 0,
    `sort_order` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `options` (
    `id` VARCHAR(191) NOT NULL,
    `question_id` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(500) NULL,
    `label` VARCHAR(1) NOT NULL,
    `text` TEXT NULL,
    `is_correct` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER NOT NULL,

    UNIQUE INDEX `options_question_id_label_key`(`question_id`, `label`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attempts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `mock_id` VARCHAR(191) NOT NULL,
    `started_at` DATETIME(3) NOT NULL,
    `submitted_at` DATETIME(3) NULL,
    `time_taken` INTEGER NULL,
    `score` DOUBLE NULL DEFAULT 0,
    `percentage` DOUBLE NULL DEFAULT 0,
    `status` ENUM('IN_PROGRESS', 'SUBMITTED', 'AUTO_SUBMITTED') NOT NULL DEFAULT 'IN_PROGRESS',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `answers` (
    `id` VARCHAR(191) NOT NULL,
    `attempt_id` VARCHAR(191) NOT NULL,
    `question_id` VARCHAR(191) NOT NULL,
    `selected_option_id` VARCHAR(191) NULL,
    `is_correct` BOOLEAN NOT NULL DEFAULT false,
    `answered_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `answers_attempt_id_question_id_key`(`attempt_id`, `question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mock_sections` ADD CONSTRAINT `mock_sections_mock_id_fkey` FOREIGN KEY (`mock_id`) REFERENCES `mocks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_mock_id_fkey` FOREIGN KEY (`mock_id`) REFERENCES `mocks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_mock_section_id_fkey` FOREIGN KEY (`mock_section_id`) REFERENCES `mock_sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `options` ADD CONSTRAINT `options_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attempts` ADD CONSTRAINT `attempts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attempts` ADD CONSTRAINT `attempts_mock_id_fkey` FOREIGN KEY (`mock_id`) REFERENCES `mocks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_attempt_id_fkey` FOREIGN KEY (`attempt_id`) REFERENCES `attempts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_selected_option_id_fkey` FOREIGN KEY (`selected_option_id`) REFERENCES `options`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

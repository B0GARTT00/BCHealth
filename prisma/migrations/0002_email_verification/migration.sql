ALTER TABLE `User`
  ADD COLUMN `emailVerifiedAt` DATETIME(3) NULL,
  ADD COLUMN `emailVerificationTokenHash` VARCHAR(191) NULL,
  ADD COLUMN `emailVerificationExpiresAt` DATETIME(3) NULL;

CREATE UNIQUE INDEX `User_emailVerificationTokenHash_key` ON `User`(`emailVerificationTokenHash`);

UPDATE `User`
SET `emailVerifiedAt` = CURRENT_TIMESTAMP(3)
WHERE `emailVerifiedAt` IS NULL;

-- AlterEnum
ALTER TABLE `AuditLog` MODIFY COLUMN `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'APPROVE', 'REJECT', 'DISPENSE', 'EXPORT', 'ARCHIVE', 'RESTORE', 'LIST_USERS', 'VIEW_USER', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'ASSIGN_ROLE', 'ROLE_CHANGE', 'STATUS_CHANGE', 'PASSWORD_CHANGE', 'PASSWORD_RESET', 'OTHER') NOT NULL;

-- AddColumns
ALTER TABLE `AuditLog` ADD COLUMN `oldValue` JSON NULL;
ALTER TABLE `AuditLog` ADD COLUMN `newValue` JSON NULL;

-- AddIndex
ALTER TABLE `AuditLog` ADD INDEX `AuditLog_action_createdAt_idx`(`action`, `createdAt`);

-- AddIndex
ALTER TABLE `AuditLog` ADD INDEX `AuditLog_entity_entityId_createdAt_idx`(`entity`, `entityId`, `createdAt`);

USE klarity_db;

SET @department_column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'department'
);

SET @department_migration = IF(
  @department_column_exists = 0,
  'ALTER TABLE users ADD COLUMN department VARCHAR(100) NOT NULL DEFAULT ''Général'' AFTER role',
  'SELECT 1'
);
PREPARE department_migration_statement FROM @department_migration;
EXECUTE department_migration_statement;
DEALLOCATE PREPARE department_migration_statement;

ALTER TABLE users
  MODIFY COLUMN status ENUM('available', 'busy', 'away', 'offline', 'invited') DEFAULT 'available';

CREATE TABLE IF NOT EXISTS actionable_tasks (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  project VARCHAR(150) NOT NULL,
  assignee VARCHAR(150) NOT NULL,
  status ENUM('blocked', 'delayed', 'warning', 'completed') NOT NULL DEFAULT 'blocked',
  reason TEXT NOT NULL,
  impact TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

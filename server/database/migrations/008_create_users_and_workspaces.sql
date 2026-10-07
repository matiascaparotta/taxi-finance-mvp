CREATE TABLE IF NOT EXISTS workspaces (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  workspace_id INT NOT NULL,
  username VARCHAR(60) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  taxi_license VARCHAR(30) DEFAULT NULL,
  role ENUM('owner', 'admin', 'driver') NOT NULL DEFAULT 'driver',
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  CONSTRAINT fk_users_workspace FOREIGN KEY (workspace_id)
    REFERENCES workspaces (id)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO workspaces (id, name) VALUES (1, 'Lic249 - Matías')
ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO workspaces (id, name) VALUES (2, 'Lic1315 - Alberto Caparotta')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (id, workspace_id, username, full_name, taxi_license, role, password_hash, is_active)
VALUES (1, 1, 'matias', 'Matías Caparotta', '249', 'owner', 'MIGRATE_FROM_ACCESS_PASSWORD_HASH', TRUE)
ON DUPLICATE KEY UPDATE username = VALUES(username);

INSERT INTO users (id, workspace_id, username, full_name, taxi_license, role, password_hash, is_active)
VALUES (2, 2, 'lic1315', 'Alberto Caparotta', '1315', 'driver', 'PENDING_ACTIVATION', FALSE)
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), taxi_license = VALUES(taxi_license);

ALTER TABLE work_days ADD COLUMN user_id INT DEFAULT NULL AFTER id;
UPDATE work_days SET user_id = 1 WHERE user_id IS NULL;
ALTER TABLE work_days
  MODIFY user_id INT NOT NULL,
  ADD CONSTRAINT fk_work_days_user FOREIGN KEY (user_id) REFERENCES users (id),
  DROP INDEX uq_work_days_date,
  ADD CONSTRAINT uq_work_days_user_date UNIQUE (user_id, date);

ALTER TABLE monthly_work_day_imports ADD COLUMN user_id INT DEFAULT NULL AFTER id;
UPDATE monthly_work_day_imports SET user_id = 1 WHERE user_id IS NULL;
ALTER TABLE monthly_work_day_imports
  MODIFY user_id INT NOT NULL,
  ADD CONSTRAINT fk_monthly_imports_user FOREIGN KEY (user_id) REFERENCES users (id),
  DROP INDEX uq_monthly_work_day_imports_date,
  ADD CONSTRAINT uq_monthly_imports_user_date UNIQUE (user_id, date);

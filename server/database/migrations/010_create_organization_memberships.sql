CREATE TABLE IF NOT EXISTS organization_memberships (
  id INT NOT NULL AUTO_INCREMENT,
  organization_id INT NOT NULL,
  user_id INT NOT NULL,
  is_owner BOOLEAN NOT NULL DEFAULT FALSE,
  is_driver BOOLEAN NOT NULL DEFAULT TRUE,
  fuel_calculation_mode ENUM('ACTUAL_LOAD', 'DISTANCE_RATE')
    NOT NULL DEFAULT 'ACTUAL_LOAD',
  fuel_rate_per_km DECIMAL(8, 4) DEFAULT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT uq_organization_memberships
    UNIQUE (organization_id, user_id),
  KEY idx_organization_memberships_user (user_id),
  CONSTRAINT fk_organization_memberships_organization
    FOREIGN KEY (organization_id)
    REFERENCES organizations (id),
  CONSTRAINT fk_organization_memberships_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

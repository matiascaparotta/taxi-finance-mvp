CREATE TABLE IF NOT EXISTS commission_companies (
  id INT NOT NULL AUTO_INCREMENT,
  organization_id INT NOT NULL,
  driver_user_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  commission_rate DECIMAL(7, 4) NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT uq_commission_company_driver_name UNIQUE (driver_user_id, name),
  KEY idx_commission_companies_scope (organization_id, driver_user_id, status),
  CONSTRAINT fk_commission_companies_organization FOREIGN KEY (organization_id) REFERENCES organizations (id),
  CONSTRAINT fk_commission_companies_driver FOREIGN KEY (driver_user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS monthly_settlements (
  id INT NOT NULL AUTO_INCREMENT,
  organization_id INT NOT NULL,
  driver_user_id INT NOT NULL,
  settlement_month DATE NOT NULL,
  expected_work_days SMALLINT NOT NULL DEFAULT 22,
  social_security DECIMAL(10, 2) NOT NULL DEFAULT 670.00,
  payroll_transfer DECIMAL(10, 2) NOT NULL DEFAULT 1533.41,
  settings_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
  closed_snapshot JSON DEFAULT NULL,
  closed_at TIMESTAMP NULL DEFAULT NULL,
  closed_by_user_id INT DEFAULT NULL,
  created_by_user_id INT NOT NULL,
  updated_by_user_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_monthly_settlement_driver_month (
    organization_id,
    driver_user_id,
    settlement_month
  ),
  CONSTRAINT fk_monthly_settlement_organization
    FOREIGN KEY (organization_id) REFERENCES organizations (id),
  CONSTRAINT fk_monthly_settlement_driver
    FOREIGN KEY (driver_user_id) REFERENCES users (id),
  CONSTRAINT fk_monthly_settlement_closed_by
    FOREIGN KEY (closed_by_user_id) REFERENCES users (id),
  CONSTRAINT fk_monthly_settlement_created_by
    FOREIGN KEY (created_by_user_id) REFERENCES users (id),
  CONSTRAINT fk_monthly_settlement_updated_by
    FOREIGN KEY (updated_by_user_id) REFERENCES users (id)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS monthly_settlement_audit_logs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  monthly_settlement_id INT NOT NULL,
  organization_id INT NOT NULL,
  actor_user_id INT NOT NULL,
  action VARCHAR(40) NOT NULL,
  reason VARCHAR(500) NOT NULL,
  previous_data JSON NOT NULL,
  resulting_data JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_monthly_audit_settlement (
    monthly_settlement_id,
    created_at
  ),
  CONSTRAINT fk_monthly_audit_settlement
    FOREIGN KEY (monthly_settlement_id)
    REFERENCES monthly_settlements (id),
  CONSTRAINT fk_monthly_audit_organization
    FOREIGN KEY (organization_id) REFERENCES organizations (id),
  CONSTRAINT fk_monthly_audit_actor
    FOREIGN KEY (actor_user_id) REFERENCES users (id)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

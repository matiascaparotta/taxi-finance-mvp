CREATE TABLE IF NOT EXISTS daily_settlement_snapshots (
  id INT NOT NULL AUTO_INCREMENT,
  work_day_id INT NOT NULL,
  organization_id INT NOT NULL,
  driver_user_id INT NOT NULL,
  net_revenue DECIMAL(10, 2) NOT NULL,
  cash_retained DECIMAL(10, 2) NOT NULL,
  fuel_cost DECIMAL(10, 2) NOT NULL,
  social_security DECIMAL(10, 2) NOT NULL,
  driver_share_basis_points SMALLINT UNSIGNED NOT NULL,
  distributable_base DECIMAL(10, 2) NOT NULL,
  driver_share DECIMAL(10, 2) NOT NULL,
  owner_share DECIMAL(10, 2) NOT NULL,
  reimbursable_fuel DECIMAL(10, 2) NOT NULL,
  driver_entitlement DECIMAL(10, 2) NOT NULL,
  balance DECIMAL(10, 2) NOT NULL,
  balance_direction ENUM(
    'OWNER_PAYS_DRIVER',
    'DRIVER_PAYS_OWNER',
    'SETTLED'
  ) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_daily_settlement_work_day (work_day_id),
  KEY idx_daily_settlement_driver (
    organization_id,
    driver_user_id,
    work_day_id
  ),
  CONSTRAINT fk_daily_settlement_work_day
    FOREIGN KEY (work_day_id) REFERENCES work_days (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_daily_settlement_organization
    FOREIGN KEY (organization_id) REFERENCES organizations (id),
  CONSTRAINT fk_daily_settlement_driver
    FOREIGN KEY (driver_user_id) REFERENCES users (id)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci

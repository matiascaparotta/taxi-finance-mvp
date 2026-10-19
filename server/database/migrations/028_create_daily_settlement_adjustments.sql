CREATE TABLE IF NOT EXISTS daily_settlement_adjustments (
  id INT NOT NULL AUTO_INCREMENT,
  work_day_id INT NOT NULL,
  organization_id INT NOT NULL,
  driver_user_id INT NOT NULL,
  direction ENUM('OWNER_TO_DRIVER', 'DRIVER_TO_OWNER') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  reason VARCHAR(160) NOT NULL,
  idempotency_key VARCHAR(64) NOT NULL,
  created_by_user_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_daily_adjustment_idempotency (idempotency_key),
  KEY idx_daily_adjustment_balance (organization_id, driver_user_id, work_day_id),
  CONSTRAINT fk_daily_adjustment_work_day
    FOREIGN KEY (work_day_id) REFERENCES work_days (id) ON DELETE CASCADE,
  CONSTRAINT fk_daily_adjustment_organization
    FOREIGN KEY (organization_id) REFERENCES organizations (id),
  CONSTRAINT fk_daily_adjustment_driver
    FOREIGN KEY (driver_user_id) REFERENCES users (id),
  CONSTRAINT fk_daily_adjustment_creator
    FOREIGN KEY (created_by_user_id) REFERENCES users (id),
  CONSTRAINT chk_daily_adjustment_amount CHECK (amount > 0)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
